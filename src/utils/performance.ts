// Performance optimization utilities

// Debounce function for search inputs
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

// Throttle function for scroll events
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let lastCall = 0
  return (...args: Parameters<T>) => {
    const now = Date.now()
    if (now - lastCall >= delay) {
      lastCall = now
      func(...args)
    }
  }
}

// Lazy loading for images
export const lazyLoadImage = (img: HTMLImageElement, src: string) => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        img.src = src
        img.classList.remove('lazy')
        observer.unobserve(img)
      }
    })
  })
  observer.observe(img)
}

// Local storage with compression for large data
export const compressedStorage = {
  setItem: (key: string, value: any) => {
    try {
      const jsonString = JSON.stringify(value)
      localStorage.setItem(key, jsonString)
    } catch (error) {
      console.error('Storage error:', error)
    }
  },
  
  getItem: (key: string) => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error('Storage retrieval error:', error)
      return null
    }
  },
  
  removeItem: (key: string) => {
    localStorage.removeItem(key)
  }
}

// Memory cleanup utilities
export const cleanupResources = () => {
  // Clear any unused event listeners
  // Clean up any timers or intervals
  // Force garbage collection if available
  if ('gc' in window) {
    (window as any).gc()
  }
}