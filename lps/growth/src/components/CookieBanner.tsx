import { useState, useEffect } from "react";

const ACCENT = "#07FDC2";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("cookie_consent")) {
      const t = setTimeout(() => setVisible(true), 1800);
      return () => clearTimeout(t);
    }
  }, []);

  function accept() {
    localStorage.setItem("cookie_consent", "accepted");
    setVisible(false);
  }

  function reject() {
    localStorage.setItem("cookie_consent", "rejected");
    setVisible(false);
  }

  return (
    <div
      role="dialog"
      aria-label="Aviso de cookies"
      style={{
        position: "fixed",
        bottom: visible ? 24 : -320,
        left: 24,
        zIndex: 99999,
        width: 300,
        background: "rgba(16,18,18,0.98)",
        border: "1px solid rgba(7,253,194,0.2)",
        borderRadius: 20,
        padding: "22px 20px 18px",
        transition: "bottom 0.6s cubic-bezier(0.34,1.4,0.64,1)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        boxShadow:
          "0 20px 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(7,253,194,0.05), inset 0 1px 0 rgba(255,255,255,0.04)",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <span style={{ fontSize: "1.3rem", lineHeight: 1, flexShrink: 0 }}>🐰</span>
        <span style={{ fontSize: "0.9rem", fontWeight: 700, color: ACCENT, letterSpacing: "-0.2px" }}>
          Controle sua privacidade
        </span>
      </div>

      {/* Text */}
      <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.6, marginBottom: 12 }}>
        Usamos cookies para personalizar anúncios e melhorar sua experiência de navegação.
      </p>

      {/* Link */}
      <div style={{ marginBottom: 16 }}>
        <a
          href="https://privacidade.growdoc.com.br/"
          target="_blank"
          rel="noopener"
          style={{ fontSize: "0.68rem", color: "rgba(7,253,194,0.65)", textDecoration: "underline" }}
        >
          Política de Privacidade
        </a>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={reject}
          style={{
            flex: 1,
            padding: "10px 12px",
            borderRadius: 50,
            fontSize: "0.72rem",
            fontWeight: 700,
            cursor: "pointer",
            background: "transparent",
            color: "rgba(255,255,255,0.35)",
            border: "1px solid rgba(255,255,255,0.12)",
            fontFamily: "inherit",
            letterSpacing: "0.3px",
          }}
        >
          Recusar
        </button>
        <button
          onClick={accept}
          style={{
            flex: 1,
            padding: "10px 12px",
            borderRadius: 50,
            fontSize: "0.72rem",
            fontWeight: 700,
            cursor: "pointer",
            background: ACCENT,
            color: "#141616",
            border: "none",
            fontFamily: "inherit",
            letterSpacing: "0.3px",
          }}
        >
          Aceitar
        </button>
      </div>
    </div>
  );
}
