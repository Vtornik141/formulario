"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Send } from "lucide-react";
import { CeibaMark } from "./CeibaMark";
import { Field } from "../app/brief/components/Field";
import { TextInput } from "../app/brief/components/TextInput";
import { TextArea } from "../app/brief/components/TextArea";
import { ChoiceCard } from "../app/brief/components/ChoiceCard";
import { PAQUETES, STEPS, EMPTY_BRIEF } from "../app/brief/constants";
import type { BriefData, BriefErrors } from "../app/brief/types";

type Phase = "portada" | "paso" | "exito";

type CeibaBriefProps = {
  embedded?: boolean;
};

export function CeibaBrief({ embedded = false }: CeibaBriefProps) {
  const [step, setStep] = useState(-1); // -1 = portada
  const [data, setData] = useState<BriefData>(EMPTY_BRIEF);
  const [errors, setErrors] = useState<BriefErrors>({});
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const set = <K extends keyof BriefData>(k: K, v: BriefData[K]) =>
    setData((d) => ({ ...d, [k]: v }));

  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step]);

  function handleLogoFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      set("logoFile", null);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      set("logoFile", typeof reader.result === "string" ? reader.result : null);
    };
    reader.readAsDataURL(file);
  }

  function validate(s: number): boolean {
    const e: BriefErrors = {};
    if (s === 0) {
      if (!data.negocio.trim()) e.negocio = true;
      if (!data.contacto.trim()) e.contacto = true;
      if (!data.whatsapp.trim()) e.whatsapp = true;
    }
    if (s === 1) {
      if (!data.descripcion.trim()) e.descripcion = true;
    }
    if (s === 2) {
      if (!data.paquete) e.paquete = true;
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function next() {
    if (validate(step)) setStep((s) => s + 1);
  }

  function back() {
    setErrors({});
    setStep((s) => s - 1);
  }

  async function submitBrief() {
    const payload = {
      ...data,
      enviadoEn: new Date().toISOString(),
    };
    setSending(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "No se pudo enviar el brief.");
      }
      setSent(true);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Ocurrió un error al enviar. Intenta de nuevo."
      );
    } finally {
      setSending(false);
    }
  }

  const phase: Phase = sent ? "exito" : step === -1 ? "portada" : "paso";
  const screenHeight = embedded ? "py-20" : "min-h-screen";

  const transition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.3, ease: [0.2, 0.7, 0.2, 1] as const };

  const variants = reduceMotion
    ? { initial: { opacity: 1 }, animate: { opacity: 1 }, exit: { opacity: 1 } }
    : {
        initial: { opacity: 0, x: 24 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -24 },
      };

  const StepIcon = step >= 0 ? STEPS[step]!.icon : null;

  return (
    <div className={`${embedded ? "" : "min-h-screen"} bg-crema font-sans text-grafito`}>
      <div ref={topRef} />
      <AnimatePresence mode="wait" initial={false}>
        {phase === "exito" && (
          <motion.div
            key="exito"
            {...variants}
            transition={transition}
            className={`${screenHeight} flex items-center justify-center p-6`}
          >
            <div className="max-w-md w-full text-center">
              <div className="mx-auto flex items-center justify-center rounded-full mb-6 w-16 h-16 bg-musgo">
                <Check size={30} className="text-white" strokeWidth={3} />
              </div>
              <h1 className="text-2xl font-bold mb-3 text-grafito">
                Recibido. Manos a la obra.
              </h1>
              <p className="text-sm leading-relaxed text-grafito-soft">
                Gracias, {data.contacto.split(" ")[0] || "equipo"}. Con esto
                tenemos lo necesario para arrancar. Te escribimos por
                WhatsApp al{" "}
                <strong className="text-grafito">
                  {data.whatsapp || "número indicado"}
                </strong>{" "}
                para confirmar el inicio del proyecto.
              </p>
              <div className="mt-8 text-xs tracking-widest uppercase text-musgo">
                Ceiba Visual · Ingeniería de alto impacto
              </div>
            </div>
          </motion.div>
        )}

        {phase === "portada" && (
          <motion.div
            key="portada"
            {...variants}
            transition={transition}
            className={`${screenHeight} flex items-center justify-center p-6 relative overflow-hidden`}
          >
            <div className="max-w-lg w-full relative">
              <div className="text-xs tracking-[0.3em] uppercase mb-5 text-musgo">
                Ceiba Visual · Brief de proyecto
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-4 text-grafito">
                Construyamos tu activo digital.
              </h1>
              <p className="text-sm sm:text-base leading-relaxed mb-2 text-grafito-soft">
                Después de nuestra conversación, este es el siguiente paso.
                Estas preguntas nos dan todo lo necesario para diseñar y
                construir una web alineada con tus objetivos — sin idas y
                vueltas.
              </p>
              <p className="text-sm leading-relaxed mb-8 text-grafito-soft">
                Toma unos <strong className="text-grafito">5 minutos</strong>.
                Lo ideal es completarlo dentro de las próximas{" "}
                <strong className="text-grafito">36 horas</strong> para
                mantener el ritmo.
              </p>
              <button
                type="button"
                onClick={() => setStep(0)}
                className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition-all duration-300 hover:scale-[1.02] bg-grafito text-white"
              >
                Empezar el brief <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        )}

        {phase === "paso" && StepIcon && (
          <motion.div key={step} {...variants} transition={transition} className="py-8 px-4 sm:px-6">
            <div className="max-w-2xl mx-auto">
              {/* Encabezado + progreso */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-xs tracking-[0.25em] uppercase text-musgo">
                    Ceiba Visual
                  </div>
                  <div className="text-xs text-grafito-soft">
                    Paso {step + 1} de {STEPS.length}
                  </div>
                </div>
                <div className="flex gap-1.5">
                  {STEPS.map((s, i) => (
                    <div
                      key={s.key}
                      className={`h-1 flex-1 rounded-full transition-all ${
                        i <= step ? "bg-musgo" : "bg-line"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Tarjeta */}
              <div className="rounded-2xl p-6 sm:p-8 relative overflow-hidden bg-white border border-line">
                <div className="absolute -top-6 -right-6">
                  <CeibaMark size={130} color="var(--color-musgo)" className="opacity-[0.05]" />
                </div>

                <div className="flex items-center gap-3 mb-6 relative">
                  <div className="flex items-center justify-center rounded-lg w-10 h-10 bg-crema">
                    <StepIcon size={20} className="text-musgo" />
                  </div>
                  <h2 className="text-lg font-bold text-grafito">{STEPS[step]!.label}</h2>
                </div>

                <div className="relative">
                  {/* PASO 0 — Identidad */}
                  {step === 0 && (
                    <>
                      <Field label="Nombre del negocio" required>
                        <TextInput
                          value={data.negocio}
                          onChange={(e) => set("negocio", e.target.value)}
                          placeholder="Ej. ImpoAutoventas"
                          invalid={!!errors.negocio}
                        />
                      </Field>
                      <Field label="Tu nombre" required>
                        <TextInput
                          value={data.contacto}
                          onChange={(e) => set("contacto", e.target.value)}
                          placeholder="Persona de contacto"
                          invalid={!!errors.contacto}
                        />
                      </Field>
                      <div className="grid sm:grid-cols-2 gap-x-4">
                        <Field label="WhatsApp" required>
                          <TextInput
                            value={data.whatsapp}
                            onChange={(e) => set("whatsapp", e.target.value)}
                            placeholder="+502 ..."
                            invalid={!!errors.whatsapp}
                          />
                        </Field>
                        <Field label="Correo">
                          <TextInput
                            type="email"
                            value={data.correo}
                            onChange={(e) => set("correo", e.target.value)}
                            placeholder="opcional"
                          />
                        </Field>
                      </div>
                      <Field
                        label="Ubicación del negocio"
                        hint="Ciudad o dirección, para mapa y SEO local."
                      >
                        <TextInput
                          value={data.ubicacion}
                          onChange={(e) => set("ubicacion", e.target.value)}
                          placeholder="Ej. Sanarate, El Progreso"
                        />
                      </Field>
                      <Field
                        label="¿Cuántas sucursales tiene tu negocio?"
                        hint="Si tienes varias ubicaciones, las integramos todas."
                      >
                        <TextInput
                          type="number"
                          min={1}
                          value={data.sucursales}
                          onChange={(e) => set("sucursales", e.target.value)}
                          placeholder="Ej. 1"
                        />
                      </Field>
                      {Number(data.sucursales) > 2 && (
                        <Field
                          label="Ubicación exacta de tus sucursales"
                          hint="Indícanos la dirección o zona de cada una."
                        >
                          <TextArea
                            value={data.ubicacionSucursales}
                            onChange={(e) => set("ubicacionSucursales", e.target.value)}
                            rows={5}
                            placeholder="Ej. Sucursal 1: Zona 10, Ciudad de Guatemala / Sucursal 2: ..."
                          />
                        </Field>
                      )}
                    </>
                  )}

                  {/* PASO 1 — El negocio */}
                  {step === 1 && (
                    <>
                      <Field
                        label="¿A qué se dedica tu negocio?"
                        required
                        hint="En tus palabras, sin tecnicismos."
                      >
                        <TextArea
                          value={data.descripcion}
                          onChange={(e) => set("descripcion", e.target.value)}
                          placeholder="Qué venden o qué servicio ofrecen..."
                          invalid={!!errors.descripcion}
                        />
                      </Field>
                      <Field label="¿Qué los hace diferentes?" hint="Opcional">
                        <TextArea
                          value={data.diferenciador}
                          onChange={(e) => set("diferenciador", e.target.value)}
                          placeholder="Por qué un cliente los elige a ustedes y no a otro..."
                        />
                      </Field>
                      <Field label="¿Hace cuánto operan?">
                        <TextInput
                          value={data.antiguedad}
                          onChange={(e) => set("antiguedad", e.target.value)}
                          placeholder="Ej. 5 años"
                        />
                      </Field>
                    </>
                  )}

                  {/* PASO 2 — Paquete */}
                  {step === 2 && (
                    <Field
                      label="Paquete de interés"
                      required
                      hint="Lo afinamos juntos; esto nos da el punto de partida."
                    >
                      <div className="grid gap-2">
                        {PAQUETES.map((p) => (
                          <ChoiceCard
                            key={p.id}
                            active={data.paquete === p.id}
                            title={p.nombre}
                            desc={p.desc}
                            onClick={() => set("paquete", p.id)}
                          />
                        ))}
                      </div>
                      {errors.paquete && (
                        <div className="text-xs mt-2 text-[#B4564E]">
                          Selecciona una opción.
                        </div>
                      )}
                    </Field>
                  )}

                  {/* PASO 3 — Marca */}
                  {step === 3 && (
                    <>
                      <Field label="¿Tienen logo?">
                        <div className="grid grid-cols-3 gap-2">
                          {["Sí", "No", "En proceso"].map((o) => (
                            <ChoiceCard
                              key={o}
                              active={data.logo === o}
                              title={o}
                              onClick={() => set("logo", o)}
                            />
                          ))}
                        </div>
                      </Field>
                      {data.logo === "Sí" && (
                        <Field label="Subí tu logo" hint="PNG, JPG o SVG. Opcional.">
                          <input
                            type="file"
                            accept=".png,.jpg,.jpeg,.svg,image/png,image/jpeg,image/svg+xml"
                            onChange={handleLogoFile}
                            className="block w-full text-sm text-grafito-soft file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-musgo file:px-3.5 file:py-2 file:text-sm file:font-semibold file:text-white"
                          />
                        </Field>
                      )}
                      <Field
                        label="Colores de marca"
                        hint="Si los tienes definidos, indícalos (o describe la sensación que buscas)."
                      >
                        <TextInput
                          value={data.colores}
                          onChange={(e) => set("colores", e.target.value)}
                          placeholder="Ej. azul y dorado / elegante y serio"
                        />
                      </Field>
                      <Field label="Redes sociales" hint="Para integrarlas y tomar contenido.">
                        <TextInput
                          value={data.redes}
                          onChange={(e) => set("redes", e.target.value)}
                          placeholder="Instagram, Facebook, TikTok..."
                        />
                      </Field>
                    </>
                  )}

                  {/* PASO 4 — Necesidades */}
                  {step === 4 && (
                    <>
                      <span className="block text-base font-semibold mb-1.5 text-grafito">
                        ¿Qué necesita tu web?
                      </span>
                      <span className="block text-sm mb-3 text-grafito-soft">
                        Mientras más detalle nos compartas, mejor será el
                        resultado.
                      </span>
                      <TextArea
                        value={data.funcionesExtra}
                        onChange={(e) => set("funcionesExtra", e.target.value)}
                        rows={5}
                        placeholder="Contanos cualquier función, sección o detalle específico que necesite tu web. Mientras más detalle, mejor resultado."
                      />

                      {submitError && (
                        <div className="rounded-xl p-4 mt-3 text-sm bg-[#B4564E]/10 text-[#B4564E] border border-[#B4564E]/30">
                          {submitError}
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Navegación */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-line">
                  <button
                    type="button"
                    onClick={back}
                    className={`inline-flex items-center gap-1.5 text-sm font-medium transition text-grafito-soft ${
                      step === 0 ? "invisible" : "visible"
                    }`}
                  >
                    <ArrowLeft size={16} /> Atrás
                  </button>

                  {step < STEPS.length - 1 ? (
                    <button
                      type="button"
                      onClick={next}
                      className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-all duration-300 hover:scale-[1.02] bg-grafito text-white"
                    >
                      Continuar <ArrowRight size={16} />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={submitBrief}
                      disabled={sending}
                      className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-all duration-300 hover:scale-[1.02] bg-musgo text-white disabled:opacity-70 disabled:hover:scale-100"
                    >
                      {sending ? "Enviando..." : "Enviar brief"} <Send size={15} />
                    </button>
                  )}
                </div>
              </div>

              <div className="text-center mt-6 text-xs text-grafito-soft">
                Ceiba Visual © 2026 · Ingeniería de alto impacto
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
