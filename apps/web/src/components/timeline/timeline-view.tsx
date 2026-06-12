'use client'

import React, { useMemo, useState } from 'react'
import { TimelineTask } from '@/types'
import { TaskCard } from '@/components/tasks/task-card'
import { TaskDialog } from '@/components/tasks/task-dialog'
import { cn } from '@/lib/utils'

interface TimelineViewProps {
  tasks: TimelineTask[]
}

const HOURS = Array.from({ length: 24 }, (_, i) => i)

export function TimelineView({ tasks }: TimelineViewProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedTime, setSelectedTime] = useState<Date | undefined>(undefined)

  // Sort tasks by start time
  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      if (!a.startTime) return -1
      if (!b.startTime) return 1
      return new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    })
  }, [tasks])

  // Group tasks by hour
  const { unscheduledTasks, tasksByHour } = useMemo(() => {
    const unscheduled: TimelineTask[] = []
    const byHour: Record<number, TimelineTask[]> = {}

    HOURS.forEach(hour => {
      byHour[hour] = []
    })

    sortedTasks.forEach(task => {
      if (!task.startTime) {
        unscheduled.push(task)
      } else {
        const hour = new Date(task.startTime).getHours()
        if (byHour[hour]) {
          byHour[hour].push(task)
        }
      }
    })

    return { unscheduledTasks: unscheduled, tasksByHour: byHour }
  }, [sortedTasks])

  // Determine active hours (trim empty hours at night if no tasks)
  // Let's show by default 06:00 to 23:00, or expand if there are tasks outside
  const activeHours = useMemo(() => {
    let minHour = 6
    let maxHour = 23
    
    Object.entries(tasksByHour).forEach(([hourStr, hourTasks]) => {
      const hour = parseInt(hourStr, 10)
      if (hourTasks.length > 0) {
        if (hour < minHour) minHour = hour
        if (hour > maxHour) maxHour = hour
      }
    })
    
    return HOURS.filter(h => h >= minHour && h <= maxHour)
  }, [tasksByHour])

  const currentHour = new Date().getHours()

  return (
    <div className="flex flex-col space-y-8 max-w-4xl mx-auto w-full pb-20">
      {/* Unscheduled Tasks Section */}
      {unscheduledTasks.length > 0 && (
        <div className="rounded-2xl border border-border/50 bg-muted/20 p-5 backdrop-blur-sm">
          <h3 className="text-sm font-semibold text-muted-foreground mb-4 flex items-center tracking-tight">
            <span className="w-2 h-2 rounded-full bg-primary/60 mr-2 shadow-[0_0_8px_rgba(var(--primary),0.6)]"></span>
            全天 / 未安排时间
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {unscheduledTasks.map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>
      )}

      {/* Timeline Section */}
      <div className="relative border-l-2 border-border/60 ml-[60px] md:ml-[80px] space-y-0 pt-4">
        {/* Current Time Indicator (Visual Mockup for now, would need a precise timer for real app) */}
        
        {activeHours.map(hour => {
          const hourTasks = tasksByHour[hour] || []
          const isCurrentHour = hour === currentHour
          
          return (
            <div key={hour} className="relative group">
              {/* Timeline dot and time label */}
              <div className="absolute -left-[61px] md:-left-[81px] top-0 flex items-center w-[60px] md:w-[80px] h-10">
                <span className={cn(
                  "text-xs font-bold w-full text-right pr-4 transition-colors duration-300",
                  isCurrentHour ? "text-primary" : "text-muted-foreground/70 group-hover:text-foreground"
                )}>
                  {hour.toString().padStart(2, '0')}:00
                </span>
              </div>
              
              {/* Dot */}
              <div className={cn(
                "absolute -left-[5px] top-4 w-2.5 h-2.5 rounded-full border-2 transition-all duration-300 z-10",
                isCurrentHour 
                  ? "bg-primary border-primary shadow-[0_0_10px_rgba(var(--primary),0.8)] scale-125" 
                  : hourTasks.length > 0
                    ? "bg-primary/20 border-primary/50"
                    : "bg-background border-border group-hover:border-primary/40"
              )} />

              {/* Tasks for this hour */}
              <div className="min-h-[5rem] pl-6 md:pl-8 pb-4 pt-1">
                {hourTasks.length === 0 ? (
                  <div 
                    onClick={() => {
                      const d = new Date()
                      d.setHours(hour, 0, 0, 0)
                      setSelectedTime(d)
                      setDialogOpen(true)
                    }}
                    className="h-12 w-full max-w-md rounded-xl border border-dashed border-border/40 bg-muted/5 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center text-xs text-muted-foreground cursor-pointer hover:bg-muted/20 hover:border-primary/30"
                  >
                    + 点击添加 {hour}:00 的任务
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                    {hourTasks.map(task => (
                      <TaskCard key={task.id} task={task} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        })}
        
        {/* Bottom fade out line */}
        <div className="absolute -bottom-10 left-[-2px] w-[2px] h-20 bg-gradient-to-b from-border/60 to-transparent" />
      </div>

      <TaskDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen} 
        defaultStartTime={selectedTime}
      />
    </div>
  )
}
