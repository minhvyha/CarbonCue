"use client"
import Link from "next/link"
import { Calendar, Download, Mail, Shield } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export function PrivacyPageClient() {
  const lastUpdated = "January 15, 2024"

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
              Your privacy is fundamental to our mission. Learn how we collect, use, and protect your personal
              information while helping you track and reduce your carbon footprint.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Last updated: {lastUpdated}</span>
              </div>
              <div className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                <Button variant="link" className="p-0 h-auto text-sm">
                  Download PDF
                </Button>
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
                <CardDescription>Key points about how we handle your data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <Shield className="h-8 w-8 text-carbon-red mx-auto mb-2" />
                    <h3 className="font-semibold mb-1">Data Protection</h3>
                    <p className="text-sm text-muted-foreground">
                      We encrypt all data and never sell your personal information
                    </p>
                  </div>
                  <div className="text-center">
                    <Mail className="h-8 w-8 text-carbon-purple mx-auto mb-2" />
                    <h3 className="font-semibold mb-1">Your Control</h3>
                    <p className="text-sm text-muted-foreground">
                      You can access, modify, or delete your data at any time
                    </p>
                  </div>
                  <div className="text-center">
                    <Calendar className="h-8 w-8 text-carbon-magenta mx-auto mb-2" />
                    <h3 className="font-semibold mb-1">Transparency</h3>
                    <p className="text-sm text-muted-foreground">We're clear about what data we collect and why</p>
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
                    <a href="#introduction" className="text-sm hover:text-primary transition-colors">
                      1. Introduction
                    </a>
                    <a href="#information-we-collect" className="text-sm hover:text-primary transition-colors">
                      2. Information We Collect
                    </a>
                    <a href="#how-we-use-information" className="text-sm hover:text-primary transition-colors">
                      3. How We Use Your Information
                    </a>
                    <a href="#information-sharing" className="text-sm hover:text-primary transition-colors">
                      4. Information Sharing
                    </a>
                    <a href="#data-security" className="text-sm hover:text-primary transition-colors">
                      5. Data Security
                    </a>
                    <a href="#your-rights" className="text-sm hover:text-primary transition-colors">
                      6. Your Rights and Choices
                    </a>
                    <a href="#cookies" className="text-sm hover:text-primary transition-colors">
                      7. Cookies and Tracking
                    </a>
                    <a href="#international-transfers" className="text-sm hover:text-primary transition-colors">
                      8. International Data Transfers
                    </a>
                    <a href="#children-privacy" className="text-sm hover:text-primary transition-colors">
                      9. Children's Privacy
                    </a>
                    <a href="#changes" className="text-sm hover:text-primary transition-colors">
                      10. Changes to This Policy
                    </a>
                    <a href="#contact" className="text-sm hover:text-primary transition-colors">
                      11. Contact Information
                    </a>
                  </nav>
                </CardContent>
              </Card>

              {/* Introduction */}
              <section id="introduction" className="mb-12">
                <h2 className="text-3xl font-bold mb-6">1. Introduction</h2>
                <p className="mb-4">
                  Welcome to CarbonCue ("we," "our," or "us"). We are committed to protecting your privacy and ensuring
                  the security of your personal information. This Privacy Policy explains how we collect, use, disclose,
                  and safeguard your information when you use our sustainability platform and related services.
                </p>
                <p className="mb-4">
                  CarbonCue provides tools and services to help individuals and organizations track, understand, and
                  reduce their carbon footprint. This includes website carbon calculators, AI emission calculators,
                  personal carbon tracking, and volunteer opportunity matching.
                </p>
                <p>
                  By using our services, you agree to the collection and use of information in accordance with this
                  Privacy Policy. If you do not agree with our policies and practices, please do not use our services.
                </p>
              </section>

              <Separator className="my-8" />

              {/* Information We Collect */}
              <section id="information-we-collect" className="mb-12">
                <h2 className="text-3xl font-bold mb-6">2. Information We Collect</h2>

                <h3 className="text-xl font-semibold mb-4">2.1 Information You Provide Directly</h3>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>
                    <strong>Account Information:</strong> Name, email address, password, and profile information when
                    you create an account
                  </li>
                  <li>
                    <strong>Carbon Tracking Data:</strong> Information about your activities, transportation, energy
                    usage, and other data you input for carbon footprint calculations
                  </li>
                  <li>
                    <strong>Website Analysis Data:</strong> URLs and website information you submit for carbon emission
                    analysis
                  </li>
                  <li>
                    <strong>Communication Data:</strong> Messages, feedback, and other communications you send to us
                  </li>
                  <li>
                    <strong>Volunteer Information:</strong> Preferences, availability, and participation data for
                    volunteer opportunities
                  </li>
                </ul>

                <h3 className="text-xl font-semibold mb-4">2.2 Information We Collect Automatically</h3>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>
                    <strong>Usage Data:</strong> How you interact with our platform, features used, time spent, and
                    navigation patterns
                  </li>
                  <li>
                    <strong>Device Information:</strong> IP address, browser type, operating system, device identifiers,
                    and mobile network information
                  </li>
                  <li>
                    <strong>Location Data:</strong> General location information based on IP address (not precise
                    location unless explicitly provided)
                  </li>
                  <li>
                    <strong>Performance Data:</strong> Information about how our services perform on your device
                  </li>
                </ul>

                <h3 className="text-xl font-semibold mb-4">2.3 Information from Third Parties</h3>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>
                    <strong>Social Media:</strong> Information from social media platforms when you connect your
                    accounts or share content
                  </li>
                  <li>
                    <strong>Partner Organizations:</strong> Information from volunteer organizations and sustainability
                    partners (with your consent)
                  </li>
                  <li>
                    <strong>Public Sources:</strong> Publicly available information about carbon emission factors and
                    environmental data
                  </li>
                </ul>
              </section>

              <Separator className="my-8" />

              {/* How We Use Information */}
              <section id="how-we-use-information" className="mb-12">
                <h2 className="text-3xl font-bold mb-6">3. How We Use Your Information</h2>
                <p className="mb-4">We use the information we collect for the following purposes:</p>

                <h3 className="text-xl font-semibold mb-4">3.1 Core Services</h3>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>Calculate and track your carbon footprint</li>
                  <li>Analyze website and AI system carbon emissions</li>
                  <li>Provide personalized sustainability recommendations</li>
                  <li>Match you with relevant volunteer opportunities</li>
                  <li>Generate reports and insights about your environmental impact</li>
                </ul>

                <h3 className="text-xl font-semibold mb-4">3.2 Platform Improvement</h3>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>Improve our algorithms and calculation accuracy</li>
                  <li>Develop new features and services</li>
                  <li>Analyze usage patterns to enhance user experience</li>
                  <li>Conduct research on sustainability trends and behaviors</li>
                </ul>

                <h3 className="text-xl font-semibold mb-4">3.3 Communication</h3>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>Send you account-related notifications and updates</li>
                  <li>Provide customer support and respond to inquiries</li>
                  <li>Share sustainability tips and educational content (with your consent)</li>
                  <li>Notify you about volunteer opportunities and community events</li>
                </ul>

                <h3 className="text-xl font-semibold mb-4">3.4 Legal and Security</h3>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>Comply with legal obligations and regulatory requirements</li>
                  <li>Protect against fraud, abuse, and security threats</li>
                  <li>Enforce our terms of service and policies</li>
                  <li>Resolve disputes and investigate violations</li>
                </ul>
              </section>

              <Separator className="my-8" />

              {/* Information Sharing */}
              <section id="information-sharing" className="mb-12">
                <h2 className="text-3xl font-bold mb-6">4. Information Sharing and Disclosure</h2>
                <p className="mb-4">
                  We do not sell, trade, or rent your personal information to third parties. We may share your
                  information only in the following circumstances:
                </p>

                <h3 className="text-xl font-semibold mb-4">4.1 With Your Consent</h3>
                <p className="mb-4">
                  We may share your information when you explicitly consent, such as when connecting with volunteer
                  organizations or sharing achievements on social media.
                </p>

                <h3 className="text-xl font-semibold mb-4">4.2 Service Providers</h3>
                <p className="mb-4">
                  We work with trusted third-party service providers who help us operate our platform, including:
                </p>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>Cloud hosting and data storage providers</li>
                  <li>Analytics and performance monitoring services</li>
                  <li>Email and communication services</li>
                  <li>Payment processing services</li>
                  <li>Customer support platforms</li>
                </ul>

                <h3 className="text-xl font-semibold mb-4">4.3 Aggregated and Anonymized Data</h3>
                <p className="mb-4">
                  We may share aggregated, anonymized data that cannot identify you personally for research,
                  sustainability reporting, and industry insights.
                </p>

                <h3 className="text-xl font-semibold mb-4">4.4 Legal Requirements</h3>
                <p className="mb-4">We may disclose your information when required by law or to:</p>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>Comply with legal processes, court orders, or government requests</li>
                  <li>Protect our rights, property, or safety, or that of our users</li>
                  <li>Investigate potential violations of our terms of service</li>
                  <li>Prevent fraud or other illegal activities</li>
                </ul>

                <h3 className="text-xl font-semibold mb-4">4.5 Business Transfers</h3>
                <p className="mb-4">
                  In the event of a merger, acquisition, or sale of assets, your information may be transferred as part
                  of the transaction, subject to the same privacy protections.
                </p>
              </section>

              <Separator className="my-8" />

              {/* Data Security */}
              <section id="data-security" className="mb-12">
                <h2 className="text-3xl font-bold mb-6">5. Data Security</h2>
                <p className="mb-4">
                  We implement comprehensive security measures to protect your personal information:
                </p>

                <h3 className="text-xl font-semibold mb-4">5.1 Technical Safeguards</h3>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>End-to-end encryption for data transmission and storage</li>
                  <li>Secure servers with regular security updates and monitoring</li>
                  <li>Multi-factor authentication for account access</li>
                  <li>Regular security audits and penetration testing</li>
                  <li>Automated backup and disaster recovery systems</li>
                </ul>

                <h3 className="text-xl font-semibold mb-4">5.2 Administrative Safeguards</h3>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>Limited access to personal data on a need-to-know basis</li>
                  <li>Employee training on data protection and privacy practices</li>
                  <li>Confidentiality agreements with all staff and contractors</li>
                  <li>Regular review and update of security policies</li>
                </ul>

                <h3 className="text-xl font-semibold mb-4">5.3 Physical Safeguards</h3>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>Secure data centers with restricted physical access</li>
                  <li>Environmental controls and monitoring systems</li>
                  <li>Secure disposal of hardware and storage media</li>
                </ul>

                <p className="mb-4">
                  While we implement strong security measures, no system is completely secure. We encourage you to use
                  strong passwords and keep your account information confidential.
                </p>
              </section>

              <Separator className="my-8" />

              {/* Your Rights */}
              <section id="your-rights" className="mb-12">
                <h2 className="text-3xl font-bold mb-6">6. Your Rights and Choices</h2>
                <p className="mb-4">You have several rights regarding your personal information:</p>

                <h3 className="text-xl font-semibold mb-4">6.1 Access and Portability</h3>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>Request a copy of all personal information we have about you</li>
                  <li>Download your data in a portable format</li>
                  <li>View your account information and activity history</li>
                </ul>

                <h3 className="text-xl font-semibold mb-4">6.2 Correction and Updates</h3>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>Update your profile and account information at any time</li>
                  <li>Correct inaccurate or incomplete data</li>
                  <li>Modify your privacy preferences and communication settings</li>
                </ul>

                <h3 className="text-xl font-semibold mb-4">6.3 Deletion</h3>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>Delete your account and associated data</li>
                  <li>Request removal of specific information</li>
                  <li>Opt out of data collection for certain features</li>
                </ul>

                <h3 className="text-xl font-semibold mb-4">6.4 Communication Preferences</h3>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>Unsubscribe from marketing emails and newsletters</li>
                  <li>Adjust notification settings for different types of communications</li>
                  <li>Choose how we contact you about account-related matters</li>
                </ul>

                <p className="mb-4">
                  To exercise these rights, please contact us at{" "}
                  <a href="mailto:privacy@carboncue.com" className="text-primary hover:underline">
                    privacy@carboncue.com
                  </a>{" "}
                  or use the privacy controls in your account settings.
                </p>
              </section>

              <Separator className="my-8" />

              {/* Cookies */}
              <section id="cookies" className="mb-12">
                <h2 className="text-3xl font-bold mb-6">7. Cookies and Tracking Technologies</h2>
                <p className="mb-4">
                  We use cookies and similar technologies to enhance your experience and understand how you use our
                  services.
                </p>

                <h3 className="text-xl font-semibold mb-4">7.1 Types of Cookies We Use</h3>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>
                    <strong>Essential Cookies:</strong> Required for basic functionality and security
                  </li>
                  <li>
                    <strong>Performance Cookies:</strong> Help us understand how you use our platform
                  </li>
                  <li>
                    <strong>Functional Cookies:</strong> Remember your preferences and settings
                  </li>
                  <li>
                    <strong>Analytics Cookies:</strong> Provide insights into usage patterns and improvements
                  </li>
                </ul>

                <h3 className="text-xl font-semibold mb-4">7.2 Managing Cookies</h3>
                <p className="mb-4">
                  You can control cookies through your browser settings and our cookie preference center. Note that
                  disabling certain cookies may affect platform functionality.
                </p>

                <h3 className="text-xl font-semibold mb-4">7.3 Third-Party Analytics</h3>
                <p className="mb-4">
                  We use analytics services like Google Analytics to understand user behavior. These services may use
                  cookies and collect information according to their own privacy policies.
                </p>
              </section>

              <Separator className="my-8" />

              {/* International Transfers */}
              <section id="international-transfers" className="mb-12">
                <h2 className="text-3xl font-bold mb-6">8. International Data Transfers</h2>
                <p className="mb-4">
                  CarbonCue operates globally, and your information may be transferred to and processed in countries
                  other than your own. We ensure appropriate safeguards are in place:
                </p>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>Standard contractual clauses approved by relevant authorities</li>
                  <li>Adequacy decisions for countries with equivalent privacy protections</li>
                  <li>Certification schemes and codes of conduct</li>
                  <li>Regular assessment of transfer mechanisms and protections</li>
                </ul>
              </section>

              <Separator className="my-8" />

              {/* Children's Privacy */}
              <section id="children-privacy" className="mb-12">
                <h2 className="text-3xl font-bold mb-6">9. Children's Privacy</h2>
                <p className="mb-4">
                  Our services are not intended for children under 13 years of age. We do not knowingly collect personal
                  information from children under 13. If we become aware that we have collected information from a child
                  under 13, we will take steps to delete such information promptly.
                </p>
                <p className="mb-4">
                  For users between 13 and 18, we recommend parental guidance when using our services and sharing
                  personal information.
                </p>
              </section>

              <Separator className="my-8" />

              {/* Changes */}
              <section id="changes" className="mb-12">
                <h2 className="text-3xl font-bold mb-6">10. Changes to This Privacy Policy</h2>
                <p className="mb-4">
                  We may update this Privacy Policy from time to time to reflect changes in our practices, technology,
                  legal requirements, or other factors. When we make changes:
                </p>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>We will update the "Last Updated" date at the top of this policy</li>
                  <li>We will notify you of significant changes via email or platform notification</li>
                  <li>We will provide a summary of key changes when appropriate</li>
                  <li>We will maintain previous versions for your reference</li>
                </ul>
                <p className="mb-4">
                  Your continued use of our services after changes become effective constitutes acceptance of the
                  updated Privacy Policy.
                </p>
              </section>

              <Separator className="my-8" />

              {/* Contact */}
              <section id="contact" className="mb-12">
                <h2 className="text-3xl font-bold mb-6">11. Contact Information</h2>
                <p className="mb-4">
                  If you have questions, concerns, or requests regarding this Privacy Policy or our data practices,
                  please contact us:
                </p>

                <div className="bg-muted/50 p-6 rounded-lg">
                  <h3 className="font-semibold mb-4">Privacy Team</h3>
                  <div className="space-y-2">
                    <p>
                      <strong>Email:</strong>{" "}
                      <a href="mailto:privacy@carboncue.com" className="text-primary hover:underline">
                        privacy@carboncue.com
                      </a>
                    </p>
                    <p>
                      <strong>Mail:</strong>
                      <br />
                      CarbonCue Privacy Team
                      <br />
                      123 Climate Street
                      <br />
                      San Francisco, CA 94105
                      <br />
                      United States
                    </p>
                    <p>
                      <strong>Response Time:</strong> We aim to respond to privacy inquiries within 30 days.
                    </p>
                  </div>
                </div>

                <p className="mt-6">
                  For general questions about our services, please visit our{" "}
                  <Link href="/contact" className="text-primary hover:underline">
                    Contact Page
                  </Link>{" "}
                  or email{" "}
                  <a href="mailto:hello@carboncue.com" className="text-primary hover:underline">
                    hello@carboncue.com
                  </a>
                  .
                </p>
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
            <p className="text-lg mb-8">
              Our privacy team is here to help. Contact us with any questions or concerns about how we handle your data.
            </p>
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
