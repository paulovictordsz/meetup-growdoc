import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

const ACCENT = "#07FDC2";
const BG = "#131515";

const CAPTURE_URL = "https://lswmkiyqznvuedbuyrkt.supabase.co/functions/v1/capture-lead";
const WEBHOOK_URL = "https://webhooks02.manager01.growdoc.com.br/webhook/redirect-global";

const CHEVRON_SVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='rgba(0%2C217%2C181%2C0.8)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`;

type UTMParams = {
  utm_source: string;
  utm_campaign: string;
  utm_medium: string;
  utm_content: string;
  utm_term: string;
  utm_id: string;
  fbclid: string;
  gclid: string;
  wbraid: string;
};

type FormErrors = {
  name?: string;
  phone?: string;
  is_vascular?: string;
  professional_stage?: string;
};

function getUTMFromURL(): UTMParams {
  const p = new URLSearchParams(window.location.search);
  return {
    utm_source:   p.get("utm_source")   || "",
    utm_campaign: p.get("utm_campaign") || "",
    utm_medium:   p.get("utm_medium")   || "",
    utm_content:  p.get("utm_content")  || "",
    utm_term:     p.get("utm_term")     || "",
    utm_id:       p.get("utm_id")       || "",
    fbclid:       p.get("fbclid")       || "",
    gclid:        p.get("gclid")        || "",
    wbraid:       p.get("wbraid")       || "",
  };
}

function saveUTM(utm: UTMParams) {
  try {
    Object.entries(utm).forEach(([k, v]) => { if (v) localStorage.setItem("utm_" + k, v); });
    localStorage.setItem("utm_timestamp", String(Date.now()));
  } catch {}
}

function loadUTM(): UTMParams {
  const g = (k: string) => localStorage.getItem("utm_" + k) || "";
  return {
    utm_source:   g("utm_source"),
    utm_campaign: g("utm_campaign"),
    utm_medium:   g("utm_medium"),
    utm_content:  g("utm_content"),
    utm_term:     g("utm_term"),
    utm_id:       g("utm_id"),
    fbclid:       g("fbclid"),
    gclid:        g("gclid"),
    wbraid:       g("wbraid"),
  };
}

function captureUTM(): UTMParams {
  const fromURL = getUTMFromURL();
  const hasUTM = Object.values(fromURL).some(Boolean);
  if (hasUTM) { saveUTM(fromURL); return fromURL; }
  return loadUTM();
}

function applyPhoneMask(value: string): string {
  const n = value.replace(/\D/g, "");
  if (!n) return "";
  if (n.length <= 10)
    return n.replace(/^(\d{2})(\d)/g, "($1) $2").replace(/(\d{4})(\d)/, "$1-$2").substring(0, 14);
  return n.replace(/^(\d{2})(\d)/g, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2").substring(0, 15);
}

function validatePhone(value: string): boolean {
  const n = value.replace(/\D/g, "");
  return n.length === 10 || n.length === 11;
}

export default function LeadForm() {
  const [name, setName]           = useState("");
  const [phone, setPhone]         = useState("");
  const [isVascular, setIsVascular] = useState("");
  const [profStage, setProfStage] = useState("");
  const [errors, setErrors]       = useState<FormErrors>({});
  const [loading, setLoading]     = useState(false);
  const [utmParams, setUtmParams] = useState<UTMParams | null>(null);

  useEffect(() => { setUtmParams(captureUTM()); }, []);

  const validate = useCallback((): boolean => {
    const e: FormErrors = {};
    if (!name.trim())           e.name              = "Campo obrigatório";
    if (!validatePhone(phone))  e.phone             = "Telefone inválido";
    if (!isVascular)            e.is_vascular       = "Campo obrigatório";
    if (!profStage)             e.professional_stage = "Campo obrigatório";
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [name, phone, isVascular, profStage]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const utm = utmParams ?? captureUTM();
    const cleanPhone = phone.replace(/\D/g, "");
    const pageURL = window.location.href;

    const supabaseParams = new URLSearchParams({
      name, email: "", phone: cleanPhone, page_url: pageURL,
    });

    const webhookParams = new URLSearchParams({
      name, email: "", phone: cleanPhone,
      '01': isVascular, '02': profStage,
      page_url: pageURL,
      ...Object.fromEntries(Object.entries(utm).filter(([, v]) => v)),
    });

    try {
      fetch(CAPTURE_URL + "?" + supabaseParams.toString(), { keepalive: true });
    } catch {}

    window.location.href = WEBHOOK_URL + "?" + webhookParams.toString();
  }, [validate, name, phone, isVascular, profStage, utmParams]);

  const inputBase =
    "w-full bg-black/30 border-2 border-[#07FDC2]/30 rounded-xl px-4 py-3 text-white text-sm " +
    "placeholder-white/40 outline-none transition-all duration-200 " +
    "hover:bg-black/40 " +
    "focus:border-[#07FDC2] focus:bg-black/50 focus:shadow-[0_0_0_3px_rgba(0,217,181,0.1)]";

  const inputError =
    "border-red-500/70 bg-red-500/10 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]";

  return (
    <section
      id="formulario"
      className="relative w-full overflow-hidden px-6 pb-20 pt-10 md:pb-28 md:pt-12"
      style={{ backgroundColor: BG }}
    >
      {/* Glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div
          className="w-[800px] h-[500px] rounded-full animate-glow-pulse"
          style={{ background: `radial-gradient(ellipse at center, ${ACCENT}15 0%, transparent 65%)` }}
        />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-2 text-center mb-8"
        >
          <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: ACCENT }}>
            Próximo passo
          </p>
          <h2 className="text-2xl md:text-3xl font-black text-white leading-tight tracking-tight">
            Pronto para transformar{" "}
            <span style={{ color: ACCENT }}>sua prática médica?</span>
          </h2>
          <p className="text-white/40 text-sm leading-relaxed">
            Preencha o formulário e nosso time entra em contato com você.
          </p>
        </motion.div>

        {/* Formulário */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div
            className="rounded-2xl p-6 md:p-10 backdrop-blur-sm"
            style={{
              backgroundColor: "rgba(255,255,255,0.05)",
              border: `1px solid ${ACCENT}33`,
            }}
          >
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">

              {/* Nome + Telefone — 2 colunas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* Nome */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-white font-semibold text-sm">
                    Nome e Sobrenome<span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder='Ex: "Julia Nascimento"'
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setErrors((p) => ({ ...p, name: undefined }));
                    }}
                    autoComplete="name"
                    className={`${inputBase} ${errors.name ? inputError : ""}`}
                  />
                  {errors.name && (
                    <span className="text-red-400 text-xs">{errors.name}</span>
                  )}
                </div>

                {/* Telefone */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-white font-semibold text-sm">
                    DDD + Whatsapp<span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder='Ex: "31999996666"'
                    value={phone}
                    onChange={(e) => {
                      setPhone(applyPhoneMask(e.target.value));
                      setErrors((p) => ({ ...p, phone: undefined }));
                    }}
                    autoComplete="tel"
                    className={`${inputBase} ${errors.phone ? inputError : ""}`}
                  />
                  {errors.phone && (
                    <span className="text-red-400 text-xs">{errors.phone}</span>
                  )}
                </div>
              </div>

              {/* Você é médico especialista? */}
              <div className="flex flex-col gap-1.5">
                <label className="text-white font-semibold text-sm">
                  Você é médico especialista?<span className="text-red-500 ml-0.5">*</span>
                </label>
                <select
                  value={isVascular}
                  onChange={(e) => {
                    setIsVascular(e.target.value);
                    setErrors((p) => ({ ...p, is_vascular: undefined }));
                  }}
                  className={`${inputBase} cursor-pointer ${errors.is_vascular ? inputError : ""}`}
                  style={{
                    appearance: "none",
                    WebkitAppearance: "none",
                    backgroundImage: CHEVRON_SVG,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 1rem center",
                    backgroundSize: "1.2em",
                    paddingRight: "3rem",
                  }}
                >
                  <option value="" style={{ background: "#0a1a1a" }}>Selecione uma opção</option>
                  <option value="Sim" style={{ background: "#0a1a1a" }}>Sim, tenho especialidade</option>
                  <option value="Não" style={{ background: "#0a1a1a" }}>Não, sou clínico geral</option>
                </select>
                {errors.is_vascular && (
                  <span className="text-red-400 text-xs">{errors.is_vascular}</span>
                )}
              </div>

              {/* Qual seu momento atual? */}
              <div className="flex flex-col gap-1.5">
                <label className="text-white font-semibold text-sm">
                  Qual seu momento atual?<span className="text-red-500 ml-0.5">*</span>
                </label>
                <select
                  value={profStage}
                  onChange={(e) => {
                    setProfStage(e.target.value);
                    setErrors((p) => ({ ...p, professional_stage: undefined }));
                  }}
                  className={`${inputBase} cursor-pointer ${errors.professional_stage ? inputError : ""}`}
                  style={{
                    appearance: "none",
                    WebkitAppearance: "none",
                    backgroundImage: CHEVRON_SVG,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 1rem center",
                    backgroundSize: "1.2em",
                    paddingRight: "3rem",
                  }}
                >
                  <option value="" style={{ background: "#0a1a1a" }}>Selecione uma opção</option>
                  <option value="Estou iniciando minha carreira" style={{ background: "#0a1a1a" }}>Estou iniciando minha carreira</option>
                  <option value="Tenho consultório e quero crescer" style={{ background: "#0a1a1a" }}>Tenho consultório e quero crescer</option>
                  <option value="Quero abrir mais unidades" style={{ background: "#0a1a1a" }}>Quero abrir mais unidades</option>
                  <option value="Clínica consolidada, quero escalar" style={{ background: "#0a1a1a" }}>Clínica consolidada, quero escalar</option>
                </select>
                {errors.professional_stage && (
                  <span className="text-red-400 text-xs">{errors.professional_stage}</span>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full font-black uppercase text-sm tracking-widest h-14 mt-1 rounded-full transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                style={{
                  backgroundColor: ACCENT,
                  color: "#1a1a1a",
                  boxShadow: loading ? "none" : `0 0 32px ${ACCENT}44`,
                }}
              >
                {loading ? "Redirecionando..." : "Ir para o WhatsApp!"}
              </button>

              <p className="text-center text-xs text-white/25">
                Ao enviar, você concorda em receber contato da nossa equipe.
                Sem spam, prometemos.
              </p>
            </form>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
