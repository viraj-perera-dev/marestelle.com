import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { bookingId, amount, customerEmail, customerName } = await req.json();

    // Create a payment link
    const paymentLink = await stripe.paymentLinks.create({
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'Marestelle Boat Tour',
              description: `Booking confirmation for ${customerName}`,
            },
            unit_amount: Math.round(amount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      metadata: {
        booking_id: bookingId.toString(),
        customer_email: customerEmail,
        customer_name: customerName,
      },
      after_completion: {
        type: 'redirect',
        redirect: {
          url: `${process.env.NEXT_PUBLIC_APP_URL}/payment-success?booking_id=${bookingId}`,
        },
      },
      // Optional: Set automatic tax
      automatic_tax: { enabled: false },
      // Optional: Allow promotional codes
      allow_promotion_codes: true,
      // Optional: Set payment method types
      payment_method_types: ['card'],
    });

    return new Response(JSON.stringify({ 
      success: true, 
      paymentLink: paymentLink.url,
      paymentLinkId: paymentLink.id
    }), { 
      status: 200 
    });

  } catch (error) {
    console.error('Error creating payment link:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to create payment link',
      details: error.message 
    }), {
      status: 500,
    });
  }
}