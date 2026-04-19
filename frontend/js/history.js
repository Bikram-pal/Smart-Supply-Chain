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

export function renderHistoryTable(entries, tableElement) {
  tableElement.innerHTML = "";

  if (!entries.length) {
    tableElement.innerHTML = `
      <tr>
        <td colspan="5" class="empty-state">
          No predictions yet. Run a risk prediction to populate the ledger.
        </td>
      </tr>
    `;
    return;
  }

  entries.forEach((item) => {
    const isHighRisk = String(item.result).includes("High");
    const weatherLabel = String(item.input?.weather) === "1" ? "Bad" : "Good";

    const row = `
      <tr class="table-row">
        <td class="px-5 md:px-7 py-4 text-sm text-slate-600 whitespace-nowrap">${formatTimestamp(item.timestamp)}</td>
        <td class="px-5 md:px-7 py-4 text-sm font-medium text-slate-900">${item.input?.distance ?? "-"} km</td>
        <td class="px-5 md:px-7 py-4 text-sm text-slate-800">${item.input?.delay ?? "-"} hrs</td>
        <td class="px-5 md:px-7 py-4 text-sm text-slate-700">${weatherLabel}</td>
        <td class="px-5 md:px-7 py-4">
          <span class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${isHighRisk ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"}">
            ${item.result}
          </span>
        </td>
      </tr>
    `;

    tableElement.innerHTML += row;
  });
}
