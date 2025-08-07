"use client"

import type React from "react"
import Link from "next/link"
import { Clock, Mail, MapPin, MessageSquare, Phone, Send } from "lucide-react"

import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../..//components/ui/card"
import { ContactForm } from "../..//components/contact-form"
export function ContactPageClient() {
  

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-carbon-sand dark:bg-carbon-charcoal/50">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight gradient-text mb-6">Get in Touch</h1>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
              Have questions about CarbonCue? Want to partner with us? We'd love to hear from you. Our team is here to
              help you on your sustainability journey.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How Can We Help?</h2>
              <p className="text-lg text-muted-foreground">Choose the best way to reach us based on your needs</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              <ContactMethodCard
                icon={<MessageSquare className="h-8 w-8 text-carbon-red" />}
                title="General Inquiries"
                description="Questions about our platform, features, or getting started"
                contact="minhvy.ha@mq.edu.au"
                action="Send Email"
                href="mailto:minhvy.ha@mq.edu.au"
              />
              <ContactMethodCard
                icon={<Phone className="h-8 w-8 text-carbon-purple" />}
                title="Technical Support"
                description="Need help with your account or experiencing technical issues"
                contact="minhvy.ha@mq.edu.au"
                action="Get Support"
                href="mailto:minhvy.ha@mq.edu.au"
              />
              <ContactMethodCard
                icon={<Mail className="h-8 w-8 text-carbon-deep-red" />}
                title="Partnerships"
                description="Interested in partnering with us or enterprise solutions"
                contact="minhvy.ha@mq.edu.au"
                action="Partner With Us"
                href="mailto:minhvy.ha@mq.edu.au"
              />
              <ContactMethodCard
                icon={<Send className="h-8 w-8 text-carbon-magenta" />}
                title="Media & Press"
                description="Press inquiries, interviews, and media requests"
                contact="minhvy.ha@mq.edu.au"
                action="Media Inquiry"
                href="mailto:minhvy.ha@mq.edu.au"
              />
            </div>

            {/* Contact Form and Info */}
            <div className="grid grid-cols-1 gap-8">
              {/* Contact Form */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">Send Us a Message</CardTitle>
                    <CardDescription>Fill out the form below and we'll get back to you within 24 hours</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ContactForm />
                  </CardContent>
                </Card>
              </div>

              {/* Contact Information */}

            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-muted/50">
  <div className="container">
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
        <p className="text-lg text-muted-foreground">
          Quick answers to common questions about CarbonCue
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <FAQCard
          question="What is the Website Carbon Emission Calculator?"
          answer="Our Website Calculator estimates a site’s carbon footprint by analyzing total file size, server location, and visitor geography. You can submit either a URL or upload your site files for a detailed breakdown."
        />
        <FAQCard
          question="How does the AI Carbon Emission Calculator work?"
          answer="We integrate with cloud provider APIs (AWS, Google Cloud, etc.) to measure energy use during model training and inference, and translate that into carbon emissions. You’ll get per-epoch and per-query emission benchmarks."
        />
        <FAQCard
          question="Can I track my personal carbon footprint?"
          answer="Yes—our Daily Carbon Footprint Tracker lets you log energy use, transportation choices, and other activities. View interactive charts of your day-to-day and monthly trends, plus get actionable tips to lower your impact."
        />
        <FAQCard
          question="How can I join the Volunteer & Resource Hub?"
          answer="Head over to our Volunteer Hub to browse local and global climate events, register for volunteer opportunities, earn badges, and connect with nonprofits. All listings are filtered by date, location, and cause."
        />
        <FAQCard
          question="Do you offer API access?"
          answer="Absolutely. Developers and organizations can integrate our calculators via RESTful APIs. Email us at minhvy.ha@mq.edu.au for documentation and keys."
        />
        <FAQCard
          question="Where can I get help or provide feedback?"
          answer="Join our Discord community (minhvha) for real-time support, or send us a message via the contact form below. We welcome contributions to our open-source GitHub repo and suggestions for new features!"
        />
      </div>

      <div className="text-center mt-12">
        <p className="text-muted-foreground mb-4">Still have questions?</p>
        <Button asChild className="bg-carbon-red hover:bg-carbon-deep-red">
          <Link href="#contact-form">Ask Us Directly</Link>
        </Button>
      </div>
    </div>
    </div>
</section>


      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="bg-carbon-sand dark:bg-carbon-charcoal/50 rounded-xl p-8 md:p-12">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Your Climate Journey?</h2>
              <p className="text-lg mb-8">
                Join thousands of users who are already making a difference with CarbonCue. Start tracking your carbon
                footprint today.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button asChild size="lg" className="bg-carbon-red hover:bg-carbon-deep-red">
                  <Link href="/signup">Get Started Free</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/website-calculator">Try Calculator</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function ContactMethodCard({
  icon,
  title,
  description,
  contact,
  action,
  href,
}: {
  icon: React.ReactNode
  title: string
  description: string
  contact: string
  action: string
  href: string
}) {
  return (
    <Card className="text-center hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="mx-auto mb-4">{icon}</div>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription className="text-sm">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm font-medium mb-4 text-muted-foreground">{contact}</p>
        <Button asChild variant="outline" size="sm" className="w-full bg-transparent">
          <Link href={href}>{action}</Link>
        </Button>
      </CardContent>
    </Card>
  )
}

function FAQCard({ question, answer }: { question: string; answer: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{question}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{answer}</p>
      </CardContent>
    </Card>
  )
}
