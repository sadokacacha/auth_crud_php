// main.jsx or index.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import router from './router.jsx';
import { ContextsProvider } from './contexts/ContextsProvider.jsx';


createRoot(document.getElementById('root')).render(
  <StrictMode>

    <ContextsProvider>
      
    <RouterProvider router={router} />

    </ContextsProvider>


  </StrictMode>
);
