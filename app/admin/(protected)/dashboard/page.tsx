"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { artworks } from "@/lib/artworks-data"
import { Plus, Edit, Trash2, LogOut, Home } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { supabaseBrowser } from "@/lib/supabase/browser"

// OPTION A: hardcode a single product to attach uploads to (Sunset Bloom)
const OPTION_A_PRODUCT_ID = "e0e2e1e1-57ba-42a3-9878-f74f4af99baf"

export default function AdminDashboard() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [uploading, setUploading] = useState(false)

  // file selection (NO upload on select)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedFileName, setSelectedFileName] = useState<string>("")

  const { toast } = useToast()
  const router = useRouter()

  // B behavior: each upload INSERTS a new image row with sort_order = next
  async function addImageRowForProduct(opts: { productId: string; pathOrUrl: string; alt?: string }) {
    const { productId, pathOrUrl, alt } = opts

    // Find next sort order
    const { data: maxRow, error: maxErr } = await supabaseBrowser
      .from("product_images")
      .select("sort_order")
      .eq("product_id", productId)
      .order("sort_order", { ascending: false })
      .limit(1)
      .maybeSingle()

    if (maxErr) throw maxErr

    const nextSortOrder = (maxRow?.sort_order ?? -1) + 1

    const { error: insertErr } = await supabaseBrowser.from("product_images").insert({
      product_id: productId,
      path: pathOrUrl,
      alt: alt ?? null,
      sort_order: nextSortOrder,
    })

    if (insertErr) throw insertErr

    return { sort_order: nextSortOrder }
  }

  async function uploadToStorage(file: File) {
    const ext = file.name.split(".").pop() || "jpg"
    const fileName = `${crypto.randomUUID()}.${ext}`
    const objectPath = `products/${fileName}`

    const { data, error } = await supabaseBrowser.storage
      .from("artworks")
      .upload(objectPath, file, { upsert: false, contentType: file.type })

    if (error) throw error

    const { data: pub } = supabaseBrowser.storage.from("artworks").getPublicUrl(data.path)

    return { storagePath: data.path, publicUrl: pub.publicUrl }
  }

  async function handleSubmitAddArtwork(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!selectedFile) {
      toast({
        title: "Please select an image",
        description: "Choose a file first, then click Add Artwork.",
        variant: "destructive",
      })
      return
    }

    setUploading(true)
    try {
      // 1) Upload file
      const uploaded = await uploadToStorage(selectedFile)

      // 2) Insert a NEW product_images row (sort_order = next)
      const res = await addImageRowForProduct({
        productId: OPTION_A_PRODUCT_ID,
        pathOrUrl: uploaded.storagePath, // storing URL for now (works with your current frontend)
        alt: selectedFileName || "Uploaded artwork image",
      })

      toast({
        title: "Artwork image added",
        description: `Uploaded + added image (sort_order=${res.sort_order}).`,
      })

      // Clear dialog state
      setSelectedFile(null)
      setSelectedFileName("")
      setIsAddDialogOpen(false)
    } catch (err: any) {
      toast({
        title: "Add artwork failed",
        description: err?.message ?? String(err),
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const handleEditArtwork = (id: string) => {
    toast({
      title: "Edit functionality",
      description: "This would open an edit dialog for the selected artwork.",
    })
  }

  const handleDeleteArtwork = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      toast({
        title: "Artwork deleted",
        description: `"${title}" has been removed from the gallery.`,
        variant: "destructive",
      })
    }
  }

  async function handleLogout() {
    await supabaseBrowser.auth.signOut()
    router.push("/admin")
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Admin Header */}
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
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Artworks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{artworks.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Featured</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{artworks.filter((a) => a.featured).length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">On Sale</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{artworks.filter((a) => a.discount).length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Artworks Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Manage Artworks</CardTitle>

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

                  <form onSubmit={handleSubmitAddArtwork} className="space-y-4 mt-4">
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
                        {uploading
                          ? "Uploading..."
                          : "Select an image, fill details, then click Add Artwork (Option A: attaches to Sunset Bloom)."}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input id="title" placeholder="Artwork title" required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea id="description" placeholder="Describe the artwork..." rows={4} required />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="price">Price ($)</Label>
                        <Input id="price" type="number" step="0.01" placeholder="0.00" required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="discount">Discount (%)</Label>
                        <Input id="discount" type="number" min="0" max="100" placeholder="0" />
                      </div>
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
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsAddDialogOpen(false)}
                        disabled={uploading}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>

          <CardContent>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead>Featured</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {artworks.map((artwork) => (
                    <TableRow key={artwork.id}>
                      <TableCell className="font-medium">{artwork.title}</TableCell>
                      <TableCell>${artwork.price.toFixed(2)}</TableCell>
                      <TableCell>{artwork.discount ? `${artwork.discount}%` : "—"}</TableCell>
                      <TableCell>
                        {artwork.featured ? (
                          <span className="text-green-600 font-medium">Yes</span>
                        ) : (
                          <span className="text-muted-foreground">No</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEditArtwork(artwork.id)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteArtwork(artwork.id, artwork.title)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
