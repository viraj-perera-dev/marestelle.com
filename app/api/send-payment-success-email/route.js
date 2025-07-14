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
    <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: auto; padding: 20px; background: #3581be; border-radius: 12px;">
      <img src="https://${process.env.NEXT_PUBLIC_APP_URL}/assets/logo/logo_max_white.png" alt="Marestelle Logo" style="max-width: 150px; margin-bottom: 20px;" />

      <h2 style="color: #fff;">✅ Pagamento Confermato!</h2>
      <p style="font-size: 16px; color: #fff;">
        Ciao ${booking.name}, il tuo pagamento è stato processato con successo!
      </p>
      
      <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0; box-shadow: 0 2px 6px rgba(0,0,0,0.05);">
        <h3 style="color: #1e3a8a; margin-top: 0;">📋 Dettagli della prenotazione:</h3>
        <p><strong>📅 Data:</strong> ${new Date(booking.date).toLocaleDateString()}</p>
        <p><strong>⏰ Orario:</strong> ${booking.time === "morning" ? "Mattino" : "Pomeriggio"}</p>
        <p><strong>🧍 Persone:</strong> ${booking.people}</p>
        <p><strong>👶 Bambini:</strong> ${booking.children}</p>
        <p><strong>💶 Pagato:</strong> <span style="color:#16a34a; font-size: 18px; font-weight: bold;">€ ${booking.price}</span></p>
      </div>

      <div style="background: #dcfce7; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #16a34a;">
        <h3 style="color: #166534; margin-top: 0;">🎉 Prenotazione Completata!</h3>
        <p style="color: #374151; margin-bottom: 10px;">
          La tua prenotazione è ora <strong>completamente confermata</strong>. Ti aspettiamo per un'esperienza indimenticabile!
        </p>
        <ul style="color: #374151; margin: 10px 0; padding-left: 20px;">
          <li>Porta un documento di identità</li>
          <li>Arriva 15 minuti prima dell'orario stabilito</li>
          <li>In caso di maltempo ti contatteremo</li>
        </ul>
      </div>

      <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p style="color: #1e40af; margin: 0; font-size: 14px;">
          <strong>📞 Contatti:</strong> Per qualsiasi domanda o modifica, non esitare a contattarci!
        </p>
      </div>

      <p style="color: #fff; font-size: 16px;">
        Grazie per aver scelto Marestelle per la tua avventura in mare!
      </p>
      <p style="color: #fff; font-size: 16px;">
        — Lo staff di Marestelle 🌊
      </p>
      
      <hr style="border: 1px solid rgba(255,255,255,0.2); margin: 20px 0;" />
      <p style="color: rgba(255,255,255,0.8); font-size: 12px;">
        ID Prenotazione: #${booking.id}<br>
        📧 Email inviata automaticamente da marestelle.com
      </p>
    </div>
  `;

  // Admin email template
  const adminHtml = `
    <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: auto; padding: 20px; background: #3581be; border-radius: 12px;">
      <img src="https://${process.env.NEXT_PUBLIC_APP_URL}/assets/logo/logo_max_white.png" alt="Marestelle Logo" style="max-width: 150px; margin-bottom: 20px;" />

      <h2 style="color: #fff;">💰 Pagamento Ricevuto</h2>
      <p style="font-size: 16px; color: #fff;">
        Il pagamento per la prenotazione di ${booking.name} è stato completato con successo.
      </p>
      
      <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0; box-shadow: 0 2px 6px rgba(0,0,0,0.05);">
        <h3 style="color: #1e3a8a; margin-top: 0;">📋 Dettagli del pagamento:</h3>
        <p><strong>👤 Cliente:</strong> ${booking.name}</p>
        <p><strong>📧 Email:</strong> ${booking.email}</p>
        <p><strong>📞 Telefono:</strong> ${booking.phone}</p>
        <p><strong>📅 Data:</strong> ${new Date(booking.date).toLocaleDateString()}</p>
        <p><strong>⏰ Orario:</strong> ${booking.time === "morning" ? "Mattino" : "Pomeriggio"}</p>
        <p><strong>🧍 Persone:</strong> ${booking.people}</p>
        <p><strong>👶 Bambini:</strong> ${booking.children}</p>
        <p><strong>💶 Importo:</strong> <span style="color:#16a34a; font-weight: bold;">€ ${booking.price}</span></p>
        <p><strong>🔗 ID Prenotazione:</strong> #${booking.id}</p>
      </div>

      <div style="background: #dcfce7; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #16a34a;">
        <h3 style="color: #166534; margin-top: 0;">✅ Stato Prenotazione</h3>
        <p style="color: #374151; margin: 0;">
          La prenotazione è ora <strong>completamente confermata e pagata</strong>. 
          Il cliente riceverà automaticamente una email di conferma.
        </p>
      </div>

      <p style="color: #fff; font-size: 12px; margin-top: 20px;">
        Sistema di pagamento automatico - Marestelle.com
      </p>
    </div>
  `;

  try {
    // Send to client
    await resend.emails.send({
      from: 'Marestelle <info@marestelle.com>',
      to: [booking.email],
      subject: '✅ Pagamento Confermato - Prenotazione Completata',
      html: clientHtml,
    });

    // Send to admin
    await resend.emails.send({
      from: 'Marestelle <info@marestelle.com>',
      to: ['info@marestelle.com'],
      subject: `💰 Pagamento ricevuto da ${booking.name}`,
      html: adminHtml,
    });

    console.log('✅ Payment success emails sent successfully');
  } catch (error) {
    console.error('❌ Error sending payment success emails:', error);
    throw error;
  }
}