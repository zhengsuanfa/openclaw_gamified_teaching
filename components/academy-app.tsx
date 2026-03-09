'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ProgressSidebar } from '@/components/progress-sidebar'
import { TutorialPanel } from '@/components/tutorial-panel'
import { AchievementsPanel } from '@/components/ai-assistant-panel'
import { TopNav } from '@/components/top-nav'
import { VictoryScreen } from '@/components/victory-screen'
import { CHAPTERS, getTotalSteps, getOrderedStepIds, getCurrentLevel } from '@/lib/tutorial-data'

const FIRST_STEP_ID = CHAPTERS[0].steps[0].id

export function AcademyApp() {
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set())
  const [activeStepId, setActiveStepId] = useState<string>(FIRST_STEP_ID)
  const [totalXp, setTotalXp] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileAiOpen, setMobileAiOpen] = useState(false)
  const [showBanner, setShowBanner] = useState(true)
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null)
  const [showVictory, setShowVictory] = useState(false)
  const [levelUpLevel, setLevelUpLevel] = useState<number | null>(null)
  const prevLevelRef = useRef<number>(1)

  const totalSteps = getTotalSteps()

  // 侧边栏顶部偏移：导航栏 4rem + 公告条约 2.5rem
  const sidebarTop = showBanner ? '6.5rem' : '4rem'

  // Build ordered step list
  const allStepIds = getOrderedStepIds(selectedPlatform)

  const handleStepComplete = useCallback(
    (stepId: string) => {
      setCompletedSteps((prev) => {
        const next = new Set(prev)
        next.add(stepId)
        return next
      })

      // Add XP
      const step = CHAPTERS.flatMap((ch) => ch.steps).find((s) => s.id === stepId)
      if (step) {
        setTotalXp((prev) => prev + step.xp)
      }

      // Auto-advance to next step
      const idx = allStepIds.indexOf(stepId)
      if (idx >= 0 && idx < allStepIds.length - 1) {
        setTimeout(() => {
          setActiveStepId(allStepIds[idx + 1])
        }, 1800)
      }
    },
    [allStepIds]
  )

  // 升级检测
  useEffect(() => {
    const level = getCurrentLevel(totalXp).level
    if (level > prevLevelRef.current) {
      setLevelUpLevel(level)
    }
    prevLevelRef.current = level
  }, [totalXp])

  // 胜利检测：所有有效步骤完成后显示胜利屏幕
  useEffect(() => {
    if (completedSteps.size === 0) return
    const ordered = getOrderedStepIds(selectedPlatform)
    if (ordered.length > 0 && ordered.every((id) => completedSteps.has(id))) {
      const t = setTimeout(() => setShowVictory(true), 2200)
      return () => clearTimeout(t)
    }
  }, [completedSteps, selectedPlatform])

  const handleStepClick = useCallback((stepId: string) => {
    setActiveStepId(stepId)
    setMobileMenuOpen(false)
  }, [])

  const handleChoiceMade = useCallback((platformId: string, targetStepId: string) => {
    setSelectedPlatform(platformId)
    // Mark the choice step as completed
    setCompletedSteps((prev) => {
      const next = new Set(prev)
      next.add('step-3-0')
      return next
    })
    setActiveStepId(targetStepId)
  }, [])

  const handleReset = useCallback(() => {
    setCompletedSteps(new Set())
    setActiveStepId(FIRST_STEP_ID)
    setTotalXp(0)
    setSelectedPlatform(null)
    setShowVictory(false)
  }, [])

  return (
    <div className="relative flex flex-col h-[100dvh] w-screen overflow-hidden bg-background">
      {/* 公告条 */}
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative flex-shrink-0 flex items-center justify-center bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white z-20 overflow-hidden"
          >
            <div className="flex items-center justify-center gap-2 px-10 py-2 text-center">
              <span className="text-sm">💬</span>
              <span className="text-xs sm:text-sm font-medium leading-tight">
                如需 1 对 1 技术指导&amp;协助，请联系微信：
                <strong className="font-black tracking-wide ml-1">zhengsuanfa</strong>
              </span>
            </div>
            <button
              onClick={() => setShowBanner(false)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-white/20 transition-colors"
              aria-label="关闭公告"
            >
              <span className="text-white text-xs font-bold leading-none">✕</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 背景渐变装饰 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-48 -left-48 w-96 h-96 rounded-full blur-3xl opacity-10"
          style={{
            background: 'radial-gradient(circle, rgba(77, 163, 255, 0.4) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute -bottom-48 -right-48 w-96 h-96 rounded-full blur-3xl opacity-8"
          style={{
            background: 'radial-gradient(circle, rgba(110, 219, 143, 0.3) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* Top Navigation */}
      <TopNav
        totalXp={totalXp}
        completedCount={completedSteps.size}
        totalSteps={totalSteps}
        onMenuToggle={() => setMobileMenuOpen((o) => !o)}
        menuOpen={mobileMenuOpen}
      />

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Sidebar - Desktop */}
        <div className="hidden md:block w-64 lg:w-72 flex-shrink-0">
          <ProgressSidebar
            completedSteps={completedSteps}
            activeStepId={activeStepId}
            onStepClick={handleStepClick}
            totalXp={totalXp}
            selectedPlatform={selectedPlatform}
          />
        </div>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="md:hidden fixed inset-0 bg-background/60 backdrop-blur-sm z-30"
                onClick={() => setMobileMenuOpen(false)}
              />
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="md:hidden fixed left-0 bottom-0 w-72 z-40 shadow-2xl"
                style={{ top: sidebarTop }}
              >
                <ProgressSidebar
                  completedSteps={completedSteps}
                  activeStepId={activeStepId}
                  onStepClick={handleStepClick}
                  totalXp={totalXp}
                  selectedPlatform={selectedPlatform}
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Center Tutorial Panel */}
        <div className="flex-1 overflow-hidden relative">
          <TutorialPanel
            activeStepId={activeStepId}
            completedSteps={completedSteps}
            onStepComplete={handleStepComplete}
            onChoiceMade={handleChoiceMade}
            selectedPlatform={selectedPlatform}
          />
        </div>

        {/* Right AI Panel - Desktop */}
        <div className="hidden lg:block w-80 flex-shrink-0">
          <AchievementsPanel
            totalXp={totalXp}
            completedSteps={completedSteps.size}
            totalSteps={totalSteps}
            levelUpLevel={levelUpLevel}
            onLevelUpDismiss={() => setLevelUpLevel(null)}
          />
        </div>
      </div>

      {/* 移动端成就浮窗 */}
      <div className="lg:hidden fixed bottom-6 right-6 z-30">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setMobileAiOpen(true)}
          className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 text-white flex items-center justify-center glow-blue shadow-xl font-bold text-sm"
        >
          🏆
        </motion.button>
      </div>

      {/* 移动端成就抽屉 */}
      <AnimatePresence>
        {mobileAiOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              onClick={() => setMobileAiOpen(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="lg:hidden fixed bottom-0 left-0 right-0 h-[75vh] z-50 rounded-t-3xl overflow-hidden shadow-2xl bg-white"
            >
              <AchievementsPanel
                totalXp={totalXp}
                completedSteps={completedSteps.size}
                totalSteps={totalSteps}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 胜利屏幕 */}
      <AnimatePresence>
        {showVictory && (
          <VictoryScreen totalXp={totalXp} onReset={handleReset} />
        )}
      </AnimatePresence>
    </div>
  )
}
