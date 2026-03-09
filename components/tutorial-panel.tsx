'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Copy,
  Check,
  CheckCircle2,
  Lock,
  ChevronRight,
  Terminal,
  Lightbulb,
  Zap,
  Star,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { CHAPTERS, getOrderedStepIds, type TutorialStep } from '@/lib/tutorial-data'

interface TutorialPanelProps {
  activeStepId: string
  completedSteps: Set<string>
  onStepComplete: (stepId: string) => void
  onChoiceMade: (platformId: string, targetStepId: string) => void
  selectedPlatform: string | null
  lang: 'zh' | 'en'
}

const labels = {
  zh: {
    complete: '我已完成',
    completed: '已完成',
    locked: '请先完成上一步',
    copy: '复制',
    copied: '已复制',
    tips: '小提示',
    terminal: '终端',
    nextStep: '下一步',
    chapterComplete: '章节完成！',
    allDone: '全部完成！',
    stepXof: '步骤',
  },
  en: {
    complete: 'Mark Complete',
    completed: 'Completed',
    locked: 'Complete previous step first',
    copy: 'Copy',
    copied: 'Copied!',
    tips: 'Tips',
    terminal: 'Terminal',
    nextStep: 'Next Step',
    chapterComplete: 'Chapter Complete!',
    allDone: 'All Done!',
    stepXof: 'Step',
  },
}

function CodeBlock({ code, language, description }: { code: string; language: string; description?: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // 代码行数
  const lines = code.split('\n')

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl overflow-hidden border border-gray-200 card-shadow bg-white group"
    >
      {/* 终端头部 - macOS 风格 */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-gray-800 to-gray-900">
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500 shadow-inner" />
            <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-inner" />
            <div className="w-3 h-3 rounded-full bg-green-500 shadow-inner" />
          </div>
          <div className="flex items-center gap-2 ml-3">
            <Terminal className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-400 font-mono font-medium">{description || language}</span>
          </div>
        </div>
        <motion.button
          onClick={handleCopy}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            'flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all duration-200 font-semibold',
            copied
              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white border border-gray-600'
          )}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              {labels.zh.copied}
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              {labels.zh.copy}
            </>
          )}
        </motion.button>
      </div>

      {/* 代码内容 - 带行号 */}
      <div className="bg-gray-900 overflow-x-auto">
        <div className="flex">
          {/* 行号 */}
          <div className="flex-shrink-0 py-4 pl-4 pr-3 text-right select-none border-r border-gray-800">
            {lines.map((_, i) => (
              <div key={i} className="font-mono text-xs text-gray-600 leading-6">{i + 1}</div>
            ))}
          </div>
          {/* 代码 */}
          <pre className="flex-1 py-4 px-4 overflow-x-auto">
            <code className="font-mono text-sm leading-6">
              {lines.map((line, i) => (
                <div key={i} className="text-emerald-400 hover:bg-gray-800/50 px-2 -mx-2 rounded transition-colors">
                  {line || ' '}
                </div>
              ))}
            </code>
          </pre>
        </div>
      </div>
    </motion.div>
  )
}

function StepCompletedOverlay({ onNext, hasNext, xp }: { onNext: () => void; hasNext: boolean; xp: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-green-500/10 to-blue-500/10 backdrop-blur-md z-10 rounded-3xl"
    >
      <motion.div
        initial={{ scale: 0.5, y: 40, rotateX: -15 }}
        animate={{ scale: 1, y: 0, rotateX: 0 }}
        exit={{ scale: 0.8, y: 20, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="flex flex-col items-center gap-5 text-center px-8 bg-white rounded-3xl p-10 max-w-sm shadow-2xl border border-gray-100"
      >
        {/* 成功动画 - 游戏风格 */}
        <div className="relative">
          {/* 外圈光晕 */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.5, 1.2], opacity: [0, 0.5, 0] }}
            transition={{ duration: 1, delay: 0.2 }}
            className="absolute inset-0 w-24 h-24 rounded-full bg-green-400"
            style={{ top: '-8px', left: '-8px' }}
          />
          
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
            className="relative w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.3, 1] }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <CheckCircle2 className="w-10 h-10 text-white" />
            </motion.div>
          </motion.div>
          
          {/* XP 爆破粒子 - 更多更炫 */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 1, scale: 1, x: 0, y: 0 }}
              animate={{ 
                opacity: 0, 
                scale: 0, 
                x: Math.cos((i / 12) * Math.PI * 2) * (80 + Math.random() * 40), 
                y: Math.sin((i / 12) * Math.PI * 2) * (80 + Math.random() * 40) 
              }}
              transition={{ duration: 1, delay: 0.3 + i * 0.02 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
              style={{ background: i % 2 === 0 ? '#6EDB8F' : '#FFD700' }}
            />
          ))}
        </div>

        {/* 文本 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: [0.8, 1.1, 1] }}
            transition={{ delay: 0.35, duration: 0.4 }}
            className="text-3xl font-black text-foreground mb-1"
          >
            太棒了！
          </motion.div>
          <div className="text-muted-foreground font-medium">任务完成</div>
        </motion.div>

        {/* XP 显示 - 更突出 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 300 }}
          className="flex items-center gap-3 bg-gradient-to-r from-amber-100 via-yellow-100 to-orange-100 border-2 border-amber-300 rounded-2xl px-6 py-4 w-full justify-center"
        >
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <Star className="w-6 h-6 text-amber-500" />
          </motion.div>
          <span className="text-xl font-black text-amber-700">+{xp} XP</span>
        </motion.div>

        {/* 按钮 */}
        {hasNext && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            onClick={onNext}
            whileHover={{ scale: 1.03, boxShadow: '0 10px 30px rgba(77, 163, 255, 0.3)' }}
            whileTap={{ scale: 0.97 }}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4 rounded-2xl font-bold text-base shadow-lg transition-all"
          >
            继续挑战
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        )}
      </motion.div>
    </motion.div>
  )
}

export function TutorialPanel({ activeStepId, completedSteps, onStepComplete, onChoiceMade, selectedPlatform, lang }: TutorialPanelProps) {
  const [showCompleted, setShowCompleted] = useState(false)
  const [xpAmount, setXpAmount] = useState(0)

  let activeStep: TutorialStep | null = null
  let activeChapterIdx = 0
  let activeStepIdx = 0
  let nextStepId: string | null = null

  const allStepIds = getOrderedStepIds(selectedPlatform)

  CHAPTERS.forEach((ch, ci) => {
    ch.steps.forEach((step, si) => {
      if (step.id === activeStepId) {
        activeStep = step
        activeChapterIdx = ci
        activeStepIdx = si
      }
    })
  })

  const activeIdx = allStepIds.indexOf(activeStepId)
  if (activeIdx >= 0 && activeIdx < allStepIds.length - 1) {
    nextStepId = allStepIds[activeIdx + 1]
  }

  const isCompleted = completedSteps.has(activeStepId)
  const isLocked = (() => {
    if (activeIdx === 0) return false
    const prevId = allStepIds[activeIdx - 1]
    return !completedSteps.has(prevId)
  })()

  const handleComplete = () => {
    if (isCompleted || isLocked || !activeStep) return
    onStepComplete(activeStepId)
    setXpAmount((activeStep as TutorialStep).xp)
    setShowCompleted(true)
  }

  const handleNext = () => {
    setShowCompleted(false)
  }

  const chapter = CHAPTERS[activeChapterIdx]
  const totalInChapter = chapter?.steps.length ?? 0

  if (!activeStep) return null

  const step = activeStep as TutorialStep
  const isChoiceStep = step.type === 'choice'
  const isLinkCtaStep = step.type === 'link-cta'

  return (
    <main className="relative flex flex-col h-full overflow-hidden bg-gradient-to-b from-blue-50/30 to-transparent">
      {/* 步骤头部 */}
      <div className="flex-shrink-0 px-4 py-4 md:px-6 md:py-5 border-b border-border">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
          <span className="font-bold text-blue-600">{chapter?.title}</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span>步骤 {activeStepIdx + 1} / {totalInChapter}</span>
        </div>

        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-xl md:text-2xl font-bold text-foreground leading-tight">{step.title}</h1>
            <p className="text-sm text-muted-foreground mt-2">{step.subtitle}</p>
          </div>

          {/* 状态徽章 */}
          {isCompleted ? (
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="flex-shrink-0 hidden sm:flex items-center gap-2 bg-green-100 text-green-600 text-xs px-4 py-2 rounded-xl border border-green-300 font-bold"
            >
              <CheckCircle2 className="w-4 h-4" />
              已完成
            </motion.div>
          ) : (
            <div className="flex-shrink-0 hidden sm:flex items-center gap-2 bg-amber-100 text-amber-600 text-xs px-4 py-2 rounded-xl border border-amber-300 font-bold">
              <Star className="w-4 h-4" />
              +{step.xp} XP
            </div>
          )}
        </div>
      </div>

      {/* 主内容区 */}
      <div className="flex-1 overflow-y-auto scrollbar-thin px-4 py-4 md:px-6 md:py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStepId}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="space-y-5"
          >
            {/* 平台选择卡片 */}
            {isChoiceStep && step.choices && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-2 gap-3"
              >
                {step.choices.map((choice, i) => (
                  <motion.button
                    key={choice.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.08 }}
                    onClick={() => onChoiceMade(choice.id, choice.targetStepId)}
                    whileHover={{ scale: 1.04, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex flex-col items-center gap-3 bg-white border-2 border-blue-100 hover:border-blue-400 rounded-2xl p-5 shadow card-shadow transition-all duration-200 cursor-pointer group"
                  >
                    <span className="text-4xl group-hover:scale-110 transition-transform duration-200">{choice.icon}</span>
                    <span className="text-sm font-bold text-foreground">{choice.label}</span>
                  </motion.button>
                ))}
              </motion.div>
            )}

            {/* Link CTA 卡片 */}
            {isLinkCtaStep && (
              <motion.a
                href="https://clawhub.ai"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02, y: -2 }}
                className="flex items-center gap-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-5 shadow-lg cursor-pointer text-white no-underline group"
              >
                <span className="text-4xl">🦞</span>
                <div className="flex-1">
                  <div className="font-black text-base">前往 ClawHub 市场</div>
                  <div className="text-blue-100 text-xs mt-0.5">clawhub.ai — 发现社区 Skills</div>
                </div>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.a>
            )}

            {/* 任务卡片 */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-white to-blue-50/30 rounded-2xl p-5 border border-blue-100 card-shadow relative overflow-hidden"
            >
              {/* 装饰性背景图案 */}
              <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle cx="80" cy="20" r="40" fill="currentColor" className="text-blue-500" />
                </svg>
              </div>
              
              <div className="relative flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center flex-shrink-0 shadow-md">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 pt-1">
                  <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">任务描述</div>
                  <p className="text-sm leading-relaxed text-foreground">{step.description}</p>
                </div>
              </div>
            </motion.div>

            {/* 代码块 */}
            {step.codeBlocks && step.codeBlocks.length > 0 && (
              <div className="space-y-4">
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">代码示例</div>
                {step.codeBlocks.map((block, i) => (
                  <CodeBlock
                    key={i}
                    code={block.code}
                    language={block.language}
                    description={block.description}
                  />
                ))}
              </div>
            )}

            {/* 提示卡片 */}
            {step.tips && step.tips.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-2xl border border-amber-200/80 px-5 py-4 relative overflow-hidden"
              >
                {/* 装饰性灯泡光晕 */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-amber-300/20 rounded-full blur-2xl" />
                
                <div className="relative">
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center shadow-sm">
                      <Lightbulb className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">小提示</span>
                  </div>
                  <ul className="space-y-2.5">
                    {step.tips.map((tip, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + i * 0.05 }}
                        className="flex items-start gap-3 text-sm text-amber-900"
                      >
                        <span className="w-5 h-5 rounded-full bg-amber-200/60 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold text-amber-700">{i + 1}</span>
                        <span className="leading-relaxed">{tip}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 完成按钮区域 - choice 步骤不显示 */}
      {!isChoiceStep && (
      <div className="flex-shrink-0 px-6 py-5 border-t border-border bg-gradient-to-t from-white to-gray-50/50">
        {isLocked ? (
          <div className="flex items-center justify-center gap-2.5 w-full py-4 rounded-2xl bg-gray-100 text-muted-foreground text-sm font-semibold border border-gray-200">
            <Lock className="w-4 h-4" />
            请先完成上一步
          </div>
        ) : isCompleted ? (
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="flex items-center justify-center gap-2.5 w-full py-4 rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 text-green-600 text-sm font-bold border-2 border-green-200"
          >
            <CheckCircle2 className="w-5 h-5" />
            任务已完成
          </motion.div>
        ) : (
          <motion.button
            onClick={handleComplete}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="relative w-full py-4 rounded-2xl bg-gradient-to-r from-blue-500 via-blue-500 to-blue-600 text-white font-bold text-base transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl overflow-hidden group"
          >
            {/* 光泽动画 */}
            <motion.div
              animate={{ x: ['-100%', '200%'] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
              className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
            />
            <CheckCircle2 className="w-5 h-5 relative z-10" />
            <span className="relative z-10">完成任务</span>
          </motion.button>
        )}
      </div>
      )}

      {/* 完成动画弹窗 */}
      <AnimatePresence>
        {showCompleted && (
          <StepCompletedOverlay
            onNext={handleNext}
            hasNext={!!nextStepId}
            xp={xpAmount}
          />
        )}
      </AnimatePresence>
    </main>
  )
}
