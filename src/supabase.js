import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('请在这里') || supabaseKey.includes('请在这里')) {
  console.error('Supabase 配置缺失或未正确填写')
  console.error('请在 .env 文件中填写正确的 VITE_SUPABASE_URL 和 VITE_SUPABASE_ANON_KEY')
}

export const supabase = supabaseUrl && supabaseKey && !supabaseUrl.includes('请在这里') && !supabaseKey.includes('请在这里')
  ? createClient(supabaseUrl, supabaseKey)
  : null

