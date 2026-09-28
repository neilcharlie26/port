interface Props {
  tag: string
  title: string
  subtitle?: string
  centered?: boolean
}

export default function SectionHeading({ tag, title, subtitle, centered }: Props) {
  return (
    <div className={centered ? "text-center" : ""}>
      <div
        className="inline-block text-xs font-semibold tracking-widest uppercase mb-3 px-3 py-1 rounded-full"
        style={{
          color: "var(--accent)",
          backgroundColor: "var(--accent-dim)",
          border: "1px solid var(--border)",
          fontFamily: "JetBrains Mono, monospace",
        }}
      >
        {tag}
      </div>
      <h2 className="text-3xl sm:text-4xl font-bold mb-3" style={{ color: "var(--text)" }}>
        {title}
      </h2>
      {!centered && <div className="section-divider" />}
      {centered && (
        <div
          className="mx-auto mt-3"
          style={{ width: 60, height: 3, background: "linear-gradient(90deg, var(--accent), transparent)", borderRadius: 2 }}
        />
      )}
      {subtitle && (
        <p className="mt-4 text-base max-w-2xl" style={{ color: "var(--text-muted)", marginLeft: centered ? "auto" : 0, marginRight: centered ? "auto" : 0 }}>
          {subtitle}
        </p>
      )}
    </div>
  )
}
