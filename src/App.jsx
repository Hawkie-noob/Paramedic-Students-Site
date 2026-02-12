import { NavLink, Route, Routes } from 'react-router-dom'
import { useMemo, useState } from 'react'

const catchline = 'From lecture theatre to lights-and-sirens confidence.'

const navItems = [
  ['/', 'Home'],
  ['/learning', 'Learning + Games'],
  ['/membership', 'Membership'],
  ['/store', 'Student Store'],
  ['/community', 'Community'],
  ['/feedback', 'Feedback'],
  ['/legal', 'Legal + Security'],
]

function TermsModal({ onAccept }) {
  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h2>Accept Terms Before Continuing</h2>
        <p>
          ParamedicStudents.com is a peer-to-peer study aid for Australian paramedic students.
          It is not an official Queensland Ambulance Service (QAS) or government resource.
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
  const [plays, setPlays] = useState(() => Number(localStorage.getItem('freeGamePlays') || 0))
  const locked = plays >= 3

  const play = () => {
    if (locked) return
    const next = plays + 1
    setPlays(next)
    localStorage.setItem('freeGamePlays', String(next))
  }

  return (
    <>
      <SectionCard title="Learning Arcade">
        <p>
          Free access includes the first <strong>3 plays/levels</strong> across addictive educational
          mini-games inspired by popular mobile gameplay loops.
        </p>
        <div className="game-box">
          <h3>ECG Time Challenge</h3>
          <p>Rapid rhythm recognition, underlying pathology interpretation, and timed scoring.</p>
          <button disabled={locked} onClick={play}>
            {locked ? 'Upgrade Required' : `Play Free (${Math.max(0, 3 - plays)} left)`}
          </button>
        </div>
        <div className="game-grid">
          <div>Crosswords: drug classes, anatomy, and pathophysiology.</div>
          <div>Hangman: abbreviations, airway tools, and trauma terms.</div>
          <div>Anatomy Fill-the-Blanks with dyslexia-friendly options.</div>
          <div>Scenario Sprint with escalating complexity and hints.</div>
        </div>
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
  return (
    <>
      <SectionCard title="Sign Up + Membership Database">
        <form className="form-grid">
          <label>
            Full Name
            <input placeholder="e.g. Olivia Smith" />
          </label>
          <label>
            Email
            <input type="email" placeholder="name@example.com" />
          </label>
          <label>
            University
            <input placeholder="e.g. QUT" />
          </label>
          <label>
            Campus / Location
            <input placeholder="e.g. Kelvin Grove, QLD" />
          </label>
          <label>
            Referral Code
            <input placeholder="Optional referral code" />
          </label>
          <button type="button">Create Account</button>
        </form>
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
  return (
    <>
      <SectionCard title="Cohort Library + Subject Uploads">
        <p>
          Students can upload subject outlines, notes, and revision tools to keep resources current
          with curriculum changes.
        </p>
      </SectionCard>
      <SectionCard title="Placement Housing Swap">
        <p>
          Share rooms for rent, short-stay swaps, and placement accommodation leads with safety
          checklists and verification badges.
        </p>
      </SectionCard>
    </>
  )
}

function Feedback() {
  return (
    <SectionCard title="Feedback + Sharing">
      <form className="form-grid">
        <label>
          Your feedback
          <textarea rows="4" placeholder="Tell us what would improve your learning" />
        </label>
        <label>
          Share link with mates
          <input value="https://paramedicstudents.com/signup?ref=YOURCODE" readOnly />
        </label>
        <button type="button">Submit Feedback</button>
      </form>
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
  const [accepted, setAccepted] = useState(() => localStorage.getItem('acceptedTerms') === 'yes')

  const acceptTerms = () => {
    localStorage.setItem('acceptedTerms', 'yes')
    setAccepted(true)
  }

  const title = useMemo(() => 'PS', [])

  return (
    <div className="app-shell">
      {!accepted && <TermsModal onAccept={acceptTerms} />}
      <header>
        <div className="logo" aria-label="Paramedic Students logo">
          <span>{title}</span>
        </div>
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
