
import numpy as np
from scipy.io.wavfile import write

def generate_om_drone(duration=10, sample_rate=44100):
    t = np.linspace(0, duration, int(sample_rate * duration))
    
    # 1. Base frequencies for "OM" (C# approx 136.1 Hz - Earth Year Tone)
    base_freq = 136.1
    
    # Generate layers of sine waves
    layer1 = 0.5 * np.sin(2 * np.pi * base_freq * t)
    layer2 = 0.3 * np.sin(2 * np.pi * (base_freq * 2) * t) # Octave up
    layer3 = 0.2 * np.sin(2 * np.pi * (base_freq * 1.5) * t) # Fifth
    
    # Add slow modulation (LFO) to creating "breathing" effect
    lfo = 0.8 + 0.2 * np.sin(2 * np.pi * 0.2 * t) 
    
    combined = (layer1 + layer2 + layer3) * lfo
    
    # Add soft pink noise for texture
    noise = np.random.normal(0, 0.05, len(t))
    
    final_wave = combined + noise
    
    # Normalize to 16-bit range
    final_wave = final_wave / np.max(np.abs(final_wave))
    audio_data = (final_wave * 32767).astype(np.int16)
    
    return audio_data

if __name__ == "__main__":
    print("🎵 Synthesizing 'Natural Om Drone'...")
    audio = generate_om_drone(duration=12) # Slightly longer than video usually
    output_file = "natural_intro.wav"
    write(output_file, 44100, audio)
    print(f"✅ Generated: {output_file}")
