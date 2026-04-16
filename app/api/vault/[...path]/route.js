import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const url = new URL(request.url);
    let pathname = url.pathname;

    // Remove the '/api/vault' prefix to get the Worker endpoint
    const endpoint = pathname.replace(/^\/api\/vault/, '') + url.search;

    const vaultUrl = process.env.VAULT_API_URL;
    const vaultKey = process.env.VAULT_API_KEY;

    if (!vaultUrl || !vaultKey) {
      return new Response(JSON.stringify({ error: 'Missing environment variables' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const workerUrl = `${vaultUrl}${endpoint}`;

    const res = await fetch(workerUrl, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': vaultKey,
      },
    });

    const data = await res.text();
    return new Response(data, {
      status: res.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST(request) {
  try {
    const url = new URL(request.url);
    let pathname = url.pathname;

    // Remove the '/api/vault' prefix
    const endpoint = pathname.replace(/^\/api\/vault/, '');

    const vaultUrl = process.env.VAULT_API_URL;
    const vaultKey = process.env.VAULT_API_KEY;

    if (!vaultUrl || !vaultKey) {
      return new Response(JSON.stringify({ error: 'Missing environment variables' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const workerUrl = `${vaultUrl}${endpoint}`;
    const body = await request.json();

    const res = await fetch(workerUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': vaultKey,
      },
      body: JSON.stringify(body),
    });

    const data = await res.text();
    return new Response(data, {
      status: res.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
