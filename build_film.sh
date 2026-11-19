#!/usr/bin/env bash
# ==============================================================================
# Cinematic AI Character Portfolio - Build Film Script
# Strictly follows AI_Character_Portfolio_Visual_Guide.pdf (Part 3)
# ==============================================================================
set -e

# Detect ffmpeg executable
if command -v ffmpeg &> /dev/null; then
    FFMPEG_CMD="ffmpeg"
elif [ -f "$HOME/.local/bin/ffmpeg" ]; then
    FFMPEG_CMD="$HOME/.local/bin/ffmpeg"
else
    echo "Error: ffmpeg is not installed or not in PATH."
    echo "Install via: brew install ffmpeg, or python3 -m pip install imageio-ffmpeg"
    exit 1
fi

echo "Using FFmpeg: $FFMPEG_CMD"

# Verify clips folder
mkdir -p clips
mkdir -p media
mkdir -p site/media

MISSING_CLIPS=0
for i in {1..6}; do
    if [ ! -f "clips/clip$i.mp4" ]; then
        MISSING_CLIPS=1
        echo "Missing clip: clips/clip$i.mp4"
    fi
done

if [ $MISSING_CLIPS -eq 1 ]; then
    echo ""
    echo "Notice: clips/clip1.mp4 ... clips/clip6.mp4 not fully populated yet."
    echo "Follow the Google Flow prompts provided to generate the 6 clips."
    echo "Currently using the generated cinematic starter film."
    exit 0
fi

echo "All 6 clips found! Building continuous film..."

# Filter complex for 6 clips with 0.25s xfade transitions, delogo, and colorlevels black-crush
# Clip durations are ~8.0s each:
# Join 1 offset: 7.75s
# Join 2 offset: 15.50s
# Join 3 offset: 23.25s
# Join 4 offset: 31.00s
# Join 5 offset: 38.75s
FILTER_COMPLEX="[0:v][1:v]xfade=transition=fade:duration=0.25:offset=7.75[v01]; \
[v01][2:v]xfade=transition=fade:duration=0.25:offset=15.50[v02]; \
[v02][3:v]xfade=transition=fade:duration=0.25:offset=23.25[v03]; \
[v03][4:v]xfade=transition=fade:duration=0.25:offset=31.00[v04]; \
[v04][5:v]xfade=transition=fade:duration=0.25:offset=38.75[vjoined]; \
[vjoined]delogo=x=1740:y=990:w=160:h=70:show=0[vdelogo]; \
[vdelogo]colorlevels=rimin=0.045:gimin=0.045:bimin=0.045[vfinal]"

echo "Rendering master film (film_master.mp4)..."
$FFMPEG_CMD -y \
  -i clips/clip1.mp4 \
  -i clips/clip2.mp4 \
  -i clips/clip3.mp4 \
  -i clips/clip4.mp4 \
  -i clips/clip5.mp4 \
  -i clips/clip6.mp4 \
  -filter_complex "$FILTER_COMPLEX" \
  -map "[vfinal]" \
  -c:v libx264 \
  -preset slow \
  -crf 17 \
  -pix_fmt yuv420p \
  -an \
  film_master.mp4

echo "Master film created: film_master.mp4"

# Generate Web Versions (Keyframe on every frame for instant scroll scrubbing)
echo "Encoding desktop version: site/media/film.mp4 (1280px, crf 27, -g 1)..."
$FFMPEG_CMD -y -i film_master.mp4 \
  -vf "scale=1280:-2" \
  -c:v libx264 \
  -preset veryfast \
  -crf 27 \
  -g 1 \
  -an \
  -pix_fmt yuv420p \
  -movflags +faststart \
  site/media/film.mp4

echo "Encoding mobile version: site/media/film_mobile.mp4 (854px, crf 28, -g 1)..."
$FFMPEG_CMD -y -i film_master.mp4 \
  -vf "scale=854:-2" \
  -c:v libx264 \
  -preset veryfast \
  -crf 28 \
  -g 1 \
  -an \
  -pix_fmt yuv420p \
  -movflags +faststart \
  site/media/film_mobile.mp4

# Extract first frame poster
echo "Exporting first frame poster: site/media/poster.jpg..."
$FFMPEG_CMD -y -ss 0.05 -i film_master.mp4 -vframes 1 -q:v 2 site/media/poster.jpg

# Mirror to media/
cp site/media/film.mp4 media/film.mp4
cp site/media/film_mobile.mp4 media/film_mobile.mp4
cp site/media/poster.jpg media/poster.jpg

echo ""
echo "=== Film Build Complete ==="
echo "Desktop film: $(ls -lh site/media/film.mp4 | awk '{print $5}')"
echo "Mobile film:  $(ls -lh site/media/film_mobile.mp4 | awk '{print $5}')"
echo "Poster image: site/media/poster.jpg"
