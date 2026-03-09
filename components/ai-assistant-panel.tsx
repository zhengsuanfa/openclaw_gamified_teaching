'use client'

import React, { useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Star, Zap, Flame, Crown, Target } from 'lucide-react'
import { LEVELS, getCurrentLevel } from '@/lib/tutorial-data'
import { cn } from '@/lib/utils'

interface AchievementsPanelProps {
  totalXp: number
  completedSteps: number
  totalSteps: number
  levelUpLevel?: number | null
  onLevelUpDismiss?: () => void
}

const BADGES = [
  { id: 'first-step', name: '崭露头角', description: '完成第一步', icon: Star, color: 'blue', minSteps: 1 },
  { id: 'first-chapter', name: '章节完成', description: '完成一整章', icon: Trophy, color: 'amber', minSteps: 5 },
  { id: 'halfway', name: '中流砥柱', description: '完成一半的步骤', icon: Target, color: 'green', minSteps: 8 },
  { id: 'momentum', name: '连胜', description: '连续完成5步', icon: Flame, color: 'orange', minSteps: 13 },
  { id: 'legend', name: '传奇', description: '完成全部教程', icon: Crown, color: 'purple', minSteps: 15 },
]

export function AchievementsPanel({ totalXp, completedSteps, totalSteps, levelUpLevel, onLevelUpDismiss }: AchievementsPanelProps) {
  const currentLevel = getCurrentLevel(totalXp)

  // 升级弹窗自动定时关闭
  useEffect(() => {
    if (!levelUpLevel) return
    const t = setTimeout(() => onLevelUpDismiss?.(), 3000)
    return () => clearTimeout(t)
  }, [levelUpLevel, onLevelUpDismiss])

  const levelUpData = levelUpLevel ? LEVELS.find((l) => l.level === levelUpLevel) : null
  const nextLevel = LEVELS.find((l) => l.level === currentLevel.level + 1)
  const nextXp = nextLevel?.minXp ?? currentLevel.minXp + 1000
  const levelProgress = ((totalXp - currentLevel.minXp) / (nextXp - currentLevel.minXp)) * 100

  // 获得的徽章
  const earnedBadges = BADGES.filter((b) => completedSteps >= b.minSteps)
  const nextBadge = BADGES.find((b) => completedSteps < b.minSteps)

  const colorMap: Record<string, { bg: string; text: string; border: string }> = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200' },
    green: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200' },
    orange: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' },
  }

  return (
    <aside className="relative flex flex-col h-full bg-background border-l border-border overflow-hidden">
      {/* 头部 */}
      <div className="flex-shrink-0 px-5 py-5 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h2 className="text-base font-bold text-foreground">成就</h2>
          </div>
        </div>

        {/* 等级卡片 - 游戏风格 */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative bg-gradient-to-br from-white to-gray-50 rounded-2xl p-4 card-shadow border border-border/50 overflow-hidden"
        >
          {/* 背景装饰 */}
          <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-10" style={{ background: currentLevel.color }} />
          
          {/* 等级徽章居中 */}
          <div className="flex flex-col items-center mb-4">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              className="mb-2"
            >
              <Image
                src={`/openclaw_logos/${currentLevel.level}.png`}
                alt={currentLevel.title}
                width={96}
                height={96}
                className="object-contain drop-shadow-lg"
              />
            </motion.div>
            <div className="text-base font-bold" style={{ color: currentLevel.color }}>
              {currentLevel.title}
            </div>
          </div>

          {/* XP 显示 */}
          <div className="flex items-center justify-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-amber-500" />
            <motion.span
              key={totalXp}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              className="text-lg font-bold text-foreground"
            >
              {totalXp} XP
            </motion.span>
          </div>

          {/* XP 进度条 */}
          <div className="space-y-1.5">
            <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{ background: `linear-gradient(90deg, ${currentLevel.color}, ${currentLevel.color}99)` }}
                initial={{ width: 0 }}
                animate={{ width: `${levelProgress}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
            {nextLevel && (
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>距下一级</span>
                <span className="font-semibold">{nextXp - totalXp} XP</span>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* 进度统计 */}
      <div className="px-5 py-4 border-b border-border flex-shrink-0">
        <div className="space-y-3">
          {/* 完成进度 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-blue-500" />
                教程进度
              </span>
              <span className="text-xs font-bold text-foreground">{completedSteps}/{totalSteps}</span>
            </div>
            <div className="relative h-2 bg-secondary rounded-full overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-blue-400 to-green-400"
                initial={{ width: 0 }}
                animate={{ width: `${(completedSteps / totalSteps) * 100}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 徽章区 */}
      <div className="flex-1 overflow-y-auto scrollbar-thin px-5 py-4">
        <div className="mb-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">已获得徽章</h3>
          
          {earnedBadges.length > 0 ? (
            <div className="grid grid-cols-2 gap-2">
              {earnedBadges.map((badge, idx) => {
                const colors = colorMap[badge.color as keyof typeof colorMap]
                const BadgeIcon = badge.icon
                return (
                  <motion.div
                    key={badge.id}
                    initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                    animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                    transition={{ delay: idx * 0.1, type: 'spring', stiffness: 200 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    className={cn(
                      'relative flex flex-col items-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-shadow hover:shadow-md',
                      colors.bg,
                      colors.border
                    )}
                  >
                    {/* 光晕效果 */}
                    <motion.div
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className={cn('absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100', colors.bg)}
                    />
                    <div className={cn('relative w-10 h-10 rounded-full flex items-center justify-center shadow-sm', colors.bg)}>
                      <BadgeIcon className={cn('w-5 h-5', colors.text)} />
                    </div>
                    <div className="text-center">
                      <div className={cn('text-xs font-bold', colors.text)}>{badge.name}</div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                <Trophy className="w-8 h-8 text-gray-300" />
              </div>
              <div className="text-sm font-medium text-muted-foreground">完成步骤来解锁徽章</div>
            </div>
          )}
        </div>

        {/* 下一个徽章 */}
        {nextBadge && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">下一个目标</h3>
            <motion.div
              initial={{ opacity: 0.6 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
              className="p-4 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 text-center"
            >
              <div className="flex justify-center mb-2">
                {React.createElement(nextBadge.icon, { className: 'w-6 h-6 text-gray-400' })}
              </div>
              <div className="text-xs font-bold text-foreground mb-1">{nextBadge.name}</div>
              <div className="text-xs text-muted-foreground mb-2">{nextBadge.description}</div>
              <div className="text-xs font-semibold text-gray-500">
                {nextBadge.minSteps - completedSteps} 步骤待完成
              </div>
            </motion.div>
          </div>
        )}
      </div>

      {/* 底部激励信息 */}
      <div className="flex-shrink-0 px-5 py-4 border-t border-border bg-gradient-to-t from-blue-50/50 to-transparent">
        <div className="text-xs text-center text-muted-foreground">
          {completedSteps === totalSteps ? (
            <span className="font-bold text-green-600">恭喜完成全部教程！🎉</span>
          ) : (
            <span>再完成 <span className="font-bold text-primary">{totalSteps - completedSteps}</span> 步就能成为传奇！</span>
          )}
        </div>
      </div>
      {/* 升级弹窗 overlay */}
      <AnimatePresence>
        {levelUpData && (
          <motion.div
            key="levelup"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.4 } }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center rounded-none"
            style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)' }}
            onClick={() => onLevelUpDismiss?.()}
          >
            {/* 外圈光晟粒子 */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1.2, 0],
                  x: Math.cos((i / 8) * Math.PI * 2) * 80,
                  y: Math.sin((i / 8) * Math.PI * 2) * 80,
                }}
                transition={{ duration: 1.2, delay: 0.2 + i * 0.05 }}
                className="absolute w-3 h-3 rounded-full"
                style={{ background: levelUpData.color }}
              />
            ))}

            {/* 头像 */}
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }}
            >
              <Image
                src={`/openclaw_logos/${levelUpData.level}.png`}
                alt={levelUpData.title}
                width={160}
                height={160}
                className="object-contain drop-shadow-2xl"
              />
            </motion.div>

            {/* 文字 */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="mt-4 text-center"
            >
              <div className="text-2xl font-black mb-1" style={{ color: levelUpData.color }}>
                升级啦！
              </div>
              <div className="text-base font-bold text-foreground">{levelUpData.title}</div>
              <div className="text-xs text-muted-foreground mt-1">Lv.{levelUpData.level}</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="mt-5 text-xs text-muted-foreground"
            >
              点击任意处关闭
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  )
}
