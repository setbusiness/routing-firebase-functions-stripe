import { useMemo, useState } from 'react'

function StripeCheckoutDemo() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const config = useMemo(() => {
    const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID
    const region = import.meta.env.VITE_FUNCTIONS_REGION || 'us-central1'
    const functionName = import.meta.env.VITE_FUNCTION_NAME || 'createCheckoutSession'
    const cloudFunctionsBase = import.meta.env.VITE_CLOUD_FUNCTIONS_BASE
    const useEmulator = import.meta.env.VITE_USE_FUNCTIONS_EMULATOR === 'true'

    const endpoint = useEmulator
      ? `http://127.0.0.1:5001/${projectId}/${region}/${functionName}`
      : cloudFunctionsBase
        ? `${cloudFunctionsBase}/${functionName}`
        : `https://${region}-${projectId}.cloudfunctions.net/${functionName}`

    return { endpoint, projectId, useEmulator }
  }, [])

  const pay = async () => {
    setLoading(true)
    setError('')

    try {
      if (!config.projectId) {
        throw new Error('VITE_FIREBASE_PROJECT_ID manquant dans .env')
      }

      const response = await fetch(config.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          successUrl: `${window.location.origin}/payment-success`,
          cancelUrl: `${window.location.origin}/payment-cancel`,
        }),
      })

      if (!response.ok) {
        const text = await response.text()
        throw new Error(`Function error ${response.status}: ${text}`)
      }

      const data = await response.json()
      if (!data.url) throw new Error('Aucune URL Stripe retournee par la function')
      window.location.href = data.url
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="checkout-demo">
      <h3>Demo Stripe Checkout</h3>
      <p>
        Exemple reel connecte a Firebase Functions. Mode actuel:{' '}
        <strong>{config.useEmulator ? 'emulator local' : 'cloud deploye'}</strong>.
      </p>
      <button type="button" onClick={pay} disabled={loading}>
        {loading ? 'Redirection en cours...' : 'Payer avec Stripe'}
      </button>
      {error ? <p className="error-message">{error}</p> : null}
    </section>
  )
}

export default StripeCheckoutDemo
