import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux'
import store from "./redux/store.js"

const root = ReactDOM.createRoot(document.getElementById('root'));

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/service-worker.js")
    .then(reg => console.log("Service Worker was registered: ", reg.scope))
    .catch(err => console.error("Service Worker registiration error: ", err));
}

root.render(
  <Provider store={store}>
    <React.StrictMode>
    <App />
    </React.StrictMode>
  </Provider>
);
