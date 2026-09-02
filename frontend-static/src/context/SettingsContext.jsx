import { createContext, useContext, useEffect, useState } from 'react'
import { api, asList } from '../lib/api'

const SettingsContext = createContext({ rate: 26500, categories: [], loading: true })

export function SettingsProvider({ children }) {
  const [rate, setRate] = useState(26500)
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true
    Promise.all([
      api.get('/settings/exchange-rate/').catch(() => null),
      api.get('/categories/').catch(() => []),
    ]).then(([rateData, cats]) => {
      if (!alive) return
      if (rateData?.rate) setRate(rateData.rate)
      setCategories(asList(cats))
      setLoading(false)
    })
    return () => {
      alive = false
    }
  }, [])

  return (
    <SettingsContext.Provider value={{ rate, categories, loading }}>
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = () => useContext(SettingsContext)
