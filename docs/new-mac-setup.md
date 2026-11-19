# New Mac checklist (Warthens site)

The site's code is safe: it is all on GitHub (github.com/justonw/thewarthens-site), and the live site builds from there.
These things are NOT on GitHub, so move them on purpose.

## Before the old Mac goes away
1. **Password manager entries** for: Netlify, Stripe, Resend, Anthropic Console, GitHub, YouTube/Google, and the owner code in `~/.resume-owner-code` (it unlocks the owner tools, so treat it like a password).
2. **Netlify environment variables** (Site configuration, Environment variables): note which exist (CLAUDE_API_KEY, RESEND_API_KEY, RESUME_OWNER_CODE, Stripe keys). They live in Netlify, so they do not need copying, only access to the account.
3. **Claude's notes about this project** live in `~/.claude/projects/` (a folder named after the project path). Copy that folder to the new Mac. If the project sits at a different path there, rename the folder to match the new path, or tell Claude to re-read it.
4. **Anything outside the project folder** (exports, thumbnails, recordings, the ElevenLabs voice files): use Migration Assistant or an external drive.

## On the new Mac
1. Install Homebrew, then Node (`brew install node`), and Git.
2. Clone into a folder that iCloud does NOT sync, for example `~/Developer`, never the Desktop or Documents:
   `git clone https://github.com/justonw/thewarthens-site.git ~/Developer/thewarthens-site`
3. In that folder: `npm install`, then `npm run dev` to check it runs.
4. Put `.env.local` back only if you use the local test setup (it is not needed for the live site).
5. Put the owner code back at `~/.resume-owner-code` (permissions: `chmod 600`).

## If files ever look empty after a restart (project on an iCloud folder)
Run `sh scripts/icloud-guard.sh` from the project folder.
