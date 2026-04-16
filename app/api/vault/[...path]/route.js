import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const path = params.path.join('/');
  const searchParams = request.nextUrl.searchParams;
  const queryString = searchParams.toString();
  const endpoint = `/api/${path}${queryString ? `?${queryString}` : ''}`;

  const url = `${process.env.VAULT_API_URL}${endpoint}`;

  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.VAULT_API_KEY,
    },
  });

  const data = await res.text();
  return new Response(data, {
    status: res.status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST(request, { params }) {
  const path = params.path.join('/');
  const body = await request.json();
  const endpoint = `/api/${path}`;

  const url = `${process.env.VAULT_API_URL}${endpoint}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.VAULT_API_KEY,
    },
    body: JSON.stringify(body),
  });

  const data = await res.text();
  return new Response(data, {
    status: res.status,
    headers: { 'Content-Type': 'application/json' },
  });
}
