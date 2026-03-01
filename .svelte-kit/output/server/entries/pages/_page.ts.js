import { s as supabase } from "../../chunks/supabaseClient.js";
import { format, subMonths } from "date-fns";
import { redirect } from "@sveltejs/kit";
const load = async ({ parent }) => {
  const { session } = await parent();
  if (!session?.user) throw redirect(303, "/auth");
  session.user.id;
  const twelveMonthsAgo = format(subMonths(/* @__PURE__ */ new Date(), 12), "yyyy-MM-dd");
  const [txsRes, budgetsRes] = await Promise.all([
    supabase.from("transactions").select("*").gte("date", twelveMonthsAgo).order("date", { ascending: false }).order("created_at", { ascending: false }),
    supabase.from("budgets").select("*").order("created_at", { ascending: false }).limit(100)
  ]);
  return {
    preloaded: {
      transactions: txsRes.data || [],
      budgets: budgetsRes.data || []
    }
  };
};
export {
  load
};
