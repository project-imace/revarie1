"use server";
import { cookies } from "next/headers";
import { vaultFetch } from "./vault";
import { signToken, verifyToken } from "./session";

export async function setAuthCookie(participantId) {
  const token = await signToken(participantId);
  const cookieStore = await cookies();
  cookieStore.set("participantId", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    domain: "",
    path: "/",
    maxAge: 30 * 24 * 60 * 60,
  });
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("participantId")?.value;
  if (!token) return null;
  const participantId = await verifyToken(token);
  if (!participantId) return null;
  try {
    return await vaultFetch(`/api/auth/verify?id=${participantId}`);
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete("participantId");
}
