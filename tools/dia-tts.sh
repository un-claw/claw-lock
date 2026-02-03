#!/bin/bash
# Dia TTS Helper - Generate speech using the Mac host MLX-audio server
#
# Usage:
#   dia-tts.sh "Your text here" [output.wav] [voice_or_voices]
#
# Examples:
#   # Basic generation (random voices)
#   dia-tts.sh "[S1] Hello there." output.wav
#
#   # Single voice for all speakers
#   dia-tts.sh "[S1] Hello. [S2] Hey!" dialogue.wav aaron
#
#   # Different voices per speaker (JSON format)
#   dia-tts.sh "[S1] Hello. [S2] Hey!" dialogue.wav '{"S1":"aaron","S2":"sarah"}'
#
# Speaker tags: [S1] and [S2] for different speakers
# Nonverbal: (laughs), (sighs), (clears throat), etc.

TEXT="${1:-[S1] Hello there.}"
OUTPUT="${2:-/tmp/dia-output.wav}"
VOICE_ARG="${3:-}"

# TTS Server on Mac host
TTS_HOST="http://host.orb.internal:8377"

# Build JSON payload based on voice argument
if [ -z "$VOICE_ARG" ]; then
  # No voice specified
  PAYLOAD=$(jq -n --arg text "$TEXT" '{text: $text}')
  echo "Generating speech (random voices)..."
elif echo "$VOICE_ARG" | jq -e '.' >/dev/null 2>&1; then
  # Voice arg is JSON - per-speaker voices
  PAYLOAD=$(jq -n --arg text "$TEXT" --argjson voices "$VOICE_ARG" '{text: $text, voices: $voices}')
  echo "Generating speech with per-speaker voices..."
  echo "  S1: $(echo "$VOICE_ARG" | jq -r '.S1 // "default"')"
  echo "  S2: $(echo "$VOICE_ARG" | jq -r '.S2 // "default"')"
else
  # Voice arg is a single name
  PAYLOAD=$(jq -n --arg text "$TEXT" --arg voice "$VOICE_ARG" '{text: $text, voice: $voice}')
  echo "Generating speech with voice: $VOICE_ARG..."
fi

RESPONSE=$(curl -s --max-time 600 -X POST "$TTS_HOST/generate" \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD")

# Check for error
ERROR=$(echo "$RESPONSE" | jq -r '.error // empty')
if [ -n "$ERROR" ]; then
  echo "Error: $ERROR"
  exit 1
fi

# Extract filename from response
FILENAME=$(echo "$RESPONSE" | jq -r '.filename // empty')
SEGMENTS=$(echo "$RESPONSE" | jq -r '.segments // empty')

if [ -n "$FILENAME" ]; then
  # Download the audio file
  curl -s "$TTS_HOST/audio/$FILENAME" -o "$OUTPUT"
  echo "Audio saved to: $OUTPUT"
  echo "File size: $(du -h "$OUTPUT" | cut -f1)"
  [ -n "$SEGMENTS" ] && echo "Segments: $SEGMENTS"
else
  echo "Error: No filename in response"
  echo "$RESPONSE"
  exit 1
fi
