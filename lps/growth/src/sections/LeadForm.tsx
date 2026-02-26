import { useState, useEffect, useCallback } from "react";
import { Input, Select, SelectItem, Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

const ACCENT = "#07FDC2";
const BG = "#131515";

const CAPTURE_URL = "https://lswmkiyqznvuedbuyrkt.supabase.co/functions/v1/capture-lead";
const WEBHOOK_URL = "https://webhooks02.manager01.growdoc.com.br/webhook/redirect-global";

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

// --- UTM helpers ---
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

// --- Phone mask ---
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
  const [name, setName]                     = useState("");
  const [phone, setPhone]                   = useState("");
  const [isVascular, setIsVascular]         = useState("");
  const [profStage, setProfStage]           = useState("");
  const [errors, setErrors]                 = useState<FormErrors>({});
  const [loading, setLoading]               = useState(false);
  const [utmParams, setUtmParams]           = useState<UTMParams | null>(null);

  useEffect(() => {
    setUtmParams(captureUTM());
  }, []);

  const validate = useCallback((): boolean => {
    const e: FormErrors = {};
    if (!name.trim())           e.name              = "Por favor, informe seu nome";
    if (!validatePhone(phone))  e.phone             = "Telefone inválido";
    if (!isVascular)            e.is_vascular       = "Selecione uma opção";
    if (!profStage)             e.professional_stage = "Selecione uma opção";
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

  const inputStyles = {
    inputWrapper: [
      "bg-white/5 border border-white/10 hover:border-white/20",
      "focus-within:!border-[#07FDC2] focus-within:!bg-white/8",
      "transition-all duration-200 rounded-xl h-12",
    ].join(" "),
    input: "text-white placeholder:text-white/30 text-sm",
    label: "text-white/50 text-xs font-medium",
  };

  const selectStyles = {
    trigger: [
      "bg-white/5 border border-white/10 hover:border-white/20",
      "focus:!border-[#07FDC2] data-[open=true]:!border-[#07FDC2]",
      "transition-all duration-200 rounded-xl h-12",
    ].join(" "),
    value: "text-white text-sm",
    label: "text-white/50 text-xs font-medium",
    selectorIcon: "text-white/40",
    popoverContent: "bg-[#1a1c1c] border border-white/10 rounded-xl",
    listbox: "p-1",
    listboxWrapper: "bg-[#1a1c1c]",
  };

  const selectItemStyles = {
    base: "text-white data-[hover=true]:bg-white/10 data-[hover=true]:text-white rounded-lg",
    title: "text-white text-sm",
  };

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

      <div className="relative z-10 max-w-lg mx-auto">

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
            className="rounded-2xl p-6 md:p-8"
            style={{
              backgroundColor: "#1a1c1c",
              border: `1px solid ${ACCENT}20`,
              boxShadow: `0 0 60px ${ACCENT}0a, 0 24px 48px rgba(0,0,0,0.4)`,
            }}
          >
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">

                {/* Nome */}
                <Input
                  label="Seu nome completo"
                  placeholder="Dr. João Silva"
                  value={name}
                  onValueChange={(v) => { setName(v); setErrors((p) => ({ ...p, name: undefined })); }}
                  isInvalid={!!errors.name}
                  errorMessage={errors.name}
                  variant="bordered"
                  classNames={inputStyles}
                  startContent={
                    <Icon icon="solar:user-bold" width={16} className="text-white/30 shrink-0" />
                  }
                />

                {/* Telefone */}
                <Input
                  label="WhatsApp"
                  placeholder="(11) 99999-9999"
                  value={phone}
                  onValueChange={(v) => {
                    setPhone(applyPhoneMask(v));
                    setErrors((p) => ({ ...p, phone: undefined }));
                  }}
                  isInvalid={!!errors.phone}
                  errorMessage={errors.phone}
                  variant="bordered"
                  classNames={inputStyles}
                  startContent={
                    <Icon icon="solar:phone-bold" width={16} className="text-white/30 shrink-0" />
                  }
                />

                {/* É especialista? */}
                <Select
                  label="Você é médico especialista?"
                  placeholder="Selecione..."
                  selectedKeys={isVascular ? [isVascular] : []}
                  onSelectionChange={(keys) => {
                    setIsVascular(Array.from(keys)[0] as string);
                    setErrors((p) => ({ ...p, is_vascular: undefined }));
                  }}
                  isInvalid={!!errors.is_vascular}
                  errorMessage={errors.is_vascular}
                  variant="bordered"
                  classNames={selectStyles}
                  listboxProps={{ itemClasses: selectItemStyles }}
                >
                  <SelectItem key="Sim">Sim, tenho especialidade</SelectItem>
                  <SelectItem key="Não">Não, sou clínico geral</SelectItem>
                </Select>

                {/* Estágio profissional */}
                <Select
                  label="Qual seu momento atual?"
                  placeholder="Selecione..."
                  selectedKeys={profStage ? [profStage] : []}
                  onSelectionChange={(keys) => {
                    setProfStage(Array.from(keys)[0] as string);
                    setErrors((p) => ({ ...p, professional_stage: undefined }));
                  }}
                  isInvalid={!!errors.professional_stage}
                  errorMessage={errors.professional_stage}
                  variant="bordered"
                  classNames={selectStyles}
                  listboxProps={{ itemClasses: selectItemStyles }}
                >
                  <SelectItem key="Estou iniciando minha carreira">Estou iniciando minha carreira</SelectItem>
                  <SelectItem key="Tenho consultório e quero crescer">Tenho consultório e quero crescer</SelectItem>
                  <SelectItem key="Quero abrir mais unidades">Quero abrir mais unidades</SelectItem>
                  <SelectItem key="Clínica consolidada, quero escalar">Clínica consolidada, quero escalar</SelectItem>
                </Select>

                {/* Submit */}
                <Button
                  type="submit"
                  size="lg"
                  radius="md"
                  isLoading={loading}
                  className="w-full font-black uppercase text-sm tracking-widest h-14 mt-1 transition-all duration-200 hover:scale-[1.02]"
                  style={{
                    backgroundColor: ACCENT,
                    color: BG,
                    boxShadow: loading ? "none" : `0 0 32px ${ACCENT}44`,
                  }}
                >
                  {loading ? "Redirecionando..." : "Quero ter mais resultados"}
                </Button>

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
