// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://vjzleyjgofyjhwjyjbrn.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqemxleWpnb2Z5amh3anlqYnJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwOTU5MzYsImV4cCI6MjA1ODY3MTkzNn0.4urIgRdK17k-6jspPEKcWYYtJrUFP4dX3pifHgKyCWA";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);