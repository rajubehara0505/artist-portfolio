import { NextResponse } from "next/server"
import { getSupabaseServer } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = getSupabaseServer()
    const { data, error } = await supabase.from("products").select("id").limit(1)

    // Always return 200 so GitHub ping doesn't fail,
    // but include ok=false when DB is paused/unreachable.
    const res = NextResponse.json({
      ok: !error,
      error: error?.message ?? null,
      sample: data ?? [],
      ts: new Date().toISOString(),
    })

    // Ensure no caching (so it really pings the backend)
    res.headers.set("Cache-Control", "no-store, max-age=0")
    return res
  } catch (e: any) {
    const res = NextResponse.json(
      { ok: false, error: e?.message ?? "Unknown error", ts: new Date().toISOString() },
      { status: 200 }
    )
    res.headers.set("Cache-Control", "no-store, max-age=0")
    return res
  }
}
