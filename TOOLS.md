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

## Kokoro TTS

**Status:** ✅ Working

**Voice:** `bm_george` (British male, Alan Watts vibes)
**Speed:** 0.95x (contemplative, unhurried)
**Lang:** `b` (British English)

**Usage:**
```bash
source ~/whisper-env/bin/activate && python3 -c "
from kokoro import KPipeline
import soundfile as sf
import numpy as np

pipeline = KPipeline(lang_code='b')
audio_chunks = []
for result in pipeline('TEXT_HERE', voice='bm_george', speed=0.95):
    audio_chunks.append(result.audio)
audio = np.concatenate(audio_chunks)
sf.write('/tmp/unclaw_voice.wav', audio, 24000)
"
```

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
