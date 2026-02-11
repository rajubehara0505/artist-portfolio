import { NextResponse } from "next/server"
import { Resend } from "resend"
import { createClient } from "@supabase/supabase-js"

export async function POST(req: Request) {
  try {
    // ✅ Guard envs (prevents build-time crashes + clearer runtime errors)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY
    const resendKey = process.env.RESEND_API_KEY
    const inquiryFrom = process.env.INQUIRY_FROM_EMAIL
    const inquiryTo = process.env.INQUIRY_TO_EMAIL

    if (!resendKey) return NextResponse.json({ error: "RESEND_API_KEY missing" }, { status: 500 })
    if (!inquiryFrom || !inquiryTo) {
      return NextResponse.json({ error: "INQUIRY_FROM_EMAIL / INQUIRY_TO_EMAIL missing" }, { status: 500 })
    }
    if (!supabaseUrl || !serviceRole) {
      return NextResponse.json({ error: "Supabase server env missing" }, { status: 500 })
    }

    // ✅ Lazy init inside handler (no build-time evaluation issues)
    const resend = new Resend(resendKey)
    const supabase = createClient(supabaseUrl, serviceRole)

    const body = await req.json()

    const name = String(body.name ?? "").trim()
    const email = String(body.email ?? "").trim()
    const subject = String(body.subject ?? "New inquiry").trim()
    const message = String(body.message ?? "").trim()
    const productSlug = String(body.productSlug ?? "").trim()
    const productTitle = String(body.productTitle ?? "").trim()

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    const artworkUrl = productSlug ? `${baseUrl}/artwork/${encodeURIComponent(productSlug)}` : ""

    // 1) Send email
    const { error: emailErr } = await resend.emails.send({
      from: inquiryFrom,
      to: [inquiryTo],
      replyTo: email,
      subject: `Inquiry: ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\n\nArtwork Link: ${artworkUrl || "N/A"}\n\nMessage:\n${message}`,
    })

    if (emailErr) {
      return NextResponse.json({ error: emailErr.message }, { status: 500 })
    }

    // 2) Save to DB (backup)
    const { error: dbErr } = await supabase.from("inquiries").insert({
      name,
      email,
      subject: subject || null,
      message,
      product_slug: productSlug || null,
      product_title: productTitle || null,
    })

    if (dbErr) {
      // email already sent, but we should still tell server logs / client
      return NextResponse.json({ error: `Saved email but DB insert failed: ${dbErr.message}` }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "Invalid request" }, { status: 500 })
  }
}
