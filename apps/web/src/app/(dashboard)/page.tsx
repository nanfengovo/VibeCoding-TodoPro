export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Good Morning ☀️</h1>
        <p className="text-muted-foreground mt-2">今天是你成为更好自己的又一天</p>
      </div>

      {/* Timeline placeholder */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-xl font-semibold mb-4">今日时间线</h2>
        <p className="text-muted-foreground">时间线视图即将到来...</p>
      </div>

      {/* Stats placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">今日任务</p>
          <p className="text-3xl font-bold mt-1">0</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">进行中</p>
          <p className="text-3xl font-bold mt-1">0</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">已完成</p>
          <p className="text-3xl font-bold mt-1">0</p>
        </div>
      </div>
    </div>
  )
}
