// app/api/accept-booking/route.js
import { Resend } from "resend";
import { supabase } from "@/utils/supabaseClient";
import { htmlToText } from 'html-to-text';

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
<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; background-color: #fff; border-radius: 12px;">

  <div style="text-align: center; margin-bottom: 24px;">
    <img src="https://${process.env.NEXT_PUBLIC_APP_URL}/assets/logo/logo_transp_blu.png" alt="Marestelle Logo" style="max-width: 160px;" />
  </div>

  <h2 style="color: #3581be; font-size: 24px; font-weight: 600; text-align: center; margin-bottom: 12px;">
    Prenotazione Confermata
  </h2>

  <p style="color: #000; font-size: 16px; text-align: center; margin-bottom: 24px;">
    Ciao <strong>${booking.name}</strong>, la tua prenotazione è stata <strong>confermata</strong>!
  </p>

  <div style="background-color: #f9fafb; padding: 20px; border-radius: 10px; margin-bottom: 24px; box-shadow: 0 2px 6px rgba(0,0,0,0.05); color: #1f2937; font-size: 15px;">
    <h3 style="margin-top: 0; color: #1e3a8a;">Dettagli della Prenotazione</h3>
    <p><strong>Data:</strong> ${new Date(booking.date).toLocaleDateString()}</p>
    <p><strong>Orario:</strong> ${booking.time === "morning" ? "Mattino" : "Pomeriggio"}</p>
    <p><strong>Persone:</strong> ${booking.people}</p>
    <p><strong>Bambini:</strong> ${booking.children}</p>
    <p><strong>Prezzo Totale:</strong> <span style="color:#16a34a; font-size: 18px; font-weight: bold;">€ ${booking.price}</span></p>
  </div>

  <div style="background-color: #3581be; padding: 20px; border-radius: 10px; margin-bottom: 24px; border-left: 4px solid #f9fafb; color: #fff;">
    <h3 style="margin-top: 0;">Procedi con il Pagamento</h3>
    <p>
      Per completare la prenotazione, effettua il pagamento entro 24 ore cliccando sul pulsante qui sotto:
    </p>
    <a href="${stripePaymentLink}" style="display:inline-block; padding: 15px 30px; background: #5ed97d; color: #000; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
      Paga Ora – € ${booking.price}
    </a>
  </div>

  <p style="color: #f0f9ff; font-size: 16px; text-align: center; margin-bottom: 12px;">
    Per qualsiasi domanda, non esitare a contattarci!
  </p>
  <p style="color: #f0f9ff; font-size: 16px; text-align: center;">
    — Lo staff di Marestelle
  </p>

  <hr style="border: 1px solid rgba(255,255,255,0.2); margin: 24px 0;" />

  <p style="color: rgba(255,255,255,0.7); font-size: 12px; text-align: center;">
    Email inviata automaticamente da marestelle.com
  </p>

</div>
    `;

    const clientText = htmlToText(clientHtml);

    await resend.emails.send({
      from: "Marestelle <info@marestelle.com>",
      to: [booking.email],
      subject: "🎉 Prenotazione Confermata - Procedi con il pagamento",
      html: clientHtml,
      text: clientText,
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Error accepting booking:", error);
    return new Response(JSON.stringify({ error: "Failed to accept booking" }), {
      status: 500,
    });
  }
}