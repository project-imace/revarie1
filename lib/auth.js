"use server";
import { cookies } from "next/headers";
import { vaultFetch } from "./vault";

export async function setAuthCookie(participantId) {
  const cookieStore = await cookies();
  cookieStore.set("participantId", participantId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60,
    path: "/",
  });
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const participantId = cookieStore.get("participantId")?.value;
  if (!participantId) return null;
  try {
    return await vaultFetch(`/api/auth/verify?id=${participantId}`);
  } catch {
    return null;
  }
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete("participantId");
}
