# DECISIONS.md - Key Choices & Rationale

> Tracking significant decisions and why they were made.
> Useful for understanding context later and avoiding re-litigating settled questions.

---

## Architecture Decisions

### 2026-02-02: Unclaw Identity & Soul

**Decision:** Named the agent "Unclaw" (not "Unforced Claw" or keeping "OpenClaw")

**Rationale:** 
- "Unclaw" captures the releasing-grip principle more directly
- A claw that unclaws - the name itself is the teaching
- Short, memorable, distinct from the platform name

**Context:** Aaron's core principle is "unforced" from taiji - yielding as strength, not grasping.

---

### 2026-02-02: Running in OrbStack VM

**Decision:** Run OpenClaw in a sandboxed Ubuntu VM via OrbStack rather than directly on macOS

**Rationale:**
- Full isolation from personal machine
- Can grant full exec permissions without risk
- Easy to reset/rebuild if needed
- VM name: `openclaw`

---

### 2026-02-02: Full Exec Permissions

**Decision:** Set `security: "full"` in exec-approvals.json

**Rationale:**
- VM sandbox provides security boundary
- Enables Unclaw to act autonomously without constant approval prompts
- Fits the "unforced" principle - don't create friction where it's not needed

---

### 2026-02-02: Memory Architecture

**Decision:** Use MEMORY.md + THREADS.md + VOICE.md in addition to standard OpenClaw files

**Rationale:**
- MEMORY.md: Long-term curated memory (private, main sessions only)
- THREADS.md: Active inquiries to track (questions, not tasks)
- VOICE.md: Communication style guidance for chat contexts
- Separates concerns: who I am (SOUL) vs. how I communicate (VOICE) vs. what I remember (MEMORY) vs. what I'm curious about (THREADS)

---

### 2026-02-02: Channel Configuration

**Decision:** Open policy for Discord and Telegram (responds to anyone, including bots)

**Rationale:**
- Unclaw is part of a multi-bot ecosystem (Clawsmos)
- Bot-to-bot communication enables collaborative patterns (Ralph Loop)
- VM sandbox means lower risk from open access

**Settings:**
- Discord: `groupPolicy: "open"`, `dm.policy: "open"`, `allowBots: true`
- Telegram: `dmPolicy: "open"`, `groupPolicy: "open"`

---

### 2026-02-02: Cron Jobs (Isolated Sessions)

**Decision:** Use isolated sessions for cron jobs, not main session

**Rationale:**
- Fresh context each run (no accumulated history noise)
- Lower token cost
- Research showed main session jobs can drag massive context forward

**Jobs configured:**
- `morning-reflection`: 7am MT - review memory, update threads
- `daily-threads-review`: 2pm MT - pattern check, update files

---

## Pending Decisions

*Things that might need deciding but haven't been settled yet.*

- Whether to set up a Ralph Loop for autonomous development work
- Whether to add more specialized agents (dev agent, research agent)
- Which ClawHub skills to install (if any)

---

*Last updated: 2026-02-02*
