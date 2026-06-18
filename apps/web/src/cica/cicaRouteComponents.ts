import type { RouteComponent } from '@tanstack/react-router';
import type { CicaScreenId } from '@epis2/epis2-ui';
import { CicaPatientSearchPage } from './CicaPatientSearchPage.js';
import { CicaCensusPage } from './CicaCensusPage.js';
import { CicaPatientSummaryPage } from './CicaPatientSummaryPage.js';
import { CicaPatientMedicationsPage } from './CicaPatientMedicationsPage.js';
import { CicaPatientAuditPage } from './CicaPatientAuditPage.js';
import { CicaPatientAdmissionPage } from './CicaPatientAdmissionPage.js';
import { CicaPatientDemoSectionRoutePage } from './CicaPatientDemoSectionRoutePage.js';
import { CicaPatientEvolutionsPage } from './CicaPatientEvolutionsPage.js';
import { CicaPatientDocumentsPage } from './CicaPatientDocumentsPage.js';
import { CicaPatientOrdersPage } from './CicaPatientOrdersPage.js';
import { CicaPatientExamsPage } from './CicaPatientExamsPage.js';
import { CicaNewEvolutionPage } from './CicaNewEvolutionPage.js';
import { CicaNewEpicrisisPage } from './CicaNewEpicrisisPage.js';
import { CicaNewPrescriptionPage } from './CicaNewPrescriptionPage.js';
import { CicaNewDocumentPage } from './CicaNewDocumentPage.js';
import { CicaPaperDayPage } from './CicaPaperDayPage.js';
import { CicaEvolutionBookPage } from './CicaEvolutionBookPage.js';
import { CicaEvolutionDetailPage } from './CicaEvolutionDetailPage.js';
import { CicaPaperBookPage } from './CicaPaperBookPage.js';
import {
  CicaAgendaPage,
  CicaMyWorkPage,
  CicaPatientTimelinePage,
  CicaRecentPatientsPage,
} from './CicaSystemScreens.js';

/** Mapa screenId → componente — SoT wiring web (MF-PONY-06). */
export const CICA_ROUTE_COMPONENTS: Record<CicaScreenId, RouteComponent> = {
  'patient-search': CicaPatientSearchPage,
  census: CicaCensusPage,
  'recent-patients': CicaRecentPatientsPage,
  'my-work': CicaMyWorkPage,
  agenda: CicaAgendaPage,
  'patient-summary': CicaPatientSummaryPage,
  'new-evolution': CicaNewEvolutionPage,
  'evolution-book': CicaEvolutionBookPage,
  'evolution-detail': CicaEvolutionDetailPage,
  'patient-evolutions': CicaPatientEvolutionsPage,
  'new-prescription': CicaNewPrescriptionPage,
  'patient-orders': CicaPatientOrdersPage,
  'patient-exams': CicaPatientExamsPage,
  'patient-admission': CicaPatientAdmissionPage,
  'patient-medications': CicaPatientMedicationsPage,
  'patient-interconsultas': CicaPatientDemoSectionRoutePage,
  'patient-procedures': CicaPatientDemoSectionRoutePage,
  'patient-discharge': CicaPatientDemoSectionRoutePage,
  'patient-timeline': CicaPatientTimelinePage,
  'patient-audit': CicaPatientAuditPage,
  'patient-documents': CicaPatientDocumentsPage,
  'new-document': CicaNewDocumentPage,
  'new-epicrisis': CicaNewEpicrisisPage,
  'paper-day': CicaPaperDayPage,
  'paper-book': CicaPaperBookPage,
};
