'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { CheckCircle2, Circle, Lock, Zap, Trophy } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CHAPTERS, getCurrentLevel, LEVELS, getOrderedStepIds } from '@/lib/tutorial-data'

interface ProgressSidebarProps {
  completedSteps: Set<string>
  activeStepId: string
  onStepClick: (stepId: string) => void
  totalXp: number
  selectedPlatform: string | null
}

const stepLabels = {
  zh: { progress: '总进度', completed: '已完成', level: '等级', steps: '步骤' },
  en: { progress: 'Progress', completed: 'Completed', level: 'Level', steps: 'Steps' },
}

export function ProgressSidebar({
  completedSteps,
  activeStepId,
  onStepClick,
  totalXp,
  selectedPlatform,
}: ProgressSidebarProps) {
  const orderedStepIds = getOrderedStepIds(selectedPlatform)
  const totalSteps = orderedStepIds.length
  const completedCount = orderedStepIds.filter((id) => completedSteps.has(id)).length
  const progressPct = Math.round((completedCount / totalSteps) * 100)
  const currentLevel = getCurrentLevel(totalXp)
  const nextLevel = LEVELS.find((l) => l.level === currentLevel.level + 1)
  const levelProgress = nextLevel
    ? ((totalXp - currentLevel.minXp) / (nextLevel.minXp - currentLevel.minXp)) * 100
    : 100

  const labels = stepLabels['zh']

  // Figure out which steps are unlocked
  const getStepStatus = (stepId: string): 'done' | 'active' | 'locked' => {
    if (completedSteps.has(stepId)) return 'done'
    if (stepId === activeStepId) return 'active'
    const idx = orderedStepIds.indexOf(stepId)
    if (idx === 0) return 'active'
    const prevId = orderedStepIds[idx - 1]
    if (prevId && completedSteps.has(prevId)) return 'active'
    return 'locked'
  }

  // 创建节点路径
  const nodePositions: Record<string, number> = {}
  let nodeIndex = 0
  CHAPTERS.forEach((ch) => {
    ch.steps.forEach((step) => {
      nodePositions[step.id] = nodeIndex
      nodeIndex++
    })
  })
  const totalNodes = nodeIndex

  return (
    <aside className="flex flex-col h-full w-full bg-background border-r border-border overflow-hidden">
      {/* 顶部品牌区 */}
      <div className="px-5 py-5 border-b border-border flex-shrink-0">
        <div className="flex items-center gap-3">
          <Image src="/openclaw_logos/home_logo.png" alt="OpenClaw" width={40} height={40} className="rounded-xl object-contain" />
          <div>
            <div className="text-sm font-bold text-foreground">OpenClaw</div>
            <div className="text-xs text-muted-foreground">游戏化学习平台</div>
          </div>
        </div>
      </div>

      {/* 等级卡片 */}
      <div className="px-4 py-3 border-b border-border flex-shrink-0">
        <div className="bg-white rounded-2xl p-4 card-shadow border border-border/50">
          {/* 等级头部 */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-bold text-foreground">{currentLevel.title}</span>
            </div>
            <span className="text-xs font-bold text-primary">{currentLevel.level}</span>
          </div>

          {/* XP 进度条 - 彩色渐变 */}
          <div className="space-y-2">
            <div className="relative h-2 bg-secondary rounded-full overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-blue-400 via-green-400 to-amber-400"
                initial={{ width: 0 }}
                animate={{ width: `${levelProgress}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
            {nextLevel && (
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{totalXp} XP</span>
                <span>{nextLevel.minXp}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 总进度 */}
      <div className="px-4 py-3 border-b border-border flex-shrink-0">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-muted-foreground">{labels.progress}</span>
          <motion.span
            key={progressPct}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            className="text-sm font-bold text-primary"
          >
            {progressPct}%
          </motion.span>
        </div>
        <div className="relative h-2 bg-secondary rounded-full overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-blue-400 to-green-400"
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* 节点路径关卡 */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin py-4 px-4" aria-label="关卡导航">
        {/* 节点连接线和节点网格 */}
        <div className="space-y-3">
          {CHAPTERS.map((chapter, ci) => {
            const chapterSteps = chapter.steps.filter(
              (s) => !s.platformGroup || s.platformGroup === selectedPlatform
            )
            const chapterStepIds = chapterSteps.map((s) => s.id)
            const chapterDone = chapterStepIds.filter((id) => completedSteps.has(id)).length
            const isChapterActive = chapterSteps.some((s) => s.id === activeStepId)
            const isChapterUnlocked =
              ci === 0 ||
              CHAPTERS[ci - 1].steps
                .filter((s) => !s.platformGroup || s.platformGroup === selectedPlatform)
                .every((s) => completedSteps.has(s.id))

            return (
              <div key={chapter.id}>
                {/* 章节标题 */}
                <div className="mb-3 flex items-center gap-2">
                  <div className={cn(
                    'text-xs font-bold uppercase tracking-wider',
                    isChapterActive ? 'text-primary' : isChapterUnlocked ? 'text-foreground' : 'text-muted-foreground/50'
                  )}>
                    {chapter.title}
                  </div>
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs text-muted-foreground font-mono">{chapterDone}/{chapterSteps.length}</span>
                </div>

                {/* 步骤节点 - 游戏地图风格 */}
                {isChapterUnlocked && (
                  <div className="relative ml-2">
                    {/* 垂直连接线背景 */}
                    <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-gray-200 via-gray-200 to-gray-200 rounded-full" />
                    
                    <div className="relative space-y-1">
                      {chapter.steps
                        .filter((step) => !step.platformGroup || step.platformGroup === selectedPlatform)
                        .map((step, si) => {
                        const status = getStepStatus(step.id)
                        const isLast = si === chapterSteps.length - 1
                        
                        return (
                          <div key={step.id} className="relative">
                            {/* 进度连接线覆盖 */}
                            {!isLast && status === 'done' && (
                              <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: '100%' }}
                                transition={{ duration: 0.3 }}
                                className="absolute left-[15px] top-4 w-0.5 bg-gradient-to-b from-green-400 to-green-400 rounded-full z-[1]"
                                style={{ bottom: '-4px' }}
                              />
                            )}

                            {/* 节点按钮 */}
                            <motion.button
                              onClick={() => status !== 'locked' && onStepClick(step.id)}
                              disabled={status === 'locked'}
                              whileHover={status !== 'locked' ? { x: 4 } : {}}
                              whileTap={status !== 'locked' ? { scale: 0.98 } : {}}
                              className={cn(
                                'relative w-full flex items-center gap-3 py-2.5 px-2 rounded-xl transition-all duration-200 group',
                                status === 'active' && 'bg-blue-50/80',
                                status !== 'locked' && 'hover:bg-secondary/80'
                              )}
                            >
                              {/* 圆形节点 */}
                              <div className="flex-shrink-0 relative z-[2]">
                                {status === 'done' && (
                                  <motion.div
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                    className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-md"
                                  >
                                    <CheckCircle2 className="w-4 h-4 text-white" />
                                  </motion.div>
                                )}
                                {status === 'active' && (
                                  <div className="relative">
                                    <motion.div
                                      animate={{ scale: [1, 1.2, 1] }}
                                      transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                                      className="absolute inset-0 w-8 h-8 rounded-full bg-blue-400/30"
                                    />
                                    <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center shadow-md">
                                      <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
                                      >
                                        <Circle className="w-3.5 h-3.5 text-white" />
                                      </motion.div>
                                    </div>
                                  </div>
                                )}
                                {status === 'locked' && (
                                  <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                                    <Lock className="w-3.5 h-3.5 text-gray-400" />
                                  </div>
                                )}
                              </div>

                              {/* 步骤信息 */}
                              <div className="flex-1 min-w-0 text-left">
                                <div className={cn(
                                  'text-sm font-medium truncate transition-colors',
                                  status === 'done' && 'text-green-600',
                                  status === 'active' && 'text-foreground font-semibold',
                                  status === 'locked' && 'text-muted-foreground/60'
                                )}>
                                  {step.title}
                                </div>
                              </div>

                              {/* XP 徽章 */}
                              <motion.span
                                whileHover={{ scale: 1.1 }}
                                className={cn(
                                  'flex-shrink-0 text-xs px-2.5 py-1 rounded-lg font-bold transition-all',
                                  status === 'done' && 'bg-green-100 text-green-600',
                                  status === 'active' && 'bg-blue-100 text-blue-600',
                                  status === 'locked' && 'bg-gray-100 text-gray-400'
                                )}
                              >
                                +{step.xp}
                              </motion.span>
                            </motion.button>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* 未解锁章节 */}
                {!isChapterUnlocked && (
                  <div className="flex items-center justify-center gap-2 py-4 text-muted-foreground text-xs">
                    <Lock className="w-3.5 h-3.5" />
                    <span>完成上一章解锁</span>
                  </div>
                )}

                {/* 章节分隔线 */}
                {ci < CHAPTERS.length - 1 && (
                  <div className="my-4 h-px bg-border/60" />
                )}
              </div>
            )
          })}
        </div>
      </nav>
    </aside>
  )
}
