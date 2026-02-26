import { Button } from "@heroui/react";
import { motion } from "framer-motion";

const CTA_LINK = "#formulario";
const ACCENT = "#07FDC2";
const BG = "#131515";

const headlines = [
  "+ Pacientes",
  "+ Faturamento",
  "+ Previsibilidade",
  "+ Segurança",
];

export default function Hero() {
  return (
    <section
      className="relative w-full overflow-hidden px-6 py-12 md:py-16"
      style={{ backgroundColor: BG }}
    >
      {/* Glow background */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full animate-glow-pulse"
        style={{
          background: `radial-gradient(ellipse at center, ${ACCENT}22 0%, transparent 70%)`,
        }}
      />
      {/* Grid dot texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `radial-gradient(circle, #fff 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col gap-6">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <img
            src="https://bkp.growdoc.com.br/wp-content/uploads/2025/01/GrowDoc-Logo-11.png"
            alt="GrowDoc"
            className="h-8 md:h-10 w-auto object-contain"
          />
        </motion.div>

        {/* Headlines */}
        <div className="flex flex-col gap-0">
          {headlines.map((line, i) => (
            <motion.h1
              key={line}
              initial={{ opacity: 0, x: -32 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
              className="font-black leading-[1.1] tracking-tight"
              style={{
                fontSize: "clamp(1.75rem, 4.5vw, 3rem)",
                background: `linear-gradient(90deg, #fff 40%, ${ACCENT} 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {line}
            </motion.h1>
          ))}
        </div>

        {/* Divider accent */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="origin-left h-px w-24 rounded-full"
          style={{ backgroundColor: ACCENT }}
        />

        {/* Subtítulo + parágrafo */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.65 }}
          className="flex flex-col gap-2 max-w-2xl"
        >
          <p className="text-white text-base md:text-lg font-semibold leading-snug">
            Transforme sua prática médica com a metodologia que oferece
            previsibilidade sobre sua agenda e receitas.
          </p>
          <p className="text-white/50 text-sm md:text-base leading-relaxed">
            Para ter acesso a essa metodologia, clique no botão abaixo e agende
            um horário com nosso time de especialistas em marketing médico hoje mesmo!
          </p>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Button
            as="a"
            href={CTA_LINK}
            size="lg"
            radius="md"
            className="font-black uppercase text-sm md:text-base px-10 h-14 tracking-widest shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl"
            style={{
              backgroundColor: ACCENT,
              color: BG,
              boxShadow: `0 0 32px ${ACCENT}55`,
            }}
          >
            Quero ter mais resultados
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
