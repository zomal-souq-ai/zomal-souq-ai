import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(url, key);

export const getSession = async () => {
  const { data } = await supabase.auth.getSession();
  return data;
};

export const signUpUser = async (email, password, full_name, role) => {
  return await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name, role } },
  });
};

export const signInUser = async (email, password) => {
  return await supabase.auth.signInWithPassword({ email, password });
};

export const signOutUser = () => supabase.auth.signOut();

export const getProducts = async (category = "") => {
  let q = supabase.from("products").select("*");
  if (category) q = q.eq("category", category);
  const { data, error } = await q;
  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }
  return data;
};

export const getMyStores = async (ownerId) => {
  return await supabase.from("stores").select("*").eq("owner_id", ownerId);
};

export const createStore = async (ownerId, name, description, image_url = "") => {
  return await supabase
    .from("stores")
    .insert({ owner_id: ownerId, name, description, image_url: image_url || null })
    .select();
};

export const getMyProducts = async (storeIds = []) => {
  if (!storeIds.length) return { data: [], error: null };
  return await supabase.from("products").select("*").in("store_id", storeIds);
};

export const createProduct = async (product) => {
  return await supabase.from("products").insert(product).select();
};
