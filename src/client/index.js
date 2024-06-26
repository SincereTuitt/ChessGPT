import { createRoot } from "react-dom/client";
import React from "react";
import App from "./components/App.jsx";
import { store } from './store'
import { Provider } from 'react-redux'

const root = createRoot(document.getElementById('root'));
root.render(
  process.env.NODE_ENV === 'production'
  ?
   <Provider store={store}>
    <App />
   </Provider>
  :
  <React.StrictMode>
   <Provider store={store}>
    <App />
   </Provider>
  </React.StrictMode>
);