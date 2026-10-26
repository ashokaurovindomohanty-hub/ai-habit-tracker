import OpenAI from 'openai'
export const metaAI = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_META_API_KEY,
  baseURL: "https://api.llama-api.com",
  dangerouslyAllowBrowser: true
})
