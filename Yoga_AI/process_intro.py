
import os
import glob
import os
import glob
try:
    from moviepy.editor import VideoFileClip, AudioFileClip
except ImportError:
    try:
        from moviepy.video.io.VideoFileClip import VideoFileClip
        from moviepy.audio.io.AudioFileClip import AudioFileClip
    except ImportError:
        print("❌ MoviePy NOT installed correctly. Run: pip install moviepy")
        exit()

VIDEO_NAME = "intro.mp4"
EXCLUDED_AUDIO = ["Adiyogi The Source of Yog-320kbps.mp3"] # Main app music

def process_video():
    # 1. Locate Video
    if not os.path.exists(VIDEO_NAME):
        print(f"❌ Error: {VIDEO_NAME} not found in current directory.")
        return

    # 2. Locate Audio
    target_audio = "natural_intro.wav" # Explicitly use synthesized audio
    
    if not os.path.exists(target_audio):
        print("❌ Synthesized audio not found. Running generate_music.py...")
        import generate_music
        generate_music.generate_om_drone()
    
    print(f"🎵 Found Audio Source: {target_audio}")

    try:
        # 3. Process with MoviePy
        print(f"🎬 Loading {VIDEO_NAME}...")
        video = VideoFileClip(VIDEO_NAME)
        
        print(f"🔊 Loading Audio {target_audio}...")
        audio = AudioFileClip(target_audio)
        
        # 4. Trim Video to match Audio Length (from ending)
        # "Trim this video from the ending" -> keep start, cut end
        final_duration = min(video.duration, audio.duration)
        print(f"✂️ Trimming video to {final_duration:.2f}s (Audio Duration)")
        
        video = video.subclip(0, final_duration)
        video = video.set_audio(audio)
        
        # 5. Output
        output_name = "intro_v2.mp4"
        video.write_videofile(output_name, codec="libx264", audio_codec="aac")
        
        video.close()
        audio.close()
        
        # 6. Replace
        print("✅ Processing Complete.")
        
        # Backup old
        if os.path.exists("intro_backup.mp4"):
            os.remove("intro_backup.mp4")
        os.rename(VIDEO_NAME, "intro_backup.mp4")
        
        # Rename new
        os.rename(output_name, VIDEO_NAME)
        print(f"🚀 Replaced {VIDEO_NAME} with new version.")

    except Exception as e:
        print(f"❌ Processing Failed: {e}")

if __name__ == "__main__":
    process_video()
