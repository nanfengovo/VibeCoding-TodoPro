/* eslint-disable */
'use client'

import React, { useTransition } from 'react'
import { TimelineTask } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { toggleTaskStatus } from '@/app/(dashboard)/tasks/actions'
import { cn } from '@/lib/utils'
import { CalendarClock, FolderKanban, Target } from 'lucide-react'

interface TaskCardProps {
  task: TimelineTask
}

export function TaskCard({ task }: TaskCardProps) {
  const [isPending, startTransition] = useTransition()
  
  const isCompleted = task.status === 'COMPLETED'
  const isActionable = task.status !== 'COMPLETED'

  const handleToggle = () => {
    startTransition(async () => {
      const newStatus = isCompleted ? 'TODO' : 'COMPLETED'
      await toggleTaskStatus(task.id, newStatus)
    })
  }

  // Define priority colors
  const priorityColor = 
    task.priority === 1 ? 'border-red-500/50 bg-red-500/10 text-red-600 dark:text-red-400' :
    task.priority === 2 ? 'border-orange-500/50 bg-orange-500/10 text-orange-600 dark:text-orange-400' :
    task.priority === 3 ? 'border-blue-500/50 bg-blue-500/10 text-blue-600 dark:text-blue-400' :
    'border-border bg-muted/50 text-muted-foreground'

  return (
    <Card className={cn(
      "group relative overflow-hidden transition-all duration-300 hover:shadow-md hover:border-primary/50",
      isCompleted ? "opacity-60 grayscale-[0.5]" : "hover:-translate-y-0.5",
      isPending && "opacity-50 pointer-events-none"
    )}>
      {/* Decorative left border based on priority */}
      <div className={cn(
        "absolute left-0 top-0 bottom-0 w-1",
        task.priority === 1 ? "bg-red-500" :
        task.priority === 2 ? "bg-orange-500" :
        task.priority === 3 ? "bg-blue-500" : "bg-border"
      )} />
      
      <CardContent className="p-3 pl-4 flex gap-3">
        <div className="pt-0.5">
          <Checkbox 
            checked={isCompleted} 
            onCheckedChange={handleToggle}
            className={cn(
              "rounded-full w-5 h-5 transition-all duration-300", 
              isCompleted && "data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            )}
          />
        </div>
        
        <div className="flex-1 min-w-0 flex flex-col gap-1.5">
          <div className="flex items-start justify-between gap-2">
            <h4 className={cn(
              "font-medium text-sm leading-tight transition-colors duration-300",
              isCompleted && "line-through text-muted-foreground"
            )}>
              {task.title}
            </h4>
            {task.priority < 4 && (
              <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0 h-4 border leading-none font-medium shrink-0", priorityColor)}>
                P{task.priority}
              </Badge>
            )}
          </div>
          
          {(task.startTime || task.endTime) && (
            <div className="flex items-center text-xs text-muted-foreground gap-1.5">
              <CalendarClock className="w-3 h-3 shrink-0" />
              <span className="truncate">
                {task.startTime && new Date(task.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                {task.endTime && ` - ${new Date(task.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
              </span>
            </div>
          )}
          
          {(task.project || task.goal) && (
            <div className="flex flex-wrap items-center gap-2 mt-1">
              {task.project && (
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 bg-primary/10 text-primary hover:bg-primary/20 border-0 flex items-center gap-1">
                  <FolderKanban className="w-2.5 h-2.5" />
                  <span className="truncate max-w-[80px]">{task.project.title}</span>
                </Badge>
              )}
              {task.goal && !task.project && (
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 bg-purple-500/10 text-purple-600 dark:text-purple-400 hover:bg-purple-500/20 border-0 flex items-center gap-1">
                  <Target className="w-2.5 h-2.5" />
                  <span className="truncate max-w-[80px]">{task.goal.title}</span>
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
