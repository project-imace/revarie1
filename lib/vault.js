export async function vaultFetch(endpoint, options = {}) {
  const isServer = typeof window === "undefined";
  const vaultUrl = process.env.VAULT_API_URL;
  const vaultKey = process.env.VAULT_API_KEY;
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

  if (isServer && vaultUrl && vaultKey) {
    // On server, go directly to the Worker
    const normalizedEndpoint = endpoint.startsWith("/api/")
      ? endpoint.replace(/^\/api/, "")
      : endpoint;
    const workerUrl = `${vaultUrl}${normalizedEndpoint}`;
    const res = await fetch(workerUrl, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        "x-api-key": vaultKey,
        ...options.headers,
      },
    });
    if (!res.ok) {
      const errorText = await res.text();
      let errorMessage = errorText;
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.error || errorJson.message || errorText;
      } catch {
        // Fallback to errorText if JSON parsing fails
      }
      throw new Error(`Vault API error ${res.status}: ${errorMessage}`);
    }
    return res.json();
  }

  // On client, route through internal API proxy
  const normalizedEndpoint = endpoint.startsWith("/api/")
    ? endpoint.replace(/^\/api/, "")
    : endpoint;
  const internalPath = `${basePath}/api/vault${normalizedEndpoint}`;
  const res = await fetch(internalPath, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  if (!res.ok) {
    const errorText = await res.text();
    let errorMessage = errorText;
    try {
      const errorJson = JSON.parse(errorText);
      errorMessage = errorJson.error || errorJson.message || errorText;
    } catch {
      // Fallback to errorText if JSON parsing fails
    }
    throw new Error(`API error ${res.status}: ${errorMessage}`);
  }

  return res.json();
}
