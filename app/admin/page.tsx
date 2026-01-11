"use client"

import type React from "react"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { LogIn } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { supabaseBrowser } from "@/lib/supabase/browser"

export default function AdminLoginPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    const { data, error } = await supabaseBrowser.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) {
      setIsLoading(false)
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      })
      return
    }

    const userId = data.user?.id
    if (!userId) {
      await supabaseBrowser.auth.signOut()
      setIsLoading(false)
      toast({
        title: "Login failed",
        description: "No user returned from Supabase.",
        variant: "destructive",
      })
      return
    }

    // Check admin in profiles
    const { data: profile, error: profileError } = await supabaseBrowser
      .from("profiles")
      .select("is_admin")
      .eq("id", userId)
      .single()

    if (profileError) {
      await supabaseBrowser.auth.signOut()
      setIsLoading(false)
      toast({
        title: "Login failed",
        description: profileError.message,
        variant: "destructive",
      })
      return
    }

    if (!profile?.is_admin) {
      await supabaseBrowser.auth.signOut()
      setIsLoading(false)
      toast({
        title: "Access denied",
        description: "Your account is not an admin. Add your email to admin_allowlist and sign up again.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(false)
    router.push("/admin/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-serif">Admin Login</CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Enter your credentials to access the admin panel
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@praveearts.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                "Logging in..."
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </>
              )}
            </Button>

            <div className="text-sm text-muted-foreground">
              Need an admin account?{" "}
              <Link href="/admin/signup" className="underline underline-offset-4">
                Create one
              </Link>
            </div>

            <div className="mt-4 p-3 bg-muted rounded-md text-xs text-muted-foreground">
              <p className="font-semibold mb-1">Note:</p>
              <p>
                Your email must be in <code>public.admin_allowlist</code> <span className="whitespace-nowrap">before</span>{" "}
                signup, otherwise <code>is_admin</code> will stay false.
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
