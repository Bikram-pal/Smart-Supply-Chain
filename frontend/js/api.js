const BASE_URL = "http://127.0.0.1:5000";

export async function requestPrediction(payload) {
  const response = await fetch(`${BASE_URL}/predict`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  return response.json();
}

export async function fetchHistoryData() {
  const response = await fetch(`${BASE_URL}/history`);
  return response.json();
}
