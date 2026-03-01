import { s as supabase } from "../../../chunks/supabaseClient.js";
const load = async ({ parent }) => {
  const { session } = await parent();
  if (!session?.user) return { preloaded: null };
  const { data: recurringData } = await supabase.from("recurring_transactions").select("*").eq("user_id", session.user.id).order("created_at", { ascending: false }).limit(200);
  return {
    preloaded: {
      recurring: recurringData || []
    }
  };
};
export {
  load
};
