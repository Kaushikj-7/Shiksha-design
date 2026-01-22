import InsightBox from './InsightBox';

/**
 * Displays validation results from Rules Engine
 * Groups by severity: ERRORS (must fix) → WARNINGS (should fix) → INFO (helpful) → SUCCESS
 */
export default function ValidationDisplay({ validationResult }) {
  if (!validationResult || !validationResult.results) {
    return null;
  }

  const { results } = validationResult;
  if (results.length === 0) {
    return null;
  }

  // Group by severity
  const grouped = {
    ERROR: [],
    WARNING: [],
    INFO: [],
    SUCCESS: []
  };

  results.forEach((result) => {
    if (grouped[result.severity]) {
      grouped[result.severity].push(result);
    }
  });

  return (
    <div className="space-y-3">
      {/* Errors */}
      {grouped.ERROR.map((result, idx) => (
        <InsightBox
          key={`error-${idx}`}
          type="error"
          title="Fix This"
          message={result.message}
          suggestion={result.suggestion}
        />
      ))}

      {/* Warnings */}
      {grouped.WARNING.map((result, idx) => (
        <InsightBox
          key={`warning-${idx}`}
          type="warning"
          title="Please Review"
          message={result.message}
          suggestion={result.suggestion}
        />
      ))}

      {/* Info */}
      {grouped.INFO.map((result, idx) => (
        <InsightBox
          key={`info-${idx}`}
          type="info"
          title="Tip"
          message={result.message}
          suggestion={result.suggestion}
        />
      ))}

      {/* Success */}
      {grouped.SUCCESS.map((result, idx) => (
        <InsightBox
          key={`success-${idx}`}
          type="success"
          title="Great!"
          message={result.message}
        />
      ))}
    </div>
  );
}
