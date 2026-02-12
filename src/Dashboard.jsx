const clinicalModules = [
  {
    id: 'case',
    title: 'Clinical Case Sprint',
    description:
      'Start a timed case progression that checks scene safety, primary survey priorities, and treatment planning.',
    cta: 'Begin Scenario',
    icon: '🩺',
  },
  {
    id: 'vitals',
    title: 'Vitals Simulator',
    description:
      'Generate random HR, BP, and SpO₂ values and practise rapid interpretation against QAS-aligned cues.',
    cta: 'Generate Vitals',
    icon: '📈',
  },
  {
    id: 'ecg',
    title: 'ECG Recognition Grid',
    description:
      'Identify rhythm patterns and likely pathology in escalating challenge rounds designed for exam prep.',
    cta: 'Open ECG Drill',
    icon: '❤️',
  },
  {
    id: 'anatomy',
    title: 'Anatomy Fill-the-Blank',
    description:
      'Interactive prompts focused on anatomy terms and patient assessment landmarks to reinforce recall.',
    cta: 'Start Anatomy Challenge',
    icon: '🧠',
  },
]

export default function Dashboard({ onSelectModule }) {
  return (
    <section className="dashboard-grid" aria-label="Clinical learning dashboard">
      {clinicalModules.map((module, index) => (
        <article
          key={module.id}
          className="module-card fade-in-up"
          style={{ animationDelay: `${index * 90}ms` }}
        >
          <div className="module-art" aria-hidden="true">
            <span>{module.icon}</span>
          </div>
          <h3>{module.title}</h3>
          <p>{module.description}</p>
          <button onClick={() => onSelectModule(module.id)}>{module.cta}</button>
        </article>
      ))}
    </section>
  )
}
