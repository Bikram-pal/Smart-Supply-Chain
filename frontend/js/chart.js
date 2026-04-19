let chartInstance = null;

export function renderRiskChart(entries, canvas) {
  if (!canvas || typeof Chart === "undefined") {
    return;
  }

  let high = 0;
  let safe = 0;

  entries.forEach((item) => {
    if (String(item.result).includes("High")) {
      high += 1;
    } else {
      safe += 1;
    }
  });

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
        legend: {
          position: "bottom"
        }
      }
    }
  });
}
