sox $1 -n spectrogram -o $3
sox $2 -n spectrogram -o $4

sox -m -v 1 $1 -v -1 $2 $5

sox $5 -n spectrogram -o $6
