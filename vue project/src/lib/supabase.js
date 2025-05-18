// supabase.js

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tviytnmeqyecvylozlfs.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2aXl0bm1lcXllY3Z5bG96bGZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyMzcwNDksImV4cCI6MjA2MTgxMzA0OX0.QrXstLP_Tafrv4SLcxt-kpL-LKwoH8i_NdQXH9Uzvsw'
export const supabase = createClient(supabaseUrl, supabaseKey)
