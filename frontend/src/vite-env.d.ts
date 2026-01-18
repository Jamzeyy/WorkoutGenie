/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_SENTRY_DSN?: string
  readonly VITE_POSTHOG_KEY?: string
  readonly VITE_POSTHOG_HOST?: string
  readonly VITE_PADDLE_CLIENT_TOKEN?: string
  readonly VITE_PADDLE_PRICE_MONTHLY?: string
  readonly VITE_PADDLE_PRICE_ANNUAL?: string
  readonly VITE_PADDLE_PRICE_TWO_YEAR?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
