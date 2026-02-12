import { NavLink, Route, Routes } from 'react-router-dom'
import { useMemo, useState } from 'react'
import logo from './assets/ps-ecg-logo.svg'

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
      // no-op: storage may be disabled in some mobile browser contexts
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

const games = [
  {
    id: 'ecg',
    name: 'ECG Time Challenge',
    detail: 'Rapid rhythm recognition, pathology clues, and timed scoring.',
  },
  {
    id: 'crossword',
    name: 'Clinical Crossword',
    detail: 'Drug classes, anatomy, trauma patterns, and terminology drills.',
  },
  {
    id: 'hangman',
    name: 'Paramedic Hangman',
    detail: 'Airway tools, abbreviations, and emergency care language.',
  },
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
        <ul>
          <li>Dark mode interface with neurodivergent-friendly learning pathways.</li>
          <li>QAS-focused protocol revision and scenario-based drills.</li>
          <li>University leaderboard challenges, referral rewards, and cohort sharing tools.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Evidence, Safety, and QAS Alignment">
        <p>
          Every educational module is designed to reference evidence-based practice and encourage
          active alignment with QAS Clinical Practice Guidelines and protocol updates.
        </p>
        <p>
          Content contributions are moderated and date-stamped so students can track teaching
          changes across cohorts and subjects.
        </p>
      </SectionCard>
    </>
  )
}

function Learning() {
  const [gamePlays, setGamePlays] = usePersistentState('gamePlays', {})

  const launchGame = (gameId) => {
    const currentPlays = gamePlays[gameId] ?? 0
    if (currentPlays >= 3) return

    setGamePlays({
      ...gamePlays,
      [gameId]: currentPlays + 1,
    })
  }

  const totalFreePlays = Object.values(gamePlays).reduce((sum, count) => sum + Number(count), 0)

  return (
    <>
      <SectionCard title="Learning Arcade">
        <p>
          Each game includes <strong>3 free plays</strong> before membership upgrade prompts.
          Progress is saved to this device so you can track your free attempts.
        </p>

        <div className="game-grid cards-grid">
          {games.map((game) => {
            const plays = gamePlays[game.id] ?? 0
            const locked = plays >= 3

            return (
              <article key={game.id} className="game-box">
                <h3>{game.name}</h3>
                <p>{game.detail}</p>
                <p className="meta-line">Free plays used: {plays}/3</p>
                <button disabled={locked} onClick={() => launchGame(game.id)}>
                  {locked ? 'Upgrade to Continue' : 'Launch Game'}
                </button>
              </article>
            )
          })}
        </div>

        <p className="meta-line">Total free plays used across arcade: {totalFreePlays}</p>
      </SectionCard>

      <SectionCard title="Leaderboard + University Insights">
        <p>
          Users can register university and campus to compare progress, ECG scores, and streaks.
          Public leaderboard views can highlight top students and top-performing universities.
        </p>
      </SectionCard>
    </>
  )
}

function Membership() {
  const [members, setMembers] = usePersistentState('members', [])
  const [form, setForm] = useState({
    name: '',
    email: '',
    university: '',
    campus: '',
    referral: '',
  })

  const submitMember = (event) => {
    event.preventDefault()

    if (!form.name || !form.email || !form.university) return

    const nextMembers = [
      {
        ...form,
        joinedAt: new Date().toISOString(),
      },
      ...members,
    ]

    setMembers(nextMembers)
    setForm({ name: '', email: '', university: '', campus: '', referral: '' })
  }

  const topUniversity = useMemo(() => {
    if (!members.length) return 'No sign-ups yet'

    const counts = members.reduce((acc, member) => {
      const key = member.university
      acc[key] = (acc[key] ?? 0) + 1
      return acc
    }, {})

    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0]
  }, [members])

  return (
    <>
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
          <label>
            Campus / Location
            <input
              value={form.campus}
              onChange={(event) => setForm({ ...form, campus: event.target.value })}
              placeholder="e.g. Kelvin Grove, QLD"
            />
          </label>
          <label>
            Referral Code
            <input
              value={form.referral}
              onChange={(event) => setForm({ ...form, referral: event.target.value })}
              placeholder="Optional referral code"
            />
          </label>
          <button type="submit">Create Account</button>
        </form>

        <div className="stats-row">
          <p>Local sign-ups tracked: {members.length}</p>
          <p>Top university (local sample): {topUniversity}</p>
        </div>

        <p>
          Referral rewards: if a referred member upgrades to paid, both students earn credits
          towards personalised equipment and placement essentials.
        </p>
      </SectionCard>
    </>
  )
}

function Store() {
  return (
    <>
      <SectionCard title="Student Essentials Store (AUD)">
        <p>
          Shop in Australian dollars for placement tools, junior paramedic attire (infants and
          children), and custom-branded essentials.
        </p>
        <ul>
          <li>Stethoscopes, BP cuffs, shears, boots, notebooks, and flash cards.</li>
          <li>Placement kit bundles and practical add-ons (including lunch prep gear).</li>
          <li>Personalised bags, tools, and embroidered apparel.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Virtual Try-On Studio">
        <p>
          Upload a headshot or full-body image to preview recommended kit overlays. Suggested items
          are filtered by student usage and configurable for QAS-compatible styles.
        </p>
        <button>Upload Preview Image</button>
      </SectionCard>

      <SectionCard title="Checkout Options">
        <p>
          Payments: Visa, Mastercard, PayPal, Apple Pay, Google Pay, bank transfer, and crypto
          options (BTC, ETH, USDT) with clear AUD conversion shown before purchase.
        </p>
      </SectionCard>
    </>
  )
}

function Community() {
  const [resources, setResources] = usePersistentState('cohortResources', [])
  const [housing, setHousing] = usePersistentState('housingListings', [])
  const [resourceForm, setResourceForm] = useState({ title: '', unit: '' })
  const [housingForm, setHousingForm] = useState({ suburb: '', details: '' })

  const addResource = (event) => {
    event.preventDefault()
    if (!resourceForm.title || !resourceForm.unit) return

    setResources([
      { ...resourceForm, createdAt: new Date().toISOString() },
      ...resources,
    ])
    setResourceForm({ title: '', unit: '' })
  }

  const addHousing = (event) => {
    event.preventDefault()
    if (!housingForm.suburb || !housingForm.details) return

    setHousing([
      { ...housingForm, createdAt: new Date().toISOString() },
      ...housing,
    ])
    setHousingForm({ suburb: '', details: '' })
  }

  return (
    <>
      <SectionCard title="Cohort Library + Subject Uploads">
        <p>
          Students can upload subject outlines, notes, and revision tools to keep resources current
          with curriculum changes.
        </p>

        <form className="form-grid" onSubmit={addResource}>
          <label>
            Resource title
            <input
              value={resourceForm.title}
              onChange={(event) => setResourceForm({ ...resourceForm, title: event.target.value })}
              placeholder="e.g. Trauma Assessment Summary"
            />
          </label>
          <label>
            Unit / subject
            <input
              value={resourceForm.unit}
              onChange={(event) => setResourceForm({ ...resourceForm, unit: event.target.value })}
              placeholder="e.g. PARA201"
            />
          </label>
          <button type="submit">Share Resource</button>
        </form>

        <ul className="list-box">
          {resources.slice(0, 3).map((resource) => (
            <li key={`${resource.title}-${resource.createdAt}`}>
              <strong>{resource.title}</strong> — {resource.unit}
            </li>
          ))}
          {!resources.length && <li>No resources shared yet.</li>}
        </ul>
      </SectionCard>

      <SectionCard title="Placement Housing Swap">
        <p>
          Share rooms for rent, short-stay swaps, and placement accommodation leads with safety
          checklists and verification badges.
        </p>

        <form className="form-grid" onSubmit={addHousing}>
          <label>
            Suburb / location
            <input
              value={housingForm.suburb}
              onChange={(event) => setHousingForm({ ...housingForm, suburb: event.target.value })}
              placeholder="e.g. Townsville"
            />
          </label>
          <label>
            Listing details
            <textarea
              rows="3"
              value={housingForm.details}
              onChange={(event) => setHousingForm({ ...housingForm, details: event.target.value })}
              placeholder="Room available near placement hub..."
            />
          </label>
          <button type="submit">Post Listing</button>
        </form>

        <ul className="list-box">
          {housing.slice(0, 3).map((listing) => (
            <li key={`${listing.suburb}-${listing.createdAt}`}>
              <strong>{listing.suburb}</strong> — {listing.details}
            </li>
          ))}
          {!housing.length && <li>No housing posts yet.</li>}
        </ul>
      </SectionCard>
    </>
  )
}

function Feedback() {
  const [feedbackEntries, setFeedbackEntries] = usePersistentState('feedbackEntries', [])
  const [feedbackText, setFeedbackText] = useState('')

  const submitFeedback = (event) => {
    event.preventDefault()
    if (!feedbackText.trim()) return

    setFeedbackEntries([
      {
        text: feedbackText.trim(),
        createdAt: new Date().toISOString(),
      },
      ...feedbackEntries,
    ])

    setFeedbackText('')
  }

  return (
    <SectionCard title="Feedback + Sharing">
      <form className="form-grid" onSubmit={submitFeedback}>
        <label>
          Your feedback
          <textarea
            rows="4"
            value={feedbackText}
            onChange={(event) => setFeedbackText(event.target.value)}
            placeholder="Tell us what would improve your learning"
          />
        </label>
        <label>
          Share link with mates
          <input value="https://paramedicstudents.com/signup?ref=YOURCODE" readOnly />
        </label>
        <button type="submit">Submit Feedback</button>
      </form>

      <ul className="list-box">
        {feedbackEntries.slice(0, 3).map((entry) => (
          <li key={entry.createdAt}>{entry.text}</li>
        ))}
        {!feedbackEntries.length && <li>No feedback submitted yet.</li>}
      </ul>
    </SectionCard>
  )
}

function Legal() {
  return (
    <>
      <SectionCard title="Waiver and Responsibility">
        <p>
          This website is educational only and not a substitute for official training, clinical
          supervision, or QAS documentation. Accuracy is not guaranteed and users accept
          responsibility to verify all information before application.
        </p>
      </SectionCard>
      <SectionCard title="Security Commitments">
        <ul>
          <li>Encrypted logins and secure payment handling via PCI-compliant providers.</li>
          <li>Role-based moderation for uploaded content.</li>
          <li>Privacy controls for profile, university, and leaderboard visibility.</li>
        </ul>
        <p>
          For GoDaddy + GitHub setup, provide your GitHub username, repo access, GoDaddy DNS
          access, and preferred support email so deployment and domain linking can be completed.
        </p>
      </SectionCard>
    </>
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
      <header>
        <img className="logo" src={logo} alt="PS monogram blended with ECG rhythm" />
        <div>
          <h1>paramedicstudents.com</h1>
          <p>{catchline}</p>
        </div>
      </header>
      <nav>
        {navItems.map(([to, label]) => (
          <NavLink key={to} to={to}>
            {label}
          </NavLink>
        ))}
      </nav>
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
