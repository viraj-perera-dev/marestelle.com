import { headers } from 'next/headers';
import Stripe from 'stripe';
import { supabase } from '@/utils/supabaseClient';
import { Resend } from 'resend';
import { htmlToText } from 'html-to-text';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  const body = await req.text();
  const signature = headers().get('stripe-signature');

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      await handlePaymentSuccess(event.data.object);
      break;
    case 'payment_intent.succeeded':
      await handlePaymentIntentSuccess(event.data.object);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
}

async function handlePaymentSuccess(session) {
  try {
    // Extract booking ID from metadata
    const bookingId = session.metadata?.booking_id;
    
    if (!bookingId) {
      console.error('No booking ID found in session metadata');
      return;
    }

    // Update booking as paid in database
    const { error: updateError } = await supabase
      .from('bookings')
      .update({ paid: true })
      .eq('id', bookingId);

    if (updateError) {
      console.error('Error updating booking payment status:', updateError);
      return;
    }

    // Get booking details for confirmation email
    const { data: booking, error: fetchError } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single();

    if (fetchError || !booking) {
      console.error('Error fetching booking details:', fetchError);
      return;
    }

    // Send payment confirmation email
    await sendPaymentConfirmationEmail(booking, session);

    console.log(`Payment confirmed for booking ${bookingId}`);
  } catch (error) {
    console.error('Error handling payment success:', error);
  }
}

async function handlePaymentIntentSuccess(paymentIntent) {
  // Handle payment intent success if needed
  console.log('Payment intent succeeded:', paymentIntent.id);
}

async function sendPaymentConfirmationEmail(booking, session) {
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
          <li>Riceverai un promemoria 24h prima del tour</li>
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
        ID Transazione: ${session.payment_intent}<br>
        📧 Email inviata automaticamente da marestelle.com
      </p>
    </div>
  `;

  const adminHtml = `
    <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: auto; padding: 20px; background: #3581be; border-radius: 12px;">
      <img src="https://${process.env.NEXT_PUBLIC_APP_URL}/assets/logo/logo_max_white.png" alt="Marestelle Logo" style="max-width: 150px; margin-bottom: 20px;" />

      <h2 style="color: #fff;">💰 Pagamento Ricevuto</h2>
      <p style="font-size: 16px; color: #fff;">
        Il pagamento per la prenotazione di ${booking.name} è stato completato con successo.
      </p>
      
      <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0; box-shadow: 0 2px 6px rgba(0,0,0,0.05);">
        <p><strong>👤 Cliente:</strong> ${booking.name}</p>
        <p><strong>📧 Email:</strong> ${booking.email}</p>
        <p><strong>📞 Telefono:</strong> ${booking.phone}</p>
        <p><strong>📅 Data:</strong> ${new Date(booking.date).toLocaleDateString()}</p>
        <p><strong>⏰ Orario:</strong> ${booking.time === "morning" ? "Mattino" : "Pomeriggio"}</p>
        <p><strong>🧍 Persone:</strong> ${booking.people}</p>
        <p><strong>👶 Bambini:</strong> ${booking.children}</p>
        <p><strong>💶 Importo:</strong> <span style="color:#16a34a; font-weight: bold;">€ ${booking.price}</span></p>
        <p><strong>🔗 ID Transazione:</strong> ${session.payment_intent}</p>
      </div>

      <p style="color: #fff; font-size: 12px; margin-top: 20px;">
        Sistema di pagamento automatico - Marestelle.com
      </p>
    </div>
  `;

  const clientText = htmlToText(clientHtml);
  const adminText = htmlToText(adminHtml);

  try {
    // Send to client
    await resend.emails.send({
      from: 'Marestelle <info@marestelle.com>',
      to: [booking.email],
      subject: '✅ Pagamento Confermato - Prenotazione Completata',
      html: clientHtml,
      text: clientText,
    });

    // Send to admin
    await resend.emails.send({
      from: 'Marestelle <info@marestelle.com>',
      to: ['tremitimarestelle@gmail.com'],
      subject: `💰 Pagamento ricevuto da ${booking.name}`,
      html: adminHtml,
      text: adminText,
    });

    console.log('Payment confirmation emails sent successfully');
  } catch (error) {
    console.error('Error sending payment confirmation emails:', error);
  }
}