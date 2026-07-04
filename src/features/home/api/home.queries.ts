import { useQuery } from '@tanstack/react-query'
import { getBusinessInsights, getTodoList } from './home.api'

// Stable, structured query keys → cache, dedupe, and invalidation just work.
export const homeKeys = {
  all: ['home'] as const,
  todo: () => [...homeKeys.all, 'todo'] as const,
  insights: () => [...homeKeys.all, 'insights'] as const,
}

export function useTodoList() {
  return useQuery({
    queryKey: homeKeys.todo(),
    queryFn: getTodoList,
  })
}

export function useBusinessInsights() {
  return useQuery({
    queryKey: homeKeys.insights(),
    queryFn: getBusinessInsights,
  })
}
