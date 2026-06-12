import { TimelineView } from '@/components/timeline/timeline-view'
/* eslint-disable @typescript-eslint/no-explicit-any */
import { getTasksForDate } from '@/app/(dashboard)/tasks/actions'

interface PageProps {
  searchParams: Promise<{ date?: string }>
}

export default async function TimelinePage({ searchParams }: PageProps) {
  // Use provided date from URL or default to today
  const params = await searchParams
  let dateStr = params.date
  
  if (!dateStr) {
    const today = new Date()
    // Convert to local YYYY-MM-DD
    const tzOffset = today.getTimezoneOffset() * 60000
    dateStr = new Date(today.getTime() - tzOffset).toISOString().split('T')[0]
  }

  // Create a normalized Date object at midnight UTC for querying
  const dateObj = new Date(dateStr)
  const tasks = await getTasksForDate(dateObj.toISOString())

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">时间线</h1>
          <p className="text-muted-foreground mt-2">
            {dateStr === new Date().toISOString().split('T')[0] 
              ? '你今天的日程安排。' 
              : `${dateStr} 的日程安排。`}
          </p>
        </div>
      </div>

      <div className="mt-8">
        <TimelineView tasks={tasks as any} />
      </div>
    </div>
  )
}
