import { Card } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

const ACCENT = "#07FDC2";
const BG = "#131515";

const proofs = [
  {
    src: "https://bkp.growdoc.com.br/wp-content/uploads/2025/01/meta-alcancada.png",
    caption: "Meta alcançada de 150% de crescimento: R$1.250.615,25",
    highlight: "R$1.250.615,25",
  },
  {
    src: "https://bkp.growdoc.com.br/wp-content/uploads/2025/01/agradecer.png",
    caption: "Queria agradecer e parabenizar a todos da GROWDOC pela competência e empenho",
    highlight: null,
  },
  {
    src: "https://bkp.growdoc.com.br/wp-content/uploads/2025/01/15-mil.png",
    caption: "Fez um pix de R$15.000 — isso é que é funil escorregador",
    highlight: "R$15.000",
  },
  {
    src: "https://bkp.growdoc.com.br/wp-content/uploads/2025/01/indicacoes.png",
    caption: "50 indicações se tornaram R$158.831,75",
    highlight: "R$158.831,75",
  },
  {
    src: "https://bkp.growdoc.com.br/wp-content/uploads/2025/01/31-pa.png",
    caption: "31 pacientes antigos se tornaram R$153.000",
    highlight: "R$153.000",
  },
  {
    src: "https://bkp.growdoc.com.br/wp-content/uploads/2025/01/socialproof6.png",
    caption: "3 agendamentos em 1 semana de campanhas ativas",
    highlight: null,
  },
  {
    src: "https://bkp.growdoc.com.br/wp-content/uploads/2025/01/DEPOIMENTO-2.jpg",
    caption: "Agenda cheia até a segunda semana de setembro...",
    highlight: null,
  },
  {
    src: "https://bkp.growdoc.com.br/wp-content/uploads/2025/01/img.png",
    caption: "Piscamos e o faturamento do Guilherme aumentou...",
    highlight: null,
  },
  {
    src: "https://meetup.growdoc.com.br/images/resultado-1.webp",
    caption: "Tratamento fechado: paciente que veio do tráfego investiu R$9.000 em um único atendimento!",
    highlight: "R$9.000",
  },
  {
    src: "https://meetup.growdoc.com.br/images/resultado-2.webp",
    caption: "Campanhas no ar e leads qualificados pingando no WhatsApp!",
    highlight: null,
  },
  {
    src: "https://meetup.growdoc.com.br/images/resultado-3.webp",
    caption: "Captação eficaz: paciente agendou online e realizou botox.",
    highlight: null,
  },
  {
    src: "https://meetup.growdoc.com.br/images/resultado-4.webp",
    caption: "82 leads em poucos dias e agenda preenchida até o mês seguinte",
    highlight: "82 leads",
  },
  {
    src: "https://meetup.growdoc.com.br/images/resultado-5.webp",
    caption: "Reconhecida como uma das melhores agências pelos nossos clientes satisfeitos!",
    highlight: null,
  },
  {
    src: "https://meetup.growdoc.com.br/images/resultado-6.webp",
    caption: "Excelência em campanhas com nota 10 de satisfação!",
    highlight: null,
  },
  {
    src: "https://meetup.growdoc.com.br/images/resultado-7.webp",
    caption: "Agilidade e dedicação que transformam planos em realidade!",
    highlight: null,
  },
  {
    src: "https://meetup.growdoc.com.br/images/resultado-8.webp",
    caption: "15 solicitações de exame em uma semana!",
    highlight: "15 solicitações",
  },
];

function ProofCard({
  src,
  caption,
  highlight,
  index,
}: {
  src: string;
  caption: string;
  highlight: string | null;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.08 }}
    >
      <Card
        className="group overflow-hidden border transition-all duration-300 hover:-translate-y-1"
        style={{
          backgroundColor: "#1a1c1c",
          borderColor: "#ffffff12",
          boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = `${ACCENT}44`;
          (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 32px rgba(0,0,0,0.4), 0 0 20px ${ACCENT}18`;
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = "#ffffff12";
          (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 24px rgba(0,0,0,0.3)";
        }}
        radius="lg"
      >
        <img
          src={src}
          alt={caption}
          className="w-full object-contain"
          loading="lazy"
          style={{ maxHeight: "340px", objectPosition: "top" }}
        />
        <div className="px-4 py-3 border-t" style={{ borderColor: "#ffffff08" }}>
          {highlight ? (
            <p className="text-xs text-white/50 leading-relaxed">
              {caption.replace(highlight, "")}
              <span className="font-bold ml-1" style={{ color: ACCENT }}>{highlight}</span>
            </p>
          ) : (
            <p className="text-xs text-white/50 leading-relaxed italic">"{caption}"</p>
          )}
        </div>
      </Card>
    </motion.div>
  );
}

export default function SocialProof() {
  return (
    <section
      className="w-full px-6 py-20 md:py-28 overflow-hidden"
      style={{ backgroundColor: BG }}
    >
      <div className="max-w-5xl mx-auto flex flex-col items-center gap-14">

        {/* Título */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-4 text-center"
        >
          <p
            className="text-xs font-bold uppercase tracking-[0.2em]"
            style={{ color: ACCENT }}
          >
            Prova Social
          </p>
          <h2 className="text-3xl md:text-4xl font-black text-white leading-tight max-w-xl">
            Nossa metodologia funciona.{" "}
            <span style={{ color: ACCENT }}>Veja você mesmo:</span>
          </h2>
          <Icon
            icon="solar:alt-arrow-down-bold"
            width={32}
            style={{ color: ACCENT, marginTop: 4 }}
          />
        </motion.div>

        {/* Grid de provas — 2 colunas no desktop */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
          {proofs.map((proof, i) => (
            <ProofCard key={proof.src} {...proof} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
