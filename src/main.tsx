import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { generateCellularAutomaton } from './cellularAutomaton'
import './index.css'
import { log, stringify } from './utils'

log(stringify(generateCellularAutomaton('hi'), null, 2))

ReactDOM.render(
  // <React.StrictMode>
  <App />,
  // <EmojiNPCDemo />,
  // </React.StrictMode>,
  document.getElementById('root'),
)
