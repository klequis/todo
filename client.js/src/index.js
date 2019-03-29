import * as React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import configureStore from './redux'

import App from './ui/App'
import './index.css'
import * as serviceWorker from './serviceWorker'

const store = configureStore()

const Root = () => (
  <Provider store={store}>
    <App />
  </Provider>
)

render(<Root />, document.getElementById("root"))

serviceWorker.unregister()
