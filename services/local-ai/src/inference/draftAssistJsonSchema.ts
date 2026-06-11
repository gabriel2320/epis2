/** JSON Schema para OpenAI Structured Outputs — alineado a localAiDraftAssistOutputSchema. */
export const DRAFT_ASSIST_JSON_SCHEMA = {
  type: 'object',
  properties: {
    suggestedFields: {
      type: 'object',
      additionalProperties: { type: 'string' },
    },
    safetyNotes: {
      type: 'array',
      items: { type: 'string' },
    },
    requiresHumanReview: {
      type: 'boolean',
      const: true,
    },
  },
  required: ['suggestedFields', 'safetyNotes', 'requiresHumanReview'],
  additionalProperties: false,
} as const;
