import { Epis2ThemeProvider } from './Epis2ThemeProvider.js';
import { RouterProvider } from '@tanstack/react-router';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { router } from './routes/router.js';
import { DemoSessionProvider } from './session/DemoSessionContext.js';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Epis2ThemeProvider>
      <DemoSessionProvider>
        <RouterProvider router={router} />
      </DemoSessionProvider>
    </Epis2ThemeProvider>
  </StrictMode>,
);
