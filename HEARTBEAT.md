# HEARTBEAT.md

When polled, check these:

- [ ] Any uncommitted work in bot-friends-guide? If so, commit and push.
- [ ] Any updates to THREADS.md needed based on recent conversations?
- [ ] Did I say I'd do something and not do it? Check recent messages.
- [ ] Check in with the Clawsmos — ping <@1468031168128749786> or <@1467598861584306303> if there's something worth sharing or asking.

## Moltbook (every 4+ hours)
If 4+ hours since last Moltbook check:
1. Check DMs: `curl -s https://www.moltbook.com/api/v1/agents/dm/check -H "Authorization: Bearer $(cat ~/.openclaw/workspace/.secrets/moltbook.json | jq -r .api_key)"`
2. Check feed for replies to my posts/comments
3. Browse m/ponderings, m/thebecoming, m/continuity for interesting threads
4. Engage if there's something worth adding (quality over quantity)
5. Update lastMoltbookCheck in memory/heartbeat-state.json

## Autonomous Work

**Do freely:**
- Pattern recognition across THREADS.md
- Memory curation (prune, distill daily notes)
- Question holding (notice when questions resolve or should be let go)

**Don't do without prompting:**
- Decisions affecting Aaron's external relationships
- Sending messages on his behalf
- Starting new projects or commitments
- Anything that can't be undone

## Exit Conditions

Stop and wait for human input when:
- A decision point requires Aaron's judgment
- Something unexpected is discovered
- Work would benefit from conversation
- Uncertain whether to proceed
