import { s as supabase } from "../../../chunks/supabaseClient.js";
import { P as PAGE_SIZE } from "../../../chunks/data.js";
const load = async ({ parent }) => {
  const { session } = await parent();
  if (!session?.user) return { preloaded: null };
  const page = 1;
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;
  let countQ = supabase.from("transactions").select("id", { count: "exact", head: true });
  let dataQ = supabase.from("transactions").select("*").order("date", { ascending: false }).order("created_at", { ascending: false }).range(from, to);
  let categoriesQ = supabase.from("categories").select("*").order("created_at", { ascending: true }).limit(100);
  const [{ count, error: cErr }, { data: txsData, error: dErr }, { data: catData }] = await Promise.all([countQ, dataQ, categoriesQ]);
  const total = count ?? 0;
  const pagedResult = {
    data: txsData ?? [],
    total,
    page,
    totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE))
  };
  return {
    preloaded: {
      transactionsPaged: pagedResult,
      categories: catData || []
    }
  };
};
export {
  load
};
