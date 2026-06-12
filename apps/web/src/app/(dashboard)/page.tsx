import { TimelineView } from '@/components/timeline/timeline-view'
import { getTasksForDate } from '@/app/(dashboard)/tasks/actions'

export default async function DashboardPage() {
  const today = new Date().toISOString()
  const tasks = await getTasksForDate(today)

  const total = tasks.length
  const completed = tasks.filter((t: any) => t.status === 'COMPLETED').length
  const inProgress = tasks.filter((t: any) => t.status === 'IN_PROGRESS').length

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Good Afternoon ☀️</h1>
        <p className="text-muted-foreground mt-2">今天是你成为更好自己的又一天</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <p className="text-sm font-medium text-muted-foreground">今日任务</p>
          <p className="text-3xl font-bold mt-2">{total}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <p className="text-sm font-medium text-muted-foreground">进行中</p>
          <p className="text-3xl font-bold mt-2 text-primary">{inProgress}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <p className="text-sm font-medium text-muted-foreground">已完成</p>
          <p className="text-3xl font-bold mt-2 text-green-500">{completed}</p>
        </div>
      </div>

      {/* Timeline */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">今日时间线</h2>
        </div>
        <TimelineView tasks={tasks as any} />
      </div>
    </div>
  )
}
