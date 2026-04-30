async function handler(request) {
  try {
    const url = new URL(request.url);
    const vaultUrlEnv = process.env.VAULT_API_URL;
    const vaultKey = process.env.VAULT_API_KEY;

    if (!vaultUrlEnv || !vaultKey) {
      return new Response(
        JSON.stringify({ error: "Missing environment variables" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // Safely construct the worker URL
    const workerUrl = new URL(vaultUrlEnv);
    const endpointPath = url.pathname.replace(/^\/api\/vault/, "");

    // Prepend a slash if it doesn't have one and join with base pathname
    // This ensures we stay within the intended host and path structure
    const joinedPath = (workerUrl.pathname + "/" + endpointPath).replace(/\/+/g, "/");
    workerUrl.pathname = joinedPath;
    workerUrl.search = url.search;

    console.log("workerUrl", workerUrl.toString());

    const fetchOptions = {
      method: request.method,
      headers: {
        "Content-Type": request.headers.get("content-type") || "application/json",
        "x-api-key": vaultKey,
      },
    };

    if (request.method !== "GET" && request.method !== "HEAD") {
      fetchOptions.body = await request.text();
    }

    const res = await fetch(workerUrl, fetchOptions);
    let data = await res.text();

    if (!res.ok) {
      console.error(`Vault API error ${res.status}:`, data);
      data = JSON.stringify({ error: `Vault API error ${res.status}` });
    }

    const responseHeaders = new Headers(res.headers);
    responseHeaders.set("Content-Type", "application/json");
    responseHeaders.delete("Content-Encoding");
    responseHeaders.delete("Content-Length");
    responseHeaders.delete("Transfer-Encoding");

    return new Response(data, {
      status: res.status,
      headers: responseHeaders,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export { handler as GET, handler as POST };
