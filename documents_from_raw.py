import re

with open("raw.txt") as f:
    s = f.read()

l = re.compile("\n(?=[0-9].)").split(s)
print(len(l))

f = open("documents.txt", "a")
f.write(str(l))
f.close()
