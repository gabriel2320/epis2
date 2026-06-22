"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { getPatientRecord } from "@/lib/api";
import { formatDate, formatDateTime } from "@/lib/format";

export function PrintRecord({ patientId }: { patientId: string }) {
  const record = useQuery({
    queryKey: ["patient-record", patientId],
    queryFn: () => getPatientRecord(patientId),
  });

  if (record.isLoading) {
    return <main className="p-10">Cargando ficha imprimible...</main>;
  }

  if (!record.data) {
    return <main className="p-10">No fue posible abrir la ficha.</main>;
  }

  const { patient } = record.data;
  return (
    <main className="min-h-screen bg-white p-10 text-graphite-950">
      <div className="mx-auto max-w-4xl">
        <Link href={`/pacientes/${patientId}/ficha`} className="print:hidden text-sm font-semibold text-pulse-teal">
          Volver a ficha
        </Link>
        <header className="mt-5 border-b border-graphite-200 pb-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-graphite-500">EPIS2</p>
          <h1 className="mt-2 text-3xl font-semibold">Ficha clinica resumida</h1>
          <p className="mt-2 text-sm text-graphite-600">
            Documento de desarrollo / no uso clinico real.
          </p>
        </header>
        <section className="grid gap-4 border-b border-graphite-200 py-5 md:grid-cols-2">
          <PrintField label="Paciente" value={`${patient.first_name} ${patient.last_name}`} />
          <PrintField label="Identificador" value={patient.clinical_identifier ?? "sin identificador"} />
          <PrintField label="Nacimiento" value={formatDate(patient.birth_date)} />
          <PrintField label="Estado" value={patient.clinical_status} />
        </section>
        <section className="py-5">
          <h2 className="text-xl font-semibold">Evoluciones recientes</h2>
          <div className="mt-4 space-y-4">
            {record.data.recent_entries.map((entry) => (
              <article key={entry.id} className="rounded-[8px] border border-graphite-200 p-4">
                <p className="text-sm font-semibold">{entry.title}</p>
                <p className="text-xs text-graphite-500">{formatDateTime(entry.occurred_at)}</p>
                <p className="mt-3 text-sm">S: {entry.subjective || "sin dato"}</p>
                <p className="text-sm">O: {entry.objective || "sin dato"}</p>
                <p className="text-sm">A: {entry.assessment || "sin dato"}</p>
                <p className="text-sm">P: {entry.plan || "sin dato"}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function PrintField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-graphite-500">{label}</p>
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}
