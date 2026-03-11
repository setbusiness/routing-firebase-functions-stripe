import { useCallback, useEffect, useMemo, useState } from 'react'
import Prism from 'prismjs'
import 'prismjs/components/prism-javascript'
import 'prismjs/themes/prism-tomorrow.css'

function maskValue(value) {
  if (!value) return '(non defini)'
  if (value.length <= 8) return '****'
  return `${value.slice(0, 4)}...${value.slice(-3)}`
}

const steps = [
  {
    title: '1) Initialiser Firebase Functions',
    code: `npm install -g firebase-tools
firebase login
firebase init functions

# Choisir JavaScript ou TypeScript
# Valider l'installation des dependances`,
  },
  {
    title: '2) Installer Stripe dans functions/',
    code: `cd functions
npm install stripe`,
  },
  {
    title: '3) Creer la Cloud Function checkout',
    code: `const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

exports.createCheckoutSession = onRequest(async (req, res) => {
  try {
    const successUrl = req.body?.successUrl || "http://localhost:5173/payment-success";
    const cancelUrl = req.body?.cancelUrl || "http://localhost:5173/payment-cancel";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: "price_123", quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
    });
    res.json({ url: session.url });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: "checkout_failed" });
  }
});`,
  },
  {
    title: '4) Secrets Stripe en local (emulator)',
    code: `# Dans functions/
echo STRIPE_SECRET_KEY=sk_test_xxx > .env.local

# firebase.json (exemple)
{
  "emulators": {
    "functions": { "port": 5001 },
    "hosting": { "port": 5000 }
  }
}`,
  },
  {
    title: '5) Lancer en local avec emulator',
    code: `# A la racine du projet
firebase emulators:start

# Endpoint local typique
# http://127.0.0.1:5001/<project-id>/us-central1/createCheckoutSession`,
  },
  {
    title: '6) Appeler la function depuis React',
    code: `async function pay() {
  const res = await fetch(
    "http://127.0.0.1:5001/<project-id>/us-central1/createCheckoutSession",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        successUrl: "http://localhost:5173/payment-success",
        cancelUrl: "http://localhost:5173/payment-cancel",
      }),
    }
  );
  const data = await res.json();
  window.location.href = data.url;
}`,
  },
  {
    title: '7) Deployer sur Firebase (prod)',
    code: `firebase use <project-prod>

# Ajouter le secret en prod
firebase functions:secrets:set STRIPE_SECRET_KEY

# Deploy
firebase deploy --only functions`,
  },
  {
    title: '8) Variables .env dans React (exemple reel)',
    code: `# .env.local (frontend)
VITE_FIREBASE_PROJECT_ID=ton-project-id
VITE_FUNCTIONS_REGION=us-central1
VITE_FUNCTION_NAME=createCheckoutSession
VITE_USE_FUNCTIONS_EMULATOR=true

# En prod, basculer:
# VITE_USE_FUNCTIONS_EMULATOR=false`,
  },
  {
    title: '9) Retour de confirmation dans l app',
    code: `// Routes React
<Route path="/payment-success" element={<PaymentSuccess />} />
<Route path="/payment-cancel" element={<PaymentCancel />} />

// Stripe redirige ici apres paiement`,
  },
]

function CodeSlides() {
  const lines = useMemo(() => steps.map((step) => step.code.split('\n')), [])
  const runtimeInfo = useMemo(
    () => ({
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
      region: import.meta.env.VITE_FUNCTIONS_REGION || 'us-central1',
      functionName: import.meta.env.VITE_FUNCTION_NAME || 'createCheckoutSession',
      useEmulator: import.meta.env.VITE_USE_FUNCTIONS_EMULATOR === 'true',
      stripePublicKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '',
    }),
    [],
  )
  const [step, setStep] = useState(1)
  const [lineStep, setLineStep] = useState(1)
  const [viewMode, setViewMode] = useState('line-by-line')
  const maxStep = steps.length
  const maxLineStep = lines[step - 1].length
  const displayedLineStep = viewMode === 'all' ? maxLineStep : lineStep
  const visibleLines = viewMode === 'all' ? lines[step - 1] : lines[step - 1].slice(0, lineStep)
  const environmentBadge = runtimeInfo.useEmulator ? 'EMULATOR' : 'PROD'
  const highlightedCode = useMemo(
    () => Prism.highlight(visibleLines.join('\n'), Prism.languages.javascript, 'javascript'),
    [visibleLines],
  )

  const goNext = useCallback(() => {
    if (viewMode === 'all') {
      if (step < maxStep) {
        setStep(step + 1)
        setLineStep(1)
      }
      return
    }

    if (lineStep < maxLineStep) {
      setLineStep(lineStep + 1)
      return
    }
    if (step < maxStep) {
      setStep(step + 1)
      setLineStep(1)
    }
  }, [lineStep, maxLineStep, maxStep, step, viewMode])

  const goPrevious = useCallback(() => {
    if (viewMode === 'all') {
      if (step > 1) {
        setStep(step - 1)
        setLineStep(1)
      }
      return
    }

    if (lineStep > 1) {
      setLineStep(lineStep - 1)
      return
    }
    if (step > 1) {
      const previousStep = step - 1
      setStep(previousStep)
      setLineStep(lines[previousStep - 1].length)
    }
  }, [lineStep, lines, step, viewMode])

  const reset = useCallback(() => {
    setStep(1)
    setLineStep(1)
  }, [])

  const setLineByLineMode = useCallback(() => {
    setViewMode('line-by-line')
    setLineStep(1)
  }, [])

  const setAllMode = useCallback(() => {
    setViewMode('all')
    setLineStep(maxLineStep)
  }, [maxLineStep])

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'ArrowRight' || event.key === ' ') {
        event.preventDefault()
        goNext()
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        goPrevious()
      }
      if (event.key.toLowerCase() === 'r') {
        event.preventDefault()
        reset()
      }
      if (event.key.toLowerCase() === 'v') {
        event.preventDefault()
        setViewMode((currentMode) => (currentMode === 'line-by-line' ? 'all' : 'line-by-line'))
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [goNext, goPrevious, reset])

  return (
    <section className="code-slides">
      <h2>Stripe + Firebase Functions pas a pas</h2>
      <p>
        Etape {step}/{maxStep} - ligne {displayedLineStep}/{maxLineStep}
      </p>
      <p>Mode d affichage: {viewMode === 'line-by-line' ? 'ligne par ligne' : 'voir tout le code'}</p>
      <p>Exemple reel connecte au bouton de paiement sur Home.</p>
      <div className="slide-badges">
        <span className="badge-live">LIVE</span>
        <span className={`badge-env ${runtimeInfo.useEmulator ? 'badge-emulator' : 'badge-prod'}`}>
          {environmentBadge}
        </span>
      </div>
      <div className="runtime-info">
        <p>
          Mode: <strong>{runtimeInfo.useEmulator ? 'emulator local' : 'production Firebase'}</strong>
        </p>
        <p>Project ID: {runtimeInfo.projectId || '(a renseigner dans .env.local)'}</p>
        <p>Region: {runtimeInfo.region}</p>
        <p>Function: {runtimeInfo.functionName}</p>
        <p>Publishable key (masquee): {maskValue(runtimeInfo.stripePublicKey)}</p>
        <p>Secret key backend: configuree dans `functions/.env.local` (jamais exposee au frontend).</p>
      </div>
      <p>{steps[step - 1].title}</p>

      <div className="view-mode-controls">
        <button type="button" onClick={setLineByLineMode} disabled={viewMode === 'line-by-line'}>
          Ligne par ligne
        </button>
        <button type="button" onClick={setAllMode} disabled={viewMode === 'all'}>
          Voir tout le code
        </button>
      </div>

      <pre className="code-panel">
        <code className="language-javascript" dangerouslySetInnerHTML={{ __html: highlightedCode }} />
      </pre>

      <div className="code-controls">
        <button
          type="button"
          onClick={goPrevious}
          disabled={viewMode === 'all' ? step === 1 : step === 1 && lineStep === 1}
        >
          Precedent
        </button>
        <button
          type="button"
          onClick={goNext}
          disabled={viewMode === 'all' ? step === maxStep : step === maxStep && lineStep === maxLineStep}
        >
          Suivant
        </button>
        <button type="button" onClick={reset}>
          Recommencer
        </button>
      </div>
    </section>
  )
}

export default CodeSlides
