'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Trophy, Share2, RefreshCw } from 'lucide-react'
import { getCurrentLevel } from '@/lib/tutorial-data'

interface VictoryScreenProps {
  totalXp: number
  onReset: () => void
}

const PARTICLE_COUNT = 40
const COLORS = ['#4da3ff', '#6EDB8F', '#FFD700', '#FF6B9D', '#A78BFA', '#34D399', '#FB923C']

export function VictoryScreen({ totalXp, onReset }: VictoryScreenProps) {
  const [copied, setCopied] = useState(false)
  const level = getCurrentLevel(totalXp)

  const handleShare = async () => {
    const text = `🦞 我在 OpenClaw Gamified Teaching 完成了全部关卡！\n获得 ${totalXp} XP，达到"${level.title}"等级 🎉\nhttps://openclaw.ai`
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // ignore clipboard errors
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at center, #0a1628 0%, #050d1a 70%)' }}
    >
      {/* 粒子背景 */}
      {[...Array(PARTICLE_COUNT)].map((_, i) => {
        const color = COLORS[i % COLORS.length]
        const size = 4 + Math.random() * 8
        const startX = Math.random() * 100
        const duration = 3 + Math.random() * 4
        const delay = Math.random() * 2

        return (
          <motion.div
            key={i}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: size,
              height: size,
              left: `${startX}%`,
              top: '110%',
              backgroundColor: color,
              boxShadow: `0 0 ${size * 2}px ${color}`,
            }}
            animate={{
              top: ['-10%'],
              x: [0, (Math.random() - 0.5) * 200],
              rotate: [0, 360 * (Math.random() > 0.5 ? 1 : -1)],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration,
              delay,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          />
        )
      })}

      {/* 主内容卡片 */}
      <motion.div
        initial={{ scale: 0.5, y: 80, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 22, delay: 0.1 }}
        className="relative z-10 w-full max-w-md mx-4 bg-gradient-to-b from-gray-900 to-gray-950 rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
      >
        {/* 顶部光晕装饰 */}
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{ background: 'linear-gradient(90deg, #4da3ff, #6EDB8F, #FFD700, #FF6B9D, #4da3ff)' }}
        />

        <div className="px-8 py-10 text-center">
          {/* 龙虾 emoji */}
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
            className="text-7xl mb-2 select-none"
          >
            🦞
          </motion.div>

          {/* 大标题 */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-4xl font-black mb-2"
            style={{
              background: 'linear-gradient(135deg, #4da3ff 0%, #6EDB8F 50%, #FFD700 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            大功告成！
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-gray-400 text-sm mb-8"
          >
            你已经是 OpenClaw 传说级大神了！
          </motion.p>

          {/* XP 展示 */}
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6, type: 'spring', stiffness: 300 }}
            className="flex items-center justify-center gap-3 bg-gradient-to-r from-amber-900/40 to-yellow-900/40 border border-amber-500/30 rounded-2xl px-6 py-4 mb-4"
          >
            <motion.div
              animate={{ rotate: [0, 20, -20, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <Star className="w-7 h-7 text-amber-400" fill="currentColor" />
            </motion.div>
            <div className="text-left">
              <div className="text-3xl font-black text-amber-400">{totalXp} XP</div>
              <div className="text-xs text-amber-600 font-medium">总获得经验值</div>
            </div>
          </motion.div>

          {/* 等级徽章 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex items-center justify-center gap-2.5 bg-gradient-to-r from-purple-900/50 to-blue-900/50 border border-purple-500/30 rounded-2xl px-5 py-3 mb-8"
          >
            <Trophy className="w-5 h-5 text-purple-400" />
            <span className="text-white font-bold text-sm">{level.title}</span>
            <span className="text-purple-400 font-bold text-sm">Lv.{level.level}</span>
          </motion.div>

          {/* 按钮组 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col gap-3"
          >
            <motion.button
              onClick={handleShare}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold text-sm shadow-lg"
            >
              <Share2 className="w-4 h-4" />
              {copied ? '✓ 已复制到剪贴板！' : '分享我的成就'}
            </motion.button>

            <motion.button
              onClick={onReset}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-2xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-colors font-semibold text-sm"
            >
              <RefreshCw className="w-4 h-4" />
              再次挑战
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}
