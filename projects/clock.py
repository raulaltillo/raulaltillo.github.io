import tkinter as tk
import datetime


def update():
  now = datetime.datetime.now()
  timeshow.config(text=now.strftime('%#I:%M:%S'))
  root.update()
  root.after(100, update)


root = tk.Tk()
timeshow = tk.Label(text="", width=20, height=3, font=('Arial', 100))
timeshow.pack()
update()
root.mainloop()
