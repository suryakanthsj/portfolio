@echo off
REM ==============================================================================
REM Cinematic AI Character Portfolio - Build Film Script (Windows)
REM Strictly follows AI_Character_Portfolio_Visual_Guide.pdf (Part 3)
REM ==============================================================================

if not exist clips\ (
    mkdir clips
)
if not exist media\ (
    mkdir media
)
if not exist site\media\ (
    mkdir site\media
)

echo Checking for clips...
if not exist clips\clip1.mp4 (
    echo clips\clip1.mp4 not found. Please place clips 1 to 6 in the clips folder.
    exit /b 1
)

set FILTER="[0:v][1:v]xfade=transition=fade:duration=0.25:offset=7.75[v01]; [v01][2:v]xfade=transition=fade:duration=0.25:offset=15.50[v02]; [v02][3:v]xfade=transition=fade:duration=0.25:offset=23.25[v03]; [v03][4:v]xfade=transition=fade:duration=0.25:offset=31.00[v04]; [v04][5:v]xfade=transition=fade:duration=0.25:offset=38.75[vjoined]; [vjoined]delogo=x=1740:y=990:w=160:h=70:show=0[vdelogo]; [vdelogo]colorlevels=rimin=0.045:gimin=0.045:bimin=0.045[vfinal]"

echo Rendering film_master.mp4...
ffmpeg -y -i clips\clip1.mp4 -i clips\clip2.mp4 -i clips\clip3.mp4 -i clips\clip4.mp4 -i clips\clip5.mp4 -i clips\clip6.mp4 -filter_complex %FILTER% -map "[vfinal]" -c:v libx264 -preset slow -crf 17 -pix_fmt yuv420p -an film_master.mp4

echo Encoding web versions...
ffmpeg -y -i film_master.mp4 -vf "scale=1280:-2" -c:v libx264 -preset veryfast -crf 27 -g 1 -an -pix_fmt yuv420p -movflags +faststart site\media\film.mp4
ffmpeg -y -i film_master.mp4 -vf "scale=854:-2" -c:v libx264 -preset veryfast -crf 28 -g 1 -an -pix_fmt yuv420p -movflags +faststart site\media\film_mobile.mp4
ffmpeg -y -ss 0.05 -i film_master.mp4 -vframes 1 -q:v 2 site\media\poster.jpg

copy site\media\film.mp4 media\film.mp4
copy site\media\film_mobile.mp4 media\film_mobile.mp4
copy site\media\poster.jpg media\poster.jpg

echo Film build complete!
