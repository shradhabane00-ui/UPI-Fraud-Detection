import { API_BASE_URL } from "../config";

// Backward-compatible export for any existing imports from ../api/client
export { API_BASE_URL };

export function apiUrl(path) {


  // Ensure single slash join.
  const base = API_BASE_URL.replace(/\/+$/, '');
  const p = String(path).replace(/^\/+/, '');
  return `${base}/${p}`;
}

export async function apiGet(path) {
  const res = await fetch(apiUrl(path));
  return res.json();
}

export async function apiPost(path, body) {
  const res = await fetch(apiUrl(path), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  return res.json();
}

