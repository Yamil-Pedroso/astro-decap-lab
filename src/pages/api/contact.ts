import type { APIRoute } from "astro";
import { Resend } from "resend";
import { z } from "zod";

export const prerender = false;

const resend = new Resend(import.meta.env.RESEND_API_KEY);

const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must contain at least 2 characters.")
    .max(100, "Name is too long."),

  email: z
    .string()
    .trim()
    .email("Please enter a valid email address.")
    .max(254, "Email address is too long."),

  topic: z
    .string()
    .trim()
    .max(100, "Topic is too long.")
    .optional()
    .default("General"),

  message: z
    .string()
    .trim()
    .min(10, "Message must contain at least 10 characters.")
    .max(5000, "Message is too long."),

  website: z.string().trim().max(200).optional().default(""),
});

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();

    const result = contactSchema.safeParse(body);

    if (!result.success) {
      return Response.json(
        {
          success: false,
          message: "Please check the form fields.",
          errors: result.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { name, email, topic, message, website } = result.data;

    // Honeypot: bots often fill hidden fields.
    if (website) {
      return Response.json({
        success: true,
        message: "Message sent successfully.",
      });
    }

    const contactEmail = import.meta.env.CONTACT_EMAIL;

    if (!contactEmail) {
      console.error("CONTACT_EMAIL is not configured.");

      return Response.json(
        {
          success: false,
          message: "Contact service is not configured.",
        },
        { status: 500 },
      );
    }

    // 1. Send the contact request to Reboot Lab.
    const { data: adminEmail, error: adminError } = await resend.emails.send({
      from: "Reboot Lab <onboarding@resend.dev>",
      to: [contactEmail],
      replyTo: email,
      subject: `Reboot Lab contact: ${topic}`,

      text: `
New contact message

Name: ${name}
Email: ${email}
Topic: ${topic}

Message:
${message}
        `.trim(),
    });

    if (adminError) {
      console.error("Resend admin email error:", adminError);

      return Response.json(
        {
          success: false,
          message: "Unable to send the message.",
        },
        { status: 500 },
      );
    }

    // 2. Send an automatic confirmation to the customer.
    const { error: customerError } = await resend.emails.send({
      from: "Reboot Lab <onboarding@resend.dev>",
      to: [email],
      subject: "We received your message — Reboot Lab",

      text: `
Hi ${name},

Thanks for contacting Reboot Lab.

We've received your message regarding "${topic}" and will get back to you as soon as possible.

Your message:

${message}

Best regards,
Reboot Lab
      `.trim(),
    });

    if (customerError) {
      // The original contact request was already received,
      // so don't tell the customer that their form submission failed.
      console.error("Resend customer confirmation error:", customerError);
    }

    return Response.json({
      success: true,
      message: "Message sent successfully.",
      id: adminEmail?.id,
    });
  } catch (error) {
    console.error("Contact endpoint error:", error);

    return Response.json(
      {
        success: false,
        message: "Invalid request.",
      },
      { status: 400 },
    );
  }
};
