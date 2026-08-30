function PageHeader({ title, subtitle, onBack }) {
  return (
    <div className="page-header">
      <button className="back-button" onClick={onBack}>
        ← Back
      </button>

      <p className="eyebrow">CRICKET ACADEMY</p>
      <h1>{title}</h1>

      {subtitle && <p>{subtitle}</p>}
    </div>
  );
}

export default PageHeader;