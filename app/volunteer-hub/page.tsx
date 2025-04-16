import Link from "next/link"
import { Calendar, Filter, MapPin, Search, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function VolunteerHubPage() {
  return (
    <div className="container py-10">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-4">Volunteer & Resource Hub</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Connect with local and global climate events, track your volunteer hours, and access resources.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 mb-10">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search for events, organizations, or resources..." className="pl-10" />
            </div>
          </div>
          <Button variant="outline" className="flex gap-2">
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </Button>
          <Button className="bg-carbon-purple hover:bg-carbon-purple/90">Find Events</Button>
        </div>

        <Tabs defaultValue="events" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="events">Upcoming Events</TabsTrigger>
            <TabsTrigger value="organizations">Organizations</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          <TabsContent value="events">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <EventCard
                title="Beach Cleanup Initiative"
                date="May 15, 2023"
                location="Santa Monica Beach, CA"
                organizer="Ocean Conservation Alliance"
                attendees={42}
                image="/placeholder.svg?height=200&width=400"
              />
              <EventCard
                title="Urban Tree Planting Day"
                date="June 5, 2023"
                location="Central Park, New York"
                organizer="City Green Initiative"
                attendees={78}
                image="/placeholder.svg?height=200&width=400"
              />
              <EventCard
                title="Climate Change Workshop"
                date="June 12, 2023"
                location="Virtual Event"
                organizer="Climate Action Network"
                attendees={156}
                image="/placeholder.svg?height=200&width=400"
              />
              <EventCard
                title="Renewable Energy Fair"
                date="July 8, 2023"
                location="Convention Center, Chicago"
                organizer="Sustainable Energy Coalition"
                attendees={210}
                image="/placeholder.svg?height=200&width=400"
              />
              <EventCard
                title="Community Garden Project"
                date="July 22, 2023"
                location="Community Center, Austin, TX"
                organizer="Green Thumbs Alliance"
                attendees={35}
                image="/placeholder.svg?height=200&width=400"
              />
              <EventCard
                title="Climate Policy Advocacy Day"
                date="August 10, 2023"
                location="State Capitol, Sacramento, CA"
                organizer="Climate Justice Coalition"
                attendees={89}
                image="/placeholder.svg?height=200&width=400"
              />
            </div>
          </TabsContent>

          <TabsContent value="organizations">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <OrganizationCard
                name="Ocean Conservation Alliance"
                description="Working to protect marine ecosystems and reduce ocean pollution through community action and education."
                location="Los Angeles, CA"
                members={1250}
                image="/placeholder.svg?height=100&width=200"
              />
              <OrganizationCard
                name="City Green Initiative"
                description="Urban forestry and green space advocacy group focused on increasing tree canopy in metropolitan areas."
                location="New York, NY"
                members={3400}
                image="/placeholder.svg?height=100&width=200"
              />
              <OrganizationCard
                name="Climate Action Network"
                description="Global network of organizations working to promote government and individual action to limit climate change."
                location="Global"
                members={12500}
                image="/placeholder.svg?height=100&width=200"
              />
              <OrganizationCard
                name="Sustainable Energy Coalition"
                description="Promoting renewable energy adoption through education, policy advocacy, and community projects."
                location="Chicago, IL"
                members={2800}
                image="/placeholder.svg?height=100&width=200"
              />
              <OrganizationCard
                name="Green Thumbs Alliance"
                description="Community gardening network focused on sustainable food systems and urban agriculture."
                location="Austin, TX"
                members={950}
                image="/placeholder.svg?height=100&width=200"
              />
              <OrganizationCard
                name="Climate Justice Coalition"
                description="Advocating for equitable climate policies that protect vulnerable communities and promote environmental justice."
                location="Sacramento, CA"
                members={1800}
                image="/placeholder.svg?height=100&width=200"
              />
            </div>
          </TabsContent>

          <TabsContent value="resources">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ResourceCard
                title="Climate Change 101"
                description="A comprehensive introduction to climate science, impacts, and solutions."
                type="Guide"
                format="PDF"
              />
              <ResourceCard
                title="How to Organize a Community Climate Event"
                description="Step-by-step instructions for planning and executing successful climate action events."
                type="Toolkit"
                format="Web Resource"
              />
              <ResourceCard
                title="Carbon Footprint Reduction Strategies"
                description="Practical tips and strategies for individuals and communities to reduce their carbon footprint."
                type="Guide"
                format="PDF"
              />
              <ResourceCard
                title="Climate Justice Framework"
                description="Understanding the intersection of climate change, social justice, and equity."
                type="Research"
                format="PDF"
              />
              <ResourceCard
                title="Sustainable Living Workshop Materials"
                description="Presentation slides, handouts, and activities for running workshops on sustainable living."
                type="Workshop"
                format="ZIP Archive"
              />
              <ResourceCard
                title="Climate Communication Toolkit"
                description="Resources for effectively communicating climate science and solutions to diverse audiences."
                type="Toolkit"
                format="Web Resource"
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-16">
          <Card>
            <CardHeader>
              <CardTitle>Your Volunteer Dashboard</CardTitle>
              <CardDescription>Track your volunteer hours and impact</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="p-4 border rounded-lg text-center">
                  <div className="text-3xl font-bold mb-1">24</div>
                  <div className="text-sm text-muted-foreground">Hours Volunteered</div>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <div className="text-3xl font-bold mb-1">5</div>
                  <div className="text-sm text-muted-foreground">Events Attended</div>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <div className="text-3xl font-bold mb-1">120</div>
                  <div className="text-sm text-muted-foreground">kg CO₂ Impact</div>
                </div>
              </div>

              <div className="h-[200px] w-full bg-muted rounded-md flex items-center justify-center text-muted-foreground">
                Volunteer activity chart placeholder
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full bg-carbon-purple hover:bg-carbon-purple/90">
                <Link href="/volunteer-hub/log-hours">Log Volunteer Hours</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

function EventCard({
  title,
  date,
  location,
  organizer,
  attendees,
  image,
}: {
  title: string
  date: string
  location: string
  organizer: string
  attendees: number
  image: string
}) {
  return (
    <Card className="overflow-hidden">
      <div className="h-48 bg-muted">
        <img src={image || "/placeholder.svg"} alt={title} className="w-full h-full object-cover" />
      </div>
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{organizer}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>{attendees} attending</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/volunteer-hub/events/${encodeURIComponent(title)}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

function OrganizationCard({
  name,
  description,
  location,
  members,
  image,
}: {
  name: string
  description: string
  location: string
  members: number
  image: string
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-md bg-muted overflow-hidden">
            <img src={image || "/placeholder.svg"} alt={name} className="w-full h-full object-cover" />
          </div>
          <div>
            <CardTitle className="text-lg">{name}</CardTitle>
            <CardDescription className="text-xs">{location}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-2">{description}</p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Users className="h-3 w-3" />
          <span>{members.toLocaleString()} members</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" className="w-full">
          <Link href={`/volunteer-hub/organizations/${encodeURIComponent(name)}`}>View Profile</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

function ResourceCard({
  title,
  description,
  type,
  format,
}: {
  title: string
  description: string
  type: string
  format: string
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{title}</CardTitle>
          <div className="flex gap-2">
            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/10 text-primary">
              {type}
            </span>
            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary/10 text-secondary">
              {format}
            </span>
          </div>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button asChild variant="outline" className="w-full">
          <Link href={`/volunteer-hub/resources/${encodeURIComponent(title)}`}>Download Resource</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
