# Text-to-Speech (Dia)

You have access to a TTS server running on the Mac host using the **Dia 1.6B** model, optimized for Apple Silicon via MLX. This lets you generate realistic dialogue audio with different voices for each speaker.

## Quick Start

```bash
# Basic generation (random voices each time)
./tools/dia-tts.sh "[S1] Hello there." output.wav

# Two speakers in dialogue
./tools/dia-tts.sh "[S1] Hey, what's up? [S2] Not much, just vibing." dialogue.wav

# Single voice profile for all speakers
./tools/dia-tts.sh "[S1] Hello. [S2] Hey!" dialogue.wav aaron

# Different voice for each speaker
./tools/dia-tts.sh "[S1] Hello. [S2] Hey!" dialogue.wav '{"S1":"aaron","S2":"sarah"}'
```

## Speaker Tags

Use `[S1]` and `[S2]` to mark different speakers. Each gets a distinct voice.

```
[S1] This is the first speaker.
[S2] And this is the second speaker responding.
[S1] Back to speaker one!
```

## Multi-Speaker Voice Cloning

The killer feature: assign different voice profiles to each speaker.

```bash
# Using the helper script with JSON
./tools/dia-tts.sh "[S1] Hey Aaron! [S2] What's up?" convo.wav '{"S1":"sarah","S2":"aaron"}'
```

**Direct API:**
```bash
curl -X POST http://host.orb.internal:8377/generate \
  -H "Content-Type: application/json" \
  -d '{
    "text": "[S1] Hello there! [S2] Hey, how are you?",
    "voices": {
      "S1": "aaron",
      "S2": "sarah"
    }
  }'
```

**How it works:** The server parses your dialogue, generates each speaker's segments separately with their voice profile, then stitches the audio together. This takes longer but gives you full control over each voice.

## Nonverbal Sounds

Dia can generate emotional sounds and nonverbal communication. Insert these tags naturally in your text:

**Laughter & Joy:**
- `(laughs)` - full laugh
- `(chuckle)` - soft laugh

**Breathing & Physical:**
- `(sighs)` - exhale of emotion
- `(gasps)` - sharp inhale of surprise
- `(inhales)` / `(exhales)` - deliberate breathing
- `(coughs)` - coughing
- `(clears throat)` - throat clearing
- `(sniffs)` - sniffling
- `(sneezes)` - sneezing
- `(burps)` - burping
- `(groans)` - groaning

**Expression:**
- `(screams)` - loud scream
- `(mumbles)` - unclear speech
- `(whistles)` - whistling

**Musical:**
- `(singing)` or `(sings)` - singing
- `(humming)` - humming a tune

**Other:**
- `(claps)` - single clap
- `(applause)` - clapping
- `(beep)` - electronic beep

**Example:**
```bash
./tools/dia-tts.sh "[S1] I can't believe it worked! (laughs) This is amazing. [S2] (clears throat) Well, I told you it would. (chuckle)" excited.wav
```

## Voice Profiles

### List Available Voices

```bash
curl -s http://host.orb.internal:8377/voices | jq
```

### Creating a Voice Profile

To clone a voice, you need:
1. A 5-10 second audio sample (WAV format, clean audio)
2. The transcript of what's said in that audio (with speaker tag)

**Upload via API:**
```bash
# Encode audio to base64
AUDIO_B64=$(base64 -w0 /path/to/sample.wav)

# Upload with transcript
curl -X POST http://host.orb.internal:8377/voices \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"aaron\",
    \"audio_base64\": \"$AUDIO_B64\",
    \"transcript\": \"[S1] This is the transcript of what I said in the sample.\"
  }"
```

**Tips for good voice cloning:**
- Use clean audio (no background noise)
- 5-10 seconds is optimal
- Match the transcript exactly to the audio
- Include words with varied sounds

## Direct API Usage

**Server:** `http://host.orb.internal:8377`

### Generate Speech

```bash
curl -X POST http://host.orb.internal:8377/generate \
  -H "Content-Type: application/json" \
  -d '{
    "text": "[S1] Your text here. [S2] Response here.",
    "voices": {"S1": "aaron", "S2": "sarah"},
    "speed": 1.0,
    "format": "wav"
  }'
```

**Parameters:**
- `text` (required): The dialogue with speaker tags
- `voice` (optional): Single voice profile for all speakers
- `voices` (optional): Per-speaker voices: `{"S1": "name1", "S2": "name2"}`
- `ref_audio_base64` (optional): Inline base64-encoded reference audio
- `ref_text` (optional): Transcript of reference audio
- `speed` (optional): Playback speed, default 1.0
- `format` (optional): Output format, default "wav"

### Response

```json
{
  "success": true,
  "filename": "dia_abc12345_combined.wav",
  "url": "/audio/dia_abc12345_combined.wav",
  "segments": 4
}
```

Then fetch the audio:
```bash
curl -s http://host.orb.internal:8377/audio/dia_abc12345_combined.wav -o output.wav
```

## Performance Notes

- Single voice generation: ~30-60 seconds
- Multi-speaker generation: ~30-60 seconds **per segment** (each speaker turn is a segment)
- The model runs on the Mac host's Apple Silicon GPU
- First request after server restart is slower (model loading)
- ffmpeg is used to stitch multi-speaker audio together

## Creative Ideas

- Generate podcast-style conversations with distinct host voices
- Create dialogue for stories with character voices
- Voice-enable bot responses in Discord/Telegram
- Make audio versions of written content with multiple narrators
- Add personality to notifications with emotional sounds
