export const dynamic = 'force-dynamic';

// app/api/resources/route.ts

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message, company, inquiryType } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing one or more required fields: name, email, subject, message.' },
        { status: 400 }
      );
    }

    // Load environment variables
    const serviceId = process.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = process.env.VITE_EMAILJS_TEMPLATE_ID;
    const userId = process.env.VITE_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !userId) {
      console.error('EmailJS env variables missing:', { serviceId, templateId, userId });
      return NextResponse.json(
        { error: 'Server configuration error: EmailJS environment variables are not set.' },
        { status: 500 }
      );
    }

    // Prepare payload for EmailJS REST API
    const payload = {
      service_id: serviceId,
      template_id: templateId,
      user_id: userId,
      template_params: {
        from_name: name,
        to_name: 'Minh Vy Ha',
        from_email: email,
        to_email: 'minhvy.ha@outlook.com',
        subject,
        message,
        company: company || '',
        inquiry_type: inquiryType || '',
      },
    };

    // Send email via EmailJS REST endpoint
    const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('EmailJS send failed:', res.status, errorText);
      return NextResponse.json(
        { error: 'Failed to send email. Please try again later.' },
        { status: 502 }
      );
    }

    return NextResponse.json({ message: 'Email sent successfully.' }, { status: 200 });

  } catch (error: any) {
    console.error('Unexpected error in email route:', error);
    return NextResponse.json(
      { error: 'Internal server error while sending email.', details: error.message || error.toString() },
      { status: 500 }
    );
  }
}
