import { z } from 'zod'

export const envSchema = z.object({
  EXPO_PUBLIC_API_URL: z
    .string()
    .default('https://g44ooscs4ggkg4s84w0kcsow.colify.antoniositoehl.sbs'),
  EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN: z.string({
    error: 'MAPBOX_ACCESS_TOKEN is required',
  }),
})

export const env = envSchema.parse(process.env)
