import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tbdmikdfsrsuuxjiikql.supabase.co'
const supabaseKey = 'sb_publishable__NvC-LsXnAdTfDBG-RGU4A_yc7-yWXC'

export const supabase = createClient(supabaseUrl, supabaseKey)
