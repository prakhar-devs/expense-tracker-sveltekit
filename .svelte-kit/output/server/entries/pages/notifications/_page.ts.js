import { s as supabase } from "../../../chunks/supabaseClient.js";
import { format, subMonths } from "date-fns";
const load = async ({ parent }) => {
  const { session } = await parent();
  if (!session?.user) return { preloaded: null };
  const twelveMonthsAgo = format(subMonths(/* @__PURE__ */ new Date(), 12), "yyyy-MM-dd");
  const [budgetsRes, txsRes, recurringRes] = await Promise.all([
    supabase.from("budgets").select("*").order("created_at", { ascending: false }).limit(100),
    supabase.from("transactions").select("*").gte("date", twelveMonthsAgo).order("date", { ascending: false }).order("created_at", { ascending: false }),
    supabase.from("recurring_transactions").select("*").order("created_at", { ascending: false }).limit(200)
  ]);
  return {
    preloaded: {
      budgets: budgetsRes.data || [],
      transactions: txsRes.data || [],
      recurring: recurringRes.data || []
    }
  };
};
export {
  load
};
