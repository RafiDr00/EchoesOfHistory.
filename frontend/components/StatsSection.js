import { motion } from 'framer-motion'

export const StatsSection = () => {
    const stats = [
        { number: '10,000+', label: 'Historical Figures' },
        { number: '5,000+', label: 'Major Events' },
        { number: '100+', label: 'Civilizations' },
        { number: '∞', label: 'Stories to Discover' }
    ]

    return (
        <section className="py-20 bg-dark-800/50 backdrop-blur-xl border-y border-gray-700/50">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">Explore the Archives</h2>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                        Dive into our vast collection of historical data, powered by AI and enhanced with immersive visualizations
                    </p>
                </motion.div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="text-center"
                        >
                            <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-cyber-blue to-cyber-purple bg-clip-text text-transparent mb-2">
                                {stat.number}
                            </div>
                            <div className="text-gray-300 text-lg">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
