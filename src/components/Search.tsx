import { useEffect, useMemo, useState } from 'react'
import type { ProductItem } from '../lib/tesco'
import { TescoAPI } from '../lib/tesco'
import Card from './Card'
import Button from './Button'

export default function Search() {
  const [query, setQuery] = useState('milk')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [products, setProducts] = useState<ProductItem[]>([])

  const canSearch = useMemo(() => query.trim().length > 1, [query])

  async function performSearch() {
    if (!canSearch) return
    setIsLoading(true)
    setError(null)
    const result = await TescoAPI.searchProducts({ query, count: 12, page: 0, filters: [] })
    if (result.errors) {
      setError(result.errors[0]?.message ?? 'Unknown error')
      setProducts([])
    } else if (result.data) {
      // API field names mapped by client types
      // The proxy returns keys as in the original schema: search.products
      // Types ensure access below is correct
      // @ts-expect-error narrow by known shape
      const items = result.data.search?.productItems || result.data.search?.products || []
      setProducts(items as ProductItem[])
    }
    setIsLoading(false)
  }

  useEffect(() => {
    performSearch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function toNumber(value: number | string | undefined): number | undefined {
    if (typeof value === 'number') return value
    if (typeof value === 'string') {
      const trimmed = value.trim()
      if (trimmed.includes(':')) {
        const [w, h] = trimmed.split(':')
        const wn = Number(w)
        const hn = Number(h)
        if (Number.isFinite(wn) && Number.isFinite(hn) && hn !== 0) {
          return wn / hn
        }
      }
      const n = Number(trimmed)
      return Number.isFinite(n) ? n : undefined
    }
    return undefined
  }

  function getImageUrl(p: ProductItem): { url: string | undefined; ratio: number | undefined } {
    const d = p.media?.defaultImage
    const dRatio = toNumber(d?.aspectRatio)
    const mediaList = p.media?.images ?? []

    const candidates = [d, ...mediaList].filter(Boolean) as Array<{ url?: string; aspectRatio?: number | string }>
    let best = undefined as { url?: string; aspectRatio?: number | string } | undefined
    let bestDist = Infinity
    for (const img of candidates) {
      if (!img?.url) continue
      const r = toNumber(img.aspectRatio)
      if (r == null) continue
      const dist = Math.abs(r - 0.8)
      if (dist < bestDist) {
        best = img
        bestDist = dist
      }
    }

    // Use closest-to-0.8 portrait if it's within tolerance
    if (best && best.url && bestDist <= 0.06) {
      return { url: best.url, ratio: 0.8 }
    }

    // Otherwise prefer defaultImage, then first available image
    if (d?.url) return { url: d.url, ratio: dRatio }
    const first = mediaList.find(img => img?.url)
    if (first?.url) return { url: first.url, ratio: toNumber(first.aspectRatio) }

    return { url: p.images?.display?.default?.url || p.defaultImageUrl, ratio: undefined }
  }

  return (
    <Card className="max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center gap-3">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Tesco products (e.g. milk, bread, eggs)"
          className="flex-1 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-gray-900/50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Button onClick={performSearch} disabled={!canSearch || isLoading}>
          {isLoading ? 'Searching…' : 'Search'}
        </Button>
      </div>

      {error && (
        <p className="text-red-600 dark:text-red-400 mt-4">{error}</p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
        {products.map((p) => (
          <div key={p.id} className="group bg-white/70 dark:bg-gray-900/40 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-lg transition-shadow">
            {(() => {
              const { url, ratio } = getImageUrl(p)
              const useFourByFive = Math.abs((ratio ?? 1) - 0.8) <= 0.06
              const aspectClass = useFourByFive ? 'aspect-[4/5]' : 'aspect-square'
              return (
                <div className={`${aspectClass} bg-white overflow-hidden`}>
                  {/* eslint-disable-next-line jsx-a11y/alt-text */}
                  <img src={url} className="w-full h-full object-cover" alt={p.title} />
                </div>
              )
            })()}
            <div className="p-3">
              <div className="text-sm text-gray-500">{p.brandName}</div>
              <div className="font-semibold leading-snug line-clamp-2">{p.title}</div>
              {(() => {
                const price = p.price?.actual ?? p.price?.price
                if (price == null) return null
                return (
                  <div className="mt-1 text-blue-700 dark:text-blue-300 font-semibold">
                    £{price.toFixed(2)}
                  </div>
                )
              })()}
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}


