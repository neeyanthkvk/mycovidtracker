import os
import sys

filepath1 = sys.argv[1]
#filepath2 = sys.argv[2]
#os.system("ffmpeg -i" +  filepath1 + " -vn -acodec pcm_s16le -ar 44100 -ac 2 output.wav")
os.system("sox output.wav -n spectrogram -o sound-original.png")

