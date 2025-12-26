# Kempion Research Site - Revised Content Plan

**Context**: Reassessed based on actual Cortex/Converx codebase and `KEMPION_MANIFESTO_V2.md`.
**Focus**: Showcasing the "Engineering of Insight" via the 5-Layer Intelligence Stack.
**Status**: Ready for Implementation

---

## Content Strategy

The site will move from purely philosophical claims to demonstrating the **engineering reality** behind the vision. We will showcase the **Converx Intelligence Stack** (5 layers) as the concrete implementation of the "Decision Intelligence" promise.

**Source of Truth**: `KEMPION_MANIFESTO_V2.md` (replaces `WEBSITE_SNIPPETS.md`).

---

## Section 1: The Core Thesis (Refined)

**Source**: `KEMPION_MANIFESTO_V2.md`
**Headline**: "We Engineer Insight."
**Subhead**: "From Hoping to Knowing."
**Content**:
- The Decision Problem: Guessing vs. Knowing.
- The Protocol: Golden Spec + 5-Layer Intelligence.
- Visual: "Golden Spec" badge or icon next to "5-Layer Stack" icon.

---

## Section 2: The Solution - Converx Intelligence Stack

**Source**: `cortex/COMPLETE_STACK.md` + `KEMPION_MANIFESTO_V2.md`
**Headline**: A Complete 5-Layer Intelligence Architecture.
**Visual**: Interactive diagram of the 5 layers.

**The 5 Layers**:
1.  **Layer 1: Analysis** (The Senses)
    - *Deep profiling of reality.*
2.  **Layer 2: Memory** (The Experience)
    - *Pattern matching against history.*
3.  **Layer 3: Warning System** (The Nerves)
    - *Real-time health and risk monitoring.*
4.  **Layer 4: Recommendation** (The Brain)
    - *Context-aware strategic advice.*
5.  **Layer 5: Planning** (The Hands)
    - *Execution and tracking.*

**Why this matters**: Shows *how* we achieve the vision. It's not magic; it's engineering.

---

## Section 3: The Four Research Pillars (The "Full Spec")

**Source**: `KEMPION_MANIFESTO_V2.md` (Research Pillars section)
**Format**: 2x2 Grid of Cards.

1.  **Calibration & Reliability**
    - *Outcome*: "Know when you don't know." (Calibration Error < 5%).
2.  **Probabilistic Forecasting**
    - *Outcome*: Scenario Bands (Optimistic/Likely/Conservative).
    - *Proof*: VortexV2.
3.  **Strategic Intelligence**
    - *Outcome*: Strategic Sovereignty.
    - *Proof*: Converx.
4.  **Deep Context Engineering**
    - *Outcome*: Zero-Shot Context Loading.
    - *Proof*: Personal AI Dataset.

---

## Section 4: Real-World Capabilities (Code-First)

**Source**: `cortex/docs/user_guide/examples.md`
**Headline**: Built for Builders.
**Format**: Terminal Showcase Component.

**Examples to Showcase**:
1.  **Daily Briefing** (CLI output).
2.  **Pattern Search** (Finding similar work).
3.  **Metrics Dashboard** (Velocity & ROI).

---

## Section 5: The 10-Year Vision (Converx)

**Source**: `cortex/FUTURE_VISION.md`
**Headline**: The Path to 2035.
**Content**:
- **Phase 0 (Now)**: Foundation (MVP, 5-Layer Stack).
- **Year 5 (2030)**: Personal Cognitive OS.
- **Year 10 (2035)**: Maximum Human/AI Collaboration.

**Key Concept**: "The Compound Effect" - 100 units → 500 units of strategic output.

---

## Implementation Plan

### 1. New Component: `IntelligenceStack.tsx`
- Visual representation of the 5 layers.
- Data source: `COMPLETE_STACK.md`.

### 2. New Component: `ResearchPillars.tsx`
- Grid layout displaying the 4 pillars defined in `KEMPION_MANIFESTO_V2.md`.
- Expandable cards showing the "5-Layer Implementation" details for each pillar.

### 3. New Component: `CodeShowcase.tsx`
- Terminal-like window displaying real CLI outputs.

### 4. New Component: `VisionTimeline.tsx`
- Timeline view of the 10-year vision.

### 5. Update: `Hero.tsx`
- Update copy to "The Engineering of Insight".

---
