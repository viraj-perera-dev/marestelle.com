import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  const body = await req.json();
  const { name, email, phone, date, time, message, people, children, price } =
    body;

  const adminHtml = `
<div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: auto; padding: 20px; background: #3581be; border-radius: 12px;">
    <img src="https://${process.env.NEXT_PUBLIC_APP_URL}/assets/logo/logo_max_white.png" alt="Marestelle Logo" style="max-width: 150px; margin-bottom: 20px;" />

    <h2 style="color: #fff;">📩 Nuova Prenotazione Ricevuta</h2>
    <p style="font-size: 16px; color: #fff;">Hai ricevuto una nuova richiesta di prenotazione con i seguenti dettagli:</p>

    <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0; box-shadow: 0 2px 6px rgba(0,0,0,0.05);">
      <p><strong>👤 Nome:</strong> ${name}</p>
      <p><strong>📧 Email:</strong> ${email}</p>
      <p><strong>📞 Telefono:</strong> ${phone}</p>
      <p><strong>📅 Data:</strong> ${new Date(date).toLocaleDateString()}</p>
      <p><strong>⏰ Orario:</strong> ${time === "morning" ? "Mattino" : "Pomeriggio"}</p>
      <p><strong>🧍 Persone:</strong> ${people}</p>
      <p><strong>👶 Bambini:</strong> ${children}</p>
      <p><strong>💬 Messaggio:</strong> ${message || "-"}</p>
      <p><strong>💶 Prezzo Totale:</strong> <span style="color:#16a34a;">€ ${price}</span></p>
    </div>

    <a href="https://${process.env.NEXT_PUBLIC_APP_URL}/login" style="display:inline-block;padding:12px 24px;background:#fff;color:#3581be;text-decoration:none;border-radius:8px;font-weight:bold;">
      🔐 Accedi per gestire la prenotazione
    </a>

    <p style="color: #fff; font-size: 12px; margin-top: 20px;">Ricevuto tramite il sito marestelle.com</p>
  </div>
`;

  const clientHtml = `
  <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: auto; padding: 20px; background: #3581be; border-radius: 12px;">
    <img src="https://${process.env.NEXT_PUBLIC_APP_URL}/logo.png" alt="Marestelle Logo" style="max-width: 150px; margin-bottom: 20px;" />

    <h2 style="color: #1e3a8a;">Grazie per la tua prenotazione, ${name}!</h2>
    <p style="font-size: 16px; color: #fff;">
      Abbiamo ricevuto la tua richiesta per il <strong>${new Date(date).toLocaleDateString()}</strong> 
      (${time === "morning" ? "Mattino" : "Pomeriggio"}).
    </p>
    
    <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0; box-shadow: 0 2px 6px rgba(0,0,0,0.05);">
      <p><strong>👤 Nome:</strong> ${name}</p>
      <p><strong>📞 Telefono:</strong> ${phone}</p>
      <p><strong>📅 Data:</strong> ${new Date(date).toLocaleDateString()}</p>
      <p><strong>⏰ Orario:</strong> ${time === "morning" ? "Mattino" : "Pomeriggio"}</p>
      <p><strong>🧍 Persone:</strong> ${people}</p>
      <p><strong>👶 Bambini:</strong> ${children}</p>
      <p><strong>💬 Messaggio:</strong> ${message || "-"}</p>
      <p><strong>💶 Prezzo Totale:</strong> <span style="color:#16a34a;">€ ${price}</span></p>
    </div>

    <p style="font-size: 16px; color: #fff;">Ti contatteremo a breve per confermare la disponibilità.</p>
    <p style="font-size: 16px; color: #fff;">— Lo staff di Marestelle 🌊</p>
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
