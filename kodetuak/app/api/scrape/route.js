export const runtime = 'edge'
import { createClient } from "@supabase/supabase-js"
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
const dataToInsert = [
  { tanggal: "2026-09-28", hasil: "1234", hari: "Minggu" },
  { tanggal: "2026-09-27", hasil: "5678", hari: "Sabtu" },
]
export async function GET(){
  const { data, error } = await supabase.from("sdp").upsert(dataToInsert, { onConflict: 'tanggal' }).select()
  return Response.json({ success: true, inserted: data, error: error?.message || null })
}
