'use server'

import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

async function getAuthenticatedUserId(): Promise<string> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('未登录')
  return user.id
}

// ──────────────────────────────────────────
// Save Daily Log
// ──────────────────────────────────────────
export async function saveDailyLog(formData: FormData) {
  const userId = await getAuthenticatedUserId()

  const dateStr = formData.get('date') as string
  const completed = (formData.get('completed') as string) || null
  const notes = (formData.get('notes') as string) || null

  if (!dateStr) throw new Error('日期不能为空')

  const date = new Date(dateStr)

  await prisma.dailyLog.upsert({
    where: {
      date_userId: { date, userId },
    },
    update: {
      completed,
      notes,
    },
    create: {
      date,
      completed,
      notes,
      userId,
    },
  })

  revalidatePath('/daily-log')
  revalidatePath('/')
}

// ──────────────────────────────────────────
// Get Daily Log
// ──────────────────────────────────────────
export async function getDailyLog(dateStr: string) {
  const userId = await getAuthenticatedUserId()
  const date = new Date(dateStr)

  return prisma.dailyLog.findUnique({
    where: {
      date_userId: { date, userId },
    },
  })
}
