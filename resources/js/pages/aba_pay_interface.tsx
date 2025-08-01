import React, { useEffect, useState } from 'react'
import axios from 'axios'

const AbaPayInterface = () => {
  const [response, setResponse] = useState(null)

  useEffect(() => {
    axios.get('/pay/aba')
      .then(res => {
        console.log(res.data)
        setResponse(res.data)
      })
      .catch(err => {
        setResponse({ error: err.message })
      })
  }, [])

  return (
    <div>
      <h1 className="text-lg font-semibold mb-2">ABA Pay Interface</h1>
      <pre className="bg-gray-100 p-4 rounded max-w-xl"
      >
        {response}
      </pre>
    </div>
  )
}

export default AbaPayInterface
