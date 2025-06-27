import { useState, useEffect, useCallback, useRef } from 'react'
import './App.css'
import ContentRow from './components/ContentRow'
import type { ApiResponse, ParsedApiResponse } from './types'
import { parseApiResponse } from './utils'
import { handleKeyPress } from './utils/keyboard'

function App() {
  const [data, setData] = useState<ParsedApiResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeRow, setActiveRow] = useState(0)
  const [activeItem, setActiveItem] = useState(0)
  const [maxIndices, setMaxIndices] = useState<number[]>([])
  const rowRefs = useRef<(HTMLDivElement | null)[]>([])

  const updateMaxIndex = useCallback((rowIndex: number, maxIndex: number) => {
    setMaxIndices(prev => {
      if (prev[rowIndex] === maxIndex) return prev
      const newMax = [...prev]
      newMax[rowIndex] = maxIndex
      return newMax
    })
  }, [])

  const onKeyPress = useCallback((e: KeyboardEvent) => {
    handleKeyPress(e, data, activeRow, activeItem, maxIndices, setActiveRow, setActiveItem)
  }, [data, activeRow, activeItem, maxIndices])

  useEffect(() => {
    rowRefs.current[activeRow]?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  }, [activeRow])

  useEffect(() => {
    fetch('https://cd-static.bamgrid.com/dp-117731241344/home.json')
      .then(res => res.json())
      .then((response: ApiResponse) => {
        setData(parseApiResponse(response))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    window.addEventListener('keydown', onKeyPress)
    return () => window.removeEventListener('keydown', onKeyPress)
  }, [onKeyPress])

  if (loading) return <div className="loading">Loading magical content...</div>
  if (!data) return <div>Error loading data</div>

  return (
    <div className="homepage">
      <h1>Disney+ Home</h1>
      {data.containers.map((container, index) => (
        <div key={container.title} ref={el => { rowRefs.current[index] = el }}>
          <ContentRow 
            container={container}
            isActive={index === activeRow}
            focusedIndex={index === activeRow ? activeItem : -1}
            onMaxIndexChange={maxIndex => updateMaxIndex(index, maxIndex)}
          />
        </div>
      ))}
    </div>
  )
}

export default App