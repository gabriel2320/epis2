import { AuditPage } from "@/components/clinical/audit-page";

export default async function PatientAuditPage({ params }: { params: Promise<{ patientId: string }> }) {
  const { patientId } = await params;
  return <AuditPage patientId={patientId} />;
}
