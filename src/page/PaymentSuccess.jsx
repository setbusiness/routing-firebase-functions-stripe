import { Link, useSearchParams } from 'react-router-dom'

function PaymentSuccess() {
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get('session_id')

  return (
    <section>
      <h2>Paiement confirme</h2>
      <p>Le retour Stripe a bien indique un paiement valide.</p>
      {sessionId ? <p>Session Stripe: {sessionId}</p> : null}
      <p>
        <Link to="/">Retour a l'accueil</Link>
      </p>
    </section>
  )
}

export default PaymentSuccess
