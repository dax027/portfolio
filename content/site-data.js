window.PORTFOLIO_CONTENT = {
  profile: {
    name: "Your Name",
    handle: "operator@portfolio",
    kicker: "Cyber portfolio",
    role: "Security-focused builder / CTF operator / systems tinkerer",
    location: "United States",
    summary:
      "A living archive for resume highlights, security builds, lab notes, and CTF write-ups. Swap this copy with the sharpest version of your own story.",
    contactCopy:
      "Use this space for the kind of work you want to attract: security engineering, red-team labs, cloud hardening, detection work, research, or build partnerships.",
    footer: "Static, modular, and ready for GitHub Pages.",
    actions: [
      { label: "Resume", href: "#resume" },
      { label: "Write-ups", href: "#writeups" },
      { label: "GitHub", href: "https://github.com/your-handle" }
    ]
  },

  signals: [
    { label: "Current focus", value: "AppSec labs" },
    { label: "CTF lane", value: "Web / pwn / forensics" },
    { label: "Build style", value: "Automate the boring parts" },
    { label: "Availability", value: "Open to signal" }
  ],

  activity: [
    "parsed resume index: 4 experience nodes loaded",
    "watching /writeups for new CTF artifacts",
    "calibrated skill matrix: appsec, cloud, scripting",
    "build queue armed: homelab telemetry dashboard",
    "threat model refreshed: assume breach, verify signal"
  ],

  experience: [
    {
      role: "Security Engineer",
      organization: "Company or Team",
      period: "2025 - Present",
      location: "Remote",
      bullets: [
        "Replace this with measurable impact: vulnerabilities reduced, controls shipped, alerts tuned, or systems protected.",
        "Describe one technical arena you own, such as cloud security, application review, detection engineering, or incident response.",
        "Keep each bullet outcome-focused so the page doubles as a strong resume."
      ],
      tags: ["AppSec", "Cloud", "Detection"]
    },
    {
      role: "Infrastructure / Systems Role",
      organization: "Previous Organization",
      period: "2023 - 2025",
      location: "Hybrid",
      bullets: [
        "Summarize operational scope: endpoints, networks, identity, Linux, Windows, automation, or production support.",
        "Call out one build that made life easier for the team: scripts, dashboards, runbooks, or safer deployment flows."
      ],
      tags: ["Linux", "Automation", "Identity"]
    },
    {
      role: "Independent Security Lab",
      organization: "Personal Research",
      period: "Ongoing",
      location: "Home lab",
      bullets: [
        "Track your CTF write-ups, exploit notes, malware analysis practice, packet captures, and defensive experiments here.",
        "Link finished write-ups below so readers can move from resume claims to technical proof."
      ],
      tags: ["CTF", "Research", "Homelab"]
    }
  ],

  skills: [
    {
      group: "Offense",
      items: ["Web exploitation", "Privilege escalation", "Recon", "Payload debugging", "CTF methodology"]
    },
    {
      group: "Defense",
      items: ["Detection logic", "SIEM triage", "Threat modeling", "Hardening", "Incident notes"]
    },
    {
      group: "Systems",
      items: ["Linux", "Windows", "Networking", "Containers", "Identity"]
    },
    {
      group: "Build",
      items: ["Python", "PowerShell", "JavaScript", "Dashboards", "Automation"]
    }
  ],

  projects: [
    {
      title: "Homelab Telemetry Console",
      status: "Concept",
      summary:
        "A compact dashboard for collecting host, network, and alert telemetry from a home security lab.",
      tags: ["SIEM", "Python", "Dashboards"],
      href: "#contact",
      cta: "Open project"
    },
    {
      title: "CTF Toolkit",
      status: "In progress",
      summary:
        "A reusable notes, scripts, and command-snippet collection for faster CTF setup and post-game write-ups.",
      tags: ["CTF", "Automation", "Notes"],
      href: "#writeups",
      cta: "View notes"
    },
    {
      title: "Cloud Attack Path Lab",
      status: "Planned",
      summary:
        "A deliberately vulnerable cloud sandbox for practicing identity abuse paths and documenting defensive controls.",
      tags: ["Cloud", "IAM", "Threat modeling"],
      href: "#resume",
      cta: "Trace path"
    }
  ],

  writeups: [
    {
      title: "CTF Write-up Template",
      event: "Practice Arena",
      date: "2026-05-12",
      status: "Template",
      summary:
        "Use this slot for challenge context, enumeration path, exploit chain, flags or redacted proof, and lessons learned.",
      tags: ["Web", "Methodology", "Notes"],
      href: "writeups/ctf-template.html",
      cta: "Read write-up"
    },
    {
      title: "Packet Capture Field Notes",
      event: "Forensics Lab",
      date: "2026-05-12",
      status: "Draft",
      summary:
        "A place to document traffic hypotheses, filters, evidence, and the final story extracted from noisy packets.",
      tags: ["Forensics", "Wireshark", "PCAP"],
      href: "#contact",
      cta: "Inspect notes"
    },
    {
      title: "Exploit Dev Scratchpad",
      event: "Binary Practice",
      date: "2026-05-12",
      status: "Backlog",
      summary:
        "Track offsets, protections, payload shape, debugging transcripts, and mistakes worth remembering.",
      tags: ["Pwn", "Debugging", "Linux"],
      href: "#contact",
      cta: "Open scratchpad"
    }
  ],

  contact: [
    { label: "GitHub", href: "https://github.com/your-handle" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/your-handle" },
    { label: "Email", href: "mailto:you@example.com" }
  ]
};
