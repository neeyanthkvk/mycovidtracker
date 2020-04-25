import os
import sys

filepath1 = sys.argv[1]
filepath2 = sys.argv[2]
#os.system("ffmpeg -i" +  filepath1 + " -vn -acodec pcm_s16le -ar 44100 -ac 2 output.wav")
os.system("sox " + filepath1 + " -n spectrogram -o sound-original.png")
os.system("sox " + filepath2 + " -n spectrogram -o sound-new.png")

os.system("sox -m -v 1 " + filepath1 +" -v -1 " + filepath2 + " sound-difference.wav")

os.system("sox sound-difference.wav -n spectrogram -o sound-difference.png")

print("comp_voice.py finished")
