import React, { useState } from 'react'
import ResultPanel from './resultPanel'
import AskPanel from './askPanel'

export default function Panel() {
  const [isResult, setIsResult] = useState(false)

  const handelChange = (value: boolean) => {
    setIsResult(value)
  }

  return (
    <div>
      {isResult ? <ResultPanel onChangePanel={handelChange} /> : <AskPanel onChangePanel={handelChange}  />}
    </div>
  )
}
