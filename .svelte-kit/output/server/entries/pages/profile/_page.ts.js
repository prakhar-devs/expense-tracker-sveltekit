import { s as supabase } from "../../../chunks/supabaseClient.js";
import { format, subMonths } from "date-fns";
const load = async ({ parent }) => {
  const { session } = await parent();
  if (!session?.user) return { preloaded: null };
  const userId = session.user.id;
  const twelveMonthsAgo = format(subMonths(/* @__PURE__ */ new Date(), 12), "yyyy-MM-dd");
  const [profileRes, txsRes, categoriesRes] = await Promise.all([
    supabase.from("profiles").select("*").eq("user_id", userId).single(),
    supabase.from("transactions").select("*").gte("date", twelveMonthsAgo).order("date", { ascending: false }).order("created_at", { ascending: false }),
    supabase.from("categories").select("*").order("created_at", { ascending: true }).limit(100)
  ]);
  return {
    preloaded: {
      profile: profileRes.data || null,
      transactions: txsRes.data || [],
      categories: categoriesRes.data || []
    }
  };
};
export {
  load
};
