import { Button } from "@heroui/react";
import { motion } from "framer-motion";

const ACCENT = "#07FDC2";
const BG = "#131515";

export default function CtaSection() {
  return (
    <section
      id="cta"
      className="relative w-full overflow-hidden px-6 py-20 md:py-28"
      style={{ backgroundColor: BG }}
    >
      {/* Glow */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <div
          className="w-[600px] h-[300px] rounded-full animate-glow-pulse"
          style={{
            background: `radial-gradient(ellipse at center, ${ACCENT}28 0%, transparent 70%)`,
          }}
        />
      </div>

      {/* Border top accent */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${ACCENT}, transparent)` }}
      />

      <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center gap-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-4"
        >
          <p
            className="text-xs font-bold uppercase tracking-[0.2em]"
            style={{ color: ACCENT }}
          >
            Próximo passo
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-white leading-tight tracking-tight">
            Pronto para transformar{" "}
            <span style={{ color: ACCENT }}>sua prática médica?</span>
          </h2>
          <p className="text-white/50 text-lg leading-relaxed max-w-xl mx-auto">
            Agende agora uma conversa com nosso time de especialistas em
            marketing médico. Sem compromisso.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Button
            as="a"
            href="#formulario"
            size="lg"
            radius="md"
            className="font-black uppercase text-sm md:text-base px-12 h-14 tracking-widest transition-all duration-200 hover:scale-105"
            style={{
              backgroundColor: ACCENT,
              color: BG,
              boxShadow: `0 0 40px ${ACCENT}55`,
            }}
          >
            Quero ter mais resultados
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
