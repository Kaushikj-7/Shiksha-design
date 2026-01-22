export default function InsightBox({ type = 'info', title, message, highlight = false }) {
  const typeStyles = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800'
  };

  const iconEmoji = {
    info: '💡',
    warning: '⚠️',
    success: '✓',
    error: '✗'
  };

  const highlightClass = highlight ? 'bg-yellow-100 border-yellow-300' : '';

  return (
    <div
      className={`border-l-4 p-4 rounded ${typeStyles[type]} ${highlightClass}`}
      role="alert"
    >
      <div className="flex items-start">
        <span className="text-xl mr-3">{iconEmoji[type]}</span>
        <div>
          {title && <h3 className="font-semibold mb-1">{title}</h3>}
          <p className="text-sm">{message}</p>
        </div>
      </div>
    </div>
  );
}
