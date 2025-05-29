import { createClient } from "@supabase/supabase-js";
import { type Database } from "./supabase.ts";

const supabaseUrl = 'https://gbptwxyoudiviyatpzvm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdicHR3eHlvdWRpdml5YXRwenZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwNzUyMDAsImV4cCI6MjA2MzY1MTIwMH0.JuFClU67QpkzzUgzaS-Ua819-vyhzTNAcQAH23tQ8iE';
const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export default supabase;