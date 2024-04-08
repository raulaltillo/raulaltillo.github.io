import os
try:
  import qrcode
except:
  os.system("pip install qrcode")
  import qrcode

qrcode.main.make(input("Text: ").replace("\n", "")).show()
input("You can now close this window")
