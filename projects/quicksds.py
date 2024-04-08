import ctypes
import os
try:
  import tkinter as tk
  import pyautogui
  import time
  from datetime import datetime
  import keyboard
except:
  os.system("pip install pyautogui keyboard --user")
  import keyboard


def DSDA():
  latestmousepositions = []
  pyautogui.keyDown('winleft')
  pyautogui.press('d')
  pyautogui.keyUp('winleft')
  root = tk.Tk()
  root.title("BP | SDS")
  root.overrideredirect(True)
  tk.Label(text="SDS engaged", width=20, height=3, font=('Arial', 30)).pack()
  timelabel = tk.Label(text="", width=20, height=3, font=("Arial", 30))
  timelabel.pack()
  root.lift()
  root.attributes("-topmost", True)
  while True:
    try:
      timelabel.config(text=datetime.now().strftime("%d/%m/%Y %H:%M:%S"))
      root.update()
      time.sleep(0.25)
      if keyboard.is_pressed("ctrl+alt+p"):
        root.destroy()
        return
      if keyboard.is_pressed("tab"):
        root.destroy()
        ctypes.windll.user32.LockWorkStation()
        return

      latestmousepositions.append(pyautogui.position())  #
      latestmousepositions = list(set(latestmousepositions))
      if len(latestmousepositions) != 1:
        root.destroy()
        ctypes.windll.user32.LockWorkStation()
        return
    except:
      pass


DSDA()