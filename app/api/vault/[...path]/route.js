async function handler(request) {
  try {
    const url = new URL(request.url);
    let pathname = url.pathname;

    
    const endpoint = pathname.replace(/^\/api\/vault/, "") + url.search;

    const vaultUrl = process.env.VAULT_API_URL;
    const vaultKey = process.env.VAULT_API_KEY;

    if (!vaultUrl || !vaultKey) {
      return new Response(
        JSON.stringify({ error: "Missing environment variables" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const workerUrl = `${vaultUrl}${endpoint}`;
    console.log("workerUrl", workerUrl);

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
    const data = await res.text();

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
