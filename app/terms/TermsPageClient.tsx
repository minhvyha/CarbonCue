"use client"
import Link from "next/link"
import { Calendar, Download, FileText, Scale } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export function TermsPageClient() {
  const lastUpdated = "August 2, 2024"
  const effectiveDate = "August 2, 2024"

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-carbon-sand dark:bg-carbon-charcoal/50">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-full bg-carbon-purple/10">
                <Scale className="h-12 w-12 text-carbon-purple" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight gradient-text mb-6">Terms of Service</h1>
            <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto">
              These terms govern your use of CarbonCue's sustainability platform and services. Please read them
              carefully to understand your rights and responsibilities.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Last updated: {lastUpdated}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Effective: {effectiveDate}</span>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Quick Summary */}
      <section className="py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-carbon-purple/5 border-carbon-purple/20">
              <CardHeader>
                <CardTitle className="text-xl">Terms Summary</CardTitle>
                <CardDescription>Key points about using CarbonCue</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <FileText className="h-8 w-8 text-carbon-purple mx-auto mb-2" />
                    <h3 className="font-semibold mb-1">Fair Use</h3>
                    <p className="text-sm text-muted-foreground">
                      Use our platform responsibly and in accordance with our guidelines
                    </p>
                  </div>
                  <div className="text-center">
                    <Scale className="h-8 w-8 text-carbon-red mx-auto mb-2" />
                    <h3 className="font-semibold mb-1">Your Rights</h3>
                    <p className="text-sm text-muted-foreground">
                      You retain ownership of your data and can terminate anytime
                    </p>
                  </div>
                  <div className="text-center">
                    <Calendar className="h-8 w-8 text-carbon-magenta mx-auto mb-2" />
                    <h3 className="font-semibold mb-1">Updates</h3>
                    <p className="text-sm text-muted-foreground">We'll notify you of any significant changes</p>
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
                    <a href="#acceptance" className="text-sm hover:text-primary transition-colors">
                      1. Acceptance of Terms
                    </a>
                    <a href="#description" className="text-sm hover:text-primary transition-colors">
                      2. Description of Service
                    </a>
                    <a href="#eligibility" className="text-sm hover:text-primary transition-colors">
                      3. Eligibility and Registration
                    </a>
                    <a href="#user-accounts" className="text-sm hover:text-primary transition-colors">
                      4. User Accounts and Security
                    </a>
                    <a href="#acceptable-use" className="text-sm hover:text-primary transition-colors">
                      5. Acceptable Use Policy
                    </a>
                    <a href="#content-ownership" className="text-sm hover:text-primary transition-colors">
                      6. Content and Intellectual Property
                    </a>
                    <a href="#privacy" className="text-sm hover:text-primary transition-colors">
                      7. Privacy and Data Protection
                    </a>
                    <a href="#payment-terms" className="text-sm hover:text-primary transition-colors">
                      8. Payment Terms
                    </a>
                    <a href="#disclaimers" className="text-sm hover:text-primary transition-colors">
                      9. Disclaimers and Limitations
                    </a>
                    <a href="#indemnification" className="text-sm hover:text-primary transition-colors">
                      10. Indemnification
                    </a>
                    <a href="#termination" className="text-sm hover:text-primary transition-colors">
                      11. Termination
                    </a>
                    <a href="#dispute-resolution" className="text-sm hover:text-primary transition-colors">
                      12. Dispute Resolution
                    </a>
                    <a href="#general-provisions" className="text-sm hover:text-primary transition-colors">
                      13. General Provisions
                    </a>
                    <a href="#contact" className="text-sm hover:text-primary transition-colors">
                      14. Contact Information
                    </a>
                  </nav>
                </CardContent>
              </Card>

              {/* Acceptance of Terms */}
              <section id="acceptance" className="mb-12">
                <h2 className="text-3xl font-bold mb-6">1. Acceptance of Terms</h2>
                <p className="mb-4">
                  Welcome to CarbonCue! These Terms of Service ("Terms") constitute a legally binding agreement between
                  you ("User," "you," or "your") and CarbonCue, Inc. ("CarbonCue," "we," "us," or "our") regarding your
                  use of our sustainability platform and related services.
                </p>
                <p className="mb-4">
                  By accessing, browsing, or using our website, mobile application, or any of our services
                  (collectively, the "Service"), you acknowledge that you have read, understood, and agree to be bound
                  by these Terms and our Privacy Policy, which is incorporated herein by reference.
                </p>
                <p className="mb-4">
                  If you do not agree to these Terms, you must not access or use our Service. Your continued use of the
                  Service constitutes your ongoing acceptance of these Terms and any modifications we may make.
                </p>
              </section>

              <Separator className="my-8" />

              {/* Description of Service */}
              <section id="description" className="mb-12">
                <h2 className="text-3xl font-bold mb-6">2. Description of Service</h2>
                <p className="mb-4">
                  CarbonCue is a comprehensive sustainability platform that provides tools and services to help
                  individuals and organizations understand, track, and reduce their carbon footprint. Our services
                  include:
                </p>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>Website Carbon Emission Calculator</li>
                  <li>AI Carbon Emission Calculator</li>
                  <li>Personal Carbon Footprint Tracker</li>
                  <li>Volunteer and Resource Hub for Climate Action</li>
                  <li>Educational resources and sustainability content</li>
                  <li>Community features and networking opportunities</li>
                  <li>Analytics and reporting tools</li>
                  <li>API access for developers and organizations</li>
                </ul>
                <p className="mb-4">
                  We reserve the right to modify, suspend, or discontinue any aspect of the Service at any time, with or
                  without notice. We may also impose limits on certain features or restrict access to parts of the
                  Service without notice or liability.
                </p>
              </section>

              <Separator className="my-8" />

              {/* Eligibility and Registration */}
              <section id="eligibility" className="mb-12">
                <h2 className="text-3xl font-bold mb-6">3. Eligibility and Registration</h2>

                <h3 className="text-xl font-semibold mb-4">3.1 Age Requirements</h3>
                <p className="mb-4">
                  You must be at least 13 years old to use our Service. If you are between 13 and 18 years old, you
                  represent that you have your parent's or guardian's permission to use the Service and that they have
                  read and agreed to these Terms.
                </p>

                <h3 className="text-xl font-semibold mb-4">3.2 Account Registration</h3>
                <p className="mb-4">
                  To access certain features of the Service, you must create an account. When registering, you agree to:
                </p>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>Provide accurate, current, and complete information</li>
                  <li>Maintain and promptly update your account information</li>
                  <li>Keep your login credentials secure and confidential</li>
                  <li>Accept responsibility for all activities under your account</li>
                  <li>Notify us immediately of any unauthorized use</li>
                </ul>

                <h3 className="text-xl font-semibold mb-4">3.3 Corporate and Organizational Accounts</h3>
                <p className="mb-4">
                  If you are registering on behalf of an organization, you represent that you have the authority to bind
                  that organization to these Terms, and references to "you" include both you individually and the
                  organization.
                </p>
              </section>

              <Separator className="my-8" />

              {/* User Accounts and Security */}
              <section id="user-accounts" className="mb-12">
                <h2 className="text-3xl font-bold mb-6">4. User Accounts and Security</h2>

                <h3 className="text-xl font-semibold mb-4">4.1 Account Security</h3>
                <p className="mb-4">
                  You are responsible for maintaining the security of your account and password. CarbonCue cannot and
                  will not be liable for any loss or damage arising from your failure to comply with this security
                  obligation.
                </p>

                <h3 className="text-xl font-semibold mb-4">4.2 Account Sharing</h3>
                <p className="mb-4">
                  You may not share your account credentials with others or allow others to access your account, except
                  as specifically permitted by our enterprise or team features.
                </p>

                <h3 className="text-xl font-semibold mb-4">4.3 Account Suspension</h3>
                <p className="mb-4">
                  We reserve the right to suspend or terminate accounts that violate these Terms, engage in fraudulent
                  activity, or pose a security risk to our Service or other users.
                </p>
              </section>

              <Separator className="my-8" />

              {/* Acceptable Use Policy */}
              <section id="acceptable-use" className="mb-12">
                <h2 className="text-3xl font-bold mb-6">5. Acceptable Use Policy</h2>

                <h3 className="text-xl font-semibold mb-4">5.1 Permitted Uses</h3>
                <p className="mb-4">You may use our Service to:</p>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>Track and analyze your carbon footprint</li>
                  <li>Access educational resources and sustainability content</li>
                  <li>Connect with volunteer opportunities and climate organizations</li>
                  <li>Share your sustainability achievements and progress</li>
                  <li>Participate in community discussions and forums</li>
                  <li>Use our APIs in accordance with our developer terms</li>
                </ul>

                <h3 className="text-xl font-semibold mb-4">5.2 Prohibited Uses</h3>
                <p className="mb-4">You agree not to:</p>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>Violate any applicable laws, regulations, or third-party rights</li>
                  <li>Use the Service for any illegal, harmful, or fraudulent purpose</li>
                  <li>Attempt to gain unauthorized access to our systems or other users' accounts</li>
                  <li>Interfere with or disrupt the Service or servers</li>
                  <li>Upload malicious code, viruses, or harmful content</li>
                  <li>Scrape, crawl, or harvest data without permission</li>
                  <li>Impersonate others or provide false information</li>
                  <li>Spam, harass, or abuse other users</li>
                  <li>Use the Service to compete with CarbonCue</li>
                  <li>Reverse engineer or attempt to extract source code</li>
                </ul>

                <h3 className="text-xl font-semibold mb-4">5.3 Content Standards</h3>
                <p className="mb-4">
                  Any content you submit must be accurate, lawful, and not infringe on others' rights. We reserve the
                  right to remove content that violates these standards.
                </p>
              </section>

              <Separator className="my-8" />

              {/* Content and Intellectual Property */}
              <section id="content-ownership" className="mb-12">
                <h2 className="text-3xl font-bold mb-6">6. Content and Intellectual Property</h2>

                <h3 className="text-xl font-semibold mb-4">6.1 Your Content</h3>
                <p className="mb-4">
                  You retain ownership of all content you submit to our Service ("User Content"). By submitting User
                  Content, you grant CarbonCue a worldwide, non-exclusive, royalty-free license to use, reproduce,
                  modify, and display your content solely for the purpose of providing and improving our Service.
                </p>

                <h3 className="text-xl font-semibold mb-4">6.2 Our Content</h3>
                <p className="mb-4">
                  The Service and its original content, features, and functionality are owned by CarbonCue and are
                  protected by international copyright, trademark, patent, trade secret, and other intellectual property
                  laws.
                </p>

                <h3 className="text-xl font-semibold mb-4">6.3 Third-Party Content</h3>
                <p className="mb-4">
                  Our Service may contain content from third parties. We do not endorse or assume responsibility for
                  third-party content, and you use such content at your own risk.
                </p>

                <h3 className="text-xl font-semibold mb-4">6.4 Feedback</h3>
                <p className="mb-4">
                  Any feedback, suggestions, or ideas you provide to us become our property and may be used without
                  compensation or attribution.
                </p>
              </section>

              <Separator className="my-8" />

              {/* Privacy and Data Protection */}
              <section id="privacy" className="mb-12">
                <h2 className="text-3xl font-bold mb-6">7. Privacy and Data Protection</h2>
                <p className="mb-4">
                  Your privacy is important to us. Our collection, use, and protection of your personal information is
                  governed by our{" "}
                  <Link href="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                  , which is incorporated into these Terms by reference.
                </p>
                <p className="mb-4">
                  By using our Service, you consent to the collection and use of your information as described in our
                  Privacy Policy. We implement appropriate security measures to protect your data, but cannot guarantee
                  absolute security.
                </p>
                <p className="mb-4">
                  You have certain rights regarding your personal data, including the right to access, correct, or
                  delete your information. Please refer to our Privacy Policy for detailed information about your rights
                  and how to exercise them.
                </p>
              </section>

              <Separator className="my-8" />

              {/* Payment Terms */}
              <section id="payment-terms" className="mb-12">
                <h2 className="text-3xl font-bold mb-6">8. Payment Terms</h2>

                <h3 className="text-xl font-semibold mb-4">8.1 Free and Paid Services</h3>
                <p className="mb-4">
                  CarbonCue offers both free and paid services. Free services are provided "as is" with no warranty.
                  Paid services are subject to the terms outlined in your subscription or purchase agreement.
                </p>

                <h3 className="text-xl font-semibold mb-4">8.2 Subscription Terms</h3>
                <p className="mb-4">For paid subscriptions:</p>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>Fees are charged in advance on a recurring basis</li>
                  <li>You authorize us to charge your payment method automatically</li>
                  <li>Subscriptions renew automatically unless cancelled</li>
                  <li>You can cancel your subscription at any time</li>
                  <li>Refunds are provided according to our refund policy</li>
                </ul>

                <h3 className="text-xl font-semibold mb-4">8.3 Price Changes</h3>
                <p className="mb-4">
                  We reserve the right to change our pricing with 30 days' notice. Price changes will not affect your
                  current billing cycle.
                </p>

                <h3 className="text-xl font-semibold mb-4">8.4 Taxes</h3>
                <p className="mb-4">
                  You are responsible for any applicable taxes, duties, or government fees related to your use of paid
                  services.
                </p>
              </section>

              <Separator className="my-8" />

              {/* Disclaimers and Limitations */}
              <section id="disclaimers" className="mb-12">
                <h2 className="text-3xl font-bold mb-6">9. Disclaimers and Limitations</h2>

                <h3 className="text-xl font-semibold mb-4">9.1 Service Availability</h3>
                <p className="mb-4">
                  While we strive to maintain high availability, we do not guarantee that the Service will be
                  uninterrupted, error-free, or completely secure. We may experience downtime for maintenance, updates,
                  or unforeseen circumstances.
                </p>

                <h3 className="text-xl font-semibold mb-4">9.2 Accuracy of Information</h3>
                <p className="mb-4">
                  Our carbon calculations and sustainability information are based on available data and established
                  methodologies, but we cannot guarantee absolute accuracy. Results should be used as estimates and
                  guidance rather than precise measurements.
                </p>

                <h3 className="text-xl font-semibold mb-4">9.3 Disclaimer of Warranties</h3>
                <p className="mb-4">
                  THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS OR
                  IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE,
                  AND NON-INFRINGEMENT.
                </p>

                <h3 className="text-xl font-semibold mb-4">9.4 Limitation of Liability</h3>
                <p className="mb-4">
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, CARBONCUE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
                  SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, OR
                  USE, ARISING OUT OF OR RELATING TO THESE TERMS OR THE SERVICE.
                </p>
              </section>

              <Separator className="my-8" />

              {/* Indemnification */}
              <section id="indemnification" className="mb-12">
                <h2 className="text-3xl font-bold mb-6">10. Indemnification</h2>
                <p className="mb-4">
                  You agree to indemnify, defend, and hold harmless CarbonCue, its officers, directors, employees,
                  agents, and affiliates from and against any claims, liabilities, damages, losses, costs, expenses, or
                  fees (including reasonable attorneys' fees) arising from:
                </p>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>Your use or misuse of the Service</li>
                  <li>Your violation of these Terms</li>
                  <li>Your violation of any rights of another party</li>
                  <li>Your User Content or any content you submit</li>
                  <li>Your negligent or wrongful conduct</li>
                </ul>
              </section>

              <Separator className="my-8" />

              {/* Termination */}
              <section id="termination" className="mb-12">
                <h2 className="text-3xl font-bold mb-6">11. Termination</h2>

                <h3 className="text-xl font-semibold mb-4">11.1 Termination by You</h3>
                <p className="mb-4">
                  You may terminate your account at any time by following the account deletion process in your settings
                  or by contacting us. Upon termination, your right to use the Service will cease immediately.
                </p>

                <h3 className="text-xl font-semibold mb-4">11.2 Termination by Us</h3>
                <p className="mb-4">
                  We may terminate or suspend your account and access to the Service immediately, without prior notice,
                  if you breach these Terms or engage in conduct that we determine is harmful to the Service or other
                  users.
                </p>

                <h3 className="text-xl font-semibold mb-4">11.3 Effect of Termination</h3>
                <p className="mb-4">
                  Upon termination, your account and data may be deleted, though we may retain certain information as
                  required by law or for legitimate business purposes. Provisions that by their nature should survive
                  termination will remain in effect.
                </p>
              </section>

              <Separator className="my-8" />

              {/* Dispute Resolution */}
              <section id="dispute-resolution" className="mb-12">
                <h2 className="text-3xl font-bold mb-6">12. Dispute Resolution</h2>

                <h3 className="text-xl font-semibold mb-4">12.1 Informal Resolution</h3>
                <p className="mb-4">
                  Before pursuing formal dispute resolution, we encourage you to contact us at{" "}
                  <a href="mailto:legal@carboncue.com" className="text-primary hover:underline">
                    legal@carboncue.com
                  </a>{" "}
                  to discuss and potentially resolve the issue informally.
                </p>

                <h3 className="text-xl font-semibold mb-4">12.2 Binding Arbitration</h3>
                <p className="mb-4">
                  Any disputes arising out of or relating to these Terms or the Service will be resolved through binding
                  arbitration in accordance with the Commercial Arbitration Rules of the American Arbitration
                  Association, rather than in court.
                </p>

                <h3 className="text-xl font-semibold mb-4">12.3 Class Action Waiver</h3>
                <p className="mb-4">
                  You agree that any arbitration will be conducted on an individual basis and not as part of a class,
                  collective, or representative action.
                </p>

                <h3 className="text-xl font-semibold mb-4">12.4 Governing Law</h3>
                <p className="mb-4">
                  These Terms are governed by the laws of the State of California, without regard to conflict of law
                  principles.
                </p>
              </section>

              <Separator className="my-8" />

              {/* General Provisions */}
              <section id="general-provisions" className="mb-12">
                <h2 className="text-3xl font-bold mb-6">13. General Provisions</h2>

                <h3 className="text-xl font-semibold mb-4">13.1 Entire Agreement</h3>
                <p className="mb-4">
                  These Terms, together with our Privacy Policy and any additional terms for specific services,
                  constitute the entire agreement between you and CarbonCue.
                </p>

                <h3 className="text-xl font-semibold mb-4">13.2 Modifications</h3>
                <p className="mb-4">
                  We may modify these Terms at any time by posting the updated version on our website. Material changes
                  will be communicated via email or platform notification. Your continued use after changes become
                  effective constitutes acceptance.
                </p>

                <h3 className="text-xl font-semibold mb-4">13.3 Severability</h3>
                <p className="mb-4">
                  If any provision of these Terms is found to be unenforceable, the remaining provisions will remain in
                  full force and effect.
                </p>

                <h3 className="text-xl font-semibold mb-4">13.4 Assignment</h3>
                <p className="mb-4">
                  You may not assign or transfer your rights under these Terms without our written consent. We may
                  assign our rights and obligations without restriction.
                </p>

                <h3 className="text-xl font-semibold mb-4">13.5 Force Majeure</h3>
                <p className="mb-4">
                  We will not be liable for any failure to perform our obligations due to circumstances beyond our
                  reasonable control, including natural disasters, war, terrorism, or government actions.
                </p>
              </section>

              <Separator className="my-8" />

              {/* Contact Information */}
              <section id="contact" className="mb-12">
                <h2 className="text-3xl font-bold mb-6">14. Contact Information</h2>
                <p className="mb-4">
                  If you have questions about these Terms or need to contact us for legal matters, please reach out:
                </p>

                <div className="bg-muted/50 p-6 rounded-lg">
                  <h3 className="font-semibold mb-4">Legal Department</h3>
                  <div className="space-y-2">
                    <p>
                      <strong>Email:</strong>{" "}
                      <a href="mailto:legal@carboncue.com" className="text-primary hover:underline">
                        legal@carboncue.com
                      </a>
                    </p>
                    <p>
                      <strong>Mail:</strong>
                      <br />
                      CarbonCue Legal Department
                      <br />
                      123 Climate Street
                      <br />
                      San Francisco, CA 94105
                      <br />
                      United States
                    </p>
                    <p>
                      <strong>Business Registration:</strong> CarbonCue, Inc. (Delaware Corporation)
                    </p>
                  </div>
                </div>

                <p className="mt-6">
                  For general support and non-legal inquiries, please visit our{" "}
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

              {/* Acknowledgment */}
              <section className="mb-12">
                <Card className="bg-carbon-sand dark:bg-carbon-charcoal/50">
                  <CardContent className="pt-6">
                    <p className="text-center font-medium">
                      By using CarbonCue, you acknowledge that you have read, understood, and agree to be bound by these
                      Terms of Service.
                    </p>
                  </CardContent>
                </Card>
              </section>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Questions About These Terms?</h2>
            <p className="text-lg mb-8">
              Our legal team is available to help clarify any questions you may have about our Terms of Service.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg" className="bg-carbon-purple hover:bg-carbon-purple/90">
                <Link href="/contact">Contact Legal Team</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/signup">Accept Terms & Sign Up</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
