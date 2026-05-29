import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Fix React crashing when Google Translate modifies the DOM (React DOMException during navigation)
if (typeof Node === 'function' && Node.prototype) {
  const methods = ['removeChild', 'insertBefore', 'replaceChild'];
  methods.forEach(method => {
    const original = Node.prototype[method];
    Node.prototype[method] = function() {
      try {
        return original.apply(this, arguments);
      } catch (e) {
        if (e.name === 'NotFoundError' || e.message.includes('not a child') || e.message.includes('is not a child of this node')) {
          console.warn(`[Google Translate Patch] Suppressed React DOMException in ${method}:`, e);
          return arguments[0];
        }
        throw e;
      }
    };
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
