/**
 * Paleta visual epis2g adaptada a MUI sx (Clean Room — sin Tailwind).
 * Fuente donante: epis2g SidebarCICA + CensoClinico + index.css (sepia ref).
 */
export const cicaEpis2gVisual = {
  railWidthExpanded: 208,
  railWidthCollapsed: 64,
  patientPanelWidth: 224,
  railBg: '#0f172a',
  railBorder: 'rgba(30, 41, 59, 0.6)',
  railText: '#cbd5e1',
  railTextMuted: '#64748b',
  railHoverBg: '#1e293b',
  railSelectedBg: '#2563eb',
  railSelectedText: '#ffffff',
  brandBadgeBg: '#2563eb',
  brandBadgeText: '#ffffff',
  panelBgLight: '#f8fafc',
  panelBgDark: '#0f172a',
  panelBorderLight: 'rgba(226, 232, 240, 0.5)',
  panelBorderDark: 'rgba(30, 41, 59, 0.8)',
  panelHeaderBgLight: 'rgba(241, 245, 249, 0.5)',
  panelHeaderBgDark: 'rgba(2, 6, 23, 0.2)',
  panelSelectedBgLight: '#e2e8f0',
  panelSelectedBgDark: '#1e293b',
  panelSelectedAccent: '#2563eb',
  contentCanvasLight: '#f8fafc',
  contentCanvasDark: '#020617',
  cardRadius: 12,
  cardHoverBorder: '#3b82f6',
  accentLabel: '#2563eb',
  accentLabelDark: '#60a5fa',
  statusDot: '#22c55e',
  fontMono: '"JetBrains Mono", ui-monospace, SFMono-Regular, monospace',
} as const;

export type CicaEpis2gSurface = {
  panelBg: string;
  panelBorder: string;
  panelHeaderBg: string;
  panelSelectedBg: string;
  contentCanvas: string;
  accentLabel: string;
};

/** Superficies L2 + canvas según modo efectivo. */
export function resolveCicaEpis2gSurfaces(isDark: boolean): CicaEpis2gSurface {
  if (isDark) {
    return {
      panelBg: cicaEpis2gVisual.panelBgDark,
      panelBorder: cicaEpis2gVisual.panelBorderDark,
      panelHeaderBg: cicaEpis2gVisual.panelHeaderBgDark,
      panelSelectedBg: cicaEpis2gVisual.panelSelectedBgDark,
      contentCanvas: cicaEpis2gVisual.contentCanvasDark,
      accentLabel: cicaEpis2gVisual.accentLabelDark,
    };
  }
  return {
    panelBg: cicaEpis2gVisual.panelBgLight,
    panelBorder: cicaEpis2gVisual.panelBorderLight,
    panelHeaderBg: cicaEpis2gVisual.panelHeaderBgLight,
    panelSelectedBg: cicaEpis2gVisual.panelSelectedBgLight,
    contentCanvas: cicaEpis2gVisual.contentCanvasLight,
    accentLabel: cicaEpis2gVisual.accentLabel,
  };
}
