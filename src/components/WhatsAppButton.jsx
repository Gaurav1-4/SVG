const WhatsAppButton = ({
  productName = '',
  className = '',
  message = '',
  label = 'Enquire on WhatsApp',
}) => {
  const defaultMsg = productName
    ? `Hi SVG! I am interested in the ${productName}. Can you share more details?`
    : message || 'Hello SVG! I want to enquire about groom wear collection.';

  const openWA = () =>
    window.open(
      `https://wa.me/919555835833?text=${encodeURIComponent(defaultMsg)}`,
      '_blank'
    );

  return (
    <button
      onClick={openWA}
      className={`wa-btn-wrap ${className}`}
      style={{
        background: 'var(--wa)',
        color: '#fff',
        border: 'none',
        padding: '10px 20px',
        fontFamily: 'var(--font-body)',
        fontSize: '10px',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        fontWeight: '600',
        cursor: 'pointer',
        clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
      }}
    >
      <span className="wa-dot"></span>
      {label}
    </button>
  );
};

export default WhatsAppButton;
