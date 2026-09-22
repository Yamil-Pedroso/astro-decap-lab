import type { APIRoute } from "astro";
import { Resend } from "resend";
import { z } from "zod";
import { createDeckCard } from "../../services/deckService";
import {
  contactRouting,
  departmentEmailEnv,
} from "../../config/contactRouting";

export const prerender = false;

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

    const requestId = `REQ-${crypto.randomUUID()}`;

    console.log(`[${requestId}] Contact request received`);

    // Read secrets at runtime.
    const resendApiKey =
      process.env.RESEND_API_KEY || import.meta.env.RESEND_API_KEY;

    const contactEmail =
      process.env.CONTACT_EMAIL || import.meta.env.CONTACT_EMAIL;

    const route = contactRouting[topic];

    if (!route) {
      console.error(`[${requestId}] Unknown contact topic: ${topic}`);

      return Response.json(
        {
          success: false,
          message: "Invalid contact topic.",
        },
        { status: 400 },
      );
    }

    const departmentEnvName = departmentEmailEnv[route.department];

    const departmentEmail =
      process.env[departmentEnvName] || import.meta.env[departmentEnvName];

    // Admin always receives the request.
    // The department receives it too when configured.
    // Set removes duplicates automatically.
    const recipients = [
      ...new Set(
        [contactEmail, departmentEmail].filter((email): email is string =>
          Boolean(email),
        ),
      ),
    ];

    if (!resendApiKey || !contactEmail) {
      console.error(
        "Contact service environment variables are not configured.",
      );

      return Response.json(
        {
          success: false,
          message: "Contact service is not configured.",
        },
        { status: 500 },
      );
    }

    const resend = new Resend(resendApiKey);

    // 1. Send the contact request to Reboot Lab.
    const { data: adminEmail, error: adminError } = await resend.emails.send({
      from: "Reboot Lab <contact@send.yampe.dev>",
      to: recipients,
      replyTo: email,
      subject: `[${requestId}] Reboot Lab contact: ${topic}`,

      text: `
New contact message

Request-ID: ${requestId}

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
      from: "Reboot Lab <contact@send.yampe.dev>",
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
      // The original request was already received,
      // so a confirmation failure should not fail the submission.
      console.error("Resend customer confirmation error:", customerError);
    }

    // 3. Create the corresponding card in Nextcloud Deck.
    try {
      await createDeckCard({
        requestId,
        name,
        email,
        topic,
        message,
      });
    } catch (deckError) {
      // The email has already been received.
      // Do not tell the customer that the whole submission failed.
      console.error("Nextcloud Deck card creation error:", deckError);
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
