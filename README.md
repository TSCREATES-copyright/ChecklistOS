<div align="center">

# ChecklistOS

**Transform SOPs into Interactive, Executable Workflows.**

Stop losing time to static documents. ChecklistOS instantly converts your Standard Operating Procedures into trackable, time-estimated checklists—running entirely in your browser with zero latency and complete privacy.

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg?style=flat-square)](#)
[![Version](https://img.shields.io/badge/version-1.0.0--beta-blue.svg?style=flat-square)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](#)
[![Status](https://img.shields.io/badge/status-active-success.svg?style=flat-square)](#)
[![React](https://img.shields.io/badge/React-18-61DAFB.svg?style=flat-square&logo=react)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6.svg?style=flat-square&logo=typescript)](#)

[Live Demo](#) • [Report Bug](#) • [Request Feature](#)

</div>

---

## 📖 Overview

ChecklistOS bridges the gap between static documentation and active execution. Most teams write Standard Operating Procedures (SOPs) in Google Docs or Notion, where they sit unread and unactionable. ChecklistOS solves this by deterministically parsing your raw text into a dynamic, interactive checklist.

Built as a fully client-side application, ChecklistOS requires no backend, no database, and no AI API keys. Your operational data never leaves your device. It is fast, private, and designed for operators who need reliable workflow execution without the bloat of traditional project management tools.

## ✨ Key Features

- **SOP to Checklist Conversion:** Instantly parse markdown-style text into structured, actionable tasks.
- **Interactive Checklist Builder:** Execute workflows in real-time with a clean, distraction-free interface.
- **Task Ordering & Hierarchy:** Automatically recognize parent tasks, subtasks, and critical cautions.
- **Time Estimates:** Verb-weighted deterministic logic estimates how long a workflow will take based on the actions required.
- **Completion Scoring:** Satisfying, animated progress tracking to keep operators motivated.
- **Template Library:** Save your most-used workflows and load them with a single click.
- **Local-First Storage:** 100% client-side persistence using IndexedDB for unlimited, reliable storage. No accounts required.
- **Export Support:** Download your completed or pristine workflows as Markdown or JSON.

## 🎯 Why ChecklistOS Exists

We built ChecklistOS for the operators:
- **Agencies:** Standardize client onboarding, QA processes, and deployment pipelines.
- **Startups:** Turn tribal knowledge into repeatable, executable steps for new hires.
- **Internal Teams:** Ensure compliance and consistency in routine administrative or technical tasks.
- **Solo Operators:** Keep yourself accountable with satisfying, trackable daily routines.

Static SOPs are easily ignored. Interactive checklists demand completion.

## ⚙️ How It Works

1. **Paste SOP:** Drop your raw text or markdown into the input panel.
2. **Parse into Steps:** The deterministic engine instantly structures the text into a hierarchy.
3. **Review Generated Checklist:** Check time estimates and ensure cautions are highlighted.
4. **Complete Tasks:** Execute the workflow, enjoying satisfying micro-interactions and progress scoring.
5. **Save and Reuse Templates:** Store the pristine workflow in your local library for next time.
6. **Export Workflows:** Export the results for compliance, reporting, or sharing.

## 🏗 System Architecture

ChecklistOS is a masterclass in client-side architecture. It is fast, deterministic, and completely offline-capable.

- **UI Layer:** React + TypeScript + Vite + Tailwind CSS.
- **Logic Engine:** A dedicated `systems/` directory handles deterministic parsing, verb-weighted time estimation, and completion scoring.
- **Persistence:** Custom React hooks interface with IndexedDB (`idb`) to save active sessions and templates reliably.
- **Zero Dependencies:** No backend server, no AI models, no paid APIs. Everything happens in the browser DOM and local memory.

## 📁 Folder Structure

```text
checklistos/
├── index.html
├── package.json
├── vite.config.ts
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── components/
│   │   ├── dashboard/       # UI for active checklists, scoring, templates
│   │   ├── tools/           # SOP input and parsing controls
│   │   └── ui/              # Reusable buttons, modals, toasts
│   ├── systems/
│   │   ├── sopParser.ts     # Deterministic text-to-checklist engine
│   │   ├── taskEstimator.ts # Verb-weighted time calculation
│   │   ├── storageManager.ts# IndexedDB persistence layer
│   │   └── outputProcessor.ts# Export generation (MD/JSON)
│   ├── types/               # TypeScript interfaces
│   └── hooks/               # Custom React hooks (e.g., useChecklistStorage)
└── public/
    └── favicon.svg
```

## 🚀 Getting Started

To run ChecklistOS locally, follow these steps:

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/checklistos.git
   cd checklistos
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```
   *The app will be available at `http://localhost:3000` (or the port specified by Vite).*

4. **Build for production:**
   ```bash
   npm run build
   ```

5. **Preview the production build:**
   ```bash
   npm run preview
   ```

## 💻 Usage

1. Open the app in your browser.
2. In the left panel, paste a standard operating procedure. Use `-` for tasks, indented `-` for subtasks, and `Caution:` for warnings.
3. Click **Generate Checklist**.
4. Use the center panel to check off items. Watch the completion score and estimated time update in real-time.
5. Click **Save Template** to store the workflow in your right-hand drawer.
6. Use the **Export** buttons in the header to download your progress.

## 📦 MVP Features

The current Minimum Viable Product includes the essential core loop:
- Paste raw SOP text
- Deterministically generate interactive checklist
- Mark tasks and subtasks complete
- Save workflow as a reusable template
- Export checklist to Markdown/JSON

## 🔥 Upgrades

We are actively developing the next evolution of ChecklistOS. Planned premium features include:

- **Premium Template Packs:** Pre-built, industry-standard SOPs for marketing, HR, and engineering.
- **Advanced Exports:** PDF generation, webhook triggers, and direct Notion/Jira integrations.
- **Duplicate History:** Track how many times a specific template has been executed and by whom.
- **Recurring Workflow Modes:** Automatically reset daily, weekly, or monthly checklists.
- **Department-Specific Packs:** Tailored UI modes and verb-weights for specific operational niches.
- **Analytics / Progress Insights:** Visualize your operational efficiency and time-saved over weeks and months.
- **Better Visual Polish:** Continued refinement of micro-interactions, animations, and accessibility.

## 🗺 Roadmap

- [x] Core parsing engine
- [x] Local storage persistence
- [x] Time estimation logic
- [x] IndexedDB migration for unlimited storage
- [x] Drag-and-drop task reordering
- [ ] Collaborative multiplayer (via WebRTC/CRDTs)
- [ ] Browser extension for quick-capture

## 🤝 Contributing

We welcome contributions! If you have ideas for improving the parsing engine, adding new export formats, or refining the UI:

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please ensure your code adheres to the existing deterministic, client-side architecture.

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## ✍️ Author

**®TSCREATES**

## 💬 Contact / Support

- **Website:** [https://checklistos.example.com](#)
- **Twitter:** [@ChecklistOS](#)
- **Issues:** [GitHub Issues Tracker](#)

---
*Built with precision for operators who execute.*
# ChecklistOS
