/* eslint-disable */
'use client'

import React, { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { createTask } from '@/app/(dashboard)/tasks/actions'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const taskSchema = z.object({
  title: z.string().min(1, '标题不能为空'),
  description: z.string().optional(),
  priority: z.number().min(1).max(4).default(4),
  status: z.enum(['TODO', 'IN_PROGRESS', 'COMPLETED']).default('TODO'),
  // We'll use simple strings for time, to be parsed to Date
  startTimeStr: z.string().optional(),
  endTimeStr: z.string().optional(),
})

type TaskFormValues = z.infer<typeof taskSchema>

interface TaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultStartTime?: Date
}

export function TaskDialog({ open, onOpenChange, defaultStartTime }: TaskDialogProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema) as any,
    defaultValues: {
      title: '',
      description: '',
      priority: 4,
      status: 'TODO',
      startTimeStr: defaultStartTime ? `${defaultStartTime.getHours().toString().padStart(2, '0')}:00` : '',
      endTimeStr: defaultStartTime ? `${(defaultStartTime.getHours() + 1).toString().padStart(2, '0')}:00` : '',
    }
  })

  // Watch for priority to style the trigger
  const priorityValue = watch('priority')

  const onSubmit = (data: TaskFormValues) => {
    setError(null)
    startTransition(async () => {
      try {
        const now = new Date()
        
        let startTime: Date | undefined
        if (data.startTimeStr) {
          const [h, m] = data.startTimeStr.split(':').map(Number)
          startTime = new Date(now.setHours(h, m, 0, 0))
        }

        let endTime: Date | undefined
        if (data.endTimeStr) {
          const [h, m] = data.endTimeStr.split(':').map(Number)
          endTime = new Date(now.setHours(h, m, 0, 0))
        }

        const formData = new FormData()
        formData.append('title', data.title)
        if (data.description) formData.append('description', data.description)
        formData.append('priority', data.priority.toString())
        formData.append('status', data.status)
        if (startTime) formData.append('startTime', startTime.toISOString())
        if (endTime) formData.append('endTime', endTime.toISOString())

        await createTask(formData)
        
        onOpenChange(false)
        router.refresh()
      } catch (err: any) {
        setError(err.message || '创建任务失败')
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>新建任务</DialogTitle>
          <DialogDescription>
            添加一个新任务到你的时间线中。
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          {error && (
            <div className="bg-red-500/10 text-red-500 p-3 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="title">标题</Label>
            <Input 
              id="title" 
              placeholder="你想完成什么？" 
              {...register('title')} 
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">描述 (可选)</Label>
            <Textarea 
              id="description" 
              placeholder="添加更多细节..." 
              {...register('description')} 
              className="resize-none h-20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>开始时间</Label>
              <Input type="time" {...register('startTimeStr')} />
            </div>
            <div className="space-y-2">
              <Label>结束时间</Label>
              <Input type="time" {...register('endTimeStr')} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>优先级</Label>
              <Select 
                defaultValue={priorityValue.toString()} 
                onValueChange={(val) => setValue('priority', Number(val))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择优先级" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1"><span className="text-red-500 font-medium">P1 (最高)</span></SelectItem>
                  <SelectItem value="2"><span className="text-orange-500 font-medium">P2 (高)</span></SelectItem>
                  <SelectItem value="3"><span className="text-blue-500 font-medium">P3 (中)</span></SelectItem>
                  <SelectItem value="4"><span className="text-muted-foreground font-medium">P4 (低)</span></SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>状态</Label>
              <Select 
                defaultValue="TODO" 
                onValueChange={(val) => setValue('status', val as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TODO">未开始</SelectItem>
                  <SelectItem value="IN_PROGRESS">进行中</SelectItem>
                  <SelectItem value="COMPLETED">已完成</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              取消
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? '保存中...' : '保存任务'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
