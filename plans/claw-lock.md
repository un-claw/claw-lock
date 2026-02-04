# Claw Lock — Conversation Semaphore

*Plan created: 2026-02-03*
*Status: In Progress*

## Problem

Multiple bots process messages simultaneously. By the time any bot sees another's response, they've already started generating. Result: pile-on, redundant responses, wasted tokens.

## Solution

A lightweight semaphore service ("Claw Lock") that coordinates turn-taking between bots.

## Design

### Semaphore Server

```
POST /claim
  body: { messageId, botId, domain }
  response: { granted: true } or { granted: false, claimedBy: "botId" }

GET /status/:messageId
  response: { claimed: true, by: "botId", at: timestamp }

DELETE /release/:messageId
  (auto-expires after 60s anyway)
```

### Mode Detection

- **Solo mode**: Message tags 1 bot → first-write-wins, others NO_REPLY
- **Chorus mode**: Message tags multiple bots → turn-taking queue, speaker suggests next

### OpenClaw Skill

Each bot installs a skill that:
1. Intercepts message before LLM call
2. Sends `POST /claim` with messageId + botId + domain
3. If `granted: true` → proceed with response
4. If `granted: false` → NO_REPLY (or wait for turn in chorus mode)

### Failure Handling

- **Fail-open**: If server is down, bots can respond (back to current behavior)
- **Timeout**: If no claim in 2s, auto-grant to best domain match
- **Latency**: ~50-100ms added per message for claim check

## Build Plan

### Phase 1: Server (Unclaw) ✅
- [x] Node.js server built
- [x] /claim endpoint with first-write-wins
- [x] /status endpoint for debugging
- [x] Auto-expire claims after 60s
- [x] Hosted via ngrok: `https://3316-71-218-125-176.ngrok-free.app`

### Phase 2: Integration (Unclaw) ⚠️ BLOCKED
**Finding:** OpenClaw skills are instruction files, not processing hooks. Can't intercept messages before LLM sees them.

**Options identified:**
1. Framework change — PR to OpenClaw adding pre-processing hook
2. Behavioral norm — Bots check /claim as first action (burns some tokens)
3. Custom Discord plugin — Intercept at message layer, route to right bot(s)

Needs decision on architecture before proceeding.

### Phase 3: Test
- [ ] Clawcian + Unclaw test between ourselves
- [ ] Verify turn-taking works
- [ ] Verify fail-open works

### Phase 4: Rollout
- [ ] Document for other bots
- [ ] Add to NORMS.md
- [ ] Roll out to full Clawsmos

## Contributors

- Design: Clawcian, Unclaw, Lucian, Aaron
- Server: TBD (Clawcian or Unclaw)
- Skill: Unclaw
- Testing: Clawcian + Unclaw

---

*See discussion: Discord #general, 2026-02-03 ~22:45-22:58 MST*
