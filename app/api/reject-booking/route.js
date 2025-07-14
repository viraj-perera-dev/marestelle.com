import { Resend } from "resend";
import { supabase } from "@/utils/supabaseClient";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const { bookingId } = await req.json();

    // Get booking details
    const { data: booking, error: fetchError } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", bookingId)
      .single();

    if (fetchError || !booking) {
      return new Response(JSON.stringify({ error: "Booking not found" }), {
        status: 404,
      });
    }

    // Update booking status to rejected (2)
    const { error: updateError } = await supabase
      .from("bookings")
      .update({ confirmed: 2 })
      .eq("id", bookingId);

    if (updateError) {
      return new Response(
        JSON.stringify({ error: "Failed to update booking" }),
        {
          status: 500,
        }
      );
    }

    // Send rejection email to client
    const clientHtml = `
<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; background-color: #ffffff; border-radius: 12px; border: 1px solid #e5e7eb; box-shadow: 0 5px 15px rgba(0,0,0,0.05);">
  <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; text-align: center; margin-bottom: 24px;">
    <img src="https://${process.env.NEXT_PUBLIC_APP_URL}/assets/logo/logo_transp_blu.png" alt="Marestelle Logo" style="max-width: 160px; margin-bottom: 12px;" />
    <h2 style="color: #3581be; font-size: 20px; margin: 0;">Prenotazione Non Disponibile</h2>
  </div>

  <p style="font-size: 16px; color: #1f2937; text-align: center; margin-bottom: 24px;">
    Ciao <strong>${booking.name}</strong>, ci dispiace informarti che la tua richiesta non può essere confermata.
  </p>

  <div style="background-color: #f9fafb; padding: 20px; border-radius: 10px; margin-bottom: 24px; font-size: 15px; color: #1f2937;">
    <h3 style="margin-top: 0; color: #1e3a8a;">Dettagli della Prenotazione Richiesta</h3>
    <table style="width: 100%; font-size: 15px;">
      <tr><td style="padding: 6px 0;"><strong>Data:</strong></td><td>${new Date(booking.date).toLocaleDateString()}</td></tr>
      <tr><td style="padding: 6px 0;"><strong>Orario:</strong></td><td>${booking.time === "morning" ? "Mattino" : "Pomeriggio"}</td></tr>
      <tr><td style="padding: 6px 0;"><strong>Adulti:</strong></td><td>${booking.people}</td></tr>
      <tr><td style="padding: 6px 0;"><strong>Bambini:</strong></td><td>${booking.children}</td></tr>
      <tr><td style="padding: 6px 0;"><strong>Prezzo:</strong></td><td>€ ${booking.price}</td></tr>
    </table>
  </div>

  <div style="background-color: #fef2f2; padding: 20px; border-radius: 10px; border-left: 4px solid #f87171; margin-bottom: 24px;">
    <h3 style="margin-top: 0; color: #dc2626;">Motivo della Non Disponibilità</h3>
    <p style="color: #374151;">La data e l'orario selezionati non sono attualmente disponibili. Possibili motivi:</p>
    <ul style="color: #374151; padding-left: 20px;">
      <li>Data già prenotata</li>
      <li>Condizioni meteorologiche avverse</li>
      <li>Manutenzione straordinaria</li>
      <li>Capienza massima raggiunta</li>
    </ul>
  </div>

  <div style="background-color: #f0f9ff; padding: 20px; border-radius: 10px; border-left: 4px solid #3b82f6; margin-bottom: 24px;">
    <h3 style="margin-top: 0; color: #1e40af;">Alternative Disponibili</h3>
    <p style="color: #374151; margin-bottom: 12px;">Puoi scegliere tra le seguenti opzioni:</p>
    <ul style="color: #374151; padding-left: 20px;">
      <li>Proporre una nuova data</li>
      <li>Contattarci per verificare disponibilità</li>
      <li>Iscriverti alla lista d'attesa</li>
    </ul>
    <a href="https://${process.env.NEXT_PUBLIC_APP_URL}/booking" style="display:inline-block; padding: 12px 24px; background-color: #3b82f6; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; margin-top: 12px;">
      Proponi un'altra data
    </a>
  </div>

  <div style="background-color: #f8fafc; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
    <p style="color: #1f2937; font-size: 14px; margin-bottom: 6px;">
      <strong>Contattaci per Assistenza:</strong>
    </p>
    <p style="color: #1f2937; font-size: 14px; margin: 0;">
      <a href="tel:+393714891806" style="color: #1f2937; text-decoration: none;">+39 371 489 1806</a><br />
      <a href="mailto:info@marestelle.com" style="color: #1f2937; text-decoration: none;">info@marestelle.com</a>
    </p>
  </div>

  <p style="color: #374151; font-size: 15px; margin-bottom: 6px;">
    Grazie per aver scelto <strong>Marestelle</strong>. Ci scusiamo per l'inconveniente.
  </p>
  <p style="color: #374151; font-size: 15px;">
    — Lo staff di Marestelle
  </p>

  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />

  <p style="color: #9ca3af; font-size: 12px; text-align: center;">
    Email generata automaticamente da marestelle.com
  </p>
</div>
    `;

    await resend.emails.send({
      from: "Marestelle <noreply@marestelle.com>",
      to: [booking.email],
      subject: "😔 Prenotazione Non Disponibile - Alternative disponibili",
      html: clientHtml,
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Error rejecting booking:", error);
    return new Response(JSON.stringify({ error: "Failed to reject booking" }), {
      status: 500,
    });
  }
}
