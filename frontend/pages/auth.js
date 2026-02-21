import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { api } from '../lib/api'

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState({ type: '', text: '' })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setStatus({ type: '', text: '' })

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setStatus({ type: 'error', text: 'Passwords do not match' })
      setIsLoading(false)
      return
    }

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register'
      const payload = isLogin
        ? { username: formData.username || formData.email, password: formData.password }
        : { email: formData.email, password: formData.password, username: formData.username }

      const data = await api.post(endpoint, payload)

      if (isLogin) {
        localStorage.setItem('token', data.access_token)
        setStatus({ type: 'success', text: 'Authentication successful. Synchronizing session...' })
        setTimeout(() => window.location.href = '/explore', 1200)
      } else {
        setStatus({ type: 'success', text: 'Account created. Transitioning to login...' })
        setTimeout(() => setIsLogin(true), 1500)
      }
    } catch (error) {
      setStatus({ type: 'error', text: error.message || 'Identity verification failed.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <div className="min-h-screen bg-dark-900 text-white selection:bg-cyber-blue selection:text-white">
      <Head>
        <title>{isLogin ? 'Login' : 'Sign Up'} | Echoes of History Archive</title>
      </Head>

      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyber-blue blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyber-purple blur-[120px] rounded-full" />
      </div>

      <nav className="relative z-50 p-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/">
            <motion.div whileHover={{ scale: 1.05 }} className="flex items-center space-x-3 cursor-pointer group">
              <div className="w-10 h-10 bg-gradient-to-br from-cyber-blue to-cyber-purple rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-cyber-blue/40 transition-all">
                <span className="text-white font-black">E</span>
              </div>
              <h1 className="text-2xl font-black tracking-tighter uppercase italic">Echoes</h1>
            </motion.div>
          </Link>
        </div>
      </nav>

      <div className="flex items-center justify-center p-6 sm:py-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-dark-800/50 backdrop-blur-2xl p-10 rounded-[2.5rem] border border-dark-700 shadow-2xl space-y-8"
        >
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-black tracking-tight uppercase">
              {isLogin ? 'Archive Access' : 'Create Identity'}
            </h2>
            <p className="text-gray-500 text-sm font-medium">Enter your credentials to access the historical uplink.</p>
          </div>

          <div className="flex bg-dark-900/50 p-1.5 rounded-2xl border border-dark-700">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 rounded-xl text-xs font-black tracking-widest uppercase transition-all ${isLogin ? 'bg-cyber-blue text-white shadow-xl' : 'text-gray-500 hover:text-white'
                }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 rounded-xl text-xs font-black tracking-widest uppercase transition-all ${!isLogin ? 'bg-cyber-blue text-white shadow-xl' : 'text-gray-500 hover:text-white'
                }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <label className="block text-[10px] font-black uppercase text-gray-500 tracking-widest mb-2 px-1">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required={!isLogin}
                    className="w-full px-5 py-4 bg-dark-900 border border-dark-700 rounded-2xl text-white outline-none focus:border-cyber-blue focus:ring-4 focus:ring-cyber-blue/10 transition-all placeholder:text-gray-700"
                    placeholder="IDENT_USER_01"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-[10px] font-black uppercase text-gray-500 tracking-widest mb-2 px-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-5 py-4 bg-dark-900 border border-dark-700 rounded-2xl text-white outline-none focus:border-cyber-blue focus:ring-4 focus:ring-cyber-blue/10 transition-all placeholder:text-gray-700"
                placeholder="uplink@echoes.io"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase text-gray-500 tracking-widest mb-2 px-1">Cipher Key</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full px-5 py-4 bg-dark-900 border border-dark-700 rounded-2xl text-white outline-none focus:border-cyber-blue focus:ring-4 focus:ring-cyber-blue/10 transition-all placeholder:text-gray-700"
                placeholder="••••••••••••"
              />
            </div>

            <AnimatePresence>
              {!isLogin && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                  <label className="block text-[10px] font-black uppercase text-gray-500 tracking-widest mb-2 px-1">Re-enter Key</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required={!isLogin}
                    className="w-full px-5 py-4 bg-dark-900 border border-dark-700 rounded-2xl text-white outline-none focus:border-cyber-blue focus:ring-4 focus:ring-cyber-blue/10 transition-all"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {status.text && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`p-4 rounded-xl text-xs font-bold ${status.type === 'success' ? 'bg-cyber-blue/10 text-cyber-blue border border-cyber-blue/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
                }`}>
                {status.text}
              </motion.div>
            )}

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-gradient-to-r from-cyber-blue to-cyber-purple text-white font-black tracking-widest uppercase rounded-2xl shadow-xl shadow-cyber-blue/20 hover:shadow-cyber-blue/40 transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying...</span>
                </div>
              ) : (isLogin ? 'Authorize Access' : 'Register Identity')}
            </motion.button>
          </form>

          <p className="text-center text-[10px] font-bold text-gray-600 uppercase tracking-widest">
            {isLogin ? "Legacy account? Contact the administrator." : "By registering, you agree to the historical preservation protocols."}
          </p>
        </motion.div>
      </div>
    </div>
  )
}
