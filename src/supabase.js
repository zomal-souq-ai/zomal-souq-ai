import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!url || !key) {
  console.warn("أضف متغيرات Supabase في .env");
}

export const supabase = createClient(
  url || "https://placeholder.supabase.co",
  key
);

export const getSession = async () => {
  const { data } = await supabase.auth.getSession();
  return data;
};

export const signUpUser = (email, password, full_name, role) =>
  supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name, role } },
  });

export const signInUser = (email, password) =>
  supabase.auth.signInWithPassword({ email, password });

export const signOutUser = () => supabase.auth.signOut();

export const getProducts = (category = "") => {
  let q = supabase.from("products").select("*");
  if (category) q = q.eq("category", category);
  return q;
};

export const getMyStores = (ownerId) =>
  supabase.from("stores").select("*").eq("owner_id", ownerId);

export const createStore = (owner_id, name, description, logo_url) =>
  supabase
    .from("stores")
    .insert([{ owner_id, name, description, logo_url }])
    .select();

export const getMyProducts = (ids) =>
  ids?.length
    ? supabase.from("products").select("*").in("id", ids)
    : Promise.resolve({ data: [] });

export const createProduct = (p) =>
  supabase.from("products").insert(p).select();
