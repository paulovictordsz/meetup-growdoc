import { Card } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

const ACCENT = "#07FDC2";
const BG = "#131515";

const stats = [
  {
    icon: "solar:users-group-rounded-bold",
    value: "300+",
    label: "Médicos transformados",
  },
  {
    icon: "solar:graph-up-bold",
    value: "150%",
    label: "Crescimento médio de faturamento",
  },
  {
    icon: "solar:dollar-minimalistic-bold",
    value: "R$1,25M",
    label: "Gerados para um único cliente",
  },
];

export default function Stats() {
  return (
    <section
      className="w-full px-6 py-12"
      style={{ backgroundColor: BG }}
    >
      <div className="max-w-5xl mx-auto">
        <div
          className="rounded-2xl border p-1"
          style={{ borderColor: `${ACCENT}22` }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10">
            {stats.map(({ icon, value, label }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card
                  className="rounded-xl border-0 bg-transparent shadow-none"
                  style={{ backgroundColor: "transparent" }}
                >
                  <div className="flex flex-col items-center gap-3 px-8 py-8 text-center">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-xl"
                      style={{ backgroundColor: `${ACCENT}18`, border: `1px solid ${ACCENT}33` }}
                    >
                      <Icon icon={icon} width={24} style={{ color: ACCENT }} />
                    </div>
                    <p
                      className="text-4xl font-black tracking-tight"
                      style={{ color: ACCENT }}
                    >
                      {value}
                    </p>
                    <p className="text-sm text-white/50 font-medium leading-tight">{label}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
