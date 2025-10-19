import { api } from '@/lib/axios'
import type { SignUpSubmitData } from '@/utils/schemas/sign-up-schema'

export async function signUp(data: SignUpSubmitData) {
  const response = await api.post('/auth/sign-up/email', data)
  return response.data
}
export async function signIn(data: { email: string; password: string }) {
  const response = await api.post('/auth/sign-in/email', data)
  return response.data
}

export async function verifyEmail(email: string) {
  const response = await api.post('/auth/email-otp/send-verification-otp', {
    email,
    type: 'email-verification',
  })
  return response.data
}

export async function sendEmail(email: string, otp: string) {
  const response = await api.post('/auth/email-otp/verify-email', {
    email,
    otp,
  })
  return response.data
}
