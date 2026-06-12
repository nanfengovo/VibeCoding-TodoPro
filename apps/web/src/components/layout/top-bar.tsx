import { Search, Bell, Plus } from 'lucide-react'

export function TopBar() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-background/80 backdrop-blur-sm px-6">
      {/* Search */}
      <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-2 w-80">
        <Search className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">搜索任务、项目、笔记...</span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button className="rounded-lg p-2 hover:bg-accent transition-colors">
          <Bell className="h-5 w-5 text-muted-foreground" />
        </button>
        <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
          <Plus className="h-4 w-4" />
          <span>新建</span>
        </button>
      </div>
    </header>
  )
}
