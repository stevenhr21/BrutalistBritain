interface KoFiButtonProps {
  variant?: "inline" | "floating";
}

const KoFiIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="18"
    height="18"
    fill="currentColor"
    style={{ flexShrink: 0 }}
  >
    <path d="M23.881 8.948c-.773-4.085-4.859-4.593-4.859-4.593H.723c-.604 0-.679.798-.679.798s-.082 7.324-.022 11.822c.164 2.424 2.586 2.672 2.586 2.672s8.267-.023 11.966-.049c2.438-.426 2.683-2.566 2.658-3.734 4.352.24 7.422-2.831 6.649-6.916zm-11.062 3.511c-1.246 1.453-4.011 3.976-4.011 3.976s-.121.119-.31.023c-.076-.057-.108-.09-.108-.09-.443-.441-3.368-3.049-4.034-3.954-.709-.965-1.041-2.7-.091-3.71.951-1.01 3.005-1.086 4.363.407 0 0 1.565-1.782 3.468-.963 1.904.82 1.832 3.011.723 4.311zm6.173.478c-.928.116-1.682.028-1.682.028V7.284h1.77s1.971.551 1.971 2.638c0 1.913-.985 2.667-2.059 3.015z" />
  </svg>
);

export default function KoFiButton({ variant = "inline" }: KoFiButtonProps) {
  const kofiUrl = "https://ko-fi.com/brutalistbritain";

  const baseStyles: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    fontFamily: "'IBM Plex Mono', 'JetBrains Mono', monospace",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    backgroundColor: "#323842",
    color: "#fff",
    border: "2px solid #0B0B0B",
    textDecoration: "none",
    cursor: "pointer",
  };

  if (variant === "floating") {
    const floatingStyles: React.CSSProperties = {
      ...baseStyles,
      position: "fixed",
      bottom: "32px",
      right: "12px",
      zIndex: 1000,
      padding: "8px 14px",
      fontSize: "0.7rem",
      boxShadow: "3px 3px 0 #0B0B0B",
    };

    return (
      <a
        href={kofiUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={floatingStyles}
        aria-label="Support me on Ko-fi"
      >
        <KoFiIcon />
        <span>Support me</span>
      </a>
    );
  }

  // Inline variant for homepage
  const inlineStyles: React.CSSProperties = {
    ...baseStyles,
    padding: "10px 20px",
    fontSize: "0.75rem",
  };

  return (
    <a
      href={kofiUrl}
      target="_blank"
      rel="noopener noreferrer"
      style={inlineStyles}
      aria-label="Support me on Ko-fi"
    >
      <KoFiIcon />
      <span>Support this project</span>
    </a>
  );
}
