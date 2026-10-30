# Project design skills

Installed from upstream on 2026-10-30:

- Impeccable 4.8.0: https://github.com/pbakaus/impeccable
  Commit: df3a4abe7d0840d5f60324812c432e00b66a4e75
  Source directory: `.agents/skills/impeccable` in upstream.
  Engine 0.1.18 was downloaded and verified by the upstream launcher against its pinned SHA-256 manifest. The local Linux engine is ignored by Git; other machines can download their platform engine on first run.
- Taste / design-taste-frontend: https://github.com/Leonxlnx/taste-skill
  Commit: 12af471f627f866411b4bd785b19646d3672784c
  Source directory: `skills/taste-skill` in upstream.
  Requires Node 22+ and Chrome, Edge, or Chromium. This environment has Node 24 and `/usr/bin/chromium`.

Read each skill's SKILL.md before applying it. Existing Bowlup product, brand, and design decisions remain the authority for refinements. No hooks or global agent settings were changed.

Readiness checks passed: Impeccable launcher reports 4.8.0; Taste inspector ran against the local build at 390px and produced browser measurements and screenshots.

Codex may need a new project session to display newly installed project skills in its skill menu. They can also be read directly at the paths above.
