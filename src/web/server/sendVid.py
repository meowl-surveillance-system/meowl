import sys

fname = "./Test.mp4"
with open(fname, "rb") as fin:
    print(fin.read())
sys.stdout.flush()