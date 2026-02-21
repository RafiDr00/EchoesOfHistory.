import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRightIcon, CalendarIcon, GlobeAltIcon, BookOpenIcon } from '@heroicons/react/24/outline'

const TimelineEvent = ({ event, index, isExpanded, onToggle }) => {
  const eventTypes = {
    birth: { icon: '🎂', color: 'from-green-400 to-blue-500' },
    death: { icon: '⚰️', color: 'from-red-400 to-orange-500' },
    achievement: { icon: '🏆', color: 'from-yellow-400 to-orange-500' },
    political: { icon: '🏛️', color: 'from-blue-400 to-purple-500' },
    military: { icon: '⚔️', color: 'from-red-400 to-pink-500' },
    cultural: { icon: '🎨', color: 'from-purple-400 to-indigo-500' },
    scientific: { icon: '🔬', color: 'from-cyan-400 to-blue-500' },
    default: { icon: '📅', color: 'from-gray-400 to-gray-600' }
  }

  const eventConfig = eventTypes[event.type] || eventTypes.default

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="relative"
    >
      {/* Timeline line */}
      <div className="absolute left-8 top-12 bottom-0 w-0.5 bg-gradient-to-b from-cyan-400/50 to-transparent" />

      {/* Event card */}
      <div className="relative pl-20 pb-8">
        {/* Timeline dot */}
        <motion.div
          whileHover={{ scale: 1.2 }}
          className="absolute left-6 top-8 w-4 h-4 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 border-2 border-gray-900 shadow-lg shadow-cyan-400/50"
        />

        {/* Event content */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-gray-900/70 backdrop-blur-sm rounded-lg border border-cyan-400/20 overflow-hidden hover:border-cyan-400/40 transition-all duration-300 cursor-pointer"
          onClick={onToggle}
        >
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-gray-800/50 to-gray-900/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{eventConfig.icon}</span>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {event.title}
                  </h3>
                  <div className="flex items-center space-x-2 text-cyan-400 text-sm">
                    <CalendarIcon className="w-4 h-4" />
                    <span>{event.date || event.year}</span>
                    {event.location && (
                      <>
                        <GlobeAltIcon className="w-4 h-4 ml-2" />
                        <span>{event.location}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <motion.div
                animate={{ rotate: isExpanded ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRightIcon className="w-5 h-5 text-cyan-400" />
              </motion.div>
            </div>
          </div>

          {/* Expanded content */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="p-4 border-t border-gray-700/50">
                  <p className="text-gray-300 leading-relaxed mb-4">
                    {event.description}
                  </p>

                  {/* Tags */}
                  {event.tags && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {event.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-2 py-1 bg-cyan-400/10 text-cyan-400 text-xs rounded border border-cyan-400/30"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Sources */}
                  {event.sources && event.sources.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-400 flex items-center">
                        <BookOpenIcon className="w-4 h-4 mr-1" />
                        Sources:
                      </h4>
                      {event.sources.map((source, sourceIndex) => (
                        <a
                          key={sourceIndex}
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-sm text-cyan-400 hover:text-cyan-300 underline hover:no-underline transition-colors"
                        >
                          {source.title}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  )
}

const InteractiveTimeline = ({ events = [], title = "Historical Timeline", darkMode = true }) => {
  const [expandedEvents, setExpandedEvents] = useState(new Set())
  const timelineRef = useRef(null)

  const toggleEvent = (index) => {
    const newExpanded = new Set(expandedEvents)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedEvents(newExpanded)
  }

  const expandAll = () => {
    setExpandedEvents(new Set(events.map((_, index) => index)))
  }

  const collapseAll = () => {
    setExpandedEvents(new Set())
  }

  // Default events if none provided
  const defaultEvents = [
    {
      date: "1452",
      title: "Born in Vinci",
      description: "Leonardo was born in the small town of Vinci, near Florence. His early genius was evident in his apprenticeship with Verrocchio.",
      type: "birth",
      location: "Vinci, Italy",
      tags: ["renaissance", "early-life"],
      sources: [
        { title: "Museum of Vinci", url: "https://www.museoleonardiano.it/" }
      ]
    },
    {
      date: "1495-1498",
      title: "The Last Supper",
      description: "Created the masterpiece 'The Last Supper' in the refectory of the Convent of Santa Maria delle Grazie in Milan.",
      type: "achievement",
      location: "Milan, Italy",
      tags: ["art", "masterpiece"],
      sources: [
        { title: "UNESCO World Heritage", url: "https://whc.unesco.org/en/list/93" }
      ]
    },
    {
      date: "1503",
      title: "Mona Lisa",
      description: "Began painting the Mona Lisa (La Gioconda), which would become the most recognized and iconic portrait in history.",
      type: "achievement",
      location: "Florence, Italy",
      tags: ["art", "portrait"],
      sources: [
        { title: "Louvre Museum", url: "https://www.louvre.fr/en" }
      ]
    }
  ]

  const timelineEvents = events.length > 0 ? events : defaultEvents

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            {title}
          </h2>

          <p className="text-gray-400 max-w-2xl mx-auto mb-8">
            Explore the key moments and events that shaped this historical figure's life and legacy.
          </p>

          {/* Controls */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={expandAll}
              className="px-4 py-2 bg-cyan-400/10 text-cyan-400 rounded border border-cyan-400/30 hover:bg-cyan-400/20 transition-colors text-sm"
            >
              Expand All
            </button>
            <button
              onClick={collapseAll}
              className="px-4 py-2 bg-gray-700/50 text-gray-400 rounded border border-gray-600/30 hover:bg-gray-700/70 transition-colors text-sm"
            >
              Collapse All
            </button>
          </div>
        </motion.div>

        {/* Timeline */}
        <div ref={timelineRef} className="relative">
          {timelineEvents.map((event, index) => (
            <TimelineEvent
              key={index}
              event={event}
              index={index}
              isExpanded={expandedEvents.has(index)}
              onToggle={() => toggleEvent(index)}
            />
          ))}
        </div>

        {/* Bottom fade */}
        <div className="mt-8 h-24 bg-gradient-to-t from-black to-transparent pointer-events-none" />
      </div>
    </section>
  )
}

export default InteractiveTimeline
