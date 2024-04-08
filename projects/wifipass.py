import os, time

separator = "------------"


def start():
  os.system("netsh wlan show profile")
  print("NETWORK NAME TO CRACK")
  os.system('netsh wlan show profile name="' + input() + '" key=clear')
  start()


start()