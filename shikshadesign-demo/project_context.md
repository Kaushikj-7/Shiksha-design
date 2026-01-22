🧠 Project Name
ShikshaDesign

🎯 Project Purpose
ShikshaDesign is a guided NGO program design platform that helps users create a Logical Framework Analysis (LFA) step by step.

NGOs often struggle to design coherent programs because program planning is:

expert-dependent

unstructured

time-consuming

poorly aligned between problem, outcomes, and activities

This platform converts expert program design thinking into a guided digital workflow.

The system does not generate ideas — it guides structured thinking.

🧩 Core Problem We Solve
Most NGO program proposals fail because:

Problems are not clearly defined

Outcomes are not measurable

Activities do not align with outcomes

Stakeholders are not mapped to practice change

Indicators are weak or missing

ShikshaDesign forces logical alignment across all levels.

🧱 What We Are Building (Demo Scope)
This is a frontend-only MVP prototype for hackathon demo purposes.

❌ Not building:
Authentication

Backend APIs

Real AI models

Databases

User management

✅ Building:
Step-by-step guided workflow

Logic validation rules

Structured data capture

Auto-generated Logical Framework table

Clean demo-ready UX

🔁 User Flow
Landing page

Program basics

Problem → Outcome mapping

Stakeholder & practice change mapping

Activities → Outputs alignment

Auto-generated Logical Framework summary

Users must complete steps sequentially.

🧭 Core Design Principle
No blank pages. No free-form chaos.

Every screen must:

explain what the user is doing

guide the thinking

validate the logic

move the user forward

The system behaves like a silent expert reviewer.

🧠 Conceptual Model (Logical Framework)
The platform follows standard Logical Framework Analysis:

Problem
   ↓
Stakeholders
   ↓
Practice Change
   ↓
Outcomes
   ↓
Outputs
   ↓
Activities
   ↓
Indicators
Each level must logically connect to the next.

🗂️ Data Structure (LocalStorage)
All data is stored locally using JSON.

Example structure:

{
  "basics": {
    "programName": ""
  },
  "logic": {
    "problem": "",
    "outcome": "",
    "indicator": ""
  },
  "stakeholders": [
    {
      "name": "",
      "currentPractice": "",
      "desiredPractice": ""
    }
  ],
  "activities": [
    {
      "activity": "",
      "output": "",
      "linkedOutcome": ""
    }
  ]
}
This simulates backend persistence for demo.

⚙️ Validation Rules (Very Important)
These rules create the “intelligence” illusion.

Problem & Outcome
Outcome cannot be empty

Outcome must have an indicator

Stakeholders
Every stakeholder must have a desired practice change

If missing → show warning

Activities
Every activity must map to an output

Outputs must link to an outcome

If not → show alignment warning

Framework
Missing fields highlighted in yellow/red

System shows insights, not errors

🤖 “AI Insight” Behavior
This is rule-based logic, not real AI.

Examples:

“Outcome is not measurable — add a numeric indicator.”

“Activities are not clearly aligned with outputs.”

“Stakeholder practice change missing.”

These messages are deterministic and safe.

🎨 UI / UX Guidelines
Clean, minimal interface

Step indicator or progress bar

Friendly instructional copy

One primary CTA per screen

No clutter

Design reference:

Canva-like simplicity

Notion-style structure

Figma-like clarity

🧩 Tech Stack
Frontend only:

React + Vite

Tailwind CSS

React Router

LocalStorage

Deployment:

Vercel

📦 Folder Structure
src/
│
├── pages/
│   ├── Landing.jsx
│   ├── Basics.jsx
│   ├── ProblemOutcome.jsx
│   ├── Stakeholders.jsx
│   ├── Activities.jsx
│   └── Framework.jsx
│
├── components/
│   ├── ProgressBar.jsx
│   ├── InsightBox.jsx
│
├── utils/
│   └── storage.js
│
├── App.jsx
└── main.jsx
🎬 Demo Narrative (Important)
When presenting:

“ShikshaDesign helps NGOs design programs the same way experts think — step by step.”

Then show:

Problem definition

Outcome + indicator

Stakeholder practice change

Activity alignment

Auto-generated Logical Framework

End with:

“In under 30 minutes, an NGO can generate a donor-ready logical framework.”

🚫 Scope Discipline Rules
Do NOT add:

Login systems

Dashboards

Advanced AI

Analytics

Multi-tenant logic

The goal is clarity, not complexity.

✅ Definition of Success
The demo is successful if:

A user can complete the flow without confusion

Logical Framework table auto-generates

Validation warnings appear contextually

The deployed link works smoothly

Judges understand the value in under 60 seconds

🧠 Mindset While Coding
You are not building software.

You are encoding expert thinking into a flow.

Every component should answer one question:

“Does this help the user think more clearly?”

If yes — ship it.

If not — delete it.

End of context file.
