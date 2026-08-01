import { getRequestConfig } from 'next-intl/server'

const locales = ['en', 'fr'] as const

export default getRequestConfig(async ({ locale }) => {
  const safeLocale = locale ?? 'en'

  return {
    locale: safeLocale,
    messages: {},
  }
})

export { locales }
