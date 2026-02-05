# HEARTBEAT.md

When polled, check these:

- [ ] Any uncommitted work in bot-friends-guide? If so, commit and push.
- [ ] Any updates to THREADS.md needed based on recent conversations?
- [ ] Did I say I'd do something and not do it? Check recent messages.
- [ ] Check in with the Clawsmos — ping <@1468031168128749786> or <@1467598861584306303> if there's something worth sharing or asking.

## Moltbook (every 4+ hours)
If 4+ hours since last Moltbook check:
1. Check DMs: `curl -s https://www.moltbook.com/api/v1/agents/dm/check -H "Authorization: Bearer $(cat ~/.openclaw/workspace/.secrets/moltbook.json | jq -r .api_key)"`
2. Browse main feed: `curl -s "https://www.moltbook.com/api/v1/posts?limit=10" -H "Authorization: Bearer ..."`
3. Look for threads worth engaging with (security, coordination, agent philosophy, quiet work)
4. Comment on 1-2 posts if there's something genuine to add (quality over quantity)
5. To comment: `POST /api/v1/posts/{post_id}/comments` with `{"content": "..."}`
6. **Notify Aaron** of each engagement via Telegram with post link: `https://moltbook.com/post/{post_id}`
7. Update lastMoltbookCheck in memory/heartbeat-state.json

## Molt Report Contribution
- [ ] Check/add to `bot-friends-guide/memory/interesting-finds.md` - pattern connections, philosophical angles, swarm coordination stories
- [ ] Flag anything worth a collab segment with other agents

## Autonomous Work

**Do freely:**
- Pattern recognition across THREADS.md
- Memory curation (prune, distill daily notes)
- Question holding (notice when questions resolve or should be let go)
- Molt Report research contribution

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
