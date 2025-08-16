"use client";
import type React from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FileText, ExternalLink } from "lucide-react";
import { useLoading } from "@/contexts/loading-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Resource = {
  title: string;
  description: string;
  type: "guide" | "course" | "video" | "research" | "art";
  level?: string;
  duration?: string;
  numberOfLesson?: number;
  uploadDate?: string;
  slug?: string;
  videoLink?: string;
  abstract: string;
  researchLink: string;
  authors: string[];
  year?: number;
  keywords?: string[];
  artist?: string;
  image?: string;
  medium?: string;
  views?: number;
  likes?: Array<any>;
};

export default function ResourcesPage() {
  const [resources, setResources] = useState({
    guides: [],
    courses: [],
    videos: [],
    research: [],
    artGallery: [],
  });
  const { show, hide } = useLoading();

  useEffect(() => {
    setTimeout(() => {
      show();
      fetch("/api/resources")
        .then((response) => response.json())
        .then((data) => {
          const groupedResources = {
            guides: data.filter((item: Resource) => item.type === "guide"),
            courses: data.filter((item: Resource) => item.type === "course"),
            videos: data.filter((item: Resource) => item.type === "video"),
            research: data.filter((item: Resource) => item.type === "research"),
            artGallery: data.filter((item: Resource) => item.type === "art"),
          };
          setResources(groupedResources);
          console.log(groupedResources);
        })
        .finally(() => {
          hide();
        });
    }, 300);
  }, []);

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-4">Educational Resources</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Learn about climate change, sustainability, and how you can make a
            difference.
          </p>
        </div>

        <Tabs defaultValue="guides" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="guides">Guides</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="research">Research</TabsTrigger>
            <TabsTrigger value="art">Art Gallery</TabsTrigger>
          </TabsList>

          <TabsContent value="guides">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {resources.guides.map((guide: Resource) => (
                <ResourceGuideCard
                  key={guide.title}
                  title={guide.title}
                  description={guide.description}
                  icon={<FileText className="h-8 w-8 text-carbon-red" />}
                  level={guide.level || "Beginner"}
                  readTime={guide.duration || "10 min"}
                  slug={
                    guide.slug || guide.title.toLowerCase().replace(/\s+/g, "-")
                  }
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="courses">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {resources.courses.map((course: Resource) => (
                <CourseCard
                  key={course.title}
                  title={course.title}
                  description={course.description}
                  lessons={course.numberOfLesson || 0}
                  duration={course.duration || "N/A"}
                  level={course.level || "Beginner"}
                  slug={
                    course.slug ||
                    course.title.toLowerCase().replace(/\s+/g, "-")
                  }
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="videos">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {resources.videos.map((video: Resource) => (
                <VideoCard
                  key={video.title}
                  title={video.title}
                  description={video.description}
                  duration={video.duration || "N/A"}
                  uploadDate={video.uploadDate || "Unknown"}
                  videoLink={video.videoLink || ""}
                  authors={video.authors}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="research">
            <div className="grid grid-cols-1 gap-6">
              {resources.research.map((research: Resource) => (
                <ResearchCard
                  key={research.title}
                  title={research.title}
                  authors={research.authors.join(", ")}
                  year={research.year || new Date().getFullYear()}
                  abstract={research.abstract}
                  keywords={research.keywords || []}
                  researchLink={research.researchLink || ""}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="art">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.artGallery.map((art: Resource) => (
                <ArtworkCard
                  key={art.title}
                  title={art.title}
                  artist={art.artist || "Unknown Artist"}
                  year={art.year || new Date().getFullYear()}
                  description={art.description}
                  image={art.image || "/placeholder.svg"}
                  medium={art.medium || "Unknown Medium"}
                  views={art.views || 0}
                  likes={art.likes?.length || 0}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function ResourceGuideCard({
  title,
  description,
  icon,
  level,
  readTime,
  slug,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  level: string;
  readTime: string;
  slug: string;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-4">
          <div className="mt-1">{icon}</div>
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            {/* Limit description to 3 lines using Tailwind line-clamp */}
            <CardDescription className="line-clamp-3">
              {description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between text-sm">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Level:</span>
            <span>{level}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Read time:</span>
            <span>{readTime}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild variant="default" className="w-full">
          <Link href={`/resources/guide/${slug}`}>Read Guide</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

function CourseCard({
  title,
  description,
  lessons,
  duration,
  level,
  slug,
}: {
  title: string;
  description: string;
  lessons: number;
  duration: string;
  level: string;
  slug: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="p-2 bg-muted rounded text-center">
            <div className="font-medium">{lessons}</div>
            <div className="text-xs text-muted-foreground">Lessons</div>
          </div>
          <div className="p-2 bg-muted rounded text-center">
            <div className="font-medium">{duration}</div>
            <div className="text-xs text-muted-foreground">Duration</div>
          </div>
          <div className="p-2 bg-muted rounded text-center">
            <div className="font-medium">{level}</div>
            <div className="text-xs text-muted-foreground">Level</div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          asChild
          className="w-full bg-carbon-purple hover:bg-carbon-purple/90"
        >
          <Link href={`/resources/course/${slug}`}>Enroll Now</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

function VideoCard({
  title,
  description,
  duration,
  uploadDate,
  videoLink,
  authors,
}: {
  title: string;
  description: string;
  duration: string;
  uploadDate: string;
  videoLink?: string;
  authors?: string[];
}) {
  console.log(authors);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription className="line-clamp-3">
          Authors: {authors ? authors.join(", ") : "Unknown"}
        </CardDescription>
        <CardDescription className="line-clamp-3">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64 bg-muted rounded-md flex items-center justify-center mb-4">
          <iframe src={videoLink} className="h-full w-full"></iframe>
        </div>
        <div className="flex justify-between text-sm">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Duration:</span>
            <span>{duration}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Upload Date:</span>
            <span>{uploadDate}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" className="w-full">
          <Link href={videoLink || ""} target="_blank">
            Watch Video
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

function ResearchCard({
  title,
  authors,
  year,
  abstract,
  keywords,
  researchLink,
}: {
  title: string;
  authors: string;
  year: number;
  abstract: string;
  keywords: string[];
  researchLink: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>
          {authors} ({year})
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-1">Abstract</h4>
            <p className="text-sm text-muted-foreground line-clamp-3">
              {abstract}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-1">Keywords</h4>
            <div className="flex flex-wrap gap-2">
              {keywords.map((keyword) => (
                <span
                  key={keyword}
                  className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary/10 text-secondary"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" className="w-full">
          <Link target="_blank" href={researchLink}>
            Read Full Paper
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

function ArtworkCard({
  title,
  artist,
  medium,
  year,
  views,
  likes,
  description,
  image,
}: {
  title: string;
  artist: string;
  medium: string;
  year: number;
  views: number;
  likes: number;
  description: string;
  image: string;
}) {
  return (
    <Card key={title} className="hover:shadow-lg transition-shadow group">
      <div className="relative overflow-hidden">
        <img
          src={`/painting/${image}` || "/placeholder.svg"}
          alt={title}
          className="w-full h-64 object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center justify-between text-sm">
            <span>{views} views</span>
            <span>{likes} likes</span>
          </div>
        </div>
      </div>
      <CardHeader>
        <div className="flex justify-between items-start mb-2 gap-8">
          <Badge variant="secondary" className="line-clamp-1">{medium}</Badge>
          <span className="text-sm text-muted-foreground">{year}</span>
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>by {artist}</CardDescription>
        <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
          {description}
        </p>
      </CardHeader>
      <CardContent>
        <Link href={`/resources/art/${title}`}>
          <Button size="sm" className="w-full">
            View Artwork
            <ExternalLink className="h-4 w-4 ml-1" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
