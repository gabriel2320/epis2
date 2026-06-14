-- MF-TOOL-02: rol read-only para Cursor Postgres MCP (solo SELECT; dev local).

DO $do$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'epis2_mcp_ro') THEN
    CREATE ROLE epis2_mcp_ro WITH LOGIN PASSWORD 'epis2' NOSUPERUSER NOBYPASSRLS;
  ELSE
    ALTER ROLE epis2_mcp_ro WITH LOGIN PASSWORD 'epis2' NOSUPERUSER NOBYPASSRLS;
  END IF;
END
$do$;

REVOKE ALL ON DATABASE epis2 FROM epis2_mcp_ro;
GRANT CONNECT ON DATABASE epis2 TO epis2_mcp_ro;
GRANT USAGE ON SCHEMA public TO epis2_mcp_ro;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO epis2_mcp_ro;

ALTER DEFAULT PRIVILEGES FOR ROLE epis2 IN SCHEMA public
  GRANT SELECT ON TABLES TO epis2_mcp_ro;

UPDATE epis2_schema_meta SET version = 'epis2-mcp-ro', applied_at = NOW() WHERE id = 1;
