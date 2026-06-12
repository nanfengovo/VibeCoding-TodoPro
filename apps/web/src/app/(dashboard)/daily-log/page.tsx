import { getDailyLog } from './actions'
import { DailyLogEditor } from './daily-log-editor'

interface PageProps {
  searchParams: Promise<{ date?: string }>
}

export default async function DailyLogPage({ searchParams }: PageProps) {
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
  
  // Fetch existing log from database
  const log = await getDailyLog(dateObj.toISOString())

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">每日记录</h1>
        <p className="text-muted-foreground mt-2">在这里总结你的一天，沉淀所思所想。</p>
      </div>

      <DailyLogEditor 
        date={dateObj.toISOString()} 
        initialCompleted={log?.completed || null} 
        initialNotes={log?.notes || null} 
      />
    </div>
  )
}
