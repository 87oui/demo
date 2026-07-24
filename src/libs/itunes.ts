interface Album {
  wrapperType: string
  collectionType: string
  artistId: number
  collectionId: number
  artistName: string
  collectionName: string
  collectionCensoredName: string
  artistViewUrl: string
  collectionViewUrl: string
  artworkUrl60: string
  artworkUrl100: string
  collectionPrice: number
  collectionExplicitness: string
  trackCount: number
  copyright: string
  country: string
  currency: string
  releaseDate: string
  primaryGenreName: string
}

interface Params {
  term: string
  country?: string
  media?: string
  entity?:
    | 'movie'
    | 'podcast'
    | 'music'
    | 'musicVideo'
    | 'audiobook'
    | 'shortFilm'
    | 'tvShow'
    | 'software'
    | 'ebook'
    | 'all'
  callback?: () => void
  limit?: number
  lang?: string
  version?: number
  explicit?: 'Yes' | 'No'
}

/**
 * アルバムを検索
 * @param query 検索条件
 * @returns 検索結果
 */
const fetchAlbums = async (query: Record<string, string>): Promise<Album[]> => {
  const params = new URLSearchParams(query)
  const response = await fetch(
    `https://itunes.apple.com/search?${params.toString()}`
  )

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const json = await response.json()

  if (json.resultCount < 1) {
    return []
  }

  return json.results
}

/**
 * アルバムを検索
 * @param query 検索条件
 * @returns 検索結果
 */
export const getAlbums = async (query: Params): Promise<Album[]> => {
  const queryToString: Record<string, string> = {}
  for (const key of Object.keys(query) as Array<keyof Params>) {
    const value = query[key]
    if (value !== undefined) {
      queryToString[key] = String(value)
    }
  }

  return fetchAlbums({
    country: 'jp',
    media: 'music',
    entity: 'album',
    limit: '50',
    lang: 'ja_jp',
    ...queryToString,
  })
}
