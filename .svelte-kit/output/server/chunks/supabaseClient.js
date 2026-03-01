import { createClient } from "@supabase/supabase-js";
import { D as DEV } from "./false.js";
const PUBLIC_SUPABASE_URL = "https://pwmtwwuhehocmpivrjpe.supabase.co";
const PUBLIC_SUPABASE_PUBLISHABLE_KEY = "sb_publishable_w4RhWkOLOoXsJO7a_Kd2qA_2sq01zjc";
const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
  ...DEV
});
export {
  supabase as s
};
