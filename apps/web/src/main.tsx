import { Epis2ThemeProvider } from './Epis2ThemeProvider.js';
import { RouterProvider } from '@tanstack/react-router';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { router } from './routes/router.js';
import { AuthProvider } from './auth/AuthContext.js';
import { ActivePatientProvider } from './clinical/ActivePatientContext.js';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Epis2ThemeProvider>
      <AuthProvider>
        <ActivePatientProvider>
          <RouterProvider router={router} />
        </ActivePatientProvider>
      </AuthProvider>
    </Epis2ThemeProvider>
  </StrictMode>,
);
