import type React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  Globe,
  Heart,
  Leaf,
  Target,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "About - CarbonCue",
  description:
    "Learn about CarbonCue's mission to help individuals and organizations track, reduce, and take action on their carbon footprint",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-carbon-sand dark:bg-carbon-charcoal/50">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight gradient-text pb-6">
              Empowering Climate Action Through Technology
            </h1>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
              CarbonCue is a comprehensive sustainability platform that helps
              individuals and organizations understand, track, and reduce their
              carbon footprint through innovative digital tools and community
              engagement.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-carbon-red hover:bg-carbon-deep-red"
              >
                <Link href="/signup">Join Our Mission</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/volunteer-hub">Get Involved</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Our Mission
              </h2>
              <p className="text-lg text-muted-foreground">
                We believe that technology can be a powerful force for
                environmental change
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <MissionCard
                icon={<Target className="h-10 w-10 text-carbon-red" />}
                title="Measure Impact"
                description="Provide accurate, real-time tools to measure carbon emissions from digital activities, personal choices, and organizational operations."
              />
              <MissionCard
                icon={<Leaf className="h-10 w-10 text-carbon-purple" />}
                title="Drive Reduction"
                description="Empower users with actionable insights and personalized recommendations to significantly reduce their environmental footprint."
              />
              <MissionCard
                icon={<Users className="h-10 w-10 text-carbon-magenta" />}
                title="Build Community"
                description="Connect like-minded individuals and organizations to amplify collective impact through volunteer opportunities and shared resources."
              />
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Our Story
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    CarbonCue was born from a simple realization: while climate
                    change is one of the most pressing challenges of our time,
                    many people and organizations lack the tools to understand
                    and act on their environmental impact.
                  </p>
                  <p>
                    Founded in 2023 by a team of environmental scientists,
                    software engineers, and sustainability advocates, CarbonCue
                    bridges the gap between climate awareness and climate
                    action. We recognized that the digital world—websites, AI
                    systems, and online activities—has a significant but often
                    invisible carbon footprint.
                  </p>
                  <p>
                    Our platform combines cutting-edge technology with
                    user-friendly design to make carbon tracking accessible,
                    accurate, and actionable. We're not just building tools;
                    we're fostering a movement toward a more sustainable future.
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-carbon-red to-carbon-magenta rounded-2xl p-8 flex items-center justify-center bg-cover bg-center" style={{
              backgroundImage: "url('/story-image.jpg')",
            }}>
                  
                </div>
                <div className="absolute -bottom-4 -right-4 bg-carbon-sand dark:bg-carbon-charcoal p-4 rounded-xl shadow-lg">
                  <div className="text-2xl font-bold text-carbon-red">
                    SDG 13
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Climate Action
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Our Values
              </h2>
              <p className="text-lg text-muted-foreground">
                The principles that guide everything we do
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <ValueCard
                title="Transparency"
                description="We believe in open, honest communication about climate data, methodologies, and the challenges we face. Our calculations and recommendations are based on peer-reviewed research and industry best practices."
                color="bg-carbon-red"
              />
              <ValueCard
                title="Accessibility"
                description="Climate action shouldn't be limited to experts. We design our tools to be intuitive and accessible to everyone, regardless of their technical background or environmental knowledge."
                color="bg-carbon-purple"
              />
              <ValueCard
                title="Innovation"
                description="We continuously explore new technologies and methodologies to improve carbon tracking accuracy and user experience. Innovation drives our ability to make a meaningful impact."
                color="bg-carbon-deep-red"
              />
              <ValueCard
                title="Community"
                description="Individual action is powerful, but collective action is transformative. We foster communities that support, educate, and inspire each other toward sustainable practices."
                color="bg-carbon-magenta"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Meet Our Team
              </h2>
              <p className="text-lg text-muted-foreground">
                Passionate individuals working toward a sustainable future
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <TeamMember
                name="Salvio Ha"
                role="Lead Developer"
                bio="Lead Developer with 3 years in UI, database, and core web development, passionate about green tech and climate action."
                image="/team/minh.jpg?height=300&width=300"
              />
              <TeamMember
                name="Marcus Rodriguez"
                role="Co-Founder & CTO"
                bio="Full-stack engineer passionate about using technology to solve environmental challenges."
                image="/placeholder.svg?height=300&width=300"
              />
              <TeamMember
                name="Dr. Aisha Patel"
                role="Head of Sustainability"
                bio="Climate policy expert and former UN advisor on sustainable development goals."
                image="/placeholder.svg?height=300&width=300"
              />
              <TeamMember
                name="Marcus Rodriguez"
                role="Co-Founder & CTO"
                bio="Full-stack engineer passionate about using technology to solve environmental challenges."
                image="/placeholder.svg?height=300&width=300"
              />
              <TeamMember
                name="Rozil Nguyen"
                role="Head of Sustainability"
                bio="Climate policy expert and former UN advisor on sustainable development goals."
                image="/placeholder.svg?height=300&width=300"
              />
              <TeamMember
                name="Dr. Aisha Patel"
                role="Head of Sustainability"
                bio="Climate policy expert and former UN advisor on sustainable development goals."
                image="/placeholder.svg?height=300&width=300"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      {/* <section className="py-16 md:py-24">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Our Impact
              </h2>
              <p className="text-lg text-muted-foreground">
                Together, we're making a measurable difference
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <ImpactStat
                value="10,000+"
                label="Users Tracking Their Footprint"
              />
              <ImpactStat value="2,500+" label="Websites Analyzed" />
              <ImpactStat value="500+" label="Volunteer Events Organized" />
              <ImpactStat value="1,200 tons" label="CO₂ Emissions Reduced" />
            </div>
          </div>
        </div>
      </section> */}

      {/* Recognition Section */}
      {/* <section className="py-16 md:py-24 bg-muted/50">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Recognition
              </h2>
              <p className="text-lg text-muted-foreground">
                Honored to be recognized for our commitment to climate action
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <RecognitionCard
                icon={<Award className="h-8 w-8 text-carbon-red" />}
                title="Climate Tech Innovation Award"
                organization="Green Tech Alliance"
                year="2023"
              />
              <RecognitionCard
                icon={<Heart className="h-8 w-8 text-carbon-purple" />}
                title="Best Social Impact Platform"
                organization="Sustainability Awards"
                year="2023"
              />
              <RecognitionCard
                icon={<Globe className="h-8 w-8 text-carbon-magenta" />}
                title="UN SDG Action Award"
                organization="United Nations"
                year="2023"
              />
            </div>
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="bg-carbon-sand dark:bg-carbon-charcoal/50 rounded-xl p-8 md:p-12">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Make a Difference?
              </h2>
              <p className="text-lg mb-8">
                Join thousands of individuals and organizations using CarbonCue
                to track, reduce, and take action on their carbon footprint.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-carbon-red hover:bg-carbon-deep-red"
                >
                  <Link href="/signup">
                    Get Started Today <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function MissionCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="text-center">
      <CardHeader>
        <div className="mx-auto mb-4">{icon}</div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-sm">{description}</CardDescription>
      </CardContent>
    </Card>
  );
}

function ValueCard({
  title,
  description,
  color,
}: {
  title: string;
  description: string;
  color: string;
}) {
  return (
    <Card>
      <CardHeader>
        <div
          className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center mb-4`}
        >
          <div className="w-6 h-6 bg-white rounded-full" />
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  );
}

function TeamMember({
  name,
  role,
  bio,
  image,
}: {
  name: string;
  role: string;
  bio: string;
  image: string;
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-muted overflow-hidden">
            <img
              src={image || "/placeholder.svg"}
              alt={name}
              className="w-full h-full object-cover"
            />
          </div>
          <h3 className="text-lg font-semibold mb-1">{name}</h3>
          <p className="text-sm text-carbon-red font-medium mb-3">{role}</p>
          <p className="text-sm text-muted-foreground">{bio}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function ImpactStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center p-6 rounded-lg bg-muted">
      <div className="text-3xl font-bold mb-2 text-carbon-red">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

function RecognitionCard({
  icon,
  title,
  organization,
  year,
}: {
  icon: React.ReactNode;
  title: string;
  organization: string;
  year: string;
}) {
  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto mb-4">{icon}</div>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>
          {organization} • {year}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
