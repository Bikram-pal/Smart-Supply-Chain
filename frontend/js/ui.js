export function showPredictionLoading(resultBox) {
  resultBox.classList.remove("hidden");
  resultBox.innerText = "Predicting...";
  resultBox.style.background = "#e0e3e5";
  resultBox.style.color = "#334155";
}

export function showPredictionResult(resultBox, prediction) {
  resultBox.classList.remove("hidden");
  resultBox.innerText = prediction;

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
