import { requestPrediction, fetchHistoryData } from "./api.js";
import { renderHistoryTable } from "./history.js";
import { renderRiskChart } from "./chart.js";
import {
  showPredictionLoading,
  showPredictionResult,
  showPredictionError
} from "./ui.js";

async function loadComponent(slotSelector, componentPath) {
  const slot = document.querySelector(slotSelector);
  if (!slot) {
    return;
  }

  const response = await fetch(componentPath);
  const markup = await response.text();
  slot.innerHTML = markup;
}

async function refreshDashboardData() {
  const historyTable = document.getElementById("historyTable");
  const riskChart = document.getElementById("riskChart");

  if (!historyTable || !riskChart) {
    return;
  }

  try {
    const historyResponse = await fetchHistoryData();
    const entries = Array.isArray(historyResponse.data) ? historyResponse.data : [];

    renderHistoryTable(entries, historyTable);
    renderRiskChart(entries, riskChart);
  } catch (error) {
    historyTable.innerHTML = `
      <tr>
        <td colspan="5" class="empty-state">Unable to load history right now.</td>
      </tr>
    `;
  }
}

async function handlePredictSubmit(event) {
  event.preventDefault();

  const distance = document.getElementById("distance")?.value;
  const delay = document.getElementById("delay")?.value;
  const weather = document.getElementById("weather")?.value;
  const resultBox = document.getElementById("resultBox");

  if (!resultBox) {
    return;
  }

  if (!distance || !delay || weather === "") {
    alert("Please fill all fields");
    return;
  }

  showPredictionLoading(resultBox);

  try {
    const predictionResponse = await requestPrediction({
      distance: Number(distance),
      delay: Number(delay),
      weather: Number(weather)
    });

    if (predictionResponse.status === "success") {
      showPredictionResult(resultBox, predictionResponse.prediction);
      await refreshDashboardData();
    } else {
      showPredictionError(resultBox, predictionResponse.message || "Prediction failed");
    }
  } catch (error) {
    showPredictionError(resultBox, "Server error");
  }
}

function bindUIEvents() {
  const predictionForm = document.getElementById("predictionForm");
  const refreshButton = document.getElementById("refreshHistoryBtn");

  if (predictionForm) {
    predictionForm.addEventListener("submit", handlePredictSubmit);
  }

  if (refreshButton) {
    refreshButton.addEventListener("click", refreshDashboardData);
  }
}

async function initializeDashboard() {
  await Promise.all([
    loadComponent("#sidebar-slot", "components/sidebar.html"),
    loadComponent("#navbar-slot", "components/navbar.html"),
    loadComponent("#cards-slot", "components/cards.html")
  ]);

  bindUIEvents();
  await refreshDashboardData();
}

document.addEventListener("DOMContentLoaded", initializeDashboard);
