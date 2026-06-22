import { SoapEntryPanel } from "@/components/clinical/soap-entry-panel";
import Link from "next/link";

export default async function NewEvolutionPage({ params }: { params: Promise<{ patientId: string }> }) {
  const { patientId } = await params;
  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto max-w-3xl">
        <Link
          href={`/pacientes/${patientId}/ficha`}
          className="mb-5 inline-block rounded-[8px] px-3 py-2 text-sm font-semibold text-graphite-600 transition hover:bg-white"
        >
          Volver a ficha
        </Link>
        <SoapEntryPanel patientId={patientId} embedded />
      </div>
    </main>
  );
}
