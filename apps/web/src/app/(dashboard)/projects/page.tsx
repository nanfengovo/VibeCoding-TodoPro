import { FolderKanban, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ProjectsPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">项目管理</h1>
          <p className="text-muted-foreground mt-2">将目标拆解为具体的项目，按阶段推进。</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          新建项目
        </Button>
      </div>

      <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-border rounded-xl bg-card/50">
        <FolderKanban className="w-16 h-16 text-muted-foreground mb-4 opacity-50" />
        <h3 className="text-xl font-semibold mb-2">暂无项目</h3>
        <p className="text-muted-foreground max-w-sm mb-6">
          所有的伟大都源于一个勇敢的开始。新建一个项目，把想法变成现实。
        </p>
        <Button variant="outline">新建项目</Button>
      </div>
    </div>
  )
}
