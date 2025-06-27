export function handleKeyPress(
    e: KeyboardEvent,
    parsedData: any,
    activeRowIndex: number,
    activeRowFocusIndex: number,
    maxIndices: number[],
    setActiveRowIndex: (value: number | ((prev: number) => number)) => void,
    setActiveRowFocusIndex: (value: number | ((prev: number) => number)) => void
  ) {
    if (!parsedData) return
    
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter'].includes(e.key)) {
      e.preventDefault()
    }
    
    const currentMaxIndex = maxIndices[activeRowIndex] || 0
    
    switch (e.key) {
      case 'ArrowRight':
        setActiveRowFocusIndex(prev => Math.min(currentMaxIndex, prev + 1))
        break
      case 'ArrowLeft':
        setActiveRowFocusIndex(prev => Math.max(0, prev - 1))
        break
      case 'ArrowDown':
        setActiveRowIndex(prev => Math.min(parsedData.containers.length - 1, prev + 1))
        setActiveRowFocusIndex(0)
        break
      case 'ArrowUp':
        setActiveRowIndex(prev => Math.max(0, prev - 1))
        setActiveRowFocusIndex(0)
        break
      case 'Enter':
        console.log('Selected:', parsedData.containers[activeRowIndex].title, 'item:', activeRowFocusIndex)
        break
    }
  }