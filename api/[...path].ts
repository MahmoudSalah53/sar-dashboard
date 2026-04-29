import type { VercelRequest, VercelResponse } from '@vercel/node'

function joinUrl(base: string, path: string, search: string) {
  const normalizedBase = base.endsWith('/') ? base.slice(0, -1) : base
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${normalizedBase}${normalizedPath}${search}`
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const baseUrl = process.env.API_BASE_URL
  if (!baseUrl) {
    res.status(500).json({ error: 'API_BASE_URL is not configured' })
    return
  }

  const pathParts = req.query.path
  const path = Array.isArray(pathParts) ? pathParts.join('/') : String(pathParts ?? '')
  const searchParams = new URLSearchParams()

  for (const [key, value] of Object.entries(req.query)) {
    if (key === 'path') continue
    if (Array.isArray(value)) {
      value.forEach((item) => searchParams.append(key, item))
    } else if (typeof value === 'string') {
      searchParams.append(key, value)
    }
  }

  const search = searchParams.toString()
  const targetUrl = joinUrl(baseUrl, path, search ? `?${search}` : '')

  try {
    const upstream = await fetch(targetUrl, {
      method: req.method,
      headers: {
        Accept: 'application/json',
        'ngrok-skip-browser-warning': 'true',
      },
    })

    const contentType = upstream.headers.get('content-type') ?? 'application/json'
    const bodyText = await upstream.text()

    if (contentType.includes('text/html')) {
      res.status(502).json({
        error: 'Upstream returned HTML instead of JSON',
        hint: 'Check that API_BASE_URL is correct and ngrok-skip-browser-warning is respected.',
        status: upstream.status,
        upstream: targetUrl,
      })
      return
    }

    res.status(upstream.status)
    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
    res.setHeader('Pragma', 'no-cache')
    res.setHeader('Expires', '0')
    res.send(bodyText)
  } catch (error) {
    res.status(502).json({
      error: 'Failed to reach upstream API',
      details: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}
