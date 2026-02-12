import { NavLink, Route, Routes } from 'react-router-dom'
import { useMemo, useState } from 'react'
import logo from './assets/ps-ecg-logo.svg'
import Dashboard from './Dashboard'

const catchline = 'From lecture theatre to lights-and-sirens confidence.'

const safeStorage = {
  get(key, fallback) {
    if (typeof window === 'undefined') return fallback
    try {
      const value = window.localStorage.getItem(key)
      return value ?? fallback
    } catch {
      return fallback
    }
  },
  set(key, value) {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.setItem(key, value)
    } catch {
      // local storage may be unavailable in some browsers
    }
  },
}

function usePersistentState(key, initialValue) {
  const [value, setValue] = useState(() => {
    const raw = safeStorage.get(key, null)
    if (raw === null) return initialValue

    try {
      return JSON.parse(raw)
    } catch {
      return initialValue
    }
  })

  const persist = (nextValue) => {
    setValue(nextValue)
    safeStorage.set(key, JSON.stringify(nextValue))
  }

  return [value, persist]
}

const navItems = [
  ['/', 'Home'],
  ['/learning', 'Learning + Games'],
  ['/membership', 'Membership'],
  ['/store', 'Student Store'],
  ['/community', 'Community'],
  ['/feedback', 'Feedback'],
  ['/legal', 'Legal + Security'],
]

const scenarioSteps = [
  'Scene safe, PPE on, and mechanism of injury identified.',
  'Primary survey complete: airway, breathing, circulation, disability.',
  'Treatment priorities selected and pre-alert delivered to receiving hospital.',
]

const ecgQuestions = [
  {
    rhythm: 'Narrow-complex tachycardia at 180 bpm, regular rhythm',
    answer: 'SVT',
    options: ['AF', 'SVT', 'Sinus bradycardia'],
  },
  {
    rhythm: 'Chaotic waveform with no organised QRS complexes',
    answer: 'VF',
    options: ['VF', 'Asystole', 'Normal sinus rhythm'],
  },
  {
    rhythm: 'Slow rhythm with P before every QRS at 48 bpm',
    answer: 'Sinus bradycardia',
    options: ['Sinus bradycardia', 'SVT', 'VT'],
  },
]

const anatomyPrompts = [
  { prompt: 'The _____ is the main muscle of respiration.', answer: 'diaphragm' },
  { prompt: 'The _____ artery is commonly used for pulse checks in adults.', answer: 'carotid' },
  { prompt: 'The _____ carries oxygenated blood from lungs to left atrium.', answer: 'pulmonary vein' },
]

function TermsModal({ onAccept }) {
  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h2>Accept Terms Before Continuing</h2>
        <p>
          ParamedicStudents.com is a peer-to-peer study aid for Australian paramedic students. It
          is not an official Queensland Ambulance Service (QAS) or government resource.
        </p>
        <p>
          All users must cross-check content with current QAS Clinical Practice Guidelines,
          university policies, and supervising clinicians before use in any clinical setting.
        </p>
        <button onClick={onAccept}>I Accept the Terms</button>
      </div>
    </div>
  )
}

function SectionCard({ title, children }) {
  return (
    <section className="card">
      <h2>{title}</h2>
      {children}
    </section>
  )
}

function Home() {
  return (
    <>
      <SectionCard title="Welcome to paramedicstudents.com">
        <p>
          Built for Australian student paramedics, this platform combines evidence-based learning,
          practical placement preparation, and a student-first store in one secure hub.
        </p>
        <p>
          <strong>Catchline:</strong> {catchline}
        </p>
      </SectionCard>
    </>
  )
}

function ClinicalCase({ onFinish }) {
  const [stepIndex, setStepIndex] = useState(0)
  const isComplete = stepIndex >= scenarioSteps.length

  return (
    <article className="card fade-in-up">
      <h3>Clinical Case</h3>
      {!isComplete ? (
        <>
          <p>{scenarioSteps[stepIndex]}</p>
          <button onClick={() => setStepIndex(stepIndex + 1)}>
            {stepIndex === scenarioSteps.length - 1 ? 'Complete Scenario' : 'Next Step'}
          </button>
        </>
      ) : (
        <>
          <p>Scenario complete. Great clinical reasoning.</p>
          <button onClick={onFinish}>Save Completion</button>
        </>
      )}
    </article>
  )
}

function EcgDrill() {
  const [questionIndex, setQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState('')
  const question = ecgQuestions[questionIndex]

  const chooseAnswer = (option) => {
    const isCorrect = option === question.answer
    setFeedback(isCorrect ? 'Correct rhythm identification.' : `Not quite. Correct answer: ${question.answer}.`)
    if (isCorrect) setScore(score + 1)
  }

  const nextQuestion = () => {
    setFeedback('')
    setQuestionIndex((questionIndex + 1) % ecgQuestions.length)
  }

  return (
    <article className="card fade-in-up">
      <h3>ECG Recognition Drill</h3>
      <p>{question.rhythm}</p>
      <div className="quiz-options">
        {question.options.map((option) => (
          <button key={option} onClick={() => chooseAnswer(option)}>
            {option}
          </button>
        ))}
      </div>
      <p className="meta-line">Score this session: {score}</p>
      {feedback && <p className="meta-line">{feedback}</p>}
      <button onClick={nextQuestion}>Next Rhythm</button>
    </article>
  )
}

function AnatomyChallenge() {
  const [promptIndex, setPromptIndex] = useState(0)
  const [guess, setGuess] = useState('')
  const [result, setResult] = useState('')
  const prompt = anatomyPrompts[promptIndex]

  const submitGuess = (event) => {
    event.preventDefault()
    const isCorrect = guess.trim().toLowerCase() === prompt.answer
    setResult(isCorrect ? 'Correct.' : `Try again. Expected answer: ${prompt.answer}`)
  }

  const nextPrompt = () => {
    setPromptIndex((promptIndex + 1) % anatomyPrompts.length)
    setGuess('')
    setResult('')
  }

  return (
    <article className="card fade-in-up">
      <h3>Anatomy Fill-the-Blank</h3>
      <p>{prompt.prompt}</p>
      <form className="inline-form" onSubmit={submitGuess}>
        <input
          value={guess}
          onChange={(event) => setGuess(event.target.value)}
          placeholder="Enter your answer"
        />
        <button type="submit">Check</button>
      </form>
      {result && <p className="meta-line">{result}</p>}
      <button onClick={nextPrompt}>Next Prompt</button>
    </article>
  )
}

function Learning() {
  const [sessionsCompleted, setSessionsCompleted] = usePersistentState('sessionsCompleted', 0)
  const [activeModule, setActiveModule] = useState('case')
  const [vitals, setVitals] = useState(null)

  const generateVitals = () => {
    const hr = Math.floor(Math.random() * 101) + 40
    const systolic = Math.floor(Math.random() * 91) + 90
    const diastolic = Math.floor(Math.random() * 51) + 50
    const spo2 = Math.floor(Math.random() * 16) + 84

    setVitals({ hr, bp: `${systolic}/${diastolic}`, spo2 })
  }

  const saveCompletion = () => {
    setSessionsCompleted(sessionsCompleted + 1)
    setActiveModule('vitals')
  }

  const openModule = (moduleId) => {
    setActiveModule(moduleId)
    if (moduleId === 'vitals') generateVitals()
  }

  return (
    <>
      <SectionCard title="Clinical Dashboard">
        <p className="meta-line">Sessions Completed: {sessionsCompleted}</p>
        <Dashboard onSelectModule={openModule} />
      </SectionCard>

      {activeModule === 'case' && <ClinicalCase onFinish={saveCompletion} />}
      {activeModule === 'ecg' && <EcgDrill />}
      {activeModule === 'anatomy' && <AnatomyChallenge />}

      {(activeModule === 'vitals' || vitals) && (
        <SectionCard title="Vitals Simulator">
          <p>Generate vitals and decide whether this patient appears stable, compensating, or critical.</p>
          <button onClick={generateVitals}>Generate New Readings</button>
          {vitals && (
            <div className="vitals-output fade-in-up">
              <p>
                <strong>HR:</strong> {vitals.hr} bpm
              </p>
              <p>
                <strong>BP:</strong> {vitals.bp} mmHg
              </p>
              <p>
                <strong>SpO₂:</strong> {vitals.spo2}%
              </p>
            </div>
          )}
        </SectionCard>
      )}
    </>
  )
}

function Membership() {
  const [members, setMembers] = usePersistentState('members', [])
  const [form, setForm] = useState({ name: '', email: '', university: '' })

  const submitMember = (event) => {
    event.preventDefault()
    if (!form.name || !form.email || !form.university) return

    setMembers([{ ...form, joinedAt: new Date().toISOString() }, ...members])
    setForm({ name: '', email: '', university: '' })
  }

  const topUniversity = useMemo(() => {
    if (!members.length) return 'No sign-ups yet'

    const counts = members.reduce((acc, member) => {
      acc[member.university] = (acc[member.university] ?? 0) + 1
      return acc
    }, {})

    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0]
  }, [members])

  return (
    <SectionCard title="Sign Up + Membership Database">
      <form className="form-grid" onSubmit={submitMember}>
        <label>
          Full Name
          <input
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            placeholder="e.g. Olivia Smith"
          />
        </label>
        <label>
          Email
          <input
            type="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            placeholder="name@example.com"
          />
        </label>
        <label>
          University
          <input
            value={form.university}
            onChange={(event) => setForm({ ...form, university: event.target.value })}
            placeholder="e.g. QUT"
          />
        </label>
        <button type="submit">Create Account</button>
      </form>
      <p className="meta-line">Top university (local sample): {topUniversity}</p>
    </SectionCard>
  )
}

function Store() {
  return (
    <SectionCard title="Student Essentials Store (AUD)">
      <p>
        Shop in Australian dollars for placement tools, junior paramedic attire, and custom-branded
        essentials including approved kit suggestions.
      </p>
    </SectionCard>
  )
}

function Community() {
  return (
    <SectionCard title="Community Hub">
      <p>Share housing leads, placement swaps, and subject resources with your cohort.</p>
    </SectionCard>
  )
}

function Feedback() {
  return (
    <SectionCard title="Feedback + Sharing">
      <p>
        Tell us what to build next and share your referral link to help peers discover the platform.
      </p>
    </SectionCard>
  )
}

function Legal() {
  return (
    <SectionCard title="Waiver and Responsibility">
      <p>
        This website is educational only and not a substitute for official training, clinical
        supervision, or QAS documentation. Always verify against current QAS guidelines.
      </p>
    </SectionCard>
  )
}

export default function App() {
  const [accepted, setAccepted] = useState(() => safeStorage.get('acceptedTerms', 'no') === 'yes')

  const acceptTerms = () => {
    safeStorage.set('acceptedTerms', 'yes')
    setAccepted(true)
  }

  return (
    <div className="app-shell">
      {!accepted && <TermsModal onAccept={acceptTerms} />}
      <header className="top-nav">
        <div className="brand-wrap">
          <img className="logo" src={logo} alt="PS monogram blended with ECG rhythm" />
          <h1>paramedicstudents.com</h1>
        </div>
        <nav>
          {navItems.map(([to, label]) => (
            <NavLink key={to} to={to}>
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="ecg-line" aria-hidden="true" />
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/learning" element={<Learning />} />
          <Route path="/membership" element={<Membership />} />
          <Route path="/store" element={<Store />} />
          <Route path="/community" element={<Community />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/legal" element={<Legal />} />
        </Routes>
      </main>
    </div>
  )
}
