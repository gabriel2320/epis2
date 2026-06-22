"use client";

import { FormEvent, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";
import { CheckCircle2, FilePlus2, X } from "lucide-react";
import { createSoapEntry, type NewSoapEntry } from "@/lib/api";

const emptyForm: NewSoapEntry = {
  title: "Evolucion SOAP",
  subjective: "",
  objective: "",
  assessment: "",
  plan: "",
};

export function SoapEntryPanel({
  patientId,
  onClose,
  embedded = false,
}: {
  patientId: string;
  onClose?: () => void;
  embedded?: boolean;
}) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<NewSoapEntry>(emptyForm);
  const mutation = useMutation({
    mutationFn: () => createSoapEntry(patientId, form),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["patient-record", patientId] });
      await queryClient.invalidateQueries({ queryKey: ["patient-audit", patientId] });
      setForm(emptyForm);
      onClose?.();
    },
  });

  function update<K extends keyof NewSoapEntry>(key: K, value: NewSoapEntry[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    mutation.mutate();
  }

  return (
    <motion.form
      onSubmit={submit}
      initial={{ opacity: 0, x: embedded ? 0 : 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: embedded ? 0 : 24 }}
      className="rounded-[8px] border border-teal-100 bg-white p-5 shadow-rail"
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-pulse-teal">
            Borrador auditado
          </p>
          <h2 className="mt-1 text-xl font-semibold text-graphite-950">Nueva evolucion SOAP</h2>
        </div>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="rounded-[8px] p-2 text-graphite-500 transition hover:bg-graphite-100"
            aria-label="Cerrar panel SOAP"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>
      <label className="mb-4 block">
        <span className="mb-2 block text-sm font-semibold text-graphite-700">Titulo</span>
        <input
          value={form.title}
          onChange={(event) => update("title", event.target.value)}
          className="w-full rounded-[8px] border border-graphite-200 px-3 py-2 outline-none ring-pulse-teal/30 focus:ring-4"
        />
      </label>
      <div className="grid gap-3">
        <SoapBox label="Subjetivo" value={form.subjective} onChange={(value) => update("subjective", value)} />
        <SoapBox label="Objetivo" value={form.objective} onChange={(value) => update("objective", value)} />
        <SoapBox label="Analisis" value={form.assessment} onChange={(value) => update("assessment", value)} />
        <SoapBox label="Plan" value={form.plan} onChange={(value) => update("plan", value)} />
      </div>
      {mutation.isSuccess ? (
        <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-pulse-teal">
          <CheckCircle2 className="h-4 w-4" />
          Borrador registrado
        </p>
      ) : null}
      {mutation.error ? (
        <p className="mt-4 text-sm font-semibold text-pulse-rose">
          {mutation.error instanceof Error ? mutation.error.message : "No fue posible guardar"}
        </p>
      ) : null}
      <button
        disabled={mutation.isPending}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-[8px] bg-graphite-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-graphite-700 disabled:opacity-60"
      >
        <FilePlus2 className="h-4 w-4" />
        {mutation.isPending ? "Guardando..." : "Guardar borrador SOAP"}
      </button>
    </motion.form>
  );
}

function SoapBox({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label>
      <span className="mb-2 block text-sm font-semibold text-graphite-700">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={3}
        className="w-full resize-none rounded-[8px] border border-graphite-200 px-3 py-2 outline-none ring-pulse-teal/30 focus:ring-4"
      />
    </label>
  );
}
