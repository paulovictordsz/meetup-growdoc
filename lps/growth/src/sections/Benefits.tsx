import { Button, Card } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

const CTA_LINK = "#formulario";
const ACCENT = "#07FDC2";

const benefits = [
  {
    icon: "solar:dollar-minimalistic-bold",
    label: "Faturamento",
    text: "Independente de quanto você fatura hoje, prepare-se para faturar mais.",
  },
  {
    icon: "solar:calendar-bold",
    label: "Previsibilidade",
    text: "Chega de ficar no escuro, sem saber se o mês será bom ou ruim, tenha previsibilidade da sua agenda antecipadamente.",
  },
  {
    icon: "solar:shield-check-bold",
    label: "Segurança",
    text: "Quanto mais previsibilidade e controle você tem da sua agenda e receita, mais segurança financeira você terá. Com certeza.",
  },
  {
    icon: "solar:graph-up-bold",
    label: "Crescimento",
    text: "Sua clínica ou consultório crescendo consistentemente mês a mês.",
  },
];

export default function Benefits() {
  return (
    <section className="w-full bg-white px-6 py-20 md:py-28">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-14 lg:gap-20 items-start">

          {/* Coluna esquerda — foto */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center gap-5 lg:w-[320px] xl:w-[360px] shrink-0"
          >
            <div
              className="relative w-full rounded-2xl overflow-hidden"
              style={{ boxShadow: `0 0 0 4px ${ACCENT}33, 0 24px 60px rgba(0,0,0,0.15)` }}
            >
              {/* Accent border top */}
              <div
                className="absolute top-0 left-0 right-0 h-1 z-10"
                style={{ backgroundColor: ACCENT }}
              />
              <img
                src="https://bkp.growdoc.com.br/wp-content/uploads/2025/01/Lucas-768x1255.jpg"
                alt="Lucas Faria — CEO da GrowDoc"
                className="w-full object-cover"
                loading="lazy"
                width="768"
                height="1255"
              />
            </div>
            <div className="flex flex-col items-center gap-1 text-center">
              <p className="font-black text-lg" style={{ color: "#131515" }}>Lucas Faria</p>
              <p
                className="text-xs font-bold uppercase tracking-[0.18em]"
                style={{ color: ACCENT }}
              >
                CEO da GrowDoc
              </p>
            </div>
          </motion.div>

          {/* Coluna direita — benefícios */}
          <div className="flex flex-col gap-8 flex-1 min-w-0">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-black leading-tight tracking-tight"
              style={{ color: "#131515" }}
            >
              Descubra como a Metodologia GrowDoc vai aumentar o número de
              pacientes em poucos dias e te gerar:
            </motion.h2>

            <div className="flex flex-col gap-3">
              {benefits.map(({ icon, label, text }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                >
                  <Card
                    className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 bg-white"
                    radius="lg"
                  >
                    <div className="flex items-start gap-4 p-4">
                      <div
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl mt-0.5"
                        style={{ backgroundColor: `${ACCENT}18` }}
                      >
                        <Icon icon={icon} width={20} style={{ color: ACCENT }} />
                      </div>
                      <div>
                        <p className="font-black text-base mb-1" style={{ color: "#131515" }}>
                          {label}
                        </p>
                        <p className="text-gray-500 text-sm leading-relaxed">{text}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <Button
                as="a"
                href={CTA_LINK}
                size="lg"
                radius="md"
                className="font-black uppercase text-sm md:text-base px-10 h-14 tracking-widest transition-all duration-200 hover:scale-105"
                style={{
                  backgroundColor: ACCENT,
                  color: "#131515",
                  boxShadow: `0 0 28px ${ACCENT}44`,
                }}
              >
                Quero ter mais resultados
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
