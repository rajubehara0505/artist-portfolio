// Dummy data for artworks
export interface Artwork {
  id: string
  title: string
  description: string
  price: number
  discount?: number
  image: string
  featured?: boolean
}

export const artworks: Artwork[] = [
  {
    id: "1",
    title: "Sunset Over Mountains",
    description: "A breathtaking view of the sun setting over mountain peaks, captured in vibrant oils.",
    price: 1200,
    discount: 10,
    image: "/abstract-oil-painting-sunset-mountains-warm-colors.jpg",
    featured: true,
  },
  {
    id: "2",
    title: "Ocean Waves",
    description: "The powerful movement of ocean waves rendered in deep blues and whites.",
    price: 950,
    image: "/abstract-ocean-waves-painting-blue-tones.jpg",
    featured: true,
  },
  {
    id: "3",
    title: "Urban Dreams",
    description: "A modern interpretation of city life with bold geometric shapes and vibrant colors.",
    price: 1500,
    discount: 15,
    image: "/modern-urban-cityscape-abstract-painting-geometric.jpg",
    featured: true,
  },
  {
    id: "4",
    title: "Forest Whispers",
    description: "Deep greens and earthy tones create a mystical forest atmosphere.",
    price: 880,
    image: "/forest-trees-nature-painting-green-atmospheric.jpg",
  },
  {
    id: "5",
    title: "Desert Bloom",
    description: "Vibrant desert wildflowers against golden sand dunes.",
    price: 750,
    image: "/desert-wildflowers-painting-warm-colors-sand.jpg",
  },
  {
    id: "6",
    title: "Midnight Garden",
    description: "A mysterious nocturnal garden scene with moonlit flora.",
    price: 1100,
    discount: 5,
    image: "/midnight-garden-moonlight-flowers-dark-atmospheric.jpg",
  },
  {
    id: "7",
    title: "Abstract Emotions",
    description: "Raw emotional expression through bold strokes and contrasting colors.",
    price: 1300,
    image: "/abstract-expressionist-painting-bold-strokes-color.jpg",
  },
  {
    id: "8",
    title: "Winter Silence",
    description: "The quiet beauty of a snow-covered landscape in soft whites and blues.",
    price: 920,
    image: "/winter-snow-landscape-painting-white-blue-serene.jpg",
  },
  {
    id: "9",
    title: "Summer Fields",
    description: "Golden wheat fields stretching to the horizon under a bright sky.",
    price: 850,
    discount: 8,
    image: "/wheat-fields-summer-landscape-painting-golden-yell.jpg",
  },
]

export const getArtworkById = (id: string): Artwork | undefined => {
  return artworks.find((artwork) => artwork.id === id)
}

export const getFeaturedArtworks = (): Artwork[] => {
  return artworks.filter((artwork) => artwork.featured)
}
