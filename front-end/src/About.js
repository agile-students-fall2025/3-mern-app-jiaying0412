import { useState, useEffect } from 'react'

function AboutUs() {
  const [aboutData, setAboutData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('http://localhost:5002/api/about', { headers: { Accept: 'application/json' }, cache: 'no-store' })
      .then(async res => {
        const text = await res.text()
        if (!res.ok) { console.error(res.status, text.slice(0,200)); throw new Error('Failed to fetch about data') }
        return JSON.parse(text)
      })
      .then(data => setAboutData(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div>Loading...</div>
  if (error)   return <div>Error: {error}</div>
  if (!aboutData) return <div>No data</div>

  return (
    <div className="about-us">
      <img src={aboutData.imgUrl} alt="Jiaying" style={{ maxWidth: 300, borderRadius: 8 }} />
      <h1>{aboutData.title}</h1>
      <p style={{ whiteSpace: 'pre-line' }}>{aboutData.body}</p>
    </div>
  )
}
export default AboutUs
