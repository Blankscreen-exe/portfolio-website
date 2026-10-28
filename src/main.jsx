import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
// Styles
import './index.css'
// Compiled on the fly by Vite's PostCSS (tailwind) pipeline, so new classes need no manual `npm run tc`
import './tailwind.css'
import './styles/sheet.css'
// Redux
import { store, persister } from './redux/store.jsx'
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux'
// Router
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persister}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
)
