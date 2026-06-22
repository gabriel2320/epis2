"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { Activity, FilePlus2, Search, ShieldCheck, Sparkles, UserRoundPlus } from "lucide-react";
import { listPatients, type Patient } from "@/lib/api";
import { formatDate, initials } from "@/lib/format";

export function PatientsCockpit() {
  const [query, setQuery] = useState("");
  const patients = useQuery({ queryKey: ["patients"], queryFn: listPatients });
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return patients.data ?? [];
    }
    return (patients.data ?? []).filter((patient) =>
      `${patient.first_name} ${patient.last_name} ${patient.clinical_identifier ?? ""}`
        .toLowerCase()
        .includes(normalized),
    );
  }, [patients.data, query]);
  const selected = filtered[0];

  return (
    <main className="min-h-screen p-4 lg:p-6">
      <div className="mx-auto max-w-[1540px]">
        <TopBar />
        <section className="cockpit-grid mt-5 gap-4">
          <motion.aside
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-[8px] border border-white bg-white/82 p-4 shadow-cockpit backdrop-blur"
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-pulse-teal">
                  Censo activo
                </p>
                <h1 className="text-2xl font-semibold text-graphite-950">Pacientes</h1>
              </div>
              <Link
                href="/pacientes/nuevo"
                className="grid h-10 w-10 place-items-center rounded-[8px] bg-graphite-950 text-white transition hover:bg-graphite-700"
                aria-label="Nuevo paciente"
              >
                <UserRoundPlus className="h-5 w-5" />
              </Link>
            </div>
            <label className="mb-4 flex items-center gap-2 rounded-[8px] border border-graphite-200 bg-white px-3 py-2">
              <Search className="h-4 w-4 text-graphite-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar paciente o identificador"
                className="min-w-0 flex-1 bg-transparent text-sm outline-none"
              />
            </label>
            <div className="space-y-2">
              {patients.isLoading ? (
                <SkeletonRows />
              ) : filtered.length ? (
                filtered.map((patient, index) => <PatientRow key={patient.id} patient={patient} active={index === 0} />)
              ) : (
                <p className="rounded-[8px] bg-graphite-50 p-4 text-sm text-graphite-500">
                  No hay pacientes para mostrar.
                </p>
              )}
            </div>
          </motion.aside>

          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="min-h-[720px] rounded-[8px] border border-white bg-white/78 p-5 shadow-cockpit backdrop-blur"
          >
            {selected ? <PatientPreview patient={selected} /> : <EmptyPreview />}
          </motion.section>

          <motion.aside
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.12 }}
            className="rounded-[8px] border border-teal-100 bg-white/82 p-4 shadow-rail backdrop-blur"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-pulse-teal">
              Rail contextual
            </p>
            <div className="mt-4 grid gap-3">
              <RailItem icon={<ShieldCheck className="h-4 w-4" />} title="Auditoria activa" text="Toda escritura pasa por API con actor y correlacion." />
              <RailItem icon={<Sparkles className="h-4 w-4" />} title="IA opcional" text="Asiste borradores; no firma ni aprueba datos clinicos." />
              <RailItem icon={<FilePlus2 className="h-4 w-4" />} title="Papel serio" text="Print visible, trazable y marcado como desarrollo cuando corresponde." />
            </div>
          </motion.aside>
        </section>
      </div>
    </main>
  );
}

function TopBar() {
  return (
    <header className="flex flex-col justify-between gap-4 rounded-[8px] border border-white bg-white/72 px-5 py-4 shadow-sm backdrop-blur lg:flex-row lg:items-center">
      <div className="flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-[8px] bg-graphite-950 text-white">
          <Activity className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-graphite-500">EPIS2</p>
          <h2 className="text-lg font-semibold text-graphite-950">Clinical Cockpit</h2>
        </div>
      </div>
      <nav className="flex flex-wrap gap-2 text-sm font-semibold text-graphite-600">
        <Link href="/pacientes" className="rounded-[8px] bg-graphite-950 px-3 py-2 text-white">Pacientes</Link>
        <Link href="/login" className="rounded-[8px] px-3 py-2 transition hover:bg-white">Sesion</Link>
      </nav>
    </header>
  );
}

function PatientRow({ patient, active }: { patient: Patient; active: boolean }) {
  return (
    <Link
      href={`/pacientes/${patient.id}/ficha`}
      className={`flex items-center gap-3 rounded-[8px] border p-3 transition ${
        active ? "border-teal-200 bg-teal-50/80" : "border-graphite-100 bg-white hover:border-teal-200"
      }`}
    >
      <div className="grid h-10 w-10 place-items-center rounded-[8px] bg-graphite-900 text-sm font-semibold text-white">
        {initials(patient.first_name, patient.last_name)}
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-graphite-950">
          {patient.first_name} {patient.last_name}
        </p>
        <p className="truncate text-xs text-graphite-500">{patient.clinical_identifier ?? "sin identificador"}</p>
      </div>
    </Link>
  );
}

function PatientPreview({ patient }: { patient: Patient }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-5 border-b border-graphite-100 pb-5">
        <div>
          <p className="text-sm font-semibold text-pulse-teal">Siguiente accion sugerida</p>
          <h2 className="mt-2 text-4xl font-semibold tracking-tight text-graphite-950">
            Abrir ficha longitudinal
          </h2>
          <p className="mt-3 max-w-2xl text-graphite-600">
            Revise estado, timeline, auditoria y cree una evolucion SOAP sin salir del contexto.
          </p>
        </div>
        <Link
          href={`/pacientes/${patient.id}/ficha`}
          className="rounded-[8px] bg-graphite-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-graphite-700"
        >
          Abrir ficha
        </Link>
      </div>
      <div className="grid flex-1 content-start gap-4 py-5 md:grid-cols-3">
        <Metric label="Estado" value={patient.clinical_status} tone="teal" />
        <Metric label="Contexto" value={patient.current_care_context} tone="amber" />
        <Metric label="Nacimiento" value={formatDate(patient.birth_date)} tone="rose" />
      </div>
      <div className="mt-auto rounded-[8px] bg-graphite-950 p-5 text-white">
        <p className="text-sm uppercase tracking-[0.18em] text-teal-200">Paciente seleccionado</p>
        <p className="mt-2 text-2xl font-semibold">
          {patient.first_name} {patient.last_name}
        </p>
      </div>
    </div>
  );
}

function Metric({ label, value, tone }: { label: string; value: string; tone: "teal" | "amber" | "rose" }) {
  const colors = {
    teal: "border-teal-200 bg-teal-50 text-pulse-teal",
    amber: "border-amber-200 bg-amber-50 text-pulse-amber",
    rose: "border-rose-200 bg-rose-50 text-pulse-rose",
  };
  return (
    <div className={`rounded-[8px] border p-4 ${colors[tone]}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.16em]">{label}</p>
      <p className="mt-2 text-lg font-semibold text-graphite-950">{value}</p>
    </div>
  );
}

function RailItem({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="rounded-[8px] border border-graphite-100 bg-white p-4">
      <div className="mb-3 flex items-center gap-2 text-pulse-teal">
        {icon}
        <p className="text-sm font-semibold text-graphite-950">{title}</p>
      </div>
      <p className="text-sm leading-6 text-graphite-600">{text}</p>
    </div>
  );
}

function SkeletonRows() {
  return (
    <div className="space-y-2">
      {[0, 1, 2].map((item) => (
        <div key={item} className="h-16 animate-pulse rounded-[8px] bg-graphite-100" />
      ))}
    </div>
  );
}

function EmptyPreview() {
  return (
    <div className="grid min-h-[600px] place-items-center rounded-[8px] border border-dashed border-graphite-200">
      <div className="max-w-sm text-center">
        <p className="text-2xl font-semibold text-graphite-950">Sin paciente activo</p>
        <p className="mt-2 text-sm leading-6 text-graphite-500">
          Cree un paciente sintetico para activar ficha, auditoria y evolucion.
        </p>
      </div>
    </div>
  );
}
