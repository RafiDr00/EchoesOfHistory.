import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/router'
import Hero3D from './Hero3D'
import InteractiveTimeline from './InteractiveTimeline'
import {
  HolographicLoader,
  SearchResultsSkeleton,
  ErrorDisplay,
  FloatingParticles
} from './LoadingComponents'
import {
  ClockIcon,
  BookOpenIcon,
  GlobeAltIcon,
  PlayIcon,
  PhotoIcon,
  DocumentTextIcon,
  CalendarIcon,
  UserIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline'

// Article Card Component (Refined)
const ArticleCard = ({ article, index }) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -5 }}
      className="bg-dark-800/80 backdrop-blur-xl rounded-2xl p-6 border border-dark-700 hover:border-cyber-blue/50 transition-all group flex flex-col h-full"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-2.5 rounded-xl bg-cyber-blue/10 text-cyber-blue group-hover:bg-cyber-blue group-hover:text-white transition-all">
          <BookOpenIcon className="w-5 h-5" />
        </div>
        <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold px-2 py-1 bg-dark-700 rounded-md">
          {article.category || 'Reference'}
        </span>
      </div>

      <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
        {article.title}
      </h3>

      <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3">
        {article.description || "Detailed historical context and analysis of this topic."}
      </p>

      <div className="mt-auto pt-4 border-t border-dark-700 flex items-center justify-between">
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-bold text-cyber-blue flex items-center group-hover:gap-2 transition-all"
        >
          READ FULL ARTICLE <span className="ml-1">→</span>
        </a>
      </div>
    </motion.article>
  )
}

// Media Gallery Component (Refined)
const MediaGallery = ({ media = [] }) => {
  const [selectedMedia, setSelectedMedia] = useState(null)

  if (!media || media.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {media.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.05 }}
            className="group relative aspect-square rounded-2xl overflow-hidden cursor-zoom-in bg-dark-800"
            onClick={() => setSelectedMedia(item)}
          >
            <img
              src={item.url}
              alt={item.title}
              className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
              <p className="text-xs font-bold text-white truncate">{item.title}</p>
              <p className="text-[10px] text-cyber-blue truncate">{item.credit || 'Wikimedia'}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedMedia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-dark-950/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8"
            onClick={() => setSelectedMedia(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative max-w-5xl w-full bg-dark-900 rounded-3xl overflow-hidden shadow-2xl border border-dark-700"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedMedia(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-dark-800 rounded-full text-white hover:bg-dark-700 transition-all"
              >
                ✕
              </button>
              <img
                src={selectedMedia.url}
                alt={selectedMedia.title}
                className="w-full h-auto max-h-[75vh] object-contain bg-black"
              />
              <div className="p-8 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-white">{selectedMedia.title}</h3>
                  <span className="px-3 py-1 bg-dark-700 rounded-lg text-xs font-bold text-cyber-blue">{selectedMedia.type}</span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">{selectedMedia.description}</p>
                <p className="text-[10px] text-gray-600 uppercase tracking-widest pt-4">Source: {selectedMedia.source} • {selectedMedia.credit}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

const CinematicSearchResults = ({ query, searchData, isLoading, error, onRetry }) => {
  const router = useRouter()

  if (isLoading) {
    return (
      <div className="container mx-auto px-6 py-12">
        <HolographicLoader message={`Tapping into the historical records for ${query}...`} />
        <div className="mt-12 opacity-50"><SearchResultsSkeleton /></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-6 py-24 flex items-center justify-center">
        <ErrorDisplay
          title="Archive Access Denied"
          message={error.message || "The historical records are currently unreachable. Check your uplink."}
          onRetry={onRetry}
        />
      </div>
    )
  }

  if (!searchData) return null

  const { biography, timeline, related_articles, media, model_3d_available, model_3d_url } = searchData

  return (
    <div className="relative pb-32">
      <div className="container mx-auto px-4 sm:px-6 space-y-16">
        {/* Context Hero */}
        <motion.section
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative overflow-hidden rounded-[2.5rem] bg-dark-800 border border-dark-700 min-h-[500px] flex flex-col justify-end p-8 sm:p-16"
        >
          {/* 3D or Large Image Background could go here */}
          {model_3d_available ? (
            <div className="absolute inset-0 bg-black/40">
              <iframe src={model_3d_url} className="w-full h-full border-0" allow="autoplay; fullscreen; xr-spatial-tracking" />
            </div>
          ) : (
            <div className="absolute inset-0 opacity-20 hover:opacity-30 transition-opacity">
              <img src={media?.[0]?.url} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="relative z-10 max-w-4xl space-y-6">
            <motion.div initial={{ x: -20 }} animate={{ x: 0 }} className="inline-flex items-center px-4 py-2 bg-cyber-blue/20 rounded-full border border-cyber-blue/30 backdrop-blur-md">
              <GlobeAltIcon className="w-4 h-4 text-cyber-blue mr-2" />
              <span className="text-xs font-black tracking-widest text-cyber-blue uppercase">Full Context Archived</span>
            </motion.div>

            <h1 className="text-5xl sm:text-7xl font-bold text-white tracking-tight">
              {query}
            </h1>

            {biography && (
              <p className="text-gray-300 text-lg sm:text-xl leading-relaxed max-w-2xl font-medium">
                {biography.summary}
              </p>
            )}
          </div>
        </motion.section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-16">
            {/* Timeline */}
            <section className="space-y-8">
              <div className="flex items-center space-x-4">
                <ClockIcon className="w-6 h-6 text-cyber-purple" />
                <h2 className="text-2xl font-bold text-white uppercase tracking-wider">Historical Continuity</h2>
              </div>
              <div className="bg-dark-800/40 rounded-3xl p-2">
                <InteractiveTimeline events={timeline} />
              </div>
            </section>

            {/* Media */}
            {media && media.length > 0 && (
              <section className="space-y-8">
                <div className="flex items-center space-x-4">
                  <PhotoIcon className="w-6 h-6 text-cyber-pink" />
                  <h2 className="text-2xl font-bold text-white uppercase tracking-wider">Visual Record</h2>
                </div>
                <MediaGallery media={media} />
              </section>
            )}
          </div>

          {/* Sidebar Column */}
          <div className="space-y-12">
            {/* Related Knowledge */}
            <section className="space-y-6">
              <div className="flex items-center space-x-4 px-2">
                <BookOpenIcon className="w-5 h-5 text-cyber-blue" />
                <h2 className="text-lg font-bold text-white uppercase tracking-widest">Cross References</h2>
              </div>
              <div className="space-y-4">
                {related_articles && related_articles.map((article, idx) => (
                  <ArticleCard key={idx} article={article} index={idx} />
                ))}
              </div>
            </section>

            {/* Key Attributes */}
            {biography?.known_for && (
              <section className="bg-dark-800/80 rounded-3xl p-8 border border-dark-700 space-y-6">
                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Significance</h3>
                <div className="flex flex-wrap gap-2">
                  {biography.known_for.map((item, i) => (
                    <span key={i} className="px-3 py-1.5 bg-dark-900 rounded-lg text-xs font-bold text-white border border-dark-600">
                      {item}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>

        {/* Global Footer Navigation */}
        <div className="pt-20 flex justify-center">
          <button
            onClick={() => router.push('/')}
            className="group flex items-center space-x-4 px-8 py-4 bg-dark-800 hover:bg-cyber-blue transition-all rounded-2xl border border-dark-700 text-white font-bold"
          >
            <ArrowLeftIcon className="w-5 h-5 group-hover:-translate-x-2 transition-transform" />
            <span>RETURN TO ARCHIVE SEARCH</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default CinematicSearchResults
