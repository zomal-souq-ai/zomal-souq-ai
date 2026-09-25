import { createClient } from "@supabase/supabase-js";
const url = 'https://supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdW...';
export const supabase = (url && key) ? createClient(url, key) : null;
export const getSession = async () => {
    if (!supabase) return null;
    const { data } = await supabase.auth.getSession();
    return data;
};

export const signUpUser = async (email, password, full_name, role) => {
    if (!supabase) return { error: { message: "المفاتيح غير متوفرة" } };
    return await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name, role } },
    });
};

export const signInUser = async (email, password) => {
    if (!supabase) return { error: { message: "المفاتيح غير متوفرة" } };
    return await supabase.auth.signInWithPassword({ email, password });
};

export const signOutUser = () => {
    if (!supabase) return null;
    return supabase.auth.signOut();
};

export const getProducts = async (category = "") => {
    if (!supabase) return [];
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
    if (!supabase) return [];
    const { data, error } = await supabase.from("stores").select("*").eq("owner_id", ownerId);
    if (error) return [];
    return data;
};

export const createStore = async (ownerId, name, description, image_url) => {
    if (!supabase) return { error: { message: "المفاتيح غير متوفرة" } };
    return await supabase.from("stores").insert([{ owner_id: ownerId, name, description, image_url }]);
};
