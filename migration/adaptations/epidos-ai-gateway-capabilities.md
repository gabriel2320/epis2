# Adaptación — AI Gateway EPIDOS → local-ai EPIS2

**Origen conceptual:** `Epidos/apps/api/src/ai-gateway/gateway.ts` + `structured.ts`

**Destino:**

- `services/local-ai/src/assistSchemas.ts` — registry de blueprints / campos
- `services/local-ai/src/gatewayCapabilities.ts` — respuesta `/capabilities`
- `services/local-ai/src/assist.ts` — usa registry

## Qué no se portó

- Chat clínico streaming, tool calling, embeddings, proveedores cloud.
- Esquemas `document_clinical_extraction` y propuestas de acción automática.

## Contrato

Solo `POST /assist/draft-suggestion` ejecuta IA; `GET /capabilities` describe schemas y límites MVP.
