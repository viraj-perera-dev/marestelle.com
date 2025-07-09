// app/api/accept-booking/route.js
import { Resend } from "resend";
import { supabase } from "@/utils/supabaseClient";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const { bookingId } = await req.json();

    console.log("🔄 Booking ID received:", bookingId);

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

    console.log("✅ Booking fetched:", booking);

    // Update booking status to confirmed (1)
    const { error: updateError } = await supabase
      .from("bookings")
      .update({ confirmed: 1 })
      .eq("id", bookingId);

    if (updateError) {
      console.error("❌ Failed to update booking:", updateError);
      return new Response(JSON.stringify({ error: "Failed to update booking" }), {
        status: 500,
      });
    }

    console.log("✅ Booking status updated");

    // Create Stripe payment link
    const paymentResponse = await fetch(`https://${process.env.NEXT_PUBLIC_APP_URL}/api/create-payment-link`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bookingId: bookingId,
        amount: booking.price,
        customerEmail: booking.email,
        customerName: booking.name,
      }),
    });

    console.log("🔄 Waiting for Stripe payment response...");

    const paymentData = await paymentResponse.json();

    console.log("✅ Stripe payment response:", paymentData);

    
    if (!paymentData.success) {
      console.error("❌ Failed to create payment link:", paymentData);
      return new Response(JSON.stringify({ error: "Failed to create payment link" }), {
        status: 500,
      });
    }

    console.log("🔗 Stripe payment link:", paymentData.paymentLink);

    const stripePaymentLink = paymentData.paymentLink;

    // Send confirmation email to client
    const clientHtml = `
      <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: auto; padding: 20px; background: #3581be; border-radius: 12px;">
        <img src="https://${process.env.NEXT_PUBLIC_APP_URL}/assets/logo/logo_max_white.png" alt="Marestelle Logo" style="max-width: 150px; margin-bottom: 20px;" />

        <h2 style="color: #fff;">🎉 Prenotazione Confermata!</h2>
        <p style="font-size: 16px; color: #fff;">
          Ciao ${booking.name}, la tua prenotazione è stata <strong>confermata</strong>!
        </p>
        
        <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0; box-shadow: 0 2px 6px rgba(0,0,0,0.05);">
          <h3 style="color: #1e3a8a; margin-top: 0;">Dettagli della prenotazione:</h3>
          <p><strong>📅 Data:</strong> ${new Date(booking.date).toLocaleDateString()}</p>
          <p><strong>⏰ Orario:</strong> ${booking.time === "morning" ? "Mattino" : "Pomeriggio"}</p>
          <p><strong>🧍 Persone:</strong> ${booking.people}</p>
          <p><strong>👶 Bambini:</strong> ${booking.children}</p>
          <p><strong>💶 Prezzo Totale:</strong> <span style="color:#16a34a; font-size: 18px; font-weight: bold;">€ ${booking.price}</span></p>
        </div>

        <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #fbbf24;">
          <h3 style="color: #1e3a8a; margin-top: 0;">💳 Procedi con il pagamento</h3>
          <p style="color: #374151; margin-bottom: 20px;">
            Per completare la prenotazione, effettua il pagamento cliccando sul pulsante qui sotto:
          </p>
          <a href="${stripePaymentLink}" style="display:inline-block;padding:15px 30px;background:#16a34a;color:#fff;text-decoration:none;border-radius:8px;font-weight:bold;font-size:16px;">
            💳 Paga Ora - € ${booking.price}
          </a>
        </div>

        <div style="background: #e5f3ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="color: #1e40af; margin: 0; font-size: 14px;">
            <strong>ℹ️ Importante:</strong> Il pagamento deve essere completato entro 24 ore per garantire la prenotazione.
          </p>
        </div>

        <p style="color: #fff; font-size: 16px;">
          Per qualsiasi domanda, non esitare a contattarci!
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
      subject: "🎉 Prenotazione Confermata - Procedi con il pagamento",
      html: clientHtml,
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Error accepting booking:", error);
    return new Response(JSON.stringify({ error: "Failed to accept booking" }), {
      status: 500,
    });
  }
}