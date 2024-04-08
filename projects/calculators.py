import tkinter as tk
try:
  import pyperclip
except:
  import os
  os.system("pip install pyperclip")
  import pyperclip

root = tk.Tk()
numofcalcs = 5
past, current = [], []


def copyr(entrynum):
  pyperclip.copy(globals()[f"label{entrynum}"].cget("text").replace(
    "Result: ", ""))


def update():
  global past, current
  current = []
  for i in range(numofcalcs):
    current.append(globals()[f'entry{i}'].get())
  if current != past:
    for i in range(numofcalcs):
      if current[i] != past[i]:
        try:
          result = eval(globals()[f"entry{i}"].get())
        except:
          globals()[f'label{i}'].config(text=f'Result: 0')
          break
        if type(result) == int or type(result) == float:
          globals()[f'label{i}'].config(text=f'Result: {result}')
        else:
          globals()[f'label{i}'].config(text=f'Result: 0\n')
  past = current
  root.update()


for i in range(numofcalcs):
  globals()[f'entry{i}'] = tk.Entry(font=('Helvica', 20))
  globals()[f'entry{i}'].pack()
  past.append(globals()[f'entry{i}'].get())
  globals()[f'label{i}'] = tk.Label(text='Result: 0', font=('Helvica', 20))
  globals()[f'label{i}'].pack()
  globals()[f'copier{i}'] = tk.Button(text='Copy',
                                      font=('Helvica', 10),
                                      command=lambda i=i: copyr(i))
  globals()[f'copier{i}'].pack()
  tk.Label(text="", font=('Helvica', 20)).pack()

root.lift()

while True:
  update()