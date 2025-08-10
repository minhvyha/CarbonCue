"use client";

import type React from "react";
import { useState } from "react";
import { Loader2, Send } from "lucide-react";
import emailjs from "@emailjs/browser";
import { useToast } from "./toast-provider";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ContactForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    subject: "",
    message: "",
    inquiryType: "general",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        toast({
          title: "Message Sent",
          description: "Your message has been sent successfully!",
        });
        setIsLoading(false);
        setIsSubmitted(true);
        setTimeout(() => {
          setFormData({
            name: "",
            email: "",
            company: "",
            subject: "",
            message: "",
            inquiryType: "general",
          });
          setIsSubmitted(false);
        }, 5000);
      })
      .catch((error) => {
        console.error("Error:", error);
        toast({
          title: "Error",
          description:
            "There was an issue sending your message. Please try again later.",
          variant: "destructive",
        });
      });
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
          <Send className="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
        <h3 className="text-xl font-semibold mb-2">
          Message Sent Successfully!
        </h3>
        <p className="text-muted-foreground mb-4">
          Thank you for contacting us. We'll get back to you within 24 hours.
        </p>
        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
          Check your email for confirmation
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" id="contact-form">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            name="name"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="john@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="company">Company/Organization</Label>
          <Input
            id="company"
            name="company"
            placeholder="Acme Corp (optional)"
            value={formData.company}
            onChange={handleChange}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="inquiryType">Inquiry Type</Label>
          <select
            id="inquiryType"
            name="inquiryType"
            value={formData.inquiryType}
            onChange={handleChange}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="general">General Inquiry</option>
            <option value="support">Technical Support</option>
            <option value="partnership">Partnership</option>
            <option value="press">Media & Press</option>
            <option value="feedback">Feedback</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="subject">Subject *</Label>
        <Input
          id="subject"
          name="subject"
          placeholder="How can we help you?"
          value={formData.subject}
          onChange={handleChange}
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="message">Message *</Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Tell us more about your inquiry..."
          rows={6}
          value={formData.message}
          onChange={handleChange}
          required
        />
      </div>

      <div className="flex items-start space-x-2">
        <input type="checkbox" id="privacy" className="mt-1" required />
        <Label htmlFor="privacy" className="text-sm leading-relaxed">
          I agree to CarbonCue's{" "}
          <a href="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </a>{" "}
          and consent to being contacted about my inquiry.
        </Label>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-carbon-red hover:bg-carbon-deep-red"
        size="lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending Message...
          </>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            Send Message
          </>
        )}
      </Button>
    </form>
  );
}
