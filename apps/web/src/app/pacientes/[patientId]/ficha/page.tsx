import { PatientRecordCockpit } from "@/components/clinical/patient-record-cockpit";

export default async function PatientRecordPage({ params }: { params: Promise<{ patientId: string }> }) {
  const { patientId } = await params;
  return <PatientRecordCockpit patientId={patientId} />;
}
