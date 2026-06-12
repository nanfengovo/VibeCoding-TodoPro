import { Target, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function GoalsPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">目标管理</h1>
          <p className="text-muted-foreground mt-2">设定长期目标，拆解为可执行的项目。</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          新建目标
        </Button>
      </div>

      <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-border rounded-xl bg-card/50">
        <Target className="w-16 h-16 text-muted-foreground mb-4 opacity-50" />
        <h3 className="text-xl font-semibold mb-2">暂无目标</h3>
        <p className="text-muted-foreground max-w-sm mb-6">
          "没有目标的人，永远为有目标的人去努力。" 开始设定你的第一个年度或季度目标吧。
        </p>
        <Button variant="outline">立即创建</Button>
      </div>
    </div>
  )
}
