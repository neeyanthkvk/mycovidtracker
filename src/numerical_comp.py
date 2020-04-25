import os
import sys
import numpy as np
import warnings

with warnings.catch_warnings():
    warnings.filterwarnings("ignore")
    import librosa

filepath1 = sys.argv[1]
filepath2 = sys.argv[2]

# print("filepath1: " + filepath1)
# print("filepath2: " + filepath2)

wf_base, sr_base = librosa.load(filepath1)
wf_test, sr_test = librosa.load(filepath2)

#print(wf_base.size)
#print(wf_test[:wf_base.size].size)


wf_diff = (wf_base[:min(wf_base.size, wf_test.size)] - wf_test[:min(wf_base.size, wf_test.size)])

raw = np.average(wf_diff)
base = (np.average(wf_base[:min(wf_base.size, wf_test.size)]) + np.average(wf_test[:min(wf_base.size, wf_test.size)])) / 2

print(abs(raw/base))
