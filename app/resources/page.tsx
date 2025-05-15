'use client'
import type React from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { BookOpen, FileText, Lightbulb, Video } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ResourcesPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log(process.env.MONGODB_URI)
  fetch("/api/resources")
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      setUsers(data.total);
      setLoading(false);
    })
}, [])

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-4">Educational Resources</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Learn about climate change, sustainability, and how you can make a difference.
          </p>
        </div>

        <Tabs defaultValue="guides" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="guides">Guides</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="research">Research</TabsTrigger>
          </TabsList>

          <TabsContent value="guides">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ResourceGuideCard
                title="Understanding Carbon Footprints"
                description="A comprehensive guide to understanding what carbon footprints are and how they're calculated."
                icon={<FileText className="h-8 w-8 text-carbon-red" />}
                level="Beginner"
                readTime="15 min"
              />
              <ResourceGuideCard
                title="Reducing Digital Carbon Emissions"
                description="Learn how to minimize the carbon footprint of your digital activities and website operations."
                icon={<FileText className="h-8 w-8 text-carbon-purple" />}
                level="Intermediate"
                readTime="20 min"
              />
              <ResourceGuideCard
                title="Sustainable Home Energy Guide"
                description="Practical tips and strategies for reducing energy consumption and switching to renewable sources."
                icon={<FileText className="h-8 w-8 text-carbon-deep-red" />}
                level="Beginner"
                readTime="25 min"
              />
              <ResourceGuideCard
                title="Climate-Friendly Transportation"
                description="Options and strategies for reducing transportation emissions in your daily life."
                icon={<FileText className="h-8 w-8 text-carbon-magenta" />}
                level="Beginner"
                readTime="18 min"
              />
              <ResourceGuideCard
                title="Corporate Sustainability Playbook"
                description="A guide for businesses looking to implement sustainable practices and reduce their carbon footprint."
                icon={<FileText className="h-8 w-8 text-carbon-red" />}
                level="Advanced"
                readTime="35 min"
              />
              <ResourceGuideCard
                title="Climate Justice Primer"
                description="Understanding the intersection of climate change, social justice, and equity."
                icon={<FileText className="h-8 w-8 text-carbon-purple" />}
                level="Intermediate"
                readTime="22 min"
              />
            </div>
          </TabsContent>

          <TabsContent value="courses">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CourseCard
                title="Climate Change Fundamentals"
                description="A comprehensive introduction to climate science, impacts, and solutions."
                lessons={12}
                duration="4 weeks"
                level="Beginner"
              />
              <CourseCard
                title="Sustainable Living Masterclass"
                description="Practical strategies for reducing your environmental impact in everyday life."
                lessons={8}
                duration="3 weeks"
                level="Intermediate"
              />
              <CourseCard
                title="Carbon Accounting for Professionals"
                description="Learn how to measure, report, and reduce carbon emissions in organizational contexts."
                lessons={10}
                duration="5 weeks"
                level="Advanced"
              />
              <CourseCard
                title="Climate Communication Strategies"
                description="Effective techniques for communicating climate science and motivating action."
                lessons={6}
                duration="2 weeks"
                level="Intermediate"
              />
            </div>
          </TabsContent>

          <TabsContent value="videos">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <VideoCard
                title="The Carbon Cycle Explained"
                description="A visual explanation of how carbon moves through Earth's systems and how human activities disrupt this cycle."
                duration="12:34"
                views={24500}
              />
              <VideoCard
                title="Digital Carbon Footprint: The Hidden Impact"
                description="Exploring the environmental impact of our digital lives and how to minimize it."
                duration="18:21"
                views={15800}
              />
              <VideoCard
                title="Climate Solutions That Work"
                description="Evidence-based approaches to addressing climate change at individual and systemic levels."
                duration="22:45"
                views={32100}
              />
              <VideoCard
                title="The Future of Renewable Energy"
                description="Exploring cutting-edge developments in renewable energy technology and implementation."
                duration="15:18"
                views={19700}
              />
            </div>
          </TabsContent>

          <TabsContent value="research">
            <div className="grid grid-cols-1 gap-6">
              <ResearchCard
                title="Digital Carbon Emissions: A Systematic Review"
                authors="Johnson, M., Smith, A., & Williams, K."
                year={2022}
                abstract="This paper reviews current research on the carbon footprint of digital technologies, including websites, cloud computing, and AI systems."
                keywords={["digital carbon", "ICT emissions", "sustainable computing"]}
              />
              <ResearchCard
                title="Effectiveness of Carbon Footprint Calculators: User Engagement and Behavior Change"
                authors="Chen, L., Garcia, R., & Patel, S."
                year={2023}
                abstract="An analysis of how carbon footprint calculators influence user awareness and behavior change, with recommendations for improved design."
                keywords={["carbon calculators", "behavior change", "user engagement"]}
              />
              <ResearchCard
                title="Climate Justice and Digital Sustainability: Bridging the Gap"
                authors="Okonkwo, J., Martinez, E., & Kim, H."
                year={2022}
                abstract="This research explores the intersection of climate justice principles and digital sustainability practices, highlighting opportunities for more equitable approaches."
                keywords={["climate justice", "digital equity", "sustainable technology"]}
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-16">
          <Card className="bg-carbon-sand dark:bg-carbon-charcoal/50">
            <CardHeader>
              <CardTitle className="text-2xl">Climate Change Crash Course</CardTitle>
              <CardDescription>A comprehensive introduction to climate science, impacts, and solutions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center gap-3 p-3 bg-background rounded-lg">
                  <BookOpen className="h-6 w-6 text-carbon-red" />
                  <div>
                    <div className="text-sm font-medium">8 Modules</div>
                    <div className="text-xs text-muted-foreground">Comprehensive curriculum</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-background rounded-lg">
                  <Video className="h-6 w-6 text-carbon-purple" />
                  <div>
                    <div className="text-sm font-medium">12 Video Lessons</div>
                    <div className="text-xs text-muted-foreground">Visual explanations</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-background rounded-lg">
                  <Lightbulb className="h-6 w-6 text-carbon-deep-red" />
                  <div>
                    <div className="text-sm font-medium">24 Activities</div>
                    <div className="text-xs text-muted-foreground">Hands-on learning</div>
                  </div>
                </div>
              </div>
              <p className="text-sm mb-4">
                Our Climate Change Crash Course provides a solid foundation in climate science, impacts, and solutions.
                Perfect for beginners and those looking to refresh their knowledge, this self-paced course combines
                engaging videos, interactive activities, and practical resources.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full bg-carbon-red hover:bg-carbon-deep-red">
                <Link href="/resources/crash-course">Start Learning</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

function ResourceGuideCard({
  title,
  description,
  icon,
  level,
  readTime,
}: {
  title: string
  description: string
  icon: React.ReactNode
  level: string
  readTime: string
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-4">
          <div className="mt-1">{icon}</div>
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
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
        <Button asChild variant="outline" className="w-full">
          <Link href={`/resources/guides/${encodeURIComponent(title)}`}>Read Guide</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

function CourseCard({
  title,
  description,
  lessons,
  duration,
  level,
}: {
  title: string
  description: string
  lessons: number
  duration: string
  level: string
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
        <Button asChild className="w-full bg-carbon-purple hover:bg-carbon-purple/90">
          <Link href={`/resources/courses/${encodeURIComponent(title)}`}>Enroll Now</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

function VideoCard({
  title,
  description,
  duration,
  views,
}: {
  title: string
  description: string
  duration: string
  views: number
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-40 bg-muted rounded-md flex items-center justify-center mb-4">
          <Video className="h-10 w-10 text-muted-foreground" />
        </div>
        <div className="flex justify-between text-sm">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Duration:</span>
            <span>{duration}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Views:</span>
            <span>{views.toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" className="w-full">
          <Link href={`/resources/videos/${encodeURIComponent(title)}`}>Watch Video</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

function ResearchCard({
  title,
  authors,
  year,
  abstract,
  keywords,
}: {
  title: string
  authors: string
  year: number
  abstract: string
  keywords: string[]
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
            <p className="text-sm text-muted-foreground">{abstract}</p>
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
          <Link href={`/resources/research/${encodeURIComponent(title)}`}>Read Full Paper</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
