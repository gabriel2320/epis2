"use client";

import { motion } from "motion/react";
import { Activity, LockKeyhole, ShieldCheck } from "lucide-react";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api";

export function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("medico@epis2.local");
  const [password, setPassword] = useState("medico");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    try {
      await login(email, password);
      router.push("/pacientes");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No fue posible iniciar sesion");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white/70 px-4 py-2 text-sm font-semibold text-graphite-700 shadow-rail">
            <Activity className="h-4 w-4 text-pulse-teal" />
            Clinical Cockpit
          </div>
          <div className="max-w-2xl space-y-5">
            <h1 className="text-5xl font-semibold tracking-tight text-graphite-950">
              EPIS2 reconstruido para operar, no acumular capas.
            </h1>
            <p className="text-lg leading-8 text-graphite-700">
              Paciente, ficha, evolucion, auditoria y apoyo IA opcional en una superficie clinica
              compacta, expresiva y trazable.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {["PostgreSQL SoT", "OpenAPI limpio", "Runtime compacto"].map((item) => (
              <div key={item} className="rounded-[8px] border border-white bg-white/72 p-4 shadow-sm">
                <ShieldCheck className="mb-3 h-5 w-5 text-pulse-teal" />
                <p className="text-sm font-semibold text-graphite-800">{item}</p>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.form
          onSubmit={submit}
          initial={{ opacity: 0, scale: 0.96, x: 24 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="rounded-[8px] border border-white bg-white/84 p-6 shadow-cockpit backdrop-blur"
        >
          <div className="mb-6 flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-[8px] bg-graphite-950 text-white">
              <LockKeyhole className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-graphite-950">Ingreso clinico</h2>
              <p className="text-sm text-graphite-500">Credenciales locales sinteticas</p>
            </div>
          </div>
          <label className="mb-4 block">
            <span className="mb-2 block text-sm font-semibold text-graphite-700">Correo</span>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-[8px] border border-graphite-200 bg-white px-3 py-3 outline-none ring-pulse-teal/30 transition focus:ring-4"
            />
          </label>
          <label className="mb-5 block">
            <span className="mb-2 block text-sm font-semibold text-graphite-700">Clave</span>
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              className="w-full rounded-[8px] border border-graphite-200 bg-white px-3 py-3 outline-none ring-pulse-teal/30 transition focus:ring-4"
            />
          </label>
          {error ? <p className="mb-4 text-sm font-semibold text-pulse-rose">{error}</p> : null}
          <button
            disabled={pending}
            className="w-full rounded-[8px] bg-graphite-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-graphite-700 disabled:opacity-60"
          >
            {pending ? "Entrando..." : "Entrar al cockpit"}
          </button>
        </motion.form>
      </div>
    </main>
  );
}
