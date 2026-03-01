import { s as supabase } from "../../chunks/supabaseClient.js";
const ssr = false;
const load = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return {
    session
  };
};
export {
  load,
  ssr
};
