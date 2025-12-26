# Kempion Research Site - Revised Implementation Roadmap

**Context**: Implementing the "Engineering of Insight" plan based on `KEMPION_MANIFESTO_V2.md`.
**Status**: Ready to Execute

---

## Phase 1: The Intelligence Architecture (High Priority)

**Goal**: Showcase the actual 5-layer stack that powers the system.

### Task 1.1: `IntelligenceStack.tsx`
- **Source**: `cortex/COMPLETE_STACK.md`
- **Design**:
    - Vertical stack layout.
    - Each layer card reveals technical details on hover.
    - **Content**: Layer 1-5 definitions from `COMPLETE_STACK.md`.

### Task 1.2: `ResearchPillars.tsx` (NEW)
- **Source**: `KEMPION_MANIFESTO_V2.md`
- **Design**:
    - 2x2 Grid Layout.
    - Each card represents a pillar (Calibration, Forecasting, Strategy, Context).
    - **Expandable**: Clicking a card reveals the "5-Layer Implementation" detail for that specific pillar (e.g., how Layer 3 works for Forecasting).
    - **Visual**: Use icons representing the "Golden Spec" (understand -> outcome -> solution).

---

## Phase 2: Real-World Proof (Medium Priority)

**Goal**: Prove it's real code, not just theory.

### Task 2.1: `CodeShowcase.tsx`
- **Source**: `cortex/docs/user_guide/examples.md`
- **Design**:
    - Terminal window component.
    - Tabs for "Briefing", "Analysis", "Metrics".
    - Syntax-highlighted output.

### Task 2.2: `ProofOfWork.tsx`
- **Source**: `KEMPION_MANIFESTO_V2.md`
- **Design**:
    - Showcase VortexV2, Cortex, Alpha Arena.
    - Highlight specific outcomes (MAE < 8.5kt, 911 docs indexed).

---

## Phase 3: Vision & Integration

### Task 3.1: `VisionTimeline.tsx`
- **Source**: `cortex/FUTURE_VISION.md`
- **Design**: Timeline showing Phase 0 -> Year 10.

### Task 3.2: `App.tsx` Integration
- **Order**: Hero -> IntelligenceStack -> ResearchPillars -> CodeShowcase -> VisionTimeline -> Footer.
- **Hero Update**: Change tagline to "The Engineering of Insight".

---

## Next Steps

1.  Build `IntelligenceStack.tsx`.
2.  Build `ResearchPillars.tsx` using the full spec from V2 manifesto.
3.  Build `CodeShowcase.tsx`.
