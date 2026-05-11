import type { APIRoute } from "astro";
import { Resend } from "resend";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const { name, email, subject, message } = await request.json();

  if (!name || !email || !subject || !message) {
    return new Response(
      JSON.stringify({ error: "Todos los campos son requeridos." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const resend = new Resend(import.meta.env.RESEND_API);

  const { error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: "telmo.ramirez@uees.edu.ec",
    subject: `[Stratos Cloud] ${subject}`,
    html: `
      <h2>Nuevo mensaje de contacto</h2>
      <p><strong>Nombre:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Asunto:</strong> ${subject}</p>
      <p><strong>Mensaje:</strong></p>
      <p>${message}</p>
    `,
  });

  if (error) {
    return new Response(
      JSON.stringify({ error: "Error al enviar el correo." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  return new Response(
    JSON.stringify({ success: true }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
};
