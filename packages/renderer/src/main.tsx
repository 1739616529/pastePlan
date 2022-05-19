import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './samples/preload-module'
import './styles/index.css'
import './assets/icon-font.js'
const root = createRoot(document.getElementById('root')!)

root.render(
  <StrictMode>
    <App />
  </StrictMode>
)

if (window.removeLoading) window.removeLoading()
