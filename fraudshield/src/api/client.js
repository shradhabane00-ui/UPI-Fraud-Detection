// Centralized API client base URL.
// Local default keeps current behavior: http://127.0.0.1:8000

const defaultBase = 'http://127.0.0.1:8000';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || defaultBase;

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

