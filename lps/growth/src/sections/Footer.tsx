const ACCENT = "#07FDC2";

export default function Footer() {
  return (
    <footer className="w-full bg-white px-6 py-6">
      {/* Thin accent border top */}
      <div className="w-full h-px mb-6" style={{ background: `linear-gradient(90deg, transparent, ${ACCENT}66, transparent)` }} />

      <div className="max-w-5xl mx-auto flex flex-col items-center gap-2">
        <img
          src="https://bkp.growdoc.com.br/wp-content/uploads/2025/01/GrowDoc-Logo-1.webp"
          alt="GrowDoc"
          className="h-8 w-auto object-contain"
        />
        <p className="text-xs text-gray-400 font-medium">
          © {new Date().getFullYear()} GrowDoc. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
