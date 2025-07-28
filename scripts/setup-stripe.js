// Run this once to create your Stripe product
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function setupStripeProduct() {
  try {
    // Create a product for your boat tour
    const product = await stripe.products.create({
      name: 'Marestelle Boat Tour',
      description: 'Private boat tour experience',
      images: ['https://marestelle.com/assets/sectionImages/DJI_0943.webp'], // Optional
    });

    console.log('Product created:', product.id);

    // Create a price for the product (you can create multiple prices)
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: 10000, // €100.00 in cents (adjust as needed)
      currency: 'eur',
    });

    console.log('Price created:', price.id);
    console.log('Add these to your environment variables:');
    console.log(`STRIPE_PRODUCT_ID=${product.id}`);
    console.log(`STRIPE_PRICE_ID=${price.id}`);

  } catch (error) {
    console.error('Error setting up Stripe:', error);
  }
}

setupStripeProduct();