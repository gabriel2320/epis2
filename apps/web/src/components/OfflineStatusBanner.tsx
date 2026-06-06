import { Alert } from '@epis2/epis2-ui';
import { useOnlineStatus } from '../hooks/useOnlineStatus.js';

export function OfflineStatusBanner() {
  const online = useOnlineStatus();
  if (online) return null;

  return (
    <Alert severity="warning" data-testid="epis2-offline-banner" sx={{ borderRadius: 0 }}>
      Sin conexión — los borradores no se sincronizarán hasta recuperar red. Los datos clínicos
      aprobados permanecen en el servidor.
    </Alert>
  );
}
