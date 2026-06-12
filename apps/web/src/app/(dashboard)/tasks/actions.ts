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
// Create Task
// ──────────────────────────────────────────
export async function createTask(formData: FormData) {
  const userId = await getAuthenticatedUserId()

  const title = formData.get('title') as string
  const description = (formData.get('description') as string) || null
  const startTime = formData.get('startTime') as string
  const endTime = formData.get('endTime') as string
  const projectId = (formData.get('projectId') as string) || null
  const goalId = (formData.get('goalId') as string) || null
  const priority = parseInt((formData.get('priority') as string) || '0', 10)

  if (!title?.trim()) {
    throw new Error('任务标题不能为空')
  }

  await prisma.task.create({
    data: {
      title: title.trim(),
      description,
      startTime: startTime ? new Date(startTime) : null,
      endTime: endTime ? new Date(endTime) : null,
      projectId,
      goalId,
      priority,
      userId,
    },
  })

  revalidatePath('/')
  revalidatePath('/tasks')
  revalidatePath('/timeline')
}

// ──────────────────────────────────────────
// Update Task
// ──────────────────────────────────────────
export async function updateTask(taskId: string, formData: FormData) {
  const userId = await getAuthenticatedUserId()

  const task = await prisma.task.findFirst({
    where: { id: taskId, userId },
  })
  if (!task) throw new Error('任务不存在')

  const title = formData.get('title') as string
  const description = (formData.get('description') as string) || null
  const startTime = formData.get('startTime') as string
  const endTime = formData.get('endTime') as string
  const status = (formData.get('status') as string) || task.status
  const priority = formData.has('priority')
    ? parseInt(formData.get('priority') as string, 10)
    : task.priority

  await prisma.task.update({
    where: { id: taskId },
    data: {
      title: title?.trim() || task.title,
      description,
      startTime: startTime ? new Date(startTime) : task.startTime,
      endTime: endTime ? new Date(endTime) : task.endTime,
      status,
      priority,
    },
  })

  revalidatePath('/')
  revalidatePath('/tasks')
  revalidatePath('/timeline')
}

// ──────────────────────────────────────────
// Toggle Task Status
// ──────────────────────────────────────────
export async function toggleTaskStatus(taskId: string) {
  const userId = await getAuthenticatedUserId()

  const task = await prisma.task.findFirst({
    where: { id: taskId, userId },
  })
  if (!task) throw new Error('任务不存在')

  const nextStatus =
    task.status === 'COMPLETED'
      ? 'TODO'
      : task.status === 'TODO'
        ? 'IN_PROGRESS'
        : 'COMPLETED'

  await prisma.task.update({
    where: { id: taskId },
    data: { status: nextStatus },
  })

  revalidatePath('/')
  revalidatePath('/tasks')
  revalidatePath('/timeline')
}

// ──────────────────────────────────────────
// Delete Task
// ──────────────────────────────────────────
export async function deleteTask(taskId: string) {
  const userId = await getAuthenticatedUserId()

  const task = await prisma.task.findFirst({
    where: { id: taskId, userId },
  })
  if (!task) throw new Error('任务不存在')

  await prisma.task.delete({
    where: { id: taskId },
  })

  revalidatePath('/')
  revalidatePath('/tasks')
  revalidatePath('/timeline')
}

// ──────────────────────────────────────────
// Get Tasks for a Date (Timeline)
// ──────────────────────────────────────────
export async function getTasksForDate(dateStr: string) {
  const userId = await getAuthenticatedUserId()

  const date = new Date(dateStr)
  const startOfDay = new Date(date)
  startOfDay.setHours(0, 0, 0, 0)
  const endOfDay = new Date(date)
  endOfDay.setHours(23, 59, 59, 999)

  return prisma.task.findMany({
    where: {
      userId,
      OR: [
        {
          startTime: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
        {
          startTime: null,
          createdAt: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      ],
    },
    include: {
      project: { select: { id: true, title: true } },
      goal: { select: { id: true, title: true } },
    },
    orderBy: [
      { startTime: 'asc' },
      { priority: 'desc' },
      { createdAt: 'asc' },
    ],
  })
}
