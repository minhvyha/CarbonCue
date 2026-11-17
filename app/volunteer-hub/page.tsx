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
  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [error, setError] = useState("");
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    let active = true;
    async function load() {
      show();
      setIsFetching(true);
      setError("");
      try {
        const query = new URLSearchParams({ page: String(page), search: appliedSearch, remote: String(remoteOnly) });
        const res = await fetch(`/api/volunteer-hub?${query}`);
        const result = await res.json();
        if (!res.ok) throw new Error(result.error || "Failed to fetch opportunities.");
        if (!active) return;
        setListings(result.events || []);
        setOrganizations(result.organizations || []);
        setHasMore(result.hasMore === true);
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "Could not load opportunities.");
          setListings([]);
          setOrganizations([]);
          setHasMore(false);
        }
      } finally {
        if (active) setIsFetching(false);
        hide();
      }
    }
    load();
    return () => { active = false; };
  }, [page, appliedSearch, remoteOnly]);

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-4">Volunteer & Resource Hub</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse volunteer opportunities from VolunteerConnector, including remote roles. Check each listing for location and eligibility.
          </p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); setPage(1); setAppliedSearch(search.trim()); }} className="flex flex-col md:flex-row gap-6 mb-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                aria-label="Search volunteer opportunities"
                placeholder="Search volunteer opportunities..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Button type="button" variant="outline" className="flex gap-2" aria-expanded={showFilters} onClick={() => setShowFilters(!showFilters)}>
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </Button>
          <Button type="submit" disabled={isFetching} className="bg-carbon-purple hover:bg-carbon-purple/90">
            Find Events
          </Button>
        </form>
        {showFilters && <label className="flex gap-2 mb-4"><input type="checkbox" checked={remoteOnly} onChange={(e) => { setPage(1); setRemoteOnly(e.target.checked); }} />Remote opportunities only</label>}
        {error && <p role="alert" className="mb-4 text-destructive">{error}</p>}
        {!isFetching && !error && listings.length === 0 && <p role="status" className="mb-4">No opportunities match your search.</p>}

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
                  remote={listing.remote}
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
              disableNext={!hasMore || isFetching}
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
  remote,
  image,
  url,
}: {
  title: string;
  date: string;
  organizer: string;
  remote: boolean;
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
            <span>{remote ? "Remote / online" : "In person"}</span>
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
