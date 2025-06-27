export interface ApiResponse {
  data: {
    StandardCollection: {
      containers: any[]
    }
  }
}

export interface ParsedApiResponse { 
  containers: ParsedSetData[]
}

export interface ParsedSetData {
  title: string
  type: string
  items?: TileItem[]
  refId?: string
}

export interface TileItem {
  image: string
  text: string
}