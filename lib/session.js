const encoder = new TextEncoder();

async function getSecretKey() {
  const secret = process.env.VAULT_API_KEY || 'dev-secret-key-at-least-32-chars-long';
  const keyData = encoder.encode(secret);
  return await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

function base64urlEncode(arrayBuffer) {
  const uint8Array = new Uint8Array(arrayBuffer);
  let binary = '';
  for (let i = 0; i < uint8Array.byteLength; i++) {
    binary += String.fromCharCode(uint8Array[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function base64urlDecode(str) {
  try {
    const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  } catch (e) {
    return null;
  }
}

export async function signToken(participantId) {
  if (!participantId) return null;
  const key = await getSecretKey();
  const data = encoder.encode(participantId);
  const signature = await crypto.subtle.sign('HMAC', key, data);
  const encodedSignature = base64urlEncode(signature);
  const encodedPayload = base64urlEncode(data);
  return `${encodedPayload}.${encodedSignature}`;
}

export async function verifyToken(token) {
  try {
    if (!token || typeof token !== 'string') return null;
    const parts = token.split('.');
    if (parts.length !== 2) return null;

    const [encodedPayload, encodedSignature] = parts;
    const key = await getSecretKey();

    const data = base64urlDecode(encodedPayload);
    const signature = base64urlDecode(encodedSignature);

    if (!data || !signature) return null;

    const isValid = await crypto.subtle.verify('HMAC', key, signature, data);
    if (!isValid) return null;

    return new TextDecoder().decode(data);
  } catch (error) {
    // console.error('Token verification failed:', error);
    return null;
  }
}
