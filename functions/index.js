const { onRequest } = require('firebase-functions/v2/https')
const logger = require('firebase-functions/logger')
const Stripe = require('stripe')

exports.createCheckoutSession = onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*')
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.set('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.status(204).send('')
    return
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method_not_allowed' })
    return
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    res.status(500).json({ error: 'missing_stripe_secret' })
    return
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
    const successUrl = req.body?.successUrl || 'http://localhost:5173/payment-success'
    const cancelUrl = req.body?.cancelUrl || 'http://localhost:5173/payment-cancel'
    const priceId = process.env.STRIPE_PRICE_ID

    if (!priceId) {
      res.status(500).json({ error: 'missing_stripe_price_id' })
      return
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
    })

    res.json({ url: session.url })
  } catch (error) {
    logger.error('createCheckoutSession failed', error)
    res.status(500).json({ error: 'checkout_failed' })
  }
})
