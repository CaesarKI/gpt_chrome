import React from 'react'
import { createRoot } from 'react-dom/client';
import App from './page/app'

const render = () => {
  const root = createRoot(document.getElementById('root'))
  root.render(<App/> )
}
render();

