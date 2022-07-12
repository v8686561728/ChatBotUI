import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { Provider } from 'react-redux'
import store from './redux/store'
// Opt-in to Webpack hot module replacement
if (module.hot) module.hot.accept()
const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(
  <Provider store={store}>
  <App />
  </Provider>
)