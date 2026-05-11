import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://imilbifdbfleepvjrivr.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_l10TehUgf6-BsJWnkRm_1Q_agVq0oy5';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
