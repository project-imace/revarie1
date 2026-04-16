import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const path = params.path.join('/');
    const searchParams = request.nextUrl.searchParams;
    const queryString = searchParams.toString();
    const endpoint = `/api/${path}${queryString ? `?${queryString}` : ''}`;

    const vaultUrl = process.env.VAULT_API_URL;
    const vaultKey = process.env.VAULT_API_KEY;

    if (!vaultUrl || !vaultKey) {
      return new Response(JSON.stringify({ error: 'Missing VAULT_API_URL or VAULT_API_KEY in environment' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const url = `${vaultUrl}${endpoint}`;

    const res = await fetch(url, {
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
    return new Response(JSON.stringify({ error: error.message, stack: error.stack }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST(request, { params }) {
  try {
    const path = params.path.join('/');
    const body = await request.json();
    const endpoint = `/api/${path}`;

    const vaultUrl = process.env.VAULT_API_URL;
    const vaultKey = process.env.VAULT_API_KEY;

    if (!vaultUrl || !vaultKey) {
      return new Response(JSON.stringify({ error: 'Missing VAULT_API_URL or VAULT_API_KEY' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const url = `${vaultUrl}${endpoint}`;

    const res = await fetch(url, {
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
