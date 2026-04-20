export function showPredictionLoading(resultBox) {
  resultBox.classList.remove("hidden");
  resultBox.innerText = "Predicting...";
  resultBox.style.background = "#e0e3e5";
  resultBox.style.color = "#334155";
}

export function showPredictionResult(resultBox, prediction, confidence, riskProbability = null) {
  resultBox.classList.remove("hidden");

  const confidenceValue = Number(confidence);
  const safeProbability = Number(
    riskProbability?.safe ?? (prediction.includes("High") ? 100 - confidenceValue : confidenceValue)
  );
  const highRiskProbability = Number(
    riskProbability?.high_risk ?? (prediction.includes("High") ? confidenceValue : 100 - confidenceValue)
  );

  const confidenceText = Number.isFinite(confidenceValue)
    ? `${confidenceValue.toFixed(1)}%`
    : "-";
  const safeText = Number.isFinite(safeProbability) ? `${safeProbability.toFixed(1)}%` : "-";
  const highText = Number.isFinite(highRiskProbability) ? `${highRiskProbability.toFixed(1)}%` : "-";

  resultBox.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 4px; width: 100%; align-items: center;">
      <div>${prediction}</div>
      <div style="font-size: 0.9rem; font-weight: 600;">Confidence: ${confidenceText}</div>
      <div style="font-size: 0.85rem; font-weight: 600;">
        <span style="color: #047857;">Safe: ${safeText}</span>
        <span style="color: #64748b;"> | </span>
        <span style="color: #b91c1c;">High Risk: ${highText}</span>
      </div>
    </div>
  `;

  if (prediction.includes("High")) {
    resultBox.style.background = "#ffdad6";
    resultBox.style.color = "#93000a";
  } else {
    resultBox.style.background = "#d1fae5";
    resultBox.style.color = "#065f46";
  }
}

export function showPredictionError(resultBox, message = "Server error") {
  resultBox.classList.remove("hidden");
  resultBox.innerText = `Error: ${message}`;
  resultBox.style.background = "#ffdad6";
  resultBox.style.color = "#93000a";
}
