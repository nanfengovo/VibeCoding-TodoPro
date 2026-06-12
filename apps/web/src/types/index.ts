export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'COMPLETED'
export type GoalStatus = 'IN_PROGRESS' | 'COMPLETED'

export interface TimelineTask {
  id: string
  title: string
  description: string | null
  startTime: Date | null
  endTime: Date | null
  status: TaskStatus
  priority: number
  project: {
    id: string
    title: string
  } | null
  goal: {
    id: string
    title: string
  } | null
}

export interface DailyStats {
  total: number
  completed: number
  inProgress: number
  todo: number
}
