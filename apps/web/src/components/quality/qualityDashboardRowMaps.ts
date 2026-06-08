import type { QualityDashboardResponse } from '@epis2/contracts';
import type { EpisDataGridRow } from '@epis2/epis2-ui';

function row(id: string, title: string, detail: string): EpisDataGridRow {
  return { id, title, detail };
}

/** Filas title/detail para grillas RAD del tablero calidad. */
export function buildQualityDashboardGridRows(data: QualityDashboardResponse) {
  return {
    sentinel: data.sentinelEvents.map((r) =>
      row(
        r.eventCode,
        `${r.eventCode} — ${r.unit}`,
        `${r.severity} · ${r.status} · ${r.reportedAt}`,
      ),
    ),
    rootCause: data.rootCauseAnalyses.map((r) =>
      row(r.caseCode, `${r.caseCode} — ${r.eventSummary}`, `${r.leadInvestigator} · ${r.status}`),
    ),
    mortalityBoard: data.mortalityBoardCases.map((r) =>
      row(
        r.caseCode,
        `${r.caseCode} — ${r.patientInitials}`,
        `${r.reviewDate} · ${r.recommendation}`,
      ),
    ),
    recordAudit: data.recordAudits.map((r) =>
      row(r.recordType, r.recordType, `n=${r.sampleSize} · ${r.compliancePercent}% · ${r.auditor}`),
    ),
    oirs: data.oirsClaims.map((r) =>
      row(r.claimId, `${r.claimId} — ${r.category}`, `${r.daysOpen} días · ${r.status}`),
    ),
    workClimate: data.workClimateSurveys.map((r) =>
      row(
        r.unit,
        r.unit,
        `respuesta ${r.responseRatePercent}% · engagement ${r.engagementScore} · ${r.surveyPeriod}`,
      ),
    ),
    consent: data.consentTraces.map((r) =>
      row(
        `${r.patientDisplayName}-${r.consentType}`,
        `${r.patientDisplayName} — ${r.consentType}`,
        `${r.signedAt} · ${r.traceStatus}`,
      ),
    ),
    accreditation: data.accreditationIndicators.map((r) =>
      row(
        r.indicatorCode,
        `${r.indicatorCode} — ${r.indicatorName}`,
        `meta ${r.targetPercent}% · observado ${r.observedPercent}%`,
      ),
    ),
    institutionalDocs: data.institutionalDocuments.map((r) =>
      row(
        r.documentCode,
        `${r.documentCode} — ${r.title}`,
        `${r.version} · revisión ${r.reviewDue}`,
      ),
    ),
    surgicalSuspension: data.surgicalSuspensions.map((r) =>
      row(
        r.caseCode,
        `${r.caseCode} — ${r.operatingRoom}`,
        `${r.reason} · ${r.suspendedAt}`,
      ),
    ),
    surveillance: data.surveillanceMatrix.map((r) =>
      row(
        `${r.organism}-${r.unit}`,
        `${r.organism} — ${r.unit}`,
        `${r.casesLast30d} casos/30d · ${r.alertLevel}`,
      ),
    ),
    mdro: data.mdroAlerts.map((r, index) =>
      row(
        `mdro-${index}`,
        r.patientDisplayName,
        `${r.organism} · ${r.isolationType}`,
      ),
    ),
    antimicrobial: data.antimicrobialConsumption.map((r) =>
      row(r.antibiotic, r.antibiotic, `DDD/1000 ${r.dddPer1000} · ${r.trend}`),
    ),
    proa: data.proaRecommendations.map((r, index) =>
      row(
        `proa-${index}`,
        r.patientDisplayName,
        `${r.currentRegimen} → ${r.recommendation} · ${r.status}`,
      ),
    ),
    cvc: data.cvcInsertionChecklists.map((r, index) =>
      row(
        `cvc-${index}`,
        r.patientDisplayName,
        `${r.insertionSite} · bundle ${r.bundleCompliance}%`,
      ),
    ),
    nav: data.navPreventionChecklists.map((r) =>
      row(
        r.unit,
        r.unit,
        `${r.ventilatorDays} días VM · bundle ${r.bundleCompliancePercent}%`,
      ),
    ),
    handHygiene: data.handHygieneAudits.map((r) =>
      row(
        r.unit,
        r.unit,
        `${r.compliancePercent}% · ${r.opportunities} oportunidades · ${r.auditDate}`,
      ),
    ),
    outbreak: data.outbreakStudies.map((r) =>
      row(r.outbreakCode, `${r.outbreakCode} — ${r.unit}`, `${r.cases} casos · ${r.status}`),
    ),
    isolation: data.isolationMap.map((r, index) =>
      row(
        `iso-${index}`,
        `${r.bedLabel} — ${r.patientDisplayName}`,
        r.precautionType,
      ),
    ),
    endemic: data.endemicCurves.map((r) =>
      row(
        r.indicator,
        r.indicator,
        `endémico ${r.endemicRate} · observado ${r.observedRate} · ${r.periodLabel}`,
      ),
    ),
    staging: data.stagingBatches.map((r) =>
      row(
        r.id,
        r.batchLabel,
        `${r.sourceSystem} · ${r.status} · ${r.recordCount} reg.`,
      ),
    ),
    audit: data.recentAudit.map((r) =>
      row(
        r.id,
        r.eventType,
        `${r.username ?? '—'} · ${[r.entityType, r.entityId].filter(Boolean).join(' · ') || '—'} · ${new Date(r.at).toLocaleString('es-CL')}`,
      ),
    ),
  } as const;
}