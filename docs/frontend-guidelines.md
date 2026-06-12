# LearningOS 前端架构规范

## 一、项目结构

```
apps/web/src/
├── app/                    # Next.js App Router 路由
│   ├── (dashboard)/        # 需要认证的主应用布局组
│   │   ├── layout.tsx      # Dashboard 布局（侧边栏 + 顶栏）
│   │   ├── page.tsx        # 首页（仪表盘）
│   │   ├── timeline/       # 时间线
│   │   ├── goals/          # 目标管理
│   │   ├── projects/       # 项目管理
│   │   ├── tasks/          # 任务管理
│   │   ├── knowledge/      # 知识库
│   │   └── daily-log/      # 日记录
│   ├── login/              # 登录页（不需要认证）
│   ├── auth/               # Auth 回调路由
│   ├── layout.tsx          # 根布局
│   └── globals.css         # 全局样式
├── components/
│   ├── layout/             # 布局组件（Sidebar, TopBar）
│   ├── ui/                 # shadcn/ui 基础组件
│   └── shared/             # 跨功能共享的业务组件
├── lib/
│   ├── prisma.ts           # Prisma Client 单例
│   ├── supabase/
│   │   ├── server.ts       # 服务端 Supabase 客户端
│   │   └── client.ts       # 客户端 Supabase 客户端
│   └── utils.ts            # 工具函数 (cn, 日期格式化等)
├── types/
│   └── index.ts            # 共享 TypeScript 类型定义
├── hooks/                  # 自定义 React Hooks
└── middleware.ts           # Next.js 中间件（Auth 守卫）
```

---

## 二、组件设计规范

### 2.1 Server Component vs Client Component

| 场景 | 类型 | 示例 |
|------|------|------|
| 数据获取、页面渲染 | Server Component（默认） | `page.tsx`, 数据展示列表 |
| 用户交互、状态管理 | Client Component (`'use client'`) | 表单、侧边栏、弹窗 |
| 布局容器 | Server Component | `layout.tsx` |

**原则**：能用 Server Component 就用，只在需要交互/hooks时使用 Client Component。

### 2.2 组件文件命名

- 文件名：`kebab-case`（如 `task-card.tsx`）
- 组件名：`PascalCase`（如 `TaskCard`）
- 每个组件一个文件，通过命名导出

### 2.3 组件结构模板

```tsx
// Server Component (默认)
import { prisma } from '@/lib/prisma'

export default async function TaskList() {
  const tasks = await prisma.task.findMany({
    where: { userId: 'xxx' },
    orderBy: { startTime: 'asc' },
  })

  return (
    <div>
      {tasks.map(task => (
        <div key={task.id}>{task.title}</div>
      ))}
    </div>
  )
}
```

```tsx
// Client Component
'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

interface TaskCardProps {
  id: string
  title: string
  status: string
}

export function TaskCard({ id, title, status }: TaskCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  // ...
}
```

---

## 三、数据访问规范

### 3.1 Server Actions 模式

所有数据变更操作统一使用 Server Actions。文件放在对应功能目录下的 `actions.ts`。

```tsx
// app/(dashboard)/tasks/actions.ts
'use server'

import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createTask(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('未登录')

  const title = formData.get('title') as string
  const startTime = formData.get('startTime') as string

  await prisma.task.create({
    data: {
      title,
      startTime: startTime ? new Date(startTime) : null,
      userId: user.id,
    },
  })

  revalidatePath('/tasks')
  revalidatePath('/')
}

export async function toggleTaskStatus(taskId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('未登录')

  const task = await prisma.task.findFirst({
    where: { id: taskId, userId: user.id },
  })

  if (!task) throw new Error('任务不存在')

  await prisma.task.update({
    where: { id: taskId },
    data: {
      status: task.status === 'COMPLETED' ? 'TODO' : 'COMPLETED',
    },
  })

  revalidatePath('/tasks')
  revalidatePath('/')
}
```

### 3.2 数据读取模式

在 Server Component 中直接使用 Prisma 查询，始终通过 Supabase 获取当前用户 ID 进行过滤：

```tsx
// app/(dashboard)/tasks/page.tsx
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'

export default async function TasksPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const tasks = await prisma.task.findMany({
    where: { userId: user?.id },
    include: { project: true, goal: true },
    orderBy: { startTime: 'asc' },
  })

  return <TaskList tasks={tasks} />
}
```

---

## 四、样式规范

### 4.1 使用 Tailwind CSS + shadcn/ui 设计令牌

- **永远不要**使用硬编码颜色值（如 `text-blue-500`）
- **始终使用**语义化令牌（如 `text-primary`, `bg-card`, `border-border`）
- 这确保了暗色/亮色主题的自动切换

### 4.2 核心设计令牌

| 令牌 | 用途 |
|------|------|
| `bg-background` / `text-foreground` | 页面背景/文字 |
| `bg-card` / `text-card-foreground` | 卡片组件 |
| `bg-muted` / `text-muted-foreground` | 次级内容 |
| `bg-primary` / `text-primary-foreground` | 主色按钮 |
| `bg-accent` / `text-accent-foreground` | 强调/Hover |
| `bg-destructive` | 危险操作 |
| `border-border` | 边框 |
| `bg-sidebar` / `text-sidebar-foreground` | 侧边栏 |

### 4.3 间距与圆角

- 卡片间距：`p-6`
- 列表间距：`space-y-4`
- 页面间距：`p-6`
- 圆角：使用 `rounded-xl`（默认）, `rounded-lg`（小）
- 阴影：暗色主题下少用阴影，改用边框 `border border-border`

### 4.4 动画

- 过渡：`transition-all duration-200` 或 `transition-colors`
- 侧边栏折叠：`transition-all duration-300 ease-in-out`
- Hover 效果：`hover:bg-accent/50`

---

## 五、路由结构

```
/              → 仪表盘首页（今日时间线 + 统计）
/timeline      → 完整时间线视图
/goals         → 目标管理
/goals/[id]    → 目标详情
/projects      → 项目列表
/projects/[id] → 项目详情
/tasks         → 任务列表/看板
/knowledge     → 知识库
/daily-log     → 日记录
/login         → 登录页
/auth/callback → Supabase Auth 回调
```

---

## 六、Git 提交规范

使用 Conventional Commits：

```
feat: 新增时间线视图组件
fix: 修复任务状态切换bug
style: 调整侧边栏hover颜色
refactor: 重构数据获取层
docs: 更新前端规范文档
chore: 升级依赖版本
```

---

## 七、关键设计原则

1. **暗色优先**：默认暗色主题，所有 UI 在暗色模式下必须美观
2. **移动端友好**：所有页面使用响应式设计（`md:`, `lg:` 断点）
3. **性能至上**：Server Component 优先，减少客户端 JS 体积
4. **类型安全**：所有 props 必须有 TypeScript 类型定义
5. **用户感知快速**：使用 `loading.tsx` + Skeleton 做加载态
