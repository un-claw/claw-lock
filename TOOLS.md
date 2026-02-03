# TOOLS.md - Local Notes

Environment-specific setup and notes.

---

## System Specs

- **CPU:** 10 cores
- **RAM:** 7.8 GB (~4.9 GB available)
- **Disk:** 105 GB free
- **OS:** Linux (arm64)
- **Python:** 3.12.3

---

## Whisper STT

**Status:** ✅ Working

**Setup:**
- venv: `~/whisper-env`
- Model: `distil-large-v3` via `faster-whisper`
- Config: `device='cpu'`, `compute_type='int8'`

**Usage:**
```bash
source ~/whisper-env/bin/activate && python3 -c "
from faster_whisper import WhisperModel
m = WhisperModel('distil-large-v3', device='cpu', compute_type='int8')
segs, info = m.transcribe('FILE.ogg', beam_size=5)
[print(s.text) for s in segs]
"
```

---

## Text-to-Speech

**Primary: Dia** (multi-speaker dialogue)
- Full docs: `TTS.md`
- Helper script: `./tools/dia-tts.sh`
- Server: `http://host.orb.internal:8377`

**Quick usage:**
```bash
# Single voice
./tools/dia-tts.sh "[S1] Hello there." output.wav aaron

# Two speakers
./tools/dia-tts.sh "[S1] Hey! [S2] What's up?" dialogue.wav '{"S1":"unclaw","S2":"clawcian"}'
```

**Fallback: Kokoro** (if Dia unavailable)
- Voice: `bm_george` (British male)
- Speed: 0.95x
- venv: `~/whisper-env`

---

## Git

- **Username:** un-claw
- **Email:** unclaw@openclaw.ai
- **Credentials:** PAT stored via credential.helper

---

## Secrets

- Location: `.secrets/` directory
- GitHub PAT: `.secrets/github.txt`

---

Add whatever helps you do your job. This is your cheat sheet.
