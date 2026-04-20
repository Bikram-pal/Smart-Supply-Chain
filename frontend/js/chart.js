let chartInstance = null;

export function renderRiskChart(entries, canvas, riskProbability = null) {
  if (!canvas || typeof Chart === "undefined") {
    return;
  }

  let safe = 0;
  let high = 0;

  if (
    riskProbability &&
    Number.isFinite(Number(riskProbability.safe)) &&
    Number.isFinite(Number(riskProbability.high_risk))
  ) {
    safe = Number(riskProbability.safe);
    high = Number(riskProbability.high_risk);
  } else {
    entries.forEach((item) => {
      if (String(item.result).includes("High")) {
        high += 1;
      } else {
        safe += 1;
      }
    });
  }

  const ctx = canvas.getContext("2d");

  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Safe", "High Risk"],
      datasets: [
        {
          data: [safe, high],
          backgroundColor: ["#d1fae5", "#ffdad6"],
          borderColor: ["#10b981", "#dc2626"],
          borderWidth: 2
        }
      ]
    },
    options: {
      maintainAspectRatio: false,
      responsive: true,
      plugins: {
        tooltip: {
          callbacks: {
            label(context) {
              const value = Number(context.raw) || 0;
              const label = context.label || "";
              const hasProbability = Boolean(riskProbability);
              return hasProbability
                ? `${label}: ${value.toFixed(1)}%`
                : `${label}: ${value}`;
            }
          }
        },
        legend: {
          position: "bottom"
        }
      }
    }
  });
}
