interface Env {
  apiBaseUrl: string
  enableMsw: boolean
}

function readEnv(): Env {
  const apiBaseUrl =
    import.meta.env.VITE_API_BASE_URL ??
    (import.meta.env.PROD ? '' : 'https://api.ozb.uz/api/v1')

  if (!apiBaseUrl) {
    throw new Error(
      'VITE_API_BASE_URL is not set. Copy .env.example to .env and set the backend URL.',
    )
  }

  return {
    apiBaseUrl,
    enableMsw: true, // vaqtincha majburan yoqildi
  }
}

export const env = readEnv()