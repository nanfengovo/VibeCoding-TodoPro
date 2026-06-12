'use client'

import { useState } from 'react'
import { Search, Bell, Plus } from 'lucide-react'
import { TaskDialog } from '@/components/tasks/task-dialog'

export function TopBar() {
  const [taskDialogOpen, setTaskDialogOpen] = useState(false)
  return (
    <header className="flex h-14 md:h-16 items-center justify-between border-b border-border bg-background/80 backdrop-blur-sm px-4 md:px-6">
      {/* Search - hidden on mobile, shown on md+ */}
      <div className="hidden md:flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-2 w-80">
        <Search className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">搜索任务、项目、笔记...</span>
      </div>

      {/* Mobile: Logo text */}
      <div className="md:hidden flex items-center gap-2">
        <span className="text-lg font-bold tracking-tight">LearningOS</span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 md:gap-3">
        <button className="rounded-lg p-2 hover:bg-accent transition-colors">
          <Search className="h-5 w-5 text-muted-foreground md:hidden" />
          <Bell className="h-5 w-5 text-muted-foreground hidden md:block" />
        </button>
        <button className="rounded-lg p-2 hover:bg-accent transition-colors hidden md:block">
          <Bell className="h-5 w-5 text-muted-foreground" />
        </button>
        <button 
          onClick={() => setTaskDialogOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-primary px-3 md:px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden md:inline">新建</span>
        </button>
      </div>

      <TaskDialog open={taskDialogOpen} onOpenChange={setTaskDialogOpen} />
    </header>
  )
}
