import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { bookingId, amount, customerEmail, customerName } = await req.json();

    console.log("🔍 Incoming request:", {
        bookingId,
        amount,
        customerEmail,
        customerName,
      });

      const numericAmount = Number(amount);
      console.log("💶 Parsed amount:", numericAmount, " (type:", typeof numericAmount, ")");

      if (isNaN(numericAmount)) {
        throw new Error("❌ amount is not a number");
      }  

    const product = await stripe.products.create({
      name: "Marestelle Boat Tour",
      description: `Booking confirmation for ${customerName}`,
    });
    console.log("✅ Product created:", product.id);

    const priceObj = await stripe.prices.create({
      product: product.id,
      unit_amount: Math.round(numericAmount * 100),
      currency: "eur",
    });

    console.log("✅ Price created:", priceObj.id, "- unit_amount:", priceObj.unit_amount);

    // Create a payment link
    const paymentLink = await stripe.paymentLinks.create({
      line_items: [
        {
          price: priceObj.id,
          quantity: 1,
        },
      ],
      metadata: {
        booking_id: bookingId.toString(),
        customer_email: customerEmail,
        customer_name: customerName,
      },
      after_completion: {
        type: "redirect",
        redirect: {
          url: `${process.env.NEXT_PUBLIC_APP_URL}/payment-success?booking_id=${bookingId}`,
        },
      },
      // Optional: Set automatic tax
      automatic_tax: { enabled: false },
      // Optional: Allow promotional codes
      allow_promotion_codes: true,
      // Optional: Set payment method types
      payment_method_types: ["card"],
    });

    console.log("✅ Payment link created:", paymentLink.url);


    return new Response(
      JSON.stringify({
        success: true,
        paymentLink: paymentLink.url,
        paymentLinkId: paymentLink.id,
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error creating payment link:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to create payment link",
        details: error.message,
      }),
      {
        status: 500,
      }
    );
  }
}
