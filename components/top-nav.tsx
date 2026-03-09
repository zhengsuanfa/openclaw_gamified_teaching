'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Github, Zap, Trophy, Menu, X } from 'lucide-react'
import { getCurrentLevel } from '@/lib/tutorial-data'

interface TopNavProps {
  totalXp: number
  completedCount: number
  totalSteps: number
  onMenuToggle: () => void
  menuOpen: boolean
}

export function TopNav({
  totalXp,
  completedCount,
  totalSteps,
  onMenuToggle,
  menuOpen,
}: TopNavProps) {
  const currentLevel = getCurrentLevel(totalXp)
  const progressPct = Math.round((completedCount / totalSteps) * 100)

  return (
    <header className="h-16 flex-shrink-0 flex items-center justify-between px-4 md:px-6 border-b border-border/60 bg-white/95 backdrop-blur-sm shadow-sm z-20">
      {/* Left: Logo (mobile) + title */}
      <div className="flex items-center gap-3">
        <motion.button
          onClick={onMenuToggle}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="md:hidden p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
          aria-label="打开菜单"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </motion.button>
        {/* 移动端 Logo */}
        <div className="md:hidden flex items-center gap-2">
          <Image src="/logo.png" alt="OpenClaw Logo" width={26} height={26} className="object-contain" />
          <span className="text-sm font-bold text-foreground">OpenClaw Gamified Teaching</span>
        </div>
        <div className="hidden md:flex items-center gap-3">
          <motion.div
            whileHover={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 0.5 }}
            className="w-9 h-9 flex items-center justify-center"
          >
            <Image src="/logo.png" alt="OpenClaw Logo" width={36} height={36} className="object-contain" />
          </motion.div>
          <div>
            <span className="text-base font-bold text-foreground">OpenClaw Gamified Teaching</span>
            <div className="text-xs text-muted-foreground font-medium">游戏化学习平台</div>
          </div>
        </div>
      </div>

      {/* Center: Progress (desktop) */}
      <div className="hidden md:flex items-center gap-4 flex-1 max-w-md mx-8">
        <div className="flex-1 bg-gray-50/80 rounded-2xl p-3 border border-gray-100">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-muted-foreground">总体进度</span>
            <motion.span
              key={progressPct}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              className="text-xs font-bold text-primary"
            >
              {progressPct}%
            </motion.span>
          </div>
          <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-400 via-green-400 to-emerald-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.8 }}
            />
          </div>
        </div>
      </div>

      {/* Right: Stats + Controls */}
      <div className="flex items-center gap-2.5">
        {/* XP display */}
        <motion.div
          key={totalXp}
          initial={{ scale: 1.15 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 text-amber-600 text-sm px-4 py-2.5 rounded-xl font-bold cursor-default shadow-sm"
        >
          <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
            <Zap className="w-4 h-4" />
          </motion.div>
          {totalXp}
        </motion.div>

        {/* Level badge */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="hidden sm:flex items-center gap-2 text-sm px-4 py-2.5 rounded-xl border-2 font-bold transition-all cursor-default shadow-sm"
          style={{
            color: currentLevel.color,
            borderColor: currentLevel.color,
            background: `linear-gradient(135deg, ${currentLevel.color}10, ${currentLevel.color}20)`,
          }}
        >
          <Trophy className="w-4 h-4" />
          Lv.{currentLevel.level}
        </motion.div>

        {/* GitHub link */}
        <motion.a
          href="https://github.com/zhengsuanfa/openclaw_gamified_teaching"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 text-sm px-3 py-2.5 rounded-xl bg-gray-50 text-muted-foreground hover:text-foreground hover:bg-gray-100 border border-gray-200 transition-all"
          aria-label="GitHub 仓库"
        >
          <Github className="w-5 h-5" />
        </motion.a>
      </div>
    </header>
  )
}
