export async function vaultFetch(endpoint, options = {}) {
  const isServer = typeof window === "undefined";
  const vaultUrl = process.env.VAULT_API_URL;
  const vaultKey = process.env.VAULT_API_KEY;

  if (isServer && vaultUrl && vaultKey) {
    // On server, go directly to the Worker
    const workerUrl = `${vaultUrl}${endpoint}`;
    const res = await fetch(workerUrl, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        "x-api-key": vaultKey,
        ...options.headers,
      },
    });
    if (!res.ok) {
      const error = await res.text();
      throw new Error(`Vault API error ${res.status}: ${error}`);
    }
    return res.json();
  }

  // On client, route through internal API proxy
  const internalPath = `/api/vault${endpoint}`;
  const res = await fetch(internalPath, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  if (!res.ok) {
    const error = await res.text();
    throw new Error(`API error ${res.status}: ${error}`);
  }
  return res.json();
}
