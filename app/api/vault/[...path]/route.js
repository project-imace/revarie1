async function handler(request) {
  try {
    const url = new URL(request.url);
    let pathname = url.pathname;

    // Remove the '/api/vault' prefix to get the Worker endpoint
    const endpoint =
      pathname.replace(/^\/api\/vault/, "").replace(/^\/api/, "") + url.search;

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
    const res = await fetch(workerUrl, {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": vaultKey,
      },
    });

    console.log(res);

    // console.log(res);

    const data = await res.text();
    return new Response(data, {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export { handler as GET, handler as POST };
