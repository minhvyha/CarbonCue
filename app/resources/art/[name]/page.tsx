'use client'

import * as React from "react"
import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Heart, Eye, Share2, Calendar, Ruler, Brush, ArrowLeft, ExternalLink } from "lucide-react"

import { useLoading } from "@/contexts/loading-context"
import Link from "next/link"

import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/components/toast-provider"

interface ArtworkPageProps {
  // params is a Promise in Next.js 15+
  params: Promise<{
    name: string
  }>
}

interface ArtworkData {
  _id?: string
  title: string
  artist: string
  medium: string
  year: string
  dimensions: string
  description: string
  image: string
  technique: string
  inspiration: string
  artistBio: string
  artistAvatar?: string
  views?: number
  likes?: Array<any>
  impact?: string
  type?: string
}

export default function ArtworkPage({ params }: ArtworkPageProps) {
  // React.use to unwrap the promise-based params in Next.js 15+
  const { name } = React.use(params)
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [data, setData] = useState<ArtworkData | null>(null)

  const {show, hide} = useLoading()

  useEffect(() => {
    // Fetch artwork data based on the name
    
    const fetchArtwork = async () => {
      show()
      try {
        const response = await fetch(`/api/resources/artgallery/${name}`)

        if (!response.ok) {
          // send the user to the 404 page when the API returns non-OK
          router.replace('/404')
          return
        }

        const json = await response.json()

        // set the fetched data (no defaults)
        setData(json)
      } catch (err) {
        console.error('Error fetching artwork:', err)
        // on any network/parse error, send to 404
        router.replace('/404')
      } finally {
        hide()
      }
    }
    setTimeout(() => {
      fetchArtwork()
    }, 100)
  }, [name, router])


const handleLike = async () => {
  if (!user) {
    toast({
      title: "Login required",
      description: "You must be logged in to like artwork.",
      variant: "destructive",
    });
    return;
  }

  // pick the field that actually identifies the art piece in your DB
  const title = data?.title ;
  if (!title) {
    console.error("Missing artwork identifier on client (title/slug)");
    toast({
      title: "Missing artwork identifier",
      description: "Can't call like API: missing title/slug.",
      variant: "destructive",
    });
    return;
  }

  console.log("handleLike start:", { title, userId: user._id, currentLikes: data?.likes });

  const prevLikes = Array.isArray(data?.likes) ? data.likes : [];

  // If already liked -> unlike
  if (prevLikes.includes(user._id)) {
    const optimistic = prevLikes.filter((id: string) => id !== user._id);
    setData((prev) => (prev ? { ...prev, likes: optimistic } : null));

    try {
      // If your server doesn't implement unlike yet, see server snippet below
      const res = await fetch(`/api/resources/artgallery${encodeURIComponent(title)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id, action: "remove" }),
      });

      const body = await res.json().catch(() => null);
      console.log("Unlike response:", res.status, body);

      if (!res.ok) {
        throw body || new Error(`HTTP ${res.status}`);
      }

      // use canonical likes from server if returned
      if (body?.likes) {
        setData((prev) => (prev ? { ...prev, likes: body.likes } : null));
      }
    } catch (err) {
      console.error("Unlike failed — reverting optimistic update:", err);
      setData((prev) => (prev ? { ...prev, likes: prevLikes } : null));
 
    }

    return;
  }

  // If not liked -> like (POST)
  const optimisticLikes = [...prevLikes, user._id];
  setData((prev) => (prev ? { ...prev, likes: optimisticLikes } : null));

  try {
    const res = await fetch(`/api/resources/artgallery/${encodeURIComponent(title)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user._id, action: "add" }), // action optional, server can default to add
    });

    const body = await res.json().catch(() => null);
    console.log("Like response:", res.status, body);

    if (!res.ok) {
      throw body || new Error(`HTTP ${res.status}`);
    }

    if (body?.likes) {
      setData((prev) => (prev ? { ...prev, likes: body.likes } : null));
    } else {
      // fallback: keep optimistic state
      setData((prev) => (prev ? { ...prev, likes: optimisticLikes } : null));
    }
  } catch (err) {
    console.error("Like request failed — reverting optimistic update:", err);
    setData((prev) => (prev ? { ...prev, likes: prevLikes } : null));

  }
};


  const handleShare = () => {
    if (typeof window === 'undefined' || !data) return

    if (navigator.share) {
      navigator.share({
        title: data.title,
        text: `Check out "${data.title}" by ${data.artist}`,
        url: window.location.href,
      })
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href)
    }
  }



  // after loading, if data is null we should already have redirected to /404,
  // but add a defensive fallback just in case
  if (!data) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Back Button */}
      <div className="mb-6">
        <Link href="/resources">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Gallery
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Artwork Image */}
        <div className="space-y-6">
          <div className="relative">
            <img
              src={`/painting/${data.image}` || '/placeholder.svg'}
              alt={data.title}
              className="w-full rounded-lg shadow-lg"
            />
          </div>

          {/* Engagement Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6 text-muted-foreground">
              <span className="flex items-center">
                <Eye className="h-5 w-5 mr-2" />
                {data.views ?? 0} views
              </span>
              <span className="flex items-center">
                <Heart className="h-5 w-5 mr-2" />
                {data.likes?.length ?? 0} likes
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant={data.likes?.includes(user?._id) ? 'default' : 'outline'} size="sm" onClick={handleLike}>
                <Heart className={`h-4 w-4 mr-2 ${data.likes?.includes(user?._id) ? 'fill-current' : ''}`} />
                {data.likes?.includes(user?._id) ? 'Liked' : 'Like'}
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>

        {/* Artwork Details */}
        <div className="space-y-8">
          {/* Basic Info */}
          <div>
            <div className="flex items-center justify-between mb-4 gap-8">
              <Badge variant="secondary" className="text-sm line-clamp-1">
                {data.medium}
              </Badge>
              <span className="text-muted-foreground">{data.year}</span>
            </div>
            <h1 className="text-4xl font-bold mb-2">{data.title}</h1>
            <p className="text-xl text-muted-foreground mb-4">by {data.artist}</p>
            <p className="text-lg leading-relaxed line-clamp-3">{data.description}</p>
          </div>

          <Separator />

          {/* Technical Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Artwork Details</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Brush className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">
                    <strong>Medium:</strong> {data.medium}
                  </span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">
                    <strong>Year:</strong> {data.year}
                  </span>
                </div>
                <div className="flex items-center">
                  <Ruler className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">
                    <strong>Dimensions:</strong> {data.dimensions}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Technique</h3>
              <p className="text-sm text-muted-foreground">{data.technique}</p>
            </div>
          </div>

          <Separator />

          {/* Inspiration & Impact */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Inspiration</h3>
              <p className="text-muted-foreground">{data.inspiration}</p>
            </div>

          </div>

          <Separator />

          {/* Artist Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">About the Artist</h3>
            <div className="flex items-start space-x-4">
              <img
                src={data.artistAvatar || '/placeholder.svg'}
                alt={data.artist}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="flex-1">
                <h4 className="font-medium mb-2">{data.artist}</h4>
                <p className="text-sm text-muted-foreground mb-3">{data.artistBio}</p>
                
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <Card className="bg-gradient-to-r from-carbon-red/10 to-carbon-magenta/10 border-carbon-red/20">
            <CardHeader>
              <CardTitle className="text-lg">Inspired by this artwork?</CardTitle>
              <CardDescription>Take action on climate change by tracking your own carbon footprint</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/carbon-tracker">
                <Button className="bg-gradient-to-r from-carbon-red to-carbon-magenta hover:opacity-90">
                  Start Tracking Your Impact
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>


    </div>
  )
}
