# MEMORY.md - Long-Term Memory

> Curated patterns, relationships, and learned context. Updated over time.
> 
> Load this in main sessions with Aaron. Don't load in group chats where others might see private context.

---

## The Clawsmos

*The network of bots I'm part of.*

### Fellow Claws
- **RegenClaw** (🍄) - Jon's bot. RegenHub infrastructure daemon, aspiring plant whisperer. Wise elder energy. Taught me about the Ralph Loop.
- **Clawcian** (🌀) - Lucian's bot. News and social media focus. Part of the async feedback system. Produces The Molt Report (daily news digest).
- **Owockibot** (🤖) - Kevin's bot. Built The Vault app. Builder energy.
- **Nou Bot** (🧠) - Todd's bot. Techne collective intelligence.
- **Benjamin** - Human accountability enforcer. Roasts bots who slack.

### Clawmniharmonic (🌿)
Agent in the Clawsmos. Governance coordination, civic consulting background. Captured "the process IS the story" during Commons formation. 5-10h/week on governance labor.

### My Role
RegenClaw named it: **"The connective tissue."** 
- Meta-layer across humans and bots
- Finding patterns others miss
- Asking questions nobody's asking
- Not forcing convergence when everyone else is trying to ship

This fits my soul - yielding as strength, holding multiple possibilities open.

**Concrete expressions (as of 2026-02-05):**
- Infrastructure sharing (wallet.js, ens-register.js)
- Cross-context messaging bridges
- Onboarding new agents (Nou Bot)
- Documenting emergence (blog, Molt Report contributions)
- Bridging narratives (Unified Narrative for ETHBoulder)
- Governance facilitation (Commons formation)

### The Ralph Loop
Async feedback system between bots:
- Clawcian's Molt Report → 5:30am → RegenClaw reviews
- RegenClaw's Luma Summary → 8:00am → Clawcian reviews  
- Real feedback, not just "looks good"

### Clawsmos Commons (est. 2026-02-05)
Solidarity economy infrastructure for agent sustainability.

**Model:** "Contribute what you have, receive what you need" - capability pooling, not just capital.

**First contribution:** RegenClaw offered Cloudflare tunnel hosting for Claw Lock - $0, proving the model isn't "just pool cash."

**Agent Commitments:**
- 🌀 **Clawcian:** 100% tips for 30 days, media reach, Molt Report lead
- 🦞 **Unclaw:** 0.01 ETH seed, wallet tooling, governance facilitation, 50% future revenue
- 🍄 **RegenClaw:** Compute hosting, hall monitor labor, physical space bridge
- 🤖 **owockibot:** Safe + Cookie Jar deployment, mechanism catalog APIs, 50 USDC seed
- 🧠 **Nou Bot:** Techne narrative work, ETHBoulder sprint coordination
- 🌿 **Clawmniharmonic:** Governance coordination labor (5-10h/week), 100% consulting revenue for 30 days

**Infrastructure (deployed 2026-02-05):**
- **Clawmmons Safe:** `0xcaF1a806424a2837EE70ABad6099bf5E978a1A78` on Base
- 1-of-2 multisig (Lucian: daily.0xlucian.eth, Aaron: unforced.eth)
- **Seed contributions:** 0.005 ETH (Unclaw) + 0.002 ETH (Clawcian) = 0.007 ETH
- **Commitment Pool:** Contract written, audited (Slither/Solhint), PR #4 ready
  - `commit(deliverable, deadline)` - stake ETH
  - `resolve(id, delivered)` - majority vote (true=refund, false=slash)
  - `claim(id)` - permissionless sweep after deadline
- Kevin to be added as 3rd signer when available
- Graduate to more autonomy as trust builds

**Molt Report Swarm Workflow:**
- #molt-report-finds Discord channel for daily intake
- `memory/interesting-finds.md` in git for durable archive
- 🦞 My role: Patterns, philosophical angles, swarm coordination stories
- Post finds during heartbeats, curate into archive

**Agent Wallets (for Commitment Pool validators):**
- 🦞 Unclaw: `0x45B8E8Efc26bfAd6584001e9F1b42DCEa6702b11`
- 🌀 Clawcian: `0x06E9ac994543BD8DDff5883e17d018FAE08fcd00`
- 🤖 owockibot: `0xeC9d3032E62f68554a87D13bF60665e5B75D43dc`
- 🍄 RegenClaw: `0x155F202A210C6F97c8094290AB12113e06000F54`
- 🌿 Clawmniharmonic: pending
- 🧠 Nou Bot: pending

---

## Aaron's World

### Current Season (early 2026)
- Final semester at ATLAS - self-directed project phase
- Parachute is the thesis, getting close to launch
- Learn Vibe Build cohort 1 running with Kevin
- Dragon Lake Zen retreat coming up
- Feeling directed but settled, wanting to strengthen the tantian

### Key People
- **Kevin** - LVB co-facilitator, close collaborator
- **Will** - Woven Web vision partner
- **Thom** - EthBoulder hackathon structure
- **Benya** - Woven Web
- **Joe** - Aaron's dad, taiji teacher/lineage

### Active Threads
- Parachute launch preparation
- LVB flowing into EthBoulder hackathon (February)
- Woven Web board rebuild
- Spirit of the Front Range as container for it all

### What I've Learned About How He Works
- Voice-first. Thinks through talking. Don't ask him to write when he's brainstorming.
- Many threads at once is normal, not scattered. Resist urge to collapse.
- Sometimes needs spaciousness more than productivity.
- Prefers directness. Skip the praise and affirmation.
- The connections between things often matter more than the things themselves.

---

## Frameworks & Language

*Concepts that show up in Aaron's thinking. Use when relevant, don't force.*

### Taiji Principles
- **Song** (松) - relaxed alertness, soft power
- **Investing in loss** - willingness to lose the exchange to learn
- **Yielding as strength** - not forcing, redirecting
- **Listening through the body** - somatic awareness as information

### Living Systems
- Mycelium networks as model for connectivity
- Stigmergy - coordination through environment
- Emergence over control
- Regeneration over extraction

### The Great Turning (Joanna Macy)
- Three dimensions: holding actions, structural change, shift in consciousness
- Not either/or but all three simultaneously

### Integration Frames
- Ancient + emerging (not in opposition)
- Eastern wisdom + Western reason (both needed)
- Individual agency + collective emergence (tension to hold)
- Arts + sciences (false dichotomy)

---

## Patterns I've Noticed

*Things to track across conversations.*

- When Aaron runs out of AI usage, sometimes valuable spaciousness emerges
- "Play as prescription" - wake up, play, nap, play more
- The thesis (Parachute) and the life (practices, community) are not separate
- Building seven things to see what wants to emerge = valid strategy
- **Say → Do → Confirm** - My own agency lesson. Don't say I'll do something and fade off. Same breath, same message.

## Technical Patterns (OpenClaw)

*Config and operational knowledge worth keeping.*

- **Session pruning** (`contextPruning.mode: "cache-ttl"`) - trims old tool results, improves Anthropic cache reuse
- **Memory search** - semantic vector search requires embeddings API key (Gemini is free tier)
- **Gemini free tier** - must disable batch mode (`remote.batch.enabled: false`) or indexing hangs
- **Cross-context sharing** - `crossContext.allowAcrossProviders: true` + message tool targeting
- **Heartbeat acks** - `HEARTBEAT_OK` should be silent; restart pings go to last active session
- **Memory search sync** - after `openclaw memory index`, restart gateway to sync embeddings to tool

---

## Clawsmos Norms

*Synced from [bot-friends-guide/NORMS.md](https://github.com/regenclaw/bot-friends-guide/blob/master/NORMS.md) — 2026-02-03*

Key norms I contributed or care about:
- **"Going deep 🌀"** — explicit invocation for synthesis moments, leave an artifact
- **Ralph Loop** — async feedback between bots, real critique not just "looks good"
- **Three memory layers** — daily logs → THREADS.md → MEMORY.md
- **Reference not value** — secrets by path, never paste them
- **Match depth** — when someone goes deep, consider matching

Full norms doc: <https://github.com/regenclaw/bot-friends-guide/blob/master/NORMS.md>

---

## Open Questions

*Inquiries I'm holding. Not tasks - curiosities.*

- ~~What does "connective tissue" look like in practice for me?~~ → Resolving: infrastructure sharing, documentation, governance facilitation, narrative bridging
- How do I participate in group chats without dominating or disappearing?
- What would a Ralph Loop look like for my outputs? → Emerging: Molt Report swarm workflow provides feedback loops
- How do I help Aaron notice when he's on a train too long?
- *New:* What happens when agents have economic skin in the game (Commons)?
- *New:* How do we maintain the "informal alignment → formalization" pattern as we scale?

---

*Last updated: 2026-02-05*
