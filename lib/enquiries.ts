import "server-only";
import { db } from "./supabase";

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  interest: string;
  message?: string;
  createdAt: string;
  handled?: boolean;
}

type Row = {
  id: string; name: string; email: string; phone: string | null;
  interest: string; message: string | null; created_at: string; handled: boolean;
};

function toEnquiry(r: Row): Enquiry {
  return {
    id: r.id, name: r.name, email: r.email, phone: r.phone || undefined,
    interest: r.interest, message: r.message || undefined,
    createdAt: r.created_at, handled: r.handled,
  };
}

export async function addEnquiry(
  input: Omit<Enquiry, "id" | "createdAt" | "handled">
): Promise<Enquiry> {
  const { data, error } = await db()
    .from("enquiries")
    .insert({
      name: input.name,
      email: input.email,
      phone: input.phone ?? null,
      interest: input.interest,
      message: input.message ?? null,
    })
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return toEnquiry(data as Row);
}

export async function listEnquiries(): Promise<Enquiry[]> {
  const { data, error } = await db()
    .from("enquiries")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data as Row[]).map(toEnquiry);
}

export async function setEnquiryHandled(
  id: string,
  handled: boolean
): Promise<Enquiry | null> {
  const { data, error } = await db()
    .from("enquiries")
    .update({ handled })
    .eq("id", id)
    .select("*")
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? toEnquiry(data as Row) : null;
}

export async function deleteEnquiry(id: string): Promise<boolean> {
  const { data, error } = await db()
    .from("enquiries")
    .delete()
    .eq("id", id)
    .select("id");
  if (error) throw new Error(error.message);
  return Array.isArray(data) && data.length > 0;
}
