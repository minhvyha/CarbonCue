"use client"
import Link from "next/link"
import { Calendar, Download, Mail, Shield } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export function PrivacyPageClient() {
  const lastUpdated = "August 15, 2025"

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-carbon-sand dark:bg-carbon-charcoal/50">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-full bg-carbon-red/10">
                <Shield className="h-12 w-12 text-carbon-red" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight gradient-text mb-6">Privacy Policy</h1>
            <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto">
              Your privacy matters. This policy explains how CarbonCue ("we", "our" or "us"), a non-profit educational
              service, collects, uses and protects personal information in accordance with Australian law.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Last updated: {lastUpdated}</span>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Quick Summary */}
      <section className="py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-carbon-red/5 border-carbon-red/20">
              <CardHeader>
                <CardTitle className="text-xl">Privacy at a Glance</CardTitle>
                <CardDescription>Key points about how we handle your data under Australian law</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <Shield className="h-8 w-8 text-carbon-red mx-auto mb-2" />
                    <h3 className="font-semibold mb-1">Australian law</h3>
                    <p className="text-sm text-muted-foreground">
                      We comply with the Privacy Act 1988 (Cth) and the Australian Privacy Principles (APPs).
                    </p>
                  </div>
                  <div className="text-center">
                    <Mail className="h-8 w-8 text-carbon-purple mx-auto mb-2" />
                    <h3 className="font-semibold mb-1">Your rights</h3>
                    <p className="text-sm text-muted-foreground">
                      Access, correct or request deletion of your personal data; make a complaint to us or the OAIC.
                    </p>
                  </div>
                  <div className="text-center">
                    <Calendar className="h-8 w-8 text-carbon-magenta mx-auto mb-2" />
                    <h3 className="font-semibold mb-1">Notifiable breaches</h3>
                    <p className="text-sm text-muted-foreground">We will notify affected individuals and the OAIC if a serious data breach occurs.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none">
              {/* Table of Contents */}
              <Card className="mb-12">
                <CardHeader>
                  <CardTitle>Table of Contents</CardTitle>
                </CardHeader>
                <CardContent>
                  <nav className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <a href="#introduction" className="text-sm hover:text-primary transition-colors">1. Introduction</a>
                    <a href="#information-we-collect" className="text-sm hover:text-primary transition-colors">2. Information We Collect</a>
                    <a href="#how-we-use-information" className="text-sm hover:text-primary transition-colors">3. How We Use Your Information</a>
                    <a href="#information-sharing" className="text-sm hover:text-primary transition-colors">4. Information Sharing</a>
                    <a href="#data-security" className="text-sm hover:text-primary transition-colors">5. Data Security</a>
                    <a href="#your-rights" className="text-sm hover:text-primary transition-colors">6. Your Rights and Choices</a>
                    <a href="#cookies" className="text-sm hover:text-primary transition-colors">7. Cookies and Tracking</a>
                    <a href="#international-transfers" className="text-sm hover:text-primary transition-colors">8. International Data Transfers</a>
                    <a href="#children-privacy" className="text-sm hover:text-primary transition-colors">9. Children's Privacy</a>
                    <a href="#changes" className="text-sm hover:text-primary transition-colors">10. Changes to This Policy</a>
                    <a href="#contact" className="text-sm hover:text-primary transition-colors">11. Contact Information</a>
                  </nav>
                </CardContent>
              </Card>

              {/* Introduction */}
              <section id="introduction" className="mb-12">
                <h2 className="text-3xl font-bold mb-6">1. Introduction</h2>
                <p className="mb-4">
                  CarbonCue ("we", "our", "us") is a non-profit educational website based in Australia that helps individuals and organisations measure and reduce their carbon footprint. This Privacy Policy explains how we collect, hold, use and disclose personal information in accordance with the Privacy Act 1988 (Cth) and the Australian Privacy Principles (APPs).
                </p>
                <p className="mb-4">
                  Our platform offers tools such as a website carbon emissions calculator, AI training emissions calculator, personal carbon tracker and a Volunteer & Resource Hub.
                </p>
                <p>
                  By using our services you consent to the practices described in this policy. If you do not agree, please do not use our services.
                </p>
              </section>

              <Separator className="my-8" />

              {/* Information We Collect */}
              <section id="information-we-collect" className="mb-12">
                <h2 className="text-3xl font-bold mb-6">2. Information We Collect</h2>

                <h3 className="text-xl font-semibold mb-4">2.1 Information You Provide Directly</h3>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li><strong>Account Information:</strong> name, email, password (hashed), and profile details.</li>
                  <li><strong>Carbon Tracking Data:</strong> activities you log (transport, energy, diet, purchases, digital use) to calculate emissions.</li>
                  <li><strong>Website Analysis Data:</strong> URLs, site files or related metadata you submit for our website calculator.</li>
                  <li><strong>Volunteer Preferences:</strong> location, availability and interests you provide for the Volunteer Hub.</li>
                  <li><strong>Communications:</strong> messages, feedback and survey responses you send to us.</li>
                </ul>

                <h3 className="text-xl font-semibold mb-4">2.2 Information Collected Automatically</h3>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li><strong>Usage Data:</strong> interaction events, feature usage and session times.</li>
                  <li><strong>Device & Network:</strong> IP address (anonymised where possible), browser, operating system and device identifiers.</li>
                  <li><strong>Location:</strong> approximate location derived from IP address unless you provide precise location data.</li>
                  <li><strong>Performance:</strong> error logs and performance metrics to improve our service.</li>
                </ul>

                <h3 className="text-xl font-semibold mb-4">2.3 Third-Party Sources</h3>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li><strong>Service Integrations:</strong> information from services you connect (e.g. social login) with your consent.</li>
                  <li><strong>Partners:</strong> volunteer organisations and sustainability partners who provide event or program data with your consent.</li>
                  <li><strong>Public Data:</strong> emission factors and environmental datasets from public sources.</li>
                </ul>
              </section>

              <Separator className="my-8" />

              {/* How We Use Information */}
              <section id="how-we-use-information" className="mb-12">
                <h2 className="text-3xl font-bold mb-6">3. How We Use Your Information</h2>
                <p className="mb-4">We use personal information to provide and improve our services, communicate with you, and meet legal obligations.</p>

                <h3 className="text-xl font-semibold mb-4">3.1 Core Services</h3>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>Provide carbon calculations and personalised sustainability recommendations.</li>
                  <li>Power the Volunteer Hub and match users with opportunities.</li>
                  <li>Generate anonymised reports and research insights.</li>
                </ul>

                <h3 className="text-xl font-semibold mb-4">3.2 Improvements & Research</h3>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>Improve algorithms, fix bugs and test features.</li>
                  <li>Conduct aggregated research on sustainability behaviours (data will be anonymised).</li>
                </ul>

                <h3 className="text-xl font-semibold mb-4">3.3 Communications</h3>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>Send service messages, updates and, with consent, educational content and event notifications.</li>
                </ul>

                <h3 className="text-xl font-semibold mb-4">3.4 Legal & Safety</h3>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>Comply with legal obligations and respond to law enforcement requests.</li>
                  <li>Detect and prevent fraud, abuse and security incidents.</li>
                </ul>
              </section>

              <Separator className="my-8" />

              {/* Information Sharing */}
              <section id="information-sharing" className="mb-12">
                <h2 className="text-3xl font-bold mb-6">4. Information Sharing and Disclosure</h2>
                <p className="mb-4">We will not sell your personal information. We may share data only as described below or with your consent.</p>

                <h3 className="text-xl font-semibold mb-4">4.1 With Your Consent</h3>
                <p className="mb-4">Examples include connecting to third-party volunteer platforms or sharing achievements on social media.</p>

                <h3 className="text-xl font-semibold mb-4">4.2 Service Providers</h3>
                <p className="mb-4">We use trusted third-party providers to operate our service (hosting, analytics, email, payments). These providers are contractually required to protect your data and may only process it for the purposes we specify.</p>

                <h3 className="text-xl font-semibold mb-4">4.3 Aggregated & Anonymised Data</h3>
                <p className="mb-4">We may publish aggregated, de-identified data for research or reporting; this cannot reasonably be used to identify individuals.</p>

                <h3 className="text-xl font-semibold mb-4">4.4 Legal Requests & Safety</h3>
                <p className="mb-4">We may disclose information to comply with legal processes, protect our rights, or to investigate misuse.</p>

                <h3 className="text-xl font-semibold mb-4">4.5 Business Transfers</h3>
                <p className="mb-4">If CarbonCue merges or transfers assets, user data may be transferred with appropriate protections.</p>
              </section>

              <Separator className="my-8" />

              {/* Data Security */}
              <section id="data-security" className="mb-12">
                <h2 className="text-3xl font-bold mb-6">5. Data Security</h2>
                <p className="mb-4">We take reasonable steps to protect personal information from misuse, interference and loss, and from unauthorised access, modification or disclosure.</p>

                <h3 className="text-xl font-semibold mb-4">5.1 Technical Measures</h3>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>Encryption in transit (TLS) and at rest where feasible</li>
                  <li>Secure hosting with regular updates and monitoring</li>
                  <li>Access controls and multi-factor authentication for staff</li>
                  <li>Regular security testing and backups</li>
                </ul>

                <h3 className="text-xl font-semibold mb-4">5.2 Administrative & Physical Safeguards</h3>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>Staff training and confidentiality agreements</li>
                  <li>Least-privilege access to systems holding personal data</li>
                  <li>Secure disposal of hardware and storage media</li>
                </ul>

                <p className="mb-4">No system is completely secure. If a data breach is likely to result in serious harm, we will follow the OAIC's Notifiable Data Breach scheme and notify affected individuals and the OAIC without undue delay.</p>
              </section>

              <Separator className="my-8" />

              {/* Your Rights */}
              <section id="your-rights" className="mb-12">
                <h2 className="text-3xl font-bold mb-6">6. Your Rights and Choices</h2>
                <p className="mb-4">Under the Privacy Act and the APPs you have rights including to access, correct and lodge a complaint about your personal information.</p>

                <h3 className="text-xl font-semibold mb-4">6.1 Access & Portability</h3>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>Request a copy of the personal information we hold about you.</li>
                  <li>Receive data in a commonly used, portable format where practicable.</li>
                </ul>

                <h3 className="text-xl font-semibold mb-4">6.2 Correction & Deletion</h3>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>Ask us to correct inaccurate information.</li>
                  <li>Request deletion of your account and personal data, subject to legal retention obligations.</li>
                </ul>

                <h3 className="text-xl font-semibold mb-4">6.3 How to Exercise Your Rights</h3>
                <p className="mb-4">To make a request, contact us at the address below. We will respond within a reasonable period (typically 30 days). If you remain dissatisfied, you may make a complaint to the Office of the Australian Information Commissioner (OAIC).</p>
              </section>

              <Separator className="my-8" />

              {/* Cookies */}
              <section id="cookies" className="mb-12">
                <h2 className="text-3xl font-bold mb-6">7. Cookies and Tracking Technologies</h2>
                <p className="mb-4">We use cookies and similar technologies to provide and improve our services. You can manage preferences via your browser or our cookie centre.</p>

                <h3 className="text-xl font-semibold mb-4">7.1 Types of Cookies</h3>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li><strong>Essential:</strong> Required for basic functionality.</li>
                  <li><strong>Performance & Analytics:</strong> Help us understand usage (IP is anonymised where possible).</li>
                  <li><strong>Functional:</strong> Remember preferences.</li>
                </ul>

                <h3 className="text-xl font-semibold mb-4">7.2 Third-Party Analytics</h3>
                <p className="mb-4">We use analytics providers to understand platform use; these providers maintain their own privacy policies. We work to minimise the personal data they receive and anonymise data where practicable.</p>
              </section>

              <Separator className="my-8" />

              {/* International Transfers */}
              <section id="international-transfers" className="mb-12">
                <h2 className="text-3xl font-bold mb-6">8. International Data Transfers</h2>
                <p className="mb-4">Some of our service providers or partners may be located overseas. When we transfer personal information internationally we put in place appropriate safeguards (contracts, assessments and security controls) to protect your data in line with the APPs.</p>
              </section>

              <Separator className="my-8" />

              {/* Children's Privacy */}
              <section id="children-privacy" className="mb-12">
                <h2 className="text-3xl font-bold mb-6">9. Children's Privacy</h2>
                <p className="mb-4">Our services are not intended for children under 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13 we will take steps to delete it promptly.</p>
                <p className="mb-4">If you are a parent or guardian and you believe your child has provided us with personal information, please contact us.</p>
              </section>

              <Separator className="my-8" />

              {/* Changes */}
              <section id="changes" className="mb-12">
                <h2 className="text-3xl font-bold mb-6">10. Changes to This Privacy Policy</h2>
                <p className="mb-4">We may update this policy to reflect changes in law, technology or our practices. We will update the "Last updated" date and, for significant changes, notify users by email or on the platform.</p>
              </section>

              <Separator className="my-8" />

              {/* Contact */}
              <section id="contact" className="mb-12">
                <h2 className="text-3xl font-bold mb-6">11. Contact Information</h2>
                <p className="mb-4">If you have questions, requests or complaints regarding this policy or our handling of personal information, please contact:</p>

                <div className="bg-muted/50 p-6 rounded-lg">
                  <h3 className="font-semibold mb-4">Privacy Team</h3>
                  <div className="space-y-2">
                    <p>
                      <strong>Email:</strong>{" "}
                      <a href="mailto:minhvy.ha@mq.edu.au" className="text-primary hover:underline">minhvy.ha@mq.edu.au</a>
                    </p>
      
                    <p>
                      <strong>Response Time:</strong> We aim to respond to privacy inquiries within 30 days.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      If you remain dissatisfied after contacting us you may make a complaint to the Office of the Australian
                      Information Commissioner (OAIC).
                    </p>
                  </div>
                </div>

                <p className="mt-6">For general enquiries about CarbonCue, visit our <Link href="/contact" className="text-primary hover:underline">Contact Page</Link>.</p>
              </section>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Questions About Your Privacy?</h2>
            <p className="text-lg mb-8">Our privacy team is here to help. Contact us with any questions or concerns about how we handle your data.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg" className="bg-carbon-red hover:bg-carbon-deep-red">
                <Link href="/contact">Contact Privacy Team</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/dashboard">Manage Your Data</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
