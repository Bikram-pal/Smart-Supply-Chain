let chartInstance = null;

function formatTimestamp(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString([], {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}

async function predict() {
  const distance = document.getElementById("distance").value;
  const delay = document.getElementById("delay").value;
  const weather = document.getElementById("weather").value;
  const resultBox = document.getElementById("resultBox");

  if (!distance || !delay || weather === "") {
    alert("Please fill all fields");
    return;
  }

  resultBox.classList.remove("hidden");
  resultBox.innerText = "⏳ Predicting...";
  resultBox.style.background = "#e0e3e5";

  try {
    const response = await fetch("http://127.0.0.1:5000/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        distance: Number(distance),
        delay: Number(delay),
        weather: Number(weather)
      })
    });

    const data = await response.json();

    if (data.status === "success") {
      resultBox.innerText = data.prediction;

      if (data.prediction.includes("High")) {
        resultBox.style.background = "#ffdad6";
        resultBox.style.color = "#93000a";
      } else {
        resultBox.style.background = "#d1fae5";
        resultBox.style.color = "#065f46";
      }

      loadHistory();
      loadChart();

    } else {
      resultBox.innerText = data.message;
    }

  } catch (error) {
    resultBox.innerText = "❌ Server error";
  }
}


// 🔥 HISTORY FUNCTION
async function loadHistory() {
  try {
    const response = await fetch("http://127.0.0.1:5000/history");
    const data = await response.json();

    const table = document.getElementById("historyTable");
    table.innerHTML = "";

    if (data.data.length === 0) {
      table.innerHTML = `
        <tr>
          <td colspan="5" class="px-6 py-10 text-center text-sm text-slate-500">
            No predictions yet. Run a risk prediction to populate the ledger.
          </td>
        </tr>
      `;
      return;
    }

    data.data.forEach(item => {
      const isHighRisk = item.result.includes("High");
      const weatherLabel = String(item.input.weather) === "1" ? "Bad" : "Good";

      const row = `
        <tr class="border-b border-slate-100 hover:bg-slate-50/70 transition-colors">
          <td class="px-5 md:px-7 py-4 text-sm text-slate-600 whitespace-nowrap">${formatTimestamp(item.timestamp)}</td>
          <td class="px-5 md:px-7 py-4 text-sm font-medium text-slate-900">${item.input.distance} km</td>
          <td class="px-5 md:px-7 py-4 text-sm text-slate-800">${item.input.delay} hrs</td>
          <td class="px-5 md:px-7 py-4 text-sm text-slate-700">${weatherLabel}</td>
          <td class="px-5 md:px-7 py-4">
            <span class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${isHighRisk ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"}">
              ${item.result}
            </span>
          </td>
        </tr>
      `;
      table.innerHTML += row;
    });

  } catch (error) {
    console.error("History load error:", error);
  }
}

// Add Chart Logic

async function loadChart() {
  try {
    const response = await fetch("http://127.0.0.1:5000/history");
    const data = await response.json();

    let high = 0;
    let safe = 0;

    data.data.forEach(item => {
      if (item.result.includes("High")) high++;
      else safe++;
    });

    const canvas = document.getElementById("riskChart");

    if (!canvas) {
      console.error("Chart canvas not found");
      return;
    }

    const ctx = canvas.getContext("2d");

    if (chartInstance) {
      chartInstance.destroy();
    }

    chartInstance = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Safe", "High Risk"],
        datasets: [{
          data: [safe, high],
          backgroundColor: ["#d1fae5", "#ffdad6"],
          borderColor: ["#10b981", "#dc2626"],
          borderWidth: 2
        }]
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

  } catch (error) {
    console.error("Chart error:", error);
  }
}


// auto load
window.onload = () => {
  loadHistory();
  loadChart();
};