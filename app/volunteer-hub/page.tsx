"use client";

import Link from "next/link";
import { Calendar, Filter, Search, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";

type Listing = {
  id: number;
  title: string;
  org: string;
  remote: boolean;
  dates: string;
  url: string;
};

type Organization = {
  name: string;
  logo: string;
  url: string;
};

export default function VolunteerHubPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("https://www.volunteerconnector.org/api/search/?page=2");
        if (!res.ok) throw new Error("Failed to fetch listings");
        const json = await res.json();
        const results = json.results as any[];

        // Events
        const shuffled = results.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 6).map((r) => ({
          id: r.id,
          title: r.title,
          org: r.organization.name,
          location: r.remote_or_online
            ? "Online"
            : r.audience?.scope === "local"
            ? `${r.audience.latitude?.toFixed(2)}, ${r.audience.longitude?.toFixed(2)}`
            : r.dates,
          remote: r.remote_or_online,
          dates: r.dates,
          url: r.url,
        }));
        setListings(selected);

        // Unique organizations
        const orgMap = new Map();
        results.forEach((r) => {
          const org = r.organization;
          if (org?.name && !orgMap.has(org.name)) {
            orgMap.set(org.name, {
              name: org.name,
              logo: org.logo?.startsWith("//") ? `https:${org.logo}` : org.logo,
              url: org.url,
            });
          }
        });
        setOrganizations(Array.from(orgMap.values()));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-4">Volunteer & Resource Hub</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Connect with local and global climate events, track your volunteer hours, and access
            resources.
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
              {loading ? (
                <p>Loading listings...</p>
              ) : listings.length === 0 ? (
                <p>No listings found.</p>
              ) : (
                listings.map((listing) => (
                  <EventCard
                    key={listing.id}
                    title={listing.title}
                    date={listing.dates}
                    organizer={listing.org}
                    attendees={Math.floor(Math.random() * 100) + 10}
                    image="/placeholder.svg?height=200&width=400"
                    url={listing.url}
                  />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="organizations">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                <p>Loading organizations...</p>
              ) : organizations.length === 0 ? (
                <p>No organizations found.</p>
              ) : (
                organizations.map((org, idx) => (
                  <OrganizationCard key={idx} {...org} />
                ))
              )}
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
                <DashboardStat value="24" label="Hours Volunteered" />
                <DashboardStat value="5" label="Events Attended" />
                <DashboardStat value="120" label="kg CO₂ Impact" />
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
  );
}

function EventCard({
  title,
  date,
  organizer,
  attendees,
  image,
  url,
}: {
  title: string;
  date: string;
  organizer: string;
  attendees: number;
  image: string;
  url: string;
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
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>{attendees} attending</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={url} target="_blank" rel="noopener noreferrer">
            View Details
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

function OrganizationCard({ name, logo, url }: Organization) {
  return (
    <Card className="overflow-hidden">
      <div className="h-48 bg-muted flex items-center justify-center">
        {logo ? (
          <img src={logo} alt={name} className="max-h-full max-w-full object-contain p-4" />
        ) : (
          <div className="text-muted-foreground text-sm">No logo available</div>
        )}
      </div>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
      </CardHeader>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={url} target="_blank" rel="noopener noreferrer">
            View Organization
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

function DashboardStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="p-4 border rounded-lg text-center">
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}
