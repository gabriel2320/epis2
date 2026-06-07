import { Epis2ThemeProvider } from '@epis2/epis2-ui';
import { RouterProvider } from '@tanstack/react-router';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { router } from './routes/router.js';
import { AuthProvider } from './auth/AuthContext.js';
import { ActivePatientProvider } from './clinical/ActivePatientContext.js';
import { Epis2QueryProvider } from './query/Epis2QueryProvider.js';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Epis2ThemeProvider>
      <Epis2QueryProvider>
        <AuthProvider>
          <ActivePatientProvider>
            <RouterProvider router={router} />
          </ActivePatientProvider>
        </AuthProvider>
      </Epis2QueryProvider>
    </Epis2ThemeProvider>
  </StrictMode>,
);
