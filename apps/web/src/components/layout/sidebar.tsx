'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  CalendarDays,
  Target,
  FolderKanban,
  CheckSquare,
  BookOpen,
  FileText,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  LogOut,
} from 'lucide-react'

const navItems = [
  { href: '/', label: '仪表盘', icon: LayoutDashboard },
  { href: '/timeline', label: '时间线', icon: CalendarDays },
  { href: '/goals', label: '目标', icon: Target },
  { href: '/projects', label: '项目', icon: FolderKanban },
  { href: '/tasks', label: '任务', icon: CheckSquare },
  { href: '/knowledge', label: '知识库', icon: BookOpen },
  { href: '/daily-log', label: '日记录', icon: FileText },
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'hidden md:flex flex-col border-r border-border bg-sidebar transition-all duration-300 ease-in-out h-full',
          collapsed ? 'w-16' : 'w-64'
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-border shrink-0">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">LearningOS</span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="rounded-md p-1.5 hover:bg-sidebar-accent transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-2 mt-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground',
                  collapsed && 'justify-center px-2'
                )}
                title={collapsed ? item.label : undefined}
              >
                <item.icon className={cn('h-5 w-5 shrink-0', isActive && 'text-sidebar-primary')} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Bottom section */}
        <div className="border-t border-border p-2 shrink-0">
          <button
            className={cn(
              'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors',
              collapsed && 'justify-center px-2'
            )}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!collapsed && <span>退出登录</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-background border-t border-border flex items-center justify-around px-2 z-50 safe-area-pb">
        {navItems.slice(0, 5).map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-primary/80'
              )}
            >
              <item.icon className={cn('h-5 w-5', isActive && 'animate-in zoom-in-90')} />
              <span className="text-[10px] font-medium leading-none">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}
