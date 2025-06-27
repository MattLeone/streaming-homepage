import type { ApiResponse, ParsedApiResponse, TileItem } from "../types"

export function parseApiResponse(raw: ApiResponse): ParsedApiResponse {
    const containers = raw.data.StandardCollection.containers.map(container => ({
      title: container.set.text.title.full.set.default.content,
      type: container.set.type,
      items: container.set.items ? parseItems(container.set.items) : undefined,
      refId: container.set.refId
    }))
    
    return { containers }
  }
  
function parseItems(rawItems: any[]): TileItem[] {
    return rawItems.map(item => ({
        image: getImageUrl(item),
        text: getTitle(item)
    }))
}

function getImageUrl(item: any): string {
    return item.image?.tile?.["1.78"]?.series?.default?.url ||
           item.image?.tile?.["1.78"]?.program?.default?.url ||
           item.image?.tile?.["1.78"]?.default?.default?.url ||
           ''
  }
  
function getTitle(item: any): string {
    return item.text?.title?.full?.series?.default?.content ||
            item.text?.title?.full?.program?.default?.content ||
            item.text?.title?.full?.collection?.default?.content ||
            ''
}

export async function fetchSetRefItems(refId: string): Promise<TileItem[]> {
    try {
      const response = await fetch(`https://cd-static.bamgrid.com/dp-117731241344/sets/${refId}.json`)
      const data = await response.json()
      
      const setData = data.data.CuratedSet || data.data.TrendingSet || data.data.PersonalizedCuratedSet
      return parseItems(setData.items)
    } catch (error) {
      console.error('Failed to fetch set items:', error, refId)
      return []
    }
  }