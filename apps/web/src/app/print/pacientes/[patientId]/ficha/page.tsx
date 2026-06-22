import { PrintRecord } from "@/components/clinical/print-record";

export default async function PrintPatientRecordPage({ params }: { params: Promise<{ patientId: string }> }) {
  const { patientId } = await params;
  return <PrintRecord patientId={patientId} />;
}
