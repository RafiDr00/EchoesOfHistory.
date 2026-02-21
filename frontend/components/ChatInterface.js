import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { api } from '../lib/api'

export default function ChatInterface({ darkMode = false }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      content: 'Greetings! I am Leonardo da Vinci. I was a man of many curiosities—art, science, engineering, and the mysteries of nature. What shall we explore together?',
      figure: 'Leonardo da Vinci',
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedFigure, setSelectedFigure] = useState('Leonardo da Vinci')
  const messagesEndRef = useRef(null)

  const historicalFigures = [
    'Leonardo da Vinci',
    'Cleopatra VII',
    'Napoleon Bonaparte',
    'Joan of Arc',
    'Julius Caesar',
    'Marie Curie',
    'Albert Einstein'
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!inputMessage.trim() || isLoading) return

    const currentInput = inputMessage.trim()
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: currentInput,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      const data = await api.post('/chat', {
        figure: selectedFigure,
        message: currentInput
      })

      const assistantMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: data.response,
        figure: selectedFigure,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Chat failed:', error)
      const assistantMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: "I apologize, but the threads of time are momentarily tangled. I cannot respond right now.",
        figure: selectedFigure,
        timestamp: new Date(),
        isError: true
      }
      setMessages(prev => [...prev, assistantMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={`h-full flex flex-col ${darkMode ? 'bg-dark-900' : 'bg-white'} rounded-2xl shadow-2xl overflow-hidden border ${darkMode ? 'border-dark-700' : 'border-gray-100'}`}>
      {/* Header */}
      <div className={`p-6 border-b ${darkMode ? 'border-dark-700 bg-dark-800' : 'border-gray-200 bg-gray-50'}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-cyber-blue via-cyber-purple to-cyber-pink rounded-xl flex items-center justify-center shadow-lg shadow-cyber-blue/20">
              <span className="text-white font-bold text-xl">
                {selectedFigure.charAt(0)}
              </span>
            </div>
            <div>
              <h3 className={`font-semibold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {selectedFigure}
              </h3>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Historical Accuracy Mode Active
                </p>
              </div>
            </div>
          </div>

          <select
            value={selectedFigure}
            onChange={(e) => {
              setSelectedFigure(e.target.value)
              setMessages([{
                id: Date.now(),
                type: 'assistant',
                content: `Greetings! I am ${e.target.value}. How can I assist you in your historical journey today?`,
                figure: e.target.value,
                timestamp: new Date()
              }])
            }}
            className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all focus:ring-2 focus:ring-cyber-blue outline-none ${darkMode
                ? 'bg-dark-700 border-dark-600 text-white hover:bg-dark-600'
                : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50'
              }`}
          >
            {historicalFigures.map(figure => (
              <option key={figure} value={figure}>{figure}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-gray-700">
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, x: message.type === 'user' ? 20 : -20, y: 10 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex max-w-[85%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'} items-end gap-3`}>
                <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-bold ${message.type === 'user'
                    ? 'bg-cyber-blue text-white'
                    : 'bg-dark-700 text-cyber-blue'
                  }`}>
                  {message.type === 'user' ? 'U' : message.figure.charAt(0)}
                </div>

                <div className={`px-5 py-3 rounded-2xl shadow-sm ${message.type === 'user'
                    ? 'bg-gradient-to-br from-cyber-blue to-cyber-purple text-white rounded-br-none'
                    : message.isError
                      ? 'bg-red-500/10 border border-red-500/50 text-red-500'
                      : darkMode
                        ? 'bg-dark-800 text-gray-200 border border-dark-700 rounded-bl-none'
                        : 'bg-gray-100 text-gray-900 rounded-bl-none'
                  }`}>
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <p className={`text-[10px] mt-2 opacity-60 ${message.type === 'user' ? 'text-right' : 'text-left'
                    }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className={`flex items-center space-x-3 px-5 py-3 rounded-2xl ${darkMode ? 'bg-dark-800 border border-dark-700' : 'bg-gray-100'}`}>
              <div className="flex space-x-1">
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
                    className="w-1.5 h-1.5 bg-cyber-blue rounded-full"
                  />
                ))}
              </div>
              <span className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {selectedFigure} is consulting history...
              </span>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className={`p-6 border-t ${darkMode ? 'border-dark-700 bg-dark-800/50' : 'border-gray-200 bg-gray-50/50'}`}>
        <form onSubmit={sendMessage} className="relative group">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={`Ask ${selectedFigure} a question...`}
            className={`w-full pl-6 pr-16 py-4 rounded-2xl border transition-all outline-none text-sm ${darkMode
                ? 'bg-dark-900 border-dark-600 text-white placeholder-gray-500 focus:border-cyber-blue/50'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-cyber-blue'
              } focus:ring-4 focus:ring-cyber-blue/10`}
          />
          <motion.button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-gradient-to-r from-cyber-blue to-cyber-purple text-white rounded-xl shadow-lg shadow-cyber-blue/20 disabled:opacity-50 transition-all font-semibold text-xs"
          >
            {isLoading ? '...' : 'SEND'}
          </motion.button>
        </form>
        <p className={`text-[10px] mt-3 text-center ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          AI responses are generated based on historical records.
        </p>
      </div>
    </div>
  )
}
