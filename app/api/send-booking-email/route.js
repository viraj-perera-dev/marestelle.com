import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  const body = await req.json();
  const { name, email, phone, date, time, message, people, children, price } =
    body;

  const adminHtml = `
<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; background-color: #ffffff; border-radius: 12px; border: 1px solid #e5e7eb; box-shadow: 0 5px 15px rgba(0,0,0,0.05);">
  <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; text-align: center; margin-bottom: 24px;">
    <img src="https://${process.env.NEXT_PUBLIC_APP_URL}/assets/logo/logo_transp_blu.png" alt="Marestelle Logo" style="max-width: 160px; margin-bottom: 12px;" />
    <h2 style="color: #3581be; font-size: 20px; margin: 0;">Nuova Prenotazione Ricevuta</h2>
    <p style="color: #000; font-size: 14px; margin-top: 8px;">Hai ricevuto una nuova richiesta di prenotazione</p>
  </div>

  <div style="background-color: #f9fafb; padding: 20px; border-radius: 10px; margin-bottom: 24px; font-size: 15px; color: #1f2937;">
    <table style="width: 100%; border-collapse: collapse;">
      <tr><td style="padding: 6px 0;"><strong>Nome:</strong></td><td>${name}</td></tr>
      <tr><td style="padding: 6px 0;"><strong>Email:</strong></td><td>${email}</td></tr>
      <tr><td style="padding: 6px 0;"><strong>Telefono:</strong></td><td>${phone}</td></tr>
      <tr><td style="padding: 6px 0;"><strong>Data:</strong></td><td>${new Date(date).toLocaleDateString()}</td></tr>
      <tr><td style="padding: 6px 0;"><strong>Orario:</strong></td><td>${time === "morning" ? "Mattino" : "Pomeriggio"}</td></tr>
      <tr><td style="padding: 6px 0;"><strong>Persone:</strong></td><td>${people}</td></tr>
      <tr><td style="padding: 6px 0;"><strong>Bambini:</strong></td><td>${children}</td></tr>
      <tr><td style="padding: 6px 0;"><strong>Messaggio:</strong></td><td>${message || "-"}</td></tr>
      <tr><td style="padding: 6px 0;"><strong>Prezzo Totale:</strong></td><td style="color: #16a34a; font-weight: bold;">€ ${price}</td></tr>
    </table>
  </div>

  <div style="text-align: center; margin-bottom: 24px;">
    <a href="https://${process.env.NEXT_PUBLIC_APP_URL}/login" style="display: inline-block; padding: 12px 24px; background-color: #3581be; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600;">
      Accedi per Gestire la Prenotazione
    </a>
  </div>

  <p style="color: #6b7280; font-size: 12px; text-align: center;">
    Email generata automaticamente dal sito marestelle.com
  </p>
</div>
`;

  const clientHtml = `
<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; background-color: #ffffff; border-radius: 12px; border: 1px solid #e5e7eb; box-shadow: 0 5px 15px rgba(0,0,0,0.05);">
  <div style="text-align: center; margin-bottom: 24px;">
    <img src="https://${process.env.NEXT_PUBLIC_APP_URL}/assets/logo/logo_transp_blu.png" alt="Marestelle Logo" style="max-width: 160px;" />
  </div>

  <h2 style="color: #1e3a8a; font-size: 22px; font-weight: 600; text-align: center; margin-bottom: 12px;">
    Grazie per la tua prenotazione, ${name}!
  </h2>

  <p style="color: #374151; font-size: 16px; text-align: center; margin-bottom: 24px;">
    Abbiamo ricevuto la tua richiesta per il <strong>${new Date(date).toLocaleDateString()}</strong> 
    (${time === "morning" ? "Mattino" : "Pomeriggio"}). Ti contatteremo a breve per confermare la disponibilità.
  </p>

  <div style="background-color: #f9fafb; padding: 20px; border-radius: 10px; margin-bottom: 24px; box-shadow: 0 2px 6px rgba(0,0,0,0.05);">
    <h3 style="color: #1e3a8a; font-size: 18px; margin-bottom: 16px;">Dettagli della Prenotazione</h3>
    <table style="width: 100%; font-size: 15px; color: #1f2937;">
      <tr>
        <td style="padding: 6px 0;"><strong>Nome:</strong></td>
        <td>${name}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0;"><strong>Telefono:</strong></td>
        <td>${phone}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0;"><strong>Data:</strong></td>
        <td>${new Date(date).toLocaleDateString()}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0;"><strong>Orario:</strong></td>
        <td>${time === "morning" ? "Mattino" : "Pomeriggio"}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0;"><strong>Persone:</strong></td>
        <td>${people}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0;"><strong>Bambini:</strong></td>
        <td>${children}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0;"><strong>Messaggio:</strong></td>
        <td>${message || "-"}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0;"><strong>Prezzo Totale:</strong></td>
        <td style="color: #16a34a; font-weight: bold;">€ ${price}</td>
      </tr>
    </table>
  </div>

  <p style="color: #4b5563; font-size: 15px; margin-bottom: 8px;">
    — Lo staff di Marestelle
  </p>
  <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 20px;">
    Email generata automaticamente da marestelle.com
  </p>
</div>
`;


  try {
    // Send to admin
    await resend.emails.send({
      from: "Prenotazioni Marestelle <noreply@marestelle.com>",
      to: ["info@marestelle.com"],
      subject: `📩 Nuova prenotazione da ${name}`,
      html: adminHtml,
    });

    // Send to client
    await resend.emails.send({
      from: "Marestelle <noreply@marestelle.com>",
      to: [email],
      subject: "Abbiamo ricevuto la tua prenotazione",
      html: clientHtml,
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to send email" }), {
      status: 500,
    });
  }
}
