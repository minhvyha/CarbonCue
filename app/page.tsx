import type React from "react";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Calendar,
  Globe,
  Leaf,
  Users,
} from "lucide-react";

import { features } from "@/constants/home";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-40 overflow-hidden bg-carbon-sand dark:bg-carbon-charcoal/50">
        <div className="absolute inset-0 z-0 opacity-20 dark:opacity-10">
          <div
            className="absolute inset-0 bg-[url('/hero-image.jpg?height=800&width=1600')] bg-cover bg-center"
            style={{
              backgroundImage: "url('/hero-image.jpg')",
            }}
          ></div>
        </div>
        <div className="container relative z-10">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight gradient-text mb-6">
              Track, Reduce, and Take Action on Your Carbon Footprint
            </h1>
            <p className="text-lg md:text-xl mb-8 max-w-2xl">
              CarbonCue helps you understand and reduce your digital and
              personal carbon footprint through innovative tools and community
              engagement.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="lg"
                className="bg-carbon-red hover:bg-carbon-deep-red"
              >
                <Link href="/website-calculator">
                  Calculate Website Emissions
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/carbon-tracker">Track Your Footprint</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our Sustainability Platform
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive tools to help you understand, track, and reduce your
              carbon footprint
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <FeatureCard
                key={feature.title}
                icon={<feature.icon className="h-10 w-10 text-carbon-red" />}
                title={feature.title}
                description={feature.description}
                href={feature.href}
              />
            ))}
            <Card className="bg-gradient-to-br from-carbon-red to-carbon-magenta text-white">
              <CardHeader>
                <CardTitle className="text-xl">
                  Ready to make an impact?
                </CardTitle>
                <CardDescription className="text-white/80">
                  Join thousands of users taking climate action today
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button asChild variant="secondary" className="w-full">
                  <Link href="/signup">
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 md:py-24 bg-carbon-charcoal/80 text-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Impact</h2>
            <p className="text-lg text-carbon-sand/80 max-w-2xl mx-auto">
              Together, we're making a difference in the fight against climate
              change
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <StatCard value="10,000+" label="Websites Analyzed"  />
            <StatCard value="5,000+" label="Active Users" />
            <StatCard value="250+" label="Volunteer Events" />
            <StatCard value="1,500+" label="Tons of CO₂ Saved" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="bg-carbon-sand dark:bg-carbon-charcoal/50 rounded-xl p-8 md:p-12">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Join the Climate Action Movement
              </h2>
              <p className="text-lg mb-8">
                Start tracking your carbon footprint, find volunteer
                opportunities, and connect with a community dedicated to
                sustainability.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-carbon-red hover:bg-carbon-deep-red"
                >
                  <Link href="/signup">Create Free Account</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/about">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="mb-4">{icon}</div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button asChild variant="outline" className="w-full">
          <Link href={href}>
            Learn More <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center p-6 rounded-lg ">
      <div className="text-4xl font-bold mb-2 text-carbon-red">{value}</div>
      <div className="text-carbon-sand">{label}</div>
    </div>
  );
}
