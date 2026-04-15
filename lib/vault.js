export async function vaultFetch(endpoint, options = {}) {
  // Route through our internal API proxy
  const internalPath = `/api/vault${endpoint}`;
  const res = await fetch(internalPath, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  if (!res.ok) {
    const error = await res.text();
    throw new Error(`API error ${res.status}: ${error}`);
  }
  return res.json();
}
