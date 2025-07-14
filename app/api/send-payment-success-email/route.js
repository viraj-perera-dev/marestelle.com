// app/api/send-payment-success-email/route.js
import { Resend } from "resend";
import { supabase } from "@/utils/supabaseClient";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const { bookingId } = await req.json();

    if (!bookingId) {
      return new Response(JSON.stringify({ error: "Booking ID is required" }), {
        status: 400,
      });
    }

    // Get booking details
    const { data: booking, error: fetchError } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", bookingId)
      .single();

    if (fetchError || !booking) {
      console.error("❌ Booking not found:", fetchError);
      return new Response(JSON.stringify({ error: "Booking not found" }), {
        status: 404,
      });
    }

    console.log("✅ Booking fetched for payment success email:", booking);

    // Send payment success emails
    await sendPaymentSuccessEmails(booking);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Error sending payment success emails:", error);
    return new Response(JSON.stringify({ error: "Failed to send emails" }), {
      status: 500,
    });
  }
}

async function sendPaymentSuccessEmails(booking) {
  // Client email template
  const clientHtml = `
<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; background-color: #ffffff; border-radius: 12px; border: 1px solid #e0e7ff; box-shadow: 0 5px 15px rgba(0,0,0,0.05);">
  <div style="text-align: center; margin-bottom: 24px;">
    <img src="https://${process.env.NEXT_PUBLIC_APP_URL}/assets/logo/logo_transp_blu.png" alt="Marestelle Logo" style="max-width: 160px;" />
  </div>

  <h2 style="color: #2563eb; font-size: 22px; font-weight: 600; text-align: center; margin-bottom: 12px;">
    Pagamento Confermato
  </h2>

  <p style="color: #374151; font-size: 16px; text-align: center; margin-bottom: 24px;">
    Ciao <strong>${booking.name}</strong>, il tuo pagamento è stato elaborato con successo. La tua prenotazione è ora confermata.
  </p>

  <div style="background-color: #f9fafb; padding: 20px; border-radius: 10px; margin-bottom: 24px;">
    <h3 style="color: #1e3a8a; font-size: 18px; margin-bottom: 16px;">Dettagli della Prenotazione</h3>
    <table style="width: 100%; font-size: 15px; color: #1f2937;">
      <tr><td style="padding: 6px 0;"><strong>Data:</strong></td><td>${new Date(booking.date).toLocaleDateString()}</td></tr>
      <tr><td style="padding: 6px 0;"><strong>Orario:</strong></td><td>${booking.time === "morning" ? "Mattino" : "Pomeriggio"}</td></tr>
      <tr><td style="padding: 6px 0;"><strong>Persone:</strong></td><td>${booking.people}</td></tr>
      <tr><td style="padding: 6px 0;"><strong>Bambini:</strong></td><td>${booking.children}</td></tr>
      <tr><td style="padding: 6px 0;"><strong>Totale Pagato:</strong></td><td style="color: #16a34a; font-weight: bold;">€ ${booking.price}</td></tr>
    </table>
  </div>

  <div style="background-color: #ecfdf5; padding: 20px; border-radius: 10px; border-left: 4px solid #10b981; margin-bottom: 24px;">
    <h3 style="color: #047857; font-size: 17px; margin-top: 0;">Informazioni Utili</h3>
    <p style="color: #374151; margin: 0 0 12px;">
      Preparati a vivere un’esperienza indimenticabile. Ti ricordiamo:
    </p>
    <ul style="color: #374151; padding-left: 20px; margin: 0;">
      <li>Porta con te un documento di identità</li>
      <li>Arriva almeno 15 minuti prima dell’orario stabilito</li>
      <li>In caso di maltempo verrai contattato</li>
    </ul>
  </div>

  <div style="background-color: #eff6ff; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
    <p style="color: #1e40af; margin: 0 0 6px; font-size: 14px;">
      <strong>Contatti</strong>
    </p>
    <p style="color: #1e40af; font-size: 14px; margin: 0;">
      +39 123456789<br />
      <a href="mailto:info@marestelle.com" style="color: #1d4ed8; text-decoration: none;">info@marestelle.com</a>
    </p>
  </div>

  <p style="color: #4b5563; font-size: 15px; margin-bottom: 6px;">
    Grazie per aver scelto <strong>Marestelle</strong> per la tua avventura in mare.
  </p>

  <p style="color: #4b5563; font-size: 15px; margin-bottom: 24px;">
    — Lo staff di Marestelle
  </p>

  <hr style="border: none; border-top: 1px solid #e5e7eb; margin-bottom: 16px;" />

  <p style="color: #9ca3af; font-size: 12px; text-align: center;">
    ID Prenotazione: #${booking.id}<br />
    Email generata automaticamente da marestelle.com
  </p>
</div>
  `;

  // Admin email template
  const adminHtml = `
<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; background-color: #ffffff; border-radius: 12px; border: 1px solid #e0e7ff; box-shadow: 0 5px 15px rgba(0,0,0,0.05);">
  <div style="text-align: center; margin-bottom: 24px;">
    <img src="https://${process.env.NEXT_PUBLIC_APP_URL}/assets/logo/logo_transp_blu.png" alt="Marestelle Logo" style="max-width: 160px;" />
  </div>

  <h2 style="color: #2563eb; font-size: 22px; font-weight: 600; text-align: center; margin-bottom: 12px;">
    Pagamento Ricevuto
  </h2>

  <p style="color: #374151; font-size: 16px; text-align: center; margin-bottom: 24px;">
    Il pagamento per la prenotazione di <strong>${booking.name}</strong> è stato completato con successo.
  </p>

  <div style="background-color: #f9fafb; padding: 20px; border-radius: 10px; margin-bottom: 24px;">
    <h3 style="color: #1e3a8a; font-size: 18px; margin-bottom: 16px;">Dettagli del pagamento</h3>
    <table style="width: 100%; font-size: 15px; color: #1f2937;">
      <tr>
        <td style="padding: 6px 0;"><strong>Cliente:</strong></td>
        <td>${booking.name}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0;"><strong>Email:</strong></td>
        <td>${booking.email}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0;"><strong>Telefono:</strong></td>
        <td>${booking.phone}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0;"><strong>Data:</strong></td>
        <td>${new Date(booking.date).toLocaleDateString()}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0;"><strong>Orario:</strong></td>
        <td>${booking.time === "morning" ? "Mattino" : "Pomeriggio"}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0;"><strong>Persone:</strong></td>
        <td>${booking.people}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0;"><strong>Bambini:</strong></td>
        <td>${booking.children}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0;"><strong>Importo:</strong></td>
        <td style="color: #16a34a; font-weight: bold;">€ ${booking.price}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0;"><strong>ID Prenotazione:</strong></td>
        <td>#${booking.id}</td>
      </tr>
    </table>
  </div>

  <div style="background-color: #ecfdf5; padding: 20px; border-radius: 10px; border-left: 4px solid #10b981; margin-bottom: 24px;">
    <h3 style="color: #047857; font-size: 17px; margin-top: 0;">Stato Prenotazione</h3>
    <p style="color: #374151; margin: 0;">
      La prenotazione è ora <strong>confermata e pagata</strong>. Il cliente ha ricevuto una email di conferma automatica.
    </p>
  </div>

  <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 20px;">
    Sistema di pagamento automatico — Marestelle.com
  </p>
</div>
  `;

  try {
    // Send to client
    await resend.emails.send({
      from: "Marestelle <info@marestelle.com>",
      to: [booking.email],
      subject: "✅ Pagamento Confermato - Prenotazione Completata",
      html: clientHtml,
    });

    // Send to admin
    await resend.emails.send({
      from: "Marestelle <info@marestelle.com>",
      to: ["info@marestelle.com"],
      subject: `💰 Pagamento ricevuto da ${booking.name}`,
      html: adminHtml,
    });

    console.log("✅ Payment success emails sent successfully");
  } catch (error) {
    console.error("❌ Error sending payment success emails:", error);
    throw error;
  }
}
