'use client'

import { useState, useTransition } from 'react'
import { loginWithEmail, signupWithEmail } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Sparkles, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [isSignup, setIsSignup] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)
    
    startTransition(async () => {
      const action = isSignup ? signupWithEmail : loginWithEmail
      const result = await action(formData)
      if (result?.error) {
        setError(result.error)
      }
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

      <Card className="w-full max-w-md relative z-10 border-border/50 shadow-2xl bg-card/80 backdrop-blur-xl">
        <CardHeader className="space-y-3 pb-6 text-center">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-2 border border-primary/20">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight">
            LearningOS
          </CardTitle>
          <CardDescription className="text-base">
            {isSignup ? '创建一个新账号开始您的学习之旅' : '欢迎回来，请登录您的账号'}
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 bg-destructive/15 text-destructive text-sm rounded-md border border-destructive/20 font-medium">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">邮箱 (Email)</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                placeholder="name@example.com" 
                required 
                className="h-11 bg-background/50"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">密码 (Password)</Label>
              </div>
              <Input 
                id="password" 
                name="password" 
                type="password" 
                required 
                className="h-11 bg-background/50"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 pt-4">
            <Button 
              type="submit" 
              className="w-full h-11 text-base font-medium shadow-md shadow-primary/20" 
              disabled={isPending}
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSignup ? '注 册' : '登 录'}
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              {isSignup ? '已有账号？' : '还没有账号？'}{' '}
              <button 
                type="button" 
                onClick={() => setIsSignup(!isSignup)}
                className="font-semibold text-primary hover:underline transition-all"
              >
                {isSignup ? '返回登录' : '立即注册'}
              </button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
