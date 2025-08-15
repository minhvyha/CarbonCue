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
import { Pagination } from "@/components/pagination";
import { useLoading } from "@/contexts/loading-context";

type Listing = {
  id: number;
  title: string;
  org: string;
  remote: boolean;
  dates: string;
  url: string;
  logo: string;
};

type Organization = {
  name: string;
  logo: string;
  url: string;
};

export default function VolunteerHubPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const { show, hide } = useLoading();

  useEffect(() => {
    async function load() {
      show();
      try {
        const res = await fetch(`/api/volunteer-hub?page=${page}`);
        if (!res.ok) throw new Error("Failed to fetch data");

        const { events, organizations } = await res.json();
        console.log("Fetched events:", events);
        setListings(events);
        setOrganizations(organizations);
        setHasMore(events.length > 0); // If no events, disable Next
      } catch (err) {
        console.error(err);
      } finally {
        hide();
      }
    }
    setTimeout(() => {

      load();
    }, 100);
  }, [page]);

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-4">Volunteer & Resource Hub</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Connect with local and global climate events, track your volunteer
            hours, and access resources.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 mb-10">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for events, organizations, or resources..."
                className="pl-10"
              />
            </div>
          </div>
          <Button variant="outline" className="flex gap-2">
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </Button>
          <Button className="bg-carbon-purple hover:bg-carbon-purple/90">
            Find Events
          </Button>
        </div>

        <Tabs defaultValue="events" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="events">Events & Opportunities</TabsTrigger>
            <TabsTrigger value="organizations">Organizations</TabsTrigger>
          </TabsList>

          <TabsContent value="events">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing) => (
                <EventCard
                  key={listing.id}
                  title={listing.title}
                  date={listing.dates}
                  organizer={listing.org}
                  attendees={Math.floor(Math.random() * 100) + 10}
                  image={
                    listing.logo || "/placeholder.svg?height=200&width=400"
                  }
                  url={listing.url}
                />
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={page}
              onPageChange={setPage}
              disableNext={!hasMore}
            />
          </TabsContent>

          <TabsContent value="organizations">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {organizations.map((org, idx) => (
                <OrganizationCard key={idx} {...org} />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* <div className="mt-16">
          <Card>
            <CardHeader>
              <CardTitle>Your Volunteer Dashboard</CardTitle>
              <CardDescription>
                Track your volunteer hours and impact
              </CardDescription>
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
              <Button
                asChild
                className="w-full bg-carbon-purple hover:bg-carbon-purple/90"
              >
                <Link href="/volunteer-hub/log-hours">Log Volunteer Hours</Link>
              </Button>
            </CardFooter>
          </Card>
        </div> */}
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
        <img
          src={image || "/placeholder.svg"}
          alt={title}
          className="w-full h-full object-cover"
        />
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
          <img
            src={logo}
            alt={name}
            className="max-h-full max-w-full object-contain p-4"
          />
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
