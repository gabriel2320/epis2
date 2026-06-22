"use client";

import { FormEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { createPatient, type NewPatient } from "@/lib/api";

export function PatientForm() {
  const router = useRouter();
  const [form, setForm] = useState<NewPatient>({
    first_name: "",
    last_name: "",
    preferred_name: "",
    birth_date: "1990-01-01",
    sex_at_birth: "unknown",
    clinical_identifier: "",
    contact_phone: "",
    email: "",
  });

  const mutation = useMutation({
    mutationFn: createPatient,
    onSuccess: (patient) => router.push(`/pacientes/${patient.id}/ficha`),
  });

  function update<K extends keyof NewPatient>(key: K, value: NewPatient[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    mutation.mutate(form);
  }

  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/pacientes"
          className="mb-5 inline-flex items-center gap-2 rounded-[8px] px-3 py-2 text-sm font-semibold text-graphite-600 transition hover:bg-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a pacientes
        </Link>
        <motion.form
          onSubmit={submit}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[8px] border border-white bg-white/86 p-6 shadow-cockpit"
        >
          <div className="mb-7">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-pulse-teal">
              Nuevo paciente sintetico
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-graphite-950">Ficha base auditable</h1>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Nombre" value={form.first_name} onChange={(value) => update("first_name", value)} />
            <Field label="Apellido" value={form.last_name} onChange={(value) => update("last_name", value)} />
            <Field
              label="Nombre social"
              value={form.preferred_name ?? ""}
              onChange={(value) => update("preferred_name", value)}
            />
            <Field
              label="Identificador clinico"
              value={form.clinical_identifier ?? ""}
              onChange={(value) => update("clinical_identifier", value)}
            />
            <Field
              label="Fecha nacimiento"
              value={form.birth_date}
              type="date"
              onChange={(value) => update("birth_date", value)}
            />
            <label>
              <span className="mb-2 block text-sm font-semibold text-graphite-700">Sexo registrado</span>
              <select
                value={form.sex_at_birth}
                onChange={(event) => update("sex_at_birth", event.target.value as NewPatient["sex_at_birth"])}
                className="w-full rounded-[8px] border border-graphite-200 bg-white px-3 py-3 outline-none ring-pulse-teal/30 focus:ring-4"
              >
                <option value="unknown">No informado</option>
                <option value="female">Femenino</option>
                <option value="male">Masculino</option>
                <option value="intersex">Intersex</option>
              </select>
            </label>
            <Field
              label="Telefono"
              value={form.contact_phone ?? ""}
              onChange={(value) => update("contact_phone", value)}
            />
            <Field label="Email" value={form.email ?? ""} onChange={(value) => update("email", value)} />
          </div>
          {mutation.error ? (
            <p className="mt-5 rounded-[8px] bg-rose-50 px-3 py-2 text-sm font-semibold text-pulse-rose">
              {mutation.error instanceof Error ? mutation.error.message : "No fue posible crear paciente"}
            </p>
          ) : null}
          <div className="mt-7 flex justify-end">
            <button
              disabled={mutation.isPending}
              className="inline-flex items-center gap-2 rounded-[8px] bg-graphite-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-graphite-700 disabled:opacity-60"
            >
              <Save className="h-4 w-4" />
              {mutation.isPending ? "Guardando..." : "Crear ficha"}
            </button>
          </div>
        </motion.form>
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  type?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label>
      <span className="mb-2 block text-sm font-semibold text-graphite-700">{label}</span>
      <input
        value={value}
        type={type}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-[8px] border border-graphite-200 bg-white px-3 py-3 outline-none ring-pulse-teal/30 focus:ring-4"
      />
    </label>
  );
}
