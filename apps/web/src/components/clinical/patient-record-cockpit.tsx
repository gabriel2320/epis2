"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  AlertTriangle,
  ClipboardList,
  FilePlus2,
  HeartPulse,
  Pill,
  Printer,
  ShieldCheck,
  Sparkles,
  Stethoscope,
} from "lucide-react";
import { getPatientRecord, type ClinicalEntry, type PatientRecord } from "@/lib/api";
import { formatDate, formatDateTime, initials } from "@/lib/format";
import { SoapEntryPanel } from "./soap-entry-panel";

export function PatientRecordCockpit({ patientId }: { patientId: string }) {
  const [panelOpen, setPanelOpen] = useState(false);
  const record = useQuery({
    queryKey: ["patient-record", patientId],
    queryFn: () => getPatientRecord(patientId),
  });

  if (record.isLoading) {
    return <RecordSkeleton />;
  }

  if (record.error || !record.data) {
    return (
      <main className="grid min-h-screen place-items-center p-6">
        <div className="rounded-[8px] border border-rose-200 bg-white p-6 text-center shadow-cockpit">
          <p className="text-xl font-semibold text-pulse-rose">No fue posible abrir la ficha</p>
          <Link className="mt-4 inline-block rounded-[8px] bg-graphite-950 px-4 py-2 text-white" href="/pacientes">
            Volver
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4 lg:p-6">
      <div className="mx-auto max-w-[1540px]">
        <RecordHeader record={record.data} onNewSoap={() => setPanelOpen(true)} />
        <section className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1fr)_370px]">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[8px] border border-white bg-white/82 p-5 shadow-cockpit"
          >
            <TabStrip patientId={patientId} />
            <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
              <Timeline entries={record.data.recent_entries} />
              <ClinicalSignals record={record.data} />
            </div>
          </motion.div>
          <ContextRail record={record.data} patientId={patientId} />
        </section>
      </div>
      <AnimatePresence>
        {panelOpen ? (
          <motion.div
            className="fixed inset-0 z-50 grid justify-end bg-graphite-950/28 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="w-full max-w-xl self-stretch overflow-y-auto">
              <SoapEntryPanel patientId={patientId} onClose={() => setPanelOpen(false)} />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </main>
  );
}

function RecordHeader({ record, onNewSoap }: { record: PatientRecord; onNewSoap: () => void }) {
  const { patient } = record;
  return (
    <motion.header
      initial={{ opacity: 0, y: -14 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[8px] border border-white bg-graphite-950 p-5 text-white shadow-cockpit"
    >
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
        <div className="flex items-center gap-4">
          <div className="grid h-16 w-16 place-items-center rounded-[8px] bg-white text-xl font-semibold text-graphite-950">
            {initials(patient.first_name, patient.last_name)}
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-200">Ficha longitudinal</p>
            <h1 className="mt-1 text-3xl font-semibold">
              {patient.first_name} {patient.last_name}
            </h1>
            <p className="mt-1 text-sm text-graphite-200">
              {patient.clinical_identifier ?? "sin identificador"} · nacido {formatDate(patient.birth_date)}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/print/pacientes/${patient.id}/ficha`}
            className="inline-flex items-center gap-2 rounded-[8px] bg-white/10 px-4 py-3 text-sm font-semibold transition hover:bg-white/18"
          >
            <Printer className="h-4 w-4" />
            Print
          </Link>
          <Link
            href={`/pacientes/${patient.id}/auditoria`}
            className="inline-flex items-center gap-2 rounded-[8px] bg-white/10 px-4 py-3 text-sm font-semibold transition hover:bg-white/18"
          >
            <ShieldCheck className="h-4 w-4" />
            Auditoria
          </Link>
          <button
            onClick={onNewSoap}
            className="inline-flex items-center gap-2 rounded-[8px] bg-pulse-teal px-4 py-3 text-sm font-semibold text-white transition hover:brightness-110"
          >
            <FilePlus2 className="h-4 w-4" />
            Nueva SOAP
          </button>
        </div>
      </div>
    </motion.header>
  );
}

function TabStrip({ patientId }: { patientId: string }) {
  const items = [
    ["Timeline", Stethoscope],
    ["Problemas", AlertTriangle],
    ["Medicacion", Pill],
    ["Signos", HeartPulse],
    ["Auditoria", ShieldCheck],
    ["Papel", Printer],
  ] as const;
  return (
    <div className="flex flex-wrap gap-2">
      {items.map(([label, Icon], index) => {
        const href =
          label === "Auditoria"
            ? `/pacientes/${patientId}/auditoria`
            : label === "Papel"
              ? `/print/pacientes/${patientId}/ficha`
              : `/pacientes/${patientId}/ficha`;
        return (
          <Link
            key={label}
            href={href}
            className={`inline-flex items-center gap-2 rounded-[8px] px-3 py-2 text-sm font-semibold transition ${
              index === 0 ? "bg-graphite-950 text-white" : "bg-graphite-50 text-graphite-600 hover:bg-white"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        );
      })}
    </div>
  );
}

function Timeline({ entries }: { entries: ClinicalEntry[] }) {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-pulse-teal">
            Timeline vivo
          </p>
          <h2 className="text-2xl font-semibold text-graphite-950">Evoluciones recientes</h2>
        </div>
      </div>
      <div className="space-y-3">
        {entries.length ? (
          entries.map((entry, index) => <TimelineEntry key={entry.id} entry={entry} index={index} />)
        ) : (
          <div className="rounded-[8px] border border-dashed border-graphite-200 p-6 text-sm text-graphite-500">
            Sin evoluciones. Cree un borrador SOAP para activar la historia.
          </div>
        )}
      </div>
    </section>
  );
}

function TimelineEntry({ entry, index }: { entry: ClinicalEntry; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="rounded-[8px] border border-graphite-100 bg-white p-4 shadow-sm"
    >
      <div className="flex flex-col justify-between gap-2 md:flex-row md:items-start">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-graphite-400">
            {formatDateTime(entry.occurred_at)}
          </p>
          <h3 className="mt-1 text-lg font-semibold text-graphite-950">{entry.title}</h3>
        </div>
        <span className="w-fit rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-pulse-amber">
          {entry.status}
        </span>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <SoapSnippet label="S" text={entry.subjective} />
        <SoapSnippet label="O" text={entry.objective} />
        <SoapSnippet label="A" text={entry.assessment} />
        <SoapSnippet label="P" text={entry.plan} />
      </div>
    </motion.article>
  );
}

function SoapSnippet({ label, text }: { label: string; text?: string | null }) {
  return (
    <div className="rounded-[8px] bg-graphite-50 p-3">
      <p className="text-xs font-semibold text-pulse-teal">{label}</p>
      <p className="mt-1 text-sm leading-6 text-graphite-700">{text || "Sin dato registrado"}</p>
    </div>
  );
}

function ClinicalSignals({ record }: { record: PatientRecord }) {
  return (
    <aside className="space-y-3">
      <SignalCard
        icon={<HeartPulse className="h-4 w-4" />}
        title="Signos"
        text={
          record.latest_vitals
            ? `${record.latest_vitals.systolic_bp ?? "-"} / ${record.latest_vitals.diastolic_bp ?? "-"} · FC ${
                record.latest_vitals.heart_rate_bpm ?? "-"
              }`
            : "sin signos"
        }
      />
      <SignalCard
        icon={<AlertTriangle className="h-4 w-4" />}
        title="Problemas"
        text={record.active_problems.map((item) => item.title).join(", ") || "sin problemas activos"}
      />
      <SignalCard
        icon={<Pill className="h-4 w-4" />}
        title="Medicacion"
        text={record.active_medications.map((item) => item.name).join(", ") || "sin medicacion activa"}
      />
    </aside>
  );
}

function ContextRail({ record, patientId }: { record: PatientRecord; patientId: string }) {
  return (
    <motion.aside
      initial={{ opacity: 0, x: 18 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-4 rounded-[8px] border border-teal-100 bg-white/84 p-4 shadow-rail"
    >
      <SignalCard
        icon={<Activity className="h-4 w-4" />}
        title="Estado operacional"
        text={`${record.patient.clinical_status} · ${record.patient.current_care_context}`}
      />
      <SignalCard
        icon={<Sparkles className="h-4 w-4" />}
        title="IA opcional"
        text="Preparada para sugerir borradores sin escribir en ficha."
      />
      <SignalCard
        icon={<ClipboardList className="h-4 w-4" />}
        title="Trazabilidad"
        text="Los eventos de escritura quedan ligados al paciente y actor."
      />
      <Link
        href={`/pacientes/${patientId}/evoluciones/nueva`}
        className="block rounded-[8px] bg-graphite-950 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-graphite-700"
      >
        Abrir editor completo
      </Link>
    </motion.aside>
  );
}

function SignalCard({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="rounded-[8px] border border-graphite-100 bg-white p-4">
      <div className="mb-2 flex items-center gap-2 text-pulse-teal">
        {icon}
        <p className="text-sm font-semibold text-graphite-950">{title}</p>
      </div>
      <p className="text-sm leading-6 text-graphite-600">{text}</p>
    </div>
  );
}

function RecordSkeleton() {
  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto max-w-[1540px] space-y-4">
        <div className="h-32 animate-pulse rounded-[8px] bg-graphite-100" />
        <div className="grid gap-4 xl:grid-cols-[1fr_370px]">
          <div className="h-[680px] animate-pulse rounded-[8px] bg-graphite-100" />
          <div className="h-[680px] animate-pulse rounded-[8px] bg-graphite-100" />
        </div>
      </div>
    </main>
  );
}
