import { Link } from 'react-router-dom'

function PaymentCancel() {
  return (
    <section>
      <h2>Paiement annule</h2>
      <p>Tu peux relancer un checkout quand tu veux depuis la page Home.</p>
      <p>
        <Link to="/">Retour a l'accueil</Link>
      </p>
    </section>
  )
}

export default PaymentCancel
