import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import Store from './Store.jsx';
import { FindWidthProvider } from './context/FindWidth.jsx'
import { Provider } from 'react-redux';
import { RegisterProvider } from './context/RegisterContext.jsx';
import { BrowserRouter } from 'react-router-dom';



ReactDOM.createRoot(document.getElementById('root')).render(

  <React.StrictMode>
    <Provider store={Store}>
      <FindWidthProvider>
        <RegisterProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
        </RegisterProvider>
      </FindWidthProvider>
    </Provider>
  </React.StrictMode>,
)
