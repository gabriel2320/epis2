import { copy } from '@epis2/design-system';
import type { PaperChartSectionId } from './paperChartSections.js';
import type { PaperPatientStripProps } from './PaperPatientStrip.js';
import type { PaperTableColumn } from './fields/PaperTable.js';
import {
  PaperFieldRow,
  PaperRuleBlock,
  PaperSignatureBlock,
  PaperSubSection,
  PaperTable,
} from './fields/index.js';

const LAB_TABLE_COLUMNS = [
  { key: 'study', label: 'Estudio / parámetro', width: '40%' },
  { key: 'result', label: 'Resultado', width: '25%' },
  { key: 'date', label: 'Fecha', width: '20%' },
  { key: 'flag', label: 'Flag', width: '15%' },
] as const satisfies readonly PaperTableColumn[];

const NURSING_NANDA_COLUMNS = [
  { key: 'code', label: 'Código', width: '12%' },
  { key: 'diagnosis', label: 'Diagnóstico NANDA', width: '33%' },
  { key: 'noc', label: 'Objetivo NOC', width: '27%' },
  { key: 'nic', label: 'Intervención NIC', width: '28%' },
] as const satisfies readonly PaperTableColumn[];

const NURSING_SCALE_COLUMNS = [
  { key: 'item', label: 'Subescala / factor', width: '55%' },
  { key: 'score', label: 'Puntaje', width: '15%' },
  { key: 'detail', label: 'Descripción', width: '30%' },
] as const satisfies readonly PaperTableColumn[];

const NURSING_ACTIVITY_COLUMNS = [
  { key: 'shift', label: 'Turno', width: '20%' },
  { key: 'activity', label: 'Actividad', width: '40%' },
  { key: 'time', label: 'Hora', width: '15%' },
  { key: 'nurse', label: 'Enfermera', width: '25%' },
] as const satisfies readonly PaperTableColumn[];

const NURSING_EDUCATION_COLUMNS = [
  { key: 'topic', label: 'Tema', width: '35%' },
  { key: 'method', label: 'Método', width: '25%' },
  { key: 'comprehension', label: 'Comprensión', width: '20%' },
  { key: 'date', label: 'Fecha', width: '20%' },
] as const satisfies readonly PaperTableColumn[];

const FLUID_SHIFT_COLUMNS = [
  { key: 'type', label: 'Vía / tipo', width: '40%' },
  { key: 'morning', label: 'Turno M', width: '20%' },
  { key: 'afternoon', label: 'Turno T', width: '20%' },
  { key: 'night', label: 'Turno N', width: '20%' },
] as const satisfies readonly PaperTableColumn[];

const CONSULT_COLUMNS = [
  { key: 'num', label: 'N°', width: '8%' },
  { key: 'service', label: 'Servicio', width: '30%' },
  { key: 'date', label: 'Fecha', width: '22%' },
  { key: 'status', label: 'Estado', width: '20%' },
  { key: 'priority', label: 'Prioridad', width: '20%' },
] as const satisfies readonly PaperTableColumn[];

const PROCEDURE_COLUMNS = [
  { key: 'procedure', label: 'Procedimiento', width: '30%' },
  { key: 'datetime', label: 'Fecha / hora', width: '20%' },
  { key: 'operator', label: 'Operador', width: '20%' },
  { key: 'notes', label: 'Descripción / complicaciones', width: '30%' },
] as const satisfies readonly PaperTableColumn[];

const MONITOR_COLUMNS = [
  { key: 'param', label: 'Parámetro', width: '25%' },
  { key: 't06', label: '06:00', width: '15%' },
  { key: 't10', label: '10:00', width: '15%' },
  { key: 't14', label: '14:00', width: '15%' },
  { key: 't18', label: '18:00', width: '15%' },
  { key: 't22', label: '22:00', width: '15%' },
] as const satisfies readonly PaperTableColumn[];

const IMAGING_REQUEST_COLUMNS = [
  { key: 'exam', label: 'Examen', width: '30%' },
  { key: 'requested', label: 'F. solicitud', width: '18%' },
  { key: 'performed', label: 'F. realización', width: '18%' },
  { key: 'urgency', label: 'Urgencia', width: '17%' },
  { key: 'status', label: 'Estado', width: '17%' },
] as const satisfies readonly PaperTableColumn[];

const CONSENT_PROCEDURE_COLUMNS = [
  { key: 'procedure', label: 'Procedimiento', width: '30%' },
  { key: 'infoDate', label: 'Fecha info.', width: '18%' },
  { key: 'physician', label: 'Médico informante', width: '22%' },
  { key: 'signature', label: 'Firma paciente', width: '15%' },
  { key: 'status', label: 'Estado', width: '15%' },
] as const satisfies readonly PaperTableColumn[];

const SOCIAL_SUPPORT_COLUMNS = [
  { key: 'name', label: 'Familiar / cuidador', width: '25%' },
  { key: 'relation', label: 'Parentesco', width: '18%' },
  { key: 'phone', label: 'Teléfono', width: '20%' },
  { key: 'availability', label: 'Disponibilidad', width: '22%' },
  { key: 'primary', label: 'Cuidador principal', width: '15%' },
] as const satisfies readonly PaperTableColumn[];

const SOCIAL_PLAN_COLUMNS = [
  { key: 'intervention', label: 'Intervención', width: '28%' },
  { key: 'goal', label: 'Objetivo', width: '28%' },
  { key: 'owner', label: 'Responsable', width: '20%' },
  { key: 'date', label: 'Fecha', width: '12%' },
  { key: 'status', label: 'Estado', width: '12%' },
] as const satisfies readonly PaperTableColumn[];

function emptyRows(columns: readonly PaperTableColumn[], count: number) {
  return Array.from({ length: count }, () =>
    Object.fromEntries(columns.map((col) => [col.key, ''])),
  );
}

type SectionChromeProps = {
  sectionId: PaperChartSectionId;
  patientName: string;
  recordNumber: string;
  patientStrip?: Omit<PaperPatientStripProps, 'patientName' | 'recordNumber'> | undefined;
};

/** Subestructura visual FichaPapel por sección (decorativa; SoT sigue en textarea). */
export function PaperSectionChrome({
  sectionId,
  patientName,
  recordNumber,
  patientStrip,
}: SectionChromeProps) {
  switch (sectionId) {
    case 'cover':
      return (
        <>
          <PaperSubSection
            title={copy.chartModes.paperSubCoverId}
            testId="epis2-paper-sub-cover-id"
          >
            <PaperFieldRow
              testId="epis2-paper-cover-identification"
              fields={[
                { label: copy.chartModes.paperStripPatient, value: patientName, wide: true },
                {
                  label: copy.chartModes.identityRun,
                  value: patientStrip?.nationalId ?? recordNumber,
                },
                {
                  label: copy.chartModes.identityAge,
                  value: patientStrip?.ageYears ? `${patientStrip.ageYears} años` : '—',
                },
                { label: copy.chartModes.identitySex, value: patientStrip?.sexLabel ?? '—' },
              ]}
            />
          </PaperSubSection>
          <PaperSubSection
            title={copy.chartModes.paperSubCoverAdmission}
            testId="epis2-paper-sub-cover-admission"
          >
            <PaperFieldRow
              fields={[
                {
                  label: copy.chartModes.identityService,
                  value: patientStrip?.serviceUnit ?? copy.chartModes['shellServiceDefault'],
                },
                { label: copy.chartModes.identityBed, value: patientStrip?.bedLabel ?? '—' },
                {
                  label: copy.chartModes.identityAdmission,
                  value: patientStrip?.admissionDate ?? '—',
                },
                { label: copy.chartModes.paperFormLabel, value: recordNumber },
              ]}
            />
          </PaperSubSection>
          <PaperSubSection title={copy.chartModes.paperSubCoverNotes}>
            <PaperRuleBlock lines={2} testId="epis2-paper-cover-rule-hint" />
          </PaperSubSection>
        </>
      );
    case 'anamnesis':
      return (
        <PaperSubSection
          title={copy.chartModes.paperSubAnamnesisIllness}
          testId="epis2-paper-sub-anamnesis"
        >
          <PaperRuleBlock lines={1} />
        </PaperSubSection>
      );
    case 'physicalExam':
      return (
        <PaperSubSection title={copy.chartModes.paperSubExamSystems} testId="epis2-paper-sub-exam">
          <PaperRuleBlock lines={1} />
        </PaperSubSection>
      );
    case 'orders':
      return (
        <PaperSubSection
          title={copy.chartModes.paperSubOrdersActive}
          testId="epis2-paper-sub-orders"
        >
          <PaperRuleBlock lines={2} />
        </PaperSubSection>
      );
    case 'soap':
      return (
        <PaperSubSection title={copy.chartModes.paperSubSoapDay} testId="epis2-paper-sub-soap">
          <PaperRuleBlock lines={1} />
        </PaperSubSection>
      );
    case 'labs':
      return (
        <PaperSubSection title={copy.chartModes.paperSubLabsGrid} testId="epis2-paper-sub-labs">
          <PaperTable
            testId="epis2-paper-labs-table"
            columns={LAB_TABLE_COLUMNS}
            rows={emptyRows(LAB_TABLE_COLUMNS, 4)}
          />
        </PaperSubSection>
      );
    case 'discharge':
      return (
        <>
          <PaperSubSection
            title={copy.chartModes.paperSubDischargePlan}
            testId="epis2-paper-sub-discharge"
          >
            <PaperRuleBlock lines={2} label={copy.chartModes.paperSubDischargeInstructions} />
          </PaperSubSection>
          <PaperSignatureBlock
            testId="epis2-paper-discharge-signatures"
            signatures={[
              { label: copy.chartModes.paperSignAttending },
              { label: copy.chartModes.paperSignResident },
              { label: copy.chartModes.paperSignNursing },
            ]}
          />
        </>
      );
    case 'nursing':
      return (
        <>
          <PaperSubSection
            title={copy.chartModes.paperSubNursingNanda}
            testId="epis2-paper-sub-nursing-nanda"
          >
            <PaperTable
              testId="epis2-paper-nursing-nanda-table"
              columns={NURSING_NANDA_COLUMNS}
              rows={emptyRows(NURSING_NANDA_COLUMNS, 4)}
            />
          </PaperSubSection>
          <PaperSubSection
            title={copy.chartModes.paperSubNursingBraden}
            testId="epis2-paper-sub-nursing-braden"
          >
            <PaperTable
              testId="epis2-paper-nursing-braden-table"
              columns={NURSING_SCALE_COLUMNS}
              rows={emptyRows(NURSING_SCALE_COLUMNS, 4)}
            />
          </PaperSubSection>
          <PaperSubSection
            title={copy.chartModes.paperSubNursingMorse}
            testId="epis2-paper-sub-nursing-morse"
          >
            <PaperTable
              testId="epis2-paper-nursing-morse-table"
              columns={NURSING_SCALE_COLUMNS}
              rows={emptyRows(NURSING_SCALE_COLUMNS, 4)}
            />
          </PaperSubSection>
          <PaperSubSection
            title={copy.chartModes.paperSubNursingActivities}
            testId="epis2-paper-sub-nursing-activities"
          >
            <PaperTable
              testId="epis2-paper-nursing-activities-table"
              columns={NURSING_ACTIVITY_COLUMNS}
              rows={emptyRows(NURSING_ACTIVITY_COLUMNS, 4)}
            />
          </PaperSubSection>
          <PaperSubSection
            title={copy.chartModes.paperSubNursingEducation}
            testId="epis2-paper-sub-nursing-education"
          >
            <PaperTable
              testId="epis2-paper-nursing-education-table"
              columns={NURSING_EDUCATION_COLUMNS}
              rows={emptyRows(NURSING_EDUCATION_COLUMNS, 3)}
            />
          </PaperSubSection>
        </>
      );
    case 'fluidBalance':
      return (
        <>
          <PaperSubSection
            title={copy.chartModes.paperSubFluidIntake}
            testId="epis2-paper-sub-fluid-intake"
          >
            <PaperTable
              testId="epis2-paper-fluid-intake-table"
              columns={FLUID_SHIFT_COLUMNS}
              rows={emptyRows(FLUID_SHIFT_COLUMNS, 4)}
            />
          </PaperSubSection>
          <PaperSubSection
            title={copy.chartModes.paperSubFluidOutput}
            testId="epis2-paper-sub-fluid-output"
          >
            <PaperTable
              testId="epis2-paper-fluid-output-table"
              columns={FLUID_SHIFT_COLUMNS}
              rows={emptyRows(FLUID_SHIFT_COLUMNS, 4)}
            />
          </PaperSubSection>
          <PaperSubSection
            title={copy.chartModes.paperSubFluidNotes}
            testId="epis2-paper-sub-fluid-notes"
          >
            <PaperRuleBlock lines={3} />
          </PaperSubSection>
        </>
      );
    case 'consults':
      return (
        <>
          <PaperSubSection
            title={copy.chartModes.paperSubConsultsActive}
            testId="epis2-paper-sub-consults"
          >
            <PaperTable
              testId="epis2-paper-consults-table"
              columns={CONSULT_COLUMNS}
              rows={emptyRows(CONSULT_COLUMNS, 3)}
            />
            <PaperRuleBlock lines={2} label="Respuesta / observaciones" />
          </PaperSubSection>
          <PaperSubSection
            title={copy.chartModes.paperSubConsultsNew}
            testId="epis2-paper-sub-consults-new"
          >
            <PaperFieldRow
              fields={[
                { label: 'Servicio solicitado', value: '' },
                { label: 'Fecha', value: '' },
                { label: 'Prioridad', value: '' },
              ]}
            />
            <PaperRuleBlock lines={4} label="Motivo de interconsulta" />
          </PaperSubSection>
        </>
      );
    case 'procedures':
      return (
        <>
          <PaperSubSection
            title={copy.chartModes.paperSubProceduresMinor}
            testId="epis2-paper-sub-procedures-minor"
          >
            <PaperTable
              testId="epis2-paper-procedures-minor-table"
              columns={PROCEDURE_COLUMNS}
              rows={emptyRows(PROCEDURE_COLUMNS, 4)}
            />
          </PaperSubSection>
          <PaperSubSection
            title={copy.chartModes.paperSubProceduresSurgical}
            testId="epis2-paper-sub-procedures-surgical"
          >
            <PaperFieldRow
              fields={[
                { label: 'Tipo de intervención', value: '' },
                { label: 'Fecha programada', value: '' },
                { label: 'Cirujano principal', value: '' },
                { label: 'Anestesiólogo', value: '' },
              ]}
            />
            <PaperRuleBlock lines={4} label="Descripción de la técnica" />
          </PaperSubSection>
          <PaperSubSection
            title={copy.chartModes.paperSubProceduresMonitor}
            testId="epis2-paper-sub-procedures-monitor"
          >
            <PaperTable
              testId="epis2-paper-procedures-monitor-table"
              columns={MONITOR_COLUMNS}
              rows={emptyRows(MONITOR_COLUMNS, 4)}
            />
          </PaperSubSection>
        </>
      );
    case 'imaging':
      return (
        <>
          <PaperSubSection
            title={copy.chartModes.paperSubImagingRequests}
            testId="epis2-paper-sub-imaging-requests"
          >
            <PaperTable
              testId="epis2-paper-imaging-requests-table"
              columns={IMAGING_REQUEST_COLUMNS}
              rows={emptyRows(IMAGING_REQUEST_COLUMNS, 4)}
            />
          </PaperSubSection>
          <PaperSubSection
            title={copy.chartModes.paperSubImagingReport}
            testId="epis2-paper-sub-imaging-report"
          >
            <PaperFieldRow
              fields={[
                { label: 'Examen', value: '' },
                { label: 'Fecha', value: '' },
                { label: 'Radiólogo', value: '' },
              ]}
            />
            <PaperRuleBlock lines={4} label="Hallazgos" />
            <PaperRuleBlock lines={2} label="Conclusión" />
          </PaperSubSection>
        </>
      );
    case 'consent':
      return (
        <>
          <PaperSubSection
            title={copy.chartModes.paperSubConsentAdmission}
            testId="epis2-paper-sub-consent-admission"
          >
            <PaperRuleBlock lines={6} />
          </PaperSubSection>
          <PaperSubSection
            title={copy.chartModes.paperSubConsentProcedures}
            testId="epis2-paper-sub-consent-procedures"
          >
            <PaperTable
              testId="epis2-paper-consent-procedures-table"
              columns={CONSENT_PROCEDURE_COLUMNS}
              rows={emptyRows(CONSENT_PROCEDURE_COLUMNS, 3)}
            />
          </PaperSubSection>
          <PaperSignatureBlock
            testId="epis2-paper-consent-signatures"
            signatures={[
              { label: copy.chartModes.paperSignPatientConsent },
              { label: copy.chartModes.paperSignAttending },
            ]}
          />
        </>
      );
    case 'socialWork':
      return (
        <>
          <PaperSubSection
            title={copy.chartModes.paperSubSocialIdentity}
            testId="epis2-paper-sub-social-identity"
          >
            <PaperFieldRow
              fields={[
                { label: copy.chartModes.paperStripPatient, value: patientName, wide: true },
                {
                  label: copy.chartModes.identityRun,
                  value: patientStrip?.nationalId ?? recordNumber,
                },
                { label: 'Estado civil', value: '' },
                { label: 'Ocupación', value: '' },
                { label: 'Dirección', value: '' },
                { label: 'Teléfono contacto', value: '' },
              ]}
            />
          </PaperSubSection>
          <PaperSubSection
            title={copy.chartModes.paperSubSocialSupport}
            testId="epis2-paper-sub-social-support"
          >
            <PaperTable
              testId="epis2-paper-social-support-table"
              columns={SOCIAL_SUPPORT_COLUMNS}
              rows={emptyRows(SOCIAL_SUPPORT_COLUMNS, 3)}
            />
          </PaperSubSection>
          <PaperSubSection
            title={copy.chartModes.paperSubSocialAssessment}
            testId="epis2-paper-sub-social-assessment"
          >
            <PaperFieldRow
              fields={[
                { label: 'Vivienda', value: '' },
                { label: 'Ingresos familiares', value: '' },
                { label: 'Barreras de acceso', value: '' },
                { label: 'Evaluación riesgo social', value: '' },
              ]}
            />
          </PaperSubSection>
          <PaperSubSection
            title={copy.chartModes.paperSubSocialDiagnosis}
            testId="epis2-paper-sub-social-diagnosis"
          >
            <PaperRuleBlock lines={4} />
          </PaperSubSection>
          <PaperSubSection
            title={copy.chartModes.paperSubSocialPlan}
            testId="epis2-paper-sub-social-plan"
          >
            <PaperTable
              testId="epis2-paper-social-plan-table"
              columns={SOCIAL_PLAN_COLUMNS}
              rows={emptyRows(SOCIAL_PLAN_COLUMNS, 3)}
            />
          </PaperSubSection>
          <PaperSignatureBlock
            testId="epis2-paper-social-signatures"
            signatures={[{ label: copy.chartModes.paperSignSocialWorker }]}
          />
        </>
      );
    default:
      return null;
  }
}
