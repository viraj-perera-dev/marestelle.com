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
      <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: auto; padding: 20px; background: #3581be; border-radius: 12px;">
        <img src="https://${process.env.NEXT_PUBLIC_APP_URL}/assets/logo/logo_max_white.png" alt="Marestelle Logo" style="max-width: 150px; margin-bottom: 20px;" />

        <h2 style="color: #fff;">😔 Prenotazione Non Disponibile</h2>
        <p style="font-size: 16px; color: #fff;">
          Ciao ${booking.name}, ci dispiace informarti che la tua prenotazione non può essere confermata.
        </p>
        
        <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0; box-shadow: 0 2px 6px rgba(0,0,0,0.05);">
          <h3 style="color: #1e3a8a; margin-top: 0;">Dettagli della prenotazione richiesta:</h3>
          <p><strong>📅 Data:</strong> ${new Date(booking.date).toLocaleDateString()}</p>
          <p><strong>⏰ Orario:</strong> ${booking.time === "morning" ? "Mattino" : "Pomeriggio"}</p>
          <p><strong>🧍 Adulti:</strong> ${booking.people}</p>
          <p><strong>👶 Bambini:</strong> ${booking.children}</p>
          <p><strong>💶 Prezzo:</strong> € ${booking.price}</p>
        </div>

        <div style="background: #fef2f2; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #f87171;">
          <h3 style="color: #dc2626; margin-top: 0;">❌ Motivo della non disponibilità</h3>
          <p style="color: #374151; margin-bottom: 10px;">
            Purtroppo la data e l'orario richiesti non sono disponibili. Questo può essere dovuto a:
          </p>
          <ul style="color: #374151; margin: 10px 0; padding-left: 20px;">
            <li>Prenotazione già confermata per quella data</li>
            <li>Condizioni meteorologiche avverse</li>
            <li>Manutenzione programmata</li>
            <li>Raggiungimento della capacità massima</li>
          </ul>
        </div>

        <div style="background: #f0f9ff; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #3b82f6;">
          <h3 style="color: #1e40af; margin-top: 0;">💡 Cosa puoi fare</h3>
          <p style="color: #374151; margin-bottom: 15px;">
            Non preoccuparti! Puoi:
          </p>
          <ul style="color: #374151; margin: 10px 0; padding-left: 20px;">
            <li>Scegliere una data alternativa</li>
            <li>Contattarci per verificare altre disponibilità</li>
            <li>Iscriverti alla lista d'attesa per eventuali cancellazioni</li>
          </ul>
          <a href="https://${process.env.NEXT_PUBLIC_APP_URL}/booking" style="display:inline-block;padding:12px 24px;background:#3b82f6;color:#fff;text-decoration:none;border-radius:8px;font-weight:bold;margin-top:15px;">
            📅 Prova un'altra data
          </a>
        </div>

        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="color: #374151; margin: 0; font-size: 14px;">
            <strong>Contattaci:</strong> Per assistenza immediata chiamaci al nostro numero o scrivici un'email.
          </p>
          <a href="tel:${booking.phone}" style="color: #374151; margin-bottom: 10px;">
            📞 {booking.phone}
          </a> <br/>
          <a href="mailto:${booking.email}" style="color: #374151; margin-bottom: 10px;">
           📧 {booking.email}
          </a>
        </div>

        <p style="color: #fff; font-size: 16px;">
          Grazie per aver scelto Marestelle e ci scusiamo per l'inconveniente.
        </p>
        <p style="color: #fff; font-size: 16px;">
          — Lo staff di Marestelle 🌊
        </p>
        
        <hr style="border: 1px solid rgba(255,255,255,0.2); margin: 20px 0;" />
        <p style="color: rgba(255,255,255,0.8); font-size: 12px;">
          📧 Email inviata automaticamente da marestelle.com
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
