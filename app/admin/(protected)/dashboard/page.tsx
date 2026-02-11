"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Plus, Edit, Trash2, LogOut, Home } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { supabaseBrowser } from "@/lib/supabase/browser"
import { LogoLoader } from "@/components/ui/logo-loader"


type ProductRow = {
  id: string
  title: string
  slug: string
  description: string | null
  price_cents: number | null
  currency: string | null
  featured: boolean
  is_published: boolean
}

type InquiryRow = {
  id: string
  name: string
  email: string
  subject: string | null
  message: string
  product_slug: string | null
  product_title: string | null
  created_at: string
}
export default function AdminDashboard() {
  const { toast } = useToast()
  const router = useRouter()

  const [products, setProducts] = useState<ProductRow[]>([])
  const [loading, setLoading] = useState(true)

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [uploading, setUploading] = useState(false)

  // file selection
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedFileName, setSelectedFileName] = useState<string>("")

  // edit dialog state
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editProduct, setEditProduct] = useState<ProductRow | null>(null)
  const [inquiries, setInquiries] = useState<InquiryRow[]>([])
  const [inquiriesLoading, setInquiriesLoading] = useState(false)


  // -------------------------
  // Load products
  // -------------------------
  async function loadProducts() {
    setLoading(true)
    const { data, error } = await supabaseBrowser
      .from("products")
      .select("id,title,slug,description,price_cents,currency,featured,is_published")
      .order("created_at", { ascending: false })

    if (error) {
      toast({ title: "Failed to load products", description: error.message, variant: "destructive" })
      setProducts([])
      setLoading(false)
      return
    }

    setProducts((data ?? []) as ProductRow[])
    setLoading(false)
  }

  // -------------------------
  // Load Inquiry
  // -------------------------
  async function loadInquiries() {
  setInquiriesLoading(true)

  const { data, error } = await supabaseBrowser
    .from("inquiries")
    .select("id,name,email,subject,message,product_slug,product_title,created_at")
    .order("created_at", { ascending: false })
    .limit(10)

  if (error) {
    toast({ title: "Failed to load inquiries", description: error.message, variant: "destructive" })
    setInquiries([])
    setInquiriesLoading(false)
    return
  }

  setInquiries((data ?? []) as InquiryRow[])
  setInquiriesLoading(false)
}


  useEffect(() => {
    loadProducts()
    loadInquiries()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // -------------------------
  // Helpers
  // -------------------------
  function slugifyTitle(title: string) {
    const base =
      title
        .toLowerCase()
        .trim()
        .replace(/['"]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "") || `artwork-${crypto.randomUUID().slice(0, 6)}`
    return base
  }

  async function uploadToStorage(file: File) {
    const ext = file.name.split(".").pop() || "jpg"
    const fileName = `${crypto.randomUUID()}.${ext}`
    const objectPath = `products/${fileName}`

    // ✅ correct bucket: artworks
    const { data, error } = await supabaseBrowser.storage
      .from("artworks")
      .upload(objectPath, file, { upsert: false, contentType: file.type })

    if (error) throw error

    // store ONLY storage path: "products/<file>"
    return { storagePath: data.path }
  }

  // -------------------------
  // Add product: creates product row + cover image row
  // -------------------------
  async function handleSubmitAddProduct(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const form = e.currentTarget
    const titleInput = form.querySelector<HTMLInputElement>("#title")
    const descInput = form.querySelector<HTMLTextAreaElement>("#description")
    const priceInput = form.querySelector<HTMLInputElement>("#price")
    const featuredInput = form.querySelector<HTMLInputElement>("#featured")

    const title = titleInput?.value?.trim() ?? ""
    const description = descInput?.value?.trim() ?? ""
    const priceStr = priceInput?.value?.trim() ?? ""
    const featured = !!featuredInput?.checked

    if (!title) {
      toast({ title: "Title required", description: "Please enter a title.", variant: "destructive" })
      return
    }
    
    if (!selectedFile) {
      toast({
        title: "Please select an image",
        description: "Choose a file first, then click Add artwork.",
        variant: "destructive",
      })
      return
    }

    // Price optional: empty => null => "Price on request"
    const priceCents = priceStr === "" ? null : Math.round(Number(priceStr) * 100)
    if (priceStr !== "" && (Number.isNaN(Number(priceStr)) || Number(priceStr) < 0)) {
      toast({ title: "Invalid price", description: "Price must be ≥ 0 (or leave empty).", variant: "destructive" })
      return
    }

    setUploading(true)
    try {
      // 1) upload image
      const uploaded = await uploadToStorage(selectedFile)

      // 2) create product row (published immediately)
      let slug = slugifyTitle(title)
      const { data: existing } = await supabaseBrowser.from("products").select("id").eq("slug", slug).maybeSingle()
      if (existing) slug = `${slug}-${crypto.randomUUID().slice(0, 6)}`

      const { data: product, error: productErr } = await supabaseBrowser
        .from("products")
        .insert({
          title,
          slug,
          description: description || null,
          price_cents: priceCents,
          currency: "CAD",
          featured,
          is_published: true,
        })
        .select("id,title,slug,description,price_cents,currency,featured,is_published")
        .single()

      if (productErr) throw productErr

      // 3) create cover image row
      const { error: imgErr } = await supabaseBrowser.from("product_images").insert({
        product_id: product.id,
        path: uploaded.storagePath, // ✅ "products/<file>"
        alt: selectedFileName || title,
        sort_order: 0,
      })

      if (imgErr) throw imgErr

      toast({ title: "Artwork added", description: "Created and published successfully." })

      // reset dialog state
      setSelectedFile(null)
      setSelectedFileName("")
      setIsAddDialogOpen(false)

      // update table instantly
      setProducts((prev) => [product as ProductRow, ...prev])
    } catch (err: any) {
      toast({
        title: "Add artwork failed",
        description: err?.message ?? String(err),
        variant: "destructive",
      })
    } finally {
      setUploading(false)
      form.reset()
    }
  }

  // -------------------------
  // Edit product (DB connected)
  // -------------------------
  async function openEdit(p: ProductRow) {
    setIsEditDialogOpen(true)
    setEditProduct(null) // optional: shows blank while loading latest
    
    const { data, error } = await supabaseBrowser
      .from("products")
      .select("id,title,slug,description,price_cents,currency,featured,is_published")
      .eq("id", p.id)
      .single()

    if (error) {
      toast({ title: "Failed to load artwork", description: error.message, variant: "destructive" })
      setIsEditDialogOpen(false)
      return
    }

    setEditProduct(data as ProductRow)
  }


  async function handleSubmitEditProduct(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault()
  if (!editProduct) return

  const current = editProduct // ✅ prevents TS "possibly null" across awaits

  const form = e.currentTarget
  const titleInput = form.querySelector<HTMLInputElement>("#edit_title")
  const descInput = form.querySelector<HTMLTextAreaElement>("#edit_description")
  const priceInput = form.querySelector<HTMLInputElement>("#edit_price")
  const featuredInput = form.querySelector<HTMLInputElement>("#edit_featured")
  const publishedInput = form.querySelector<HTMLInputElement>("#edit_published")

  const title = titleInput?.value?.trim() ?? ""
  const description = descInput?.value?.trim() ?? ""
  const priceStr = priceInput?.value?.trim() ?? ""
  const featured = !!featuredInput?.checked
  const is_published = !!publishedInput?.checked

  if (!title) {
    toast({ title: "Title required", description: "Please enter a title.", variant: "destructive" })
    return
  }

  // ✅ slug update when title changes + uniqueness check
  let newSlug = current.slug
  if (title !== current.title) {
    newSlug = slugifyTitle(title)

    const { data: existing } = await supabaseBrowser
      .from("products")
      .select("id")
      .eq("slug", newSlug)
      .neq("id", current.id)
      .maybeSingle()

    if (existing) {
      newSlug = `${newSlug}-${crypto.randomUUID().slice(0, 6)}`
    }
  }

  const price_cents = priceStr === "" ? null : Math.round(Number(priceStr) * 100)
  if (priceStr !== "" && (Number.isNaN(Number(priceStr)) || Number(priceStr) < 0)) {
    toast({ title: "Invalid price", description: "Price must be ≥ 0 (or leave empty).", variant: "destructive" })
    return
  }

  setEditing(true)
  try {
    const { data, error } = await supabaseBrowser
      .from("products")
      .update({
        title,
        slug: newSlug, // ✅ added
        description: description || null,
        price_cents,
        featured,
        is_published,
      })
      .eq("id", current.id) // ✅ use current.id
      .select("id,title,slug,description,price_cents,currency,featured,is_published")
      .single()

    if (error) throw error

    setProducts((prev) => prev.map((p) => (p.id === data.id ? (data as ProductRow) : p)))

    toast({ title: "Updated", description: "Artwork updated successfully." })
    setIsEditDialogOpen(false)
    setEditProduct(null)
  } catch (err: any) {
    toast({ title: "Update failed", description: err?.message ?? String(err), variant: "destructive" })
  } finally {
    setEditing(false)
  }
}


  // -------------------------
  // Delete product (DB only)
  // -------------------------
async function handleDeleteProduct(id: string, title: string) {
  if (!confirm(`Delete "${title}"? This will remove the product AND its images.`)) return

  try {
    // 1) Get all image paths for this product
    const { data: imgs, error: imgsErr } = await supabaseBrowser
      .from("product_images")
      .select("path")
      .eq("product_id", id)

    if (imgsErr) throw imgsErr

    const paths = (imgs ?? [])
      .map((x) => x.path)
      .filter((p): p is string => typeof p === "string" && p.length > 0)

    // 2) Delete files from Storage (bucket: artworks)
    // Note: storage.remove() expects an array of object paths inside the bucket.
    if (paths.length > 0) {
      const { error: storageErr } = await supabaseBrowser.storage.from("artworks").remove(paths)
      if (storageErr) throw storageErr
    }

    // 3) Delete product_images rows
    const { error: delImgsErr } = await supabaseBrowser.from("product_images").delete().eq("product_id", id)
    if (delImgsErr) throw delImgsErr

    // 4) Delete product row
    const { error: delProdErr } = await supabaseBrowser.from("products").delete().eq("id", id)
    if (delProdErr) throw delProdErr

    toast({ title: "Deleted", description: "Artwork and images removed." })
    setProducts((prev) => prev.filter((p) => p.id !== id))
  } catch (err: any) {
    toast({ title: "Delete failed", description: err?.message ?? String(err), variant: "destructive" })
  }
}

async function toggleField(id: string, field: "featured" | "is_published", value: boolean) {
  // optimistic UI
  setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)))

  const { data, error } = await supabaseBrowser
    .from("products")
    .update({ [field]: value })
    .eq("id", id)
    .select("id,title,slug,description,price_cents,currency,featured,is_published")
    .single()

  if (error) {
    // rollback
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: !value } : p)))
    toast({ title: "Update failed", description: error.message, variant: "destructive" })
    return
  }

  // sync with DB returned row
  setProducts((prev) => prev.map((p) => (p.id === data.id ? (data as ProductRow) : p)))
}

  async function handleLogout() {
    await supabaseBrowser.auth.signOut()
    router.push("/admin")
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-background border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-serif font-bold">Admin Dashboard</h1>
            <div className="flex items-center gap-2">
              <Button variant="outline" asChild>
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  View Site
                </Link>
              </Button>
              <Button variant="ghost" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Artworks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{products.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Featured</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{products.filter((p) => p.featured).length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Published</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{products.filter((p) => p.is_published).length}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Manage Artworks</CardTitle>

              <div className="flex items-center gap-2">
                {/* Add Dialog */}
                <Dialog
                  open={isAddDialogOpen}
                  onOpenChange={(open) => {
                    setIsAddDialogOpen(open)
                    if (!open) {
                      setSelectedFile(null)
                      setSelectedFileName("")
                    }
                  }}
                >
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Artwork
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Add New Artwork</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmitAddProduct} className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="image">Image Upload</Label>
                        <Input
                          id="image"
                          type="file"
                          accept="image/*"
                          disabled={uploading}
                          onChange={(e) => {
                            const file = e.currentTarget.files?.[0] ?? null
                            setSelectedFile(file)
                            setSelectedFileName(file ? file.name : "")
                          }}
                        />

                        {selectedFileName ? (
                          <p className="text-xs">
                            Selected: <b>{selectedFileName}</b>
                          </p>
                        ) : null}

                        <p className="text-xs text-muted-foreground">
                          {uploading ? "Uploading..." : "Select an image and fill details, then click Add Artwork."}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" placeholder="Artwork title" required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" placeholder="Describe the artwork..." rows={4} />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="price">Price (optional)</Label>
                        <Input id="price" type="number" step="0.01" placeholder="Leave empty for 'Price on request'" />
                      </div>

                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="featured" className="h-4 w-4 rounded border-gray-300" />
                        <Label htmlFor="featured" className="font-normal cursor-pointer">
                          Feature this artwork on homepage
                        </Label>
                      </div>

                      <div className="flex gap-3 pt-4">
                        <Button type="submit" className="flex-1" disabled={uploading}>
                          Add Artwork
                        </Button>
                        <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={uploading}>
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Featured</TableHead>
                    <TableHead>Published</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-muted-foreground">
                        Loading…
                      </TableCell>
                    </TableRow>
                  ) : products.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-muted-foreground">
                        No artworks yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    products.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className="font-medium">{p.title}</TableCell>
                        <TableCell>
                          {p.price_cents != null ? `$${(p.price_cents / 100).toFixed(2)} ${p.currency ?? "CAD"}` : "Price on request"}
                        </TableCell>
                        <TableCell>
                          <input
                            type="checkbox"
                            checked={p.featured}
                            onChange={(e) => toggleField(p.id, "featured", e.currentTarget.checked)}
                            className="h-4 w-4"
                          />
                        </TableCell>
                        <TableCell>
                          <input
                            type="checkbox"
                            checked={p.is_published}
                            onChange={(e) => toggleField(p.id, "is_published", e.currentTarget.checked)}
                            className="h-4 w-4"
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => openEdit(p)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteProduct(p.id, p.title)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Latest Inquiries</CardTitle>
          </CardHeader>
          <CardContent>
            {inquiriesLoading ? (
              <p className="text-sm text-muted-foreground">Loading inquiries…</p>
            ) : inquiries.length === 0 ? (
              <p className="text-sm text-muted-foreground">No inquiries yet.</p>
            ) : (
              <div className="space-y-3">
                {inquiries.map((q) => (
                  <div key={q.id} className="rounded-lg border p-3">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{q.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(q.created_at).toLocaleString()}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">{q.email}</div>
                    <div className="mt-2 font-medium">{q.subject ?? "No subject"}</div>
                    <div className="mt-1 text-sm whitespace-pre-wrap">{q.message}</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>


        {/* Edit Dialog (outside table) */}
        <Dialog
          open={isEditDialogOpen}
          onOpenChange={(open) => {
            setIsEditDialogOpen(open)
            if (!open) setEditProduct(null)
          }}
        >
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Artwork</DialogTitle>
            </DialogHeader>

            {editProduct ? (
              <form onSubmit={handleSubmitEditProduct} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="edit_title">Title</Label>
                  <Input id="edit_title" defaultValue={editProduct.title} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit_description">Description</Label>
                  <Textarea id="edit_description" rows={4} defaultValue={editProduct.description ?? ""} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit_price">Price (optional)</Label>
                  <Input
                    id="edit_price"
                    type="number"
                    step="0.01"
                    defaultValue={editProduct.price_cents != null ? (editProduct.price_cents / 100).toFixed(2) : ""}
                    placeholder="Leave empty for 'Price on request'"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input id="edit_featured" type="checkbox" defaultChecked={!!editProduct.featured} className="h-4 w-4" />
                  <Label htmlFor="edit_featured" className="font-normal cursor-pointer">
                    Featured
                  </Label>
                </div>

                <div className="flex items-center gap-2">
                  <input id="edit_published" type="checkbox" defaultChecked={!!editProduct.is_published} className="h-4 w-4" />
                  <Label htmlFor="edit_published" className="font-normal cursor-pointer">
                    Published
                  </Label>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="flex-1" disabled={editing}>
                    {editing ? "Saving..." : "Save changes"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={editing}>
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <LogoLoader size={72} />
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
