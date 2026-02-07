'use client'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"

export default function YouTubeVideoCard({ videoId, title }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="cursor-pointer hover:shadow-lg transition">
          <CardContent className="p-0 relative">
            <AspectRatio ratio={16 / 9}>
              <img
                src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                alt={title}
                className="object-cover w-full h-full rounded-t-lg"
              />
            </AspectRatio>

            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <Button size="icon" className="rounded-full">
                <Play />
              </Button>
            </div>
          </CardContent>

          <CardHeader>
            <CardTitle className="text-base">{title}</CardTitle>
          </CardHeader>
        </Card>
      </DialogTrigger>

      <DialogContent className="max-w-3xl p-0">
        <AspectRatio ratio={16 / 9}>
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            title={title}
            allow="autoplay; encrypted-media"
            allowFullScreen
            className="w-full h-full rounded-lg"
          />
        </AspectRatio>
      </DialogContent>
    </Dialog>
  )
}
