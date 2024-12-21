import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rrqerqobghjuvbntnnyv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJycWVycW9iZ2hqdXZibnRubnl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ3MTM1MzUsImV4cCI6MjA1MDI4OTUzNX0.NCpa72JHTaRvEy7PdnSrLb0FUyKILpq9QXYMwSLjpyw'
export const supabase = createClient(supabaseUrl, supabaseKey)