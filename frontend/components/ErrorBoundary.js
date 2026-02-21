import React from 'react'
import { motion } from 'framer-motion'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service here
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-700 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full bg-dark-800/50 backdrop-blur-xl rounded-2xl p-8 border border-cyber-blue/20"
          >
            {/* Glitch Effect Icon */}
            <motion.div
              animate={{ 
                x: [0, -2, 2, 0],
                filter: ['hue-rotate(0deg)', 'hue-rotate(180deg)', 'hue-rotate(0deg)']
              }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
              className="text-6xl text-center mb-6"
            >
              ⚡
            </motion.div>

            <h2 className="text-2xl font-bold text-cyber-blue mb-4 text-center">
              System Malfunction
            </h2>
            
            <p className="text-gray-300 text-center mb-6">
              A temporal anomaly has been detected. The history matrix is recalibrating...
            </p>

            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.reload()}
                className="w-full px-4 py-3 bg-gradient-to-r from-cyber-blue to-cyber-purple 
                         text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-cyber-blue/25 
                         transition-all duration-300"
              >
                🔄 Reload Timeline
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = '/'}
                className="w-full px-4 py-3 bg-dark-700 hover:bg-dark-600 
                         text-gray-300 font-semibold rounded-xl border border-gray-600
                         transition-all duration-300"
              >
                🏠 Return to Origin
              </motion.button>
            </div>

            {/* Debug Info (only in development) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 p-4 bg-red-900/20 rounded-lg border border-red-500/20">
                <summary className="text-red-400 cursor-pointer text-sm font-semibold mb-2">
                  Debug Information
                </summary>
                <div className="text-xs text-red-300 font-mono">
                  <div className="mb-2">
                    <strong>Error:</strong> {this.state.error.toString()}
                  </div>
                  <div>
                    <strong>Stack:</strong>
                    <pre className="mt-1 text-xs overflow-auto">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </div>
                </div>
              </details>
            )}
          </motion.div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
