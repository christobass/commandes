import { createClient } from '@supabase/supabase-js'

// ⚠️ REMPLACEZ AVEC VOS INFORMATIONS DE L'ÉTAPE 2.4
const supabaseUrl = 'https://pzailvvjosssdluuabaj.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6YWlsdnZqb3Nzc2RsdXVhYmFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5OTMzNDIsImV4cCI6MjA3NjU2OTM0Mn0.5gfX3gevuD1Q7a9AhYB7i03Rp3e79s0HrrYowWy8Y38'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)