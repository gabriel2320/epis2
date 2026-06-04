/** Bootstrap EPIS2-01 — shell visual en EPIS2-02 */
export function App() {
  return (
    <main className="bootstrap">
      <h1>EPIS2</h1>
      <p className="phase">Fase EPIS2-01 — monorepo inicializado</p>
      <p>
        El Centro de Comando y Material UI se implementan en <strong>EPIS2-02</strong>.
      </p>
      <ul>
        <li>API: <code>/health</code>, <code>/ready</code></li>
        <li>IA local: servicio separado en puerto 3002</li>
        <li>PostgreSQL: migraciones en <code>database/migrations</code></li>
      </ul>
    </main>
  );
}
