import { createClient } from '@supabase/supabase-js'

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Browser / component client (anon key)
export const supabase = createClient(supabaseUrl, supabaseAnon)

// Server-only admin client (service role — never expose to browser)
export function supabaseAdmin() {
  if (typeof window !== 'undefined') {
    throw new Error('supabaseAdmin must only be used server-side')
  }
  return createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
