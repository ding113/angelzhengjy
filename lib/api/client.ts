import { config } from '../config'
import type { ApiResponse } from './types'

const API_BASE_URL = config.API_BASE_URL

console.log('🔧 API Configuration:', {
  API_BASE_URL,
  environment: process.env.NODE_ENV,
  customApiUrl: process.env.NEXT_PUBLIC_API_BASE_URL
})

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const fullUrl = `${API_BASE_URL}${endpoint}`
  console.log('🔗 API Request:', {
    url: fullUrl,
    method: options.method || 'GET',
    headers: options.headers,
    body: options.body
  })

  try {
    const response = await fetch(fullUrl, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    })

    console.log('📡 API Response Status:', response.status, response.statusText)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ API Error Response:', errorText)
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
    }

    const data = await response.json()
    console.log('✅ API Response Data:', data)
    return data
  } catch (error) {
    console.error('❌ API request failed:', {
      url: fullUrl,
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined
    })
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}
