"use client"
import Link from "next/link"
import { Calendar, Download, FileText, Scale } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export function TermsPageClient() {
  const lastUpdated = "August 15, 2025"
  const effectiveDate = "August 15, 2025"

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
                      You retain ownership of your content and can close your account at any time
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
                    <a href="#acceptance" className="text-sm hover:text-primary transition-colors">1. Acceptance of Terms</a>
                    <a href="#description" className="text-sm hover:text-primary transition-colors">2. Description of Service</a>
                    <a href="#eligibility" className="text-sm hover:text-primary transition-colors">3. Eligibility and Registration</a>
                    <a href="#user-accounts" className="text-sm hover:text-primary transition-colors">4. User Accounts and Security</a>
                    <a href="#acceptable-use" className="text-sm hover:text-primary transition-colors">5. Acceptable Use Policy</a>
                    <a href="#content-ownership" className="text-sm hover:text-primary transition-colors">6. Content and Intellectual Property</a>
                    <a href="#privacy" className="text-sm hover:text-primary transition-colors">7. Privacy and Data Protection</a>
                    <a href="#payment-terms" className="text-sm hover:text-primary transition-colors">8. Payment Terms</a>
                    <a href="#disclaimers" className="text-sm hover:text-primary transition-colors">9. Disclaimers and Limitations</a>
                    <a href="#indemnification" className="text-sm hover:text-primary transition-colors">10. Indemnification</a>
                    <a href="#termination" className="text-sm hover:text-primary transition-colors">11. Termination</a>
                    <a href="#dispute-resolution" className="text-sm hover:text-primary transition-colors">12. Dispute Resolution</a>
                    <a href="#general-provisions" className="text-sm hover:text-primary transition-colors">13. General Provisions</a>
                    <a href="#contact" className="text-sm hover:text-primary transition-colors">14. Contact Information</a>
                  </nav>
                </CardContent>
              </Card>

              {/* Acceptance of Terms */}
              <section id="acceptance" className="mb-12">
                <h2 className="text-3xl font-bold mb-6">1. Acceptance of Terms</h2>
                <p className="mb-4">Welcome to CarbonCue! These Terms of Service ("Terms") form a binding agreement between you ("User," "you," or "your") and CarbonCue ("CarbonCue," "we," "us," or "our"), an Australian non-profit that operates this sustainability platform.</p>
                <p className="mb-4">By accessing or using our website, applications, or services (the "Service"), you agree to these Terms and our Privacy Policy. If you do not agree, please do not use the Service.</p>
                <p className="mb-4">Your continued use of the Service after we post changes to the Terms constitutes your acceptance of those changes.</p>
              </section>

              <Separator className="my-8" />

              {/* Description of Service */}
              <section id="description" className="mb-12">
                <h2 className="text-3xl font-bold mb-6">2. Description of Service</h2>
                <p className="mb-4">CarbonCue provides tools and resources to help individuals and organisations measure and reduce their carbon footprint. Services include:</p>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>Website Carbon Emission Calculator</li>
                  <li>AI Carbon Emission Calculator</li>
                  <li>Personal Carbon Footprint Tracker</li>
                  <li>Volunteer & Resource Hub for climate action</li>
                  <li>Educational resources and community features</li>
                  <li>Analytics and reporting tools</li>
                </ul>
                <p className="mb-4">We currently do not provide a public API — CarbonCue is an educational non-profit and our tools are provided through the website only.</p>
                <p className="mb-4">We reserve the right to modify, suspend, or discontinue any aspect of the Service at any time.</p>
              </section>

              <Separator className="my-8" />

              {/* Eligibility and Registration */}
              <section id="eligibility" className="mb-12">
                <h2 className="text-3xl font-bold mb-6">3. Eligibility and Registration</h2>

                <h3 className="text-xl font-semibold mb-4">3.1 Age Requirements</h3>
                <p className="mb-4">You must be at least 13 years old to use our Service. If you are under 18, you should have parental or guardian permission to use the Service.</p>

                <h3 className="text-xl font-semibold mb-4">3.2 Account Registration</h3>
                <p className="mb-4">To access certain features you must create an account. You agree to provide accurate information, keep credentials secure, and be responsible for activity on your account.</p>

                <h3 className="text-xl font-semibold mb-4">3.3 Organisation Accounts</h3>
                <p className="mb-4">If you register on behalf of an organisation you represent that you have authority to bind that organisation to these Terms.</p>
              </section>

              <Separator className="my-8" />

              {/* User Accounts and Security */}
              <section id="user-accounts" className="mb-12">
                <h2 className="text-3xl font-bold mb-6">4. User Accounts and Security</h2>
                <p className="mb-4">You are responsible for safeguarding your account. Notify us immediately of any unauthorised use. We may suspend or terminate accounts that pose security risks or violate these Terms.</p>
              </section>

              <Separator className="my-8" />

              {/* Acceptable Use Policy */}
              <section id="acceptable-use" className="mb-12">
                <h2 className="text-3xl font-bold mb-6">5. Acceptable Use Policy</h2>
                <p className="mb-4">Use the Service for lawful, constructive, and non-commercial purposes aligned with CarbonCue's mission. Prohibited activities include unlawful conduct, hacking, scraping without permission, distributing malware, impersonation, harassment, or using the Service to compete with CarbonCue.</p>
                <p className="mb-4">We may remove content or suspend accounts that breach these rules.</p>
              </section>

              <Separator className="my-8" />

              {/* Content and Intellectual Property */}
              <section id="content-ownership" className="mb-12">
                <h2 className="text-3xl font-bold mb-6">6. Content and Intellectual Property</h2>
                <p className="mb-4">You retain ownership of the content you submit ("User Content"). By submitting User Content you grant CarbonCue a non-exclusive, worldwide, royalty-free licence to use it to provide and improve the Service.</p>
                <p className="mb-4">All other content, branding and software provided by CarbonCue remain our intellectual property and are protected by law.</p>
                <p className="mb-4">Feedback you provide may be used by us without compensation.</p>
              </section>

              <Separator className="my-8" />

              {/* Privacy and Data Protection */}
              <section id="privacy" className="mb-12">
                <h2 className="text-3xl font-bold mb-6">7. Privacy and Data Protection</h2>
                <p className="mb-4">Our Privacy Policy (linked below) explains how we collect and handle personal information in accordance with Australian law. By using the Service you consent to the collection and use described therein.</p>
                <p className="mb-4"><Link href="/privacy" className="text-primary hover:underline">Read our Privacy Policy</Link></p>
              </section>

              <Separator className="my-8" />

              {/* Payment Terms */}
              <section id="payment-terms" className="mb-12">
                <h2 className="text-3xl font-bold mb-6">8. Payment Terms</h2>
                <p className="mb-4">CarbonCue offers primarily free educational services. If paid services are offered, specific subscription terms will apply and will be communicated at purchase.</p>
                <p className="mb-4">You are responsible for any applicable taxes related to paid services.</p>
              </section>

              <Separator className="my-8" />

              {/* Disclaimers and Limitations */}
              <section id="disclaimers" className="mb-12">
                <h2 className="text-3xl font-bold mb-6">9. Disclaimers and Limitations</h2>
                <p className="mb-4">The Service is provided "as is" for educational purposes. We strive for accuracy but cannot guarantee exact results. Use outputs as guidance, not precise measurements.</p>
                <p className="mb-4">To the extent permitted by law, CarbonCue excludes certain liabilities; statutory rights that cannot be excluded will continue to apply.</p>
              </section>

              <Separator className="my-8" />

              {/* Indemnification */}
              <section id="indemnification" className="mb-12">
                <h2 className="text-3xl font-bold mb-6">10. Indemnification</h2>
                <p className="mb-4">You agree to indemnify CarbonCue against claims arising from your breach of these Terms, misuse of the Service, or infringement of others' rights.</p>
              </section>

              <Separator className="my-8" />

              {/* Termination */}
              <section id="termination" className="mb-12">
                <h2 className="text-3xl font-bold mb-6">11. Termination</h2>
                <p className="mb-4">You may close your account at any time. We may suspend or terminate accounts that breach these Terms or present security risks. Certain provisions (e.g. IP, disclaimers, indemnities) survive termination.</p>
              </section>

              <Separator className="my-8" />

              {/* Dispute Resolution */}
              <section id="dispute-resolution" className="mb-12">
                <h2 className="text-3xl font-bold mb-6">12. Dispute Resolution</h2>

                <h3 className="text-xl font-semibold mb-4">12.1 Informal Resolution</h3>
                <p className="mb-4">If a dispute arises, please contact us at <a href="mailto:minhvy.ha@mq.edu.au" className="text-primary hover:underline">minhvy.ha@mq.edu.au</a> to try to resolve the matter informally within 30 days.</p>

                <h3 className="text-xl font-semibold mb-4">12.2 Mediation and Court Proceedings</h3>
                <p className="mb-4">If informal resolution fails, the parties agree to attempt mediation with a mutually agreed mediator. If mediation does not resolve the dispute, you may bring the matter to a court of competent jurisdiction in New South Wales, Australia.</p>

                <h3 className="text-xl font-semibold mb-4">12.3 Governing Law</h3>
                <p className="mb-4">These Terms are governed by the laws of New South Wales and the Commonwealth of Australia.</p>
              </section>

              <Separator className="my-8" />

              {/* General Provisions */}
              <section id="general-provisions" className="mb-12">
                <h2 className="text-3xl font-bold mb-6">13. General Provisions</h2>
                <p className="mb-4">These Terms, together with our Privacy Policy, constitute the entire agreement between you and CarbonCue regarding the Service.</p>
                <p className="mb-4">We may amend these Terms by posting updates on the site. For material changes we will provide notice where reasonably practicable.</p>
                <p className="mb-4">If a provision is held invalid, the remaining provisions remain in effect.</p>
              </section>

              <Separator className="my-8" />

              {/* Contact Information */}
              <section id="contact" className="mb-12">
                <h2 className="text-3xl font-bold mb-6">14. Contact Information</h2>
                <p className="mb-4">For questions about these Terms or legal matters, contact our legal representative:</p>

                <div className="bg-muted/50 p-6 rounded-lg">
                  <h3 className="font-semibold mb-4">Legal Contact</h3>
                  <div className="space-y-2">
                    <p><strong>Email:</strong> <a href="mailto:minhvy.ha@mq.edu.au" className="text-primary hover:underline">minhvy.ha@mq.edu.au</a></p>

                    <p><strong>Entity:</strong> CarbonCue (Australian non-profit)</p>
                  </div>
                </div>

                <p className="mt-6">For general enquiries, visit our <Link href="/contact" className="text-primary hover:underline">Contact Page</Link> or email <a href="mailto:hello@carboncue.com" className="text-primary hover:underline">hello@carboncue.com</a>.</p>
              </section>

              {/* Acknowledgment */}
              <section className="mb-12">
                <Card className="bg-carbon-sand dark:bg-carbon-charcoal/50">
                  <CardContent className="pt-6">
                    <p className="text-center font-medium">By using CarbonCue, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.</p>
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
            <p className="text-lg mb-8">Our legal team is available to help clarify any questions you may have about our Terms of Service.</p>
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
