'use client'

import React, { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { saveDailyLog } from './actions'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Calendar, Save, CheckCircle2 } from 'lucide-react'

interface DailyLogEditorProps {
  date: string
  initialCompleted: string | null
  initialNotes: string | null
}

export function DailyLogEditor({ date, initialCompleted, initialNotes }: DailyLogEditorProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  
  const [completed, setCompleted] = useState(initialCompleted || '')
  const [notes, setNotes] = useState(initialNotes || '')
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')

  const handleSave = () => {
    setSaveStatus('saving')
    startTransition(async () => {
      try {
        const formData = new FormData()
        formData.append('date', date)
        if (completed) formData.append('completed', completed)
        if (notes) formData.append('notes', notes)

        await saveDailyLog(formData)
        
        setSaveStatus('saved')
        setTimeout(() => setSaveStatus('idle'), 2000)
        router.refresh()
      } catch (err) {
        console.error(err)
        setSaveStatus('idle')
      }
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-muted-foreground">
          <Calendar className="w-5 h-5" />
          <span className="font-medium">{new Date(date).toLocaleDateString('zh-CN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={isPending}
          className="w-32 transition-all duration-300"
          variant={saveStatus === 'saved' ? 'secondary' : 'default'}
        >
          {saveStatus === 'saving' && '保存中...'}
          {saveStatus === 'saved' && <><CheckCircle2 className="w-4 h-4 mr-2 text-green-500" /> 已保存</>}
          {saveStatus === 'idle' && <><Save className="w-4 h-4 mr-2" /> 保存日记</>}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border/60 shadow-sm overflow-hidden flex flex-col h-[600px]">
          <div className="bg-muted/30 px-4 py-3 border-b border-border/50">
            <Label htmlFor="completed" className="font-semibold text-primary/80 flex items-center">
              ✅ 今日完成 (Achievements)
            </Label>
          </div>
          <CardContent className="p-0 flex-1 relative">
            <Textarea
              id="completed"
              value={completed}
              onChange={(e) => setCompleted(e.target.value)}
              placeholder="今天完成了哪些重要的事情？"
              className="h-full w-full border-0 resize-none rounded-none focus-visible:ring-0 p-4 text-base"
            />
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm overflow-hidden flex flex-col h-[600px]">
          <div className="bg-muted/30 px-4 py-3 border-b border-border/50">
            <Label htmlFor="notes" className="font-semibold text-primary/80 flex items-center">
              💡 笔记与反思 (Notes & Reflections)
            </Label>
          </div>
          <CardContent className="p-0 flex-1 relative">
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="记录你的思考、遇到的问题，或者明天要改进的地方..."
              className="h-full w-full border-0 resize-none rounded-none focus-visible:ring-0 p-4 text-base"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
