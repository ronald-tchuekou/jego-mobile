import { getApiUrl } from '@/src/lib/env'

export type ApiResponse<T> = {
  data: T | null
  error: string | null
  status: number
}

export async function fetchHelper<T>(path: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const url = `${getApiUrl('/v1')}${path}`

  const response = await fetch(url, options)
  let data: any = null
  try {
    data = await response.json()
  } catch (_e) {
    console.error('Error when parsing json response => ', _e)
  }

  if (response.status !== 200 && response.status !== 201) {
    return {
      data: null,
      error: data?.message || data?.error || data?.errors?.[0]?.message || 'Une erreur est survenue.',
      status: response.status,
    }
  }

  return { data: data as T, error: null, status: response.status }
}
