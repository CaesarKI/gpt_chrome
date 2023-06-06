import { createRoot } from 'react-dom/client';
import React from 'react';
import App from './page/app'
import { tag, containerId } from './shdow-dom';



const render = () => {
  const container = document.createElement(tag)
  document.body.append(container)
  const root = createRoot(container.shadowRoot.querySelector(`#${containerId}`));
  root.render(<App />)
}

render()

