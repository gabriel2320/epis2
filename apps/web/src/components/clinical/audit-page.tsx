"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { motion } from "motion/react";
import { ShieldCheck } from "lucide-react";
import { listAuditEvents } from "@/lib/api";
import { formatDateTime } from "@/lib/format";

export function AuditPage({ patientId }: { patientId: string }) {
  const audit = useQuery({
    queryKey: ["patient-audit", patientId],
    queryFn: () => listAuditEvents(patientId),
  });

  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto max-w-5xl">
        <Link
          href={`/pacientes/${patientId}/ficha`}
          className="mb-5 inline-block rounded-[8px] px-3 py-2 text-sm font-semibold text-graphite-600 transition hover:bg-white"
        >
          Volver a ficha
        </Link>
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[8px] border border-white bg-white/86 p-6 shadow-cockpit"
        >
          <div className="mb-6 flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-[8px] bg-graphite-950 text-white">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-pulse-teal">
                Trazabilidad
              </p>
              <h1 className="text-2xl font-semibold text-graphite-950">Auditoria del paciente</h1>
            </div>
          </div>
          <div className="space-y-3">
            {audit.isLoading ? (
              <div className="h-20 animate-pulse rounded-[8px] bg-graphite-100" />
            ) : audit.data?.length ? (
              audit.data.map((event) => (
                <article key={event.id} className="rounded-[8px] border border-graphite-100 bg-white p-4">
                  <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
                    <div>
                      <p className="text-sm font-semibold text-graphite-950">{event.action}</p>
                      <p className="text-xs text-graphite-500">{formatDateTime(event.created_at)}</p>
                    </div>
                    <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-pulse-teal">
                      {event.actor_id}
                    </span>
                  </div>
                </article>
              ))
            ) : (
              <p className="rounded-[8px] border border-dashed border-graphite-200 p-6 text-sm text-graphite-500">
                Sin eventos de auditoria para este paciente.
              </p>
            )}
          </div>
        </motion.section>
      </div>
    </main>
  );
}
