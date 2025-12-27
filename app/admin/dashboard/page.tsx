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

export default function AdminDashboard() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const { toast } = useToast()

  const handleAddArtwork = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsAddDialogOpen(false)
    toast({
      title: "Artwork added",
      description: "The artwork has been successfully added to the gallery.",
    })
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

  const handleLogout = () => {
    window.location.href = "/admin"
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

              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
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
                  <form onSubmit={handleAddArtwork} className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="image">Image Upload</Label>
                      <Input id="image" type="file" accept="image/*" />
                      <p className="text-xs text-muted-foreground">Upload an image of the artwork</p>
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
                      <Button type="submit" className="flex-1">
                        Add Artwork
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
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
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteArtwork(artwork.id, artwork.title)}
                          >
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
