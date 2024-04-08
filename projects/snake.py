import os
for package in ["pygame", "tempfile", "requests"]:
    try:
        globals()[package] = __import__(package)
    except:
        print(f"[INFO] {package} not found, installing with user privileges")
        os.system(f"pip install {package} --user")
        globals()[package] = __import__(package)
import tkinter as tk
import math, os, random
import time, requests, winsound
import tempfile, threading

try:
    for sound in ["dash", "eat", "loose", "stopdash"]:
        globals()[f"_audio{sound}"] = requests.get(f"https://github.com/Bin-Ban/sounds/raw/main/{sound}.wav").content
        wifion = True
    soundplayeron = True
except Exception as e:
    print(e)
    wifion = False
os.environ['SDL_VIDEO_WINDOW_POS'] = '0,30'
# Window dimensions
win_width = 800
win_height = 800
reverseddirections = {"UP": "DOWN", "DOWN": "UP", "LEFT": "RIGHT", "RIGHT": "LEFT"}
# Colors
white = (255, 255, 255)
red = (255, 0, 0)
green = (0, 255, 0)
black = (0, 0, 0)
# Initializing Pygame
pygame.init()

# Creating the screen
screen = pygame.display.set_mode((win_width, win_height))
# Setting the caption
pygame.display.set_caption("Snake?")

# FPS (frames per second) controller
clock = pygame.time.Clock()

# Defining the snake and its initial position
snake_pos = [[100, 50]]
snake_speed = 15
direction = 'RIGHT'
change_to = direction

# Defining the food and its initial position
food_pos = [random.randrange(5, win_width // 10) * 10, random.randrange(5, win_height // 10) * 10]
food_spawn = True
zen = False
tpborder = True
borderchange = True
# Score
score = 0

# Game Over text
font = pygame.font.Font('freesansbold.ttf', 32)
game_over_text = font.render('Game Over', True, red)


def playsound(soname):
    if wifion:
        def play_sound():
            # Create a temporary file
            fd, path = tempfile.mkstemp(suffix=".wav")
            try:
                # Write the byte data to the file
                with os.fdopen(fd, 'wb') as tmp:
                    tmp.write(globals()[f"_audio{soname}"])
                # Play the sound
                winsound.PlaySound(path, winsound.SND_FILENAME)
            finally:
                # Delete the temporary file
                os.remove(path)

        # Start a new thread to play the sound
        threading.Thread(target=play_sound).start()


def our_snake(snake_pos, dash):
    colors = [(0, 255, 0), (0, 123, 0)] if not dash else [(0, 0, 255), (0, 0, 123)]
    count = 0
    for pos in snake_pos:
        count += 1
        if count == 1:
            pygame.draw.rect(screen, (255, 255, 255), pygame.Rect(pos[0], pos[1], 10, 10))
            continue
        pygame.draw.rect(screen, colors[0] if count % 2 == 0 else colors[1], pygame.Rect(pos[0], pos[1], 10, 10))


def gameLoop():
    global win_width, win_height, snake_speed
    global direction, change_to, score, snake_pos, food_pos, food_spawn
    pastspeed = 0
    game_over = False
    dashon = False
    while not game_over:
        for event in pygame.event.get():
            if event.type == pygame.VIDEORESIZE:
                win_width = event.w
                win_height = event.h
                food_pos = [random.randrange(5, win_width // 10) * 10, random.randrange(5, win_height // 10) * 10]
                if snake_pos[0][0] >= win_width or snake_pos[0][0] < 0:
                    snake_pos[0] = [win_width // 2, snake_pos[0][1]]
                if snake_pos[0][1] >= win_height or snake_pos[0][1] < 0:
                    snake_pos[0] = [snake_pos[0][0], win_height // 2]
            if event.type == pygame.QUIT:
                game_over = True
                break
            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_UP:
                    change_to = 'UP'
                if event.key == pygame.K_DOWN:
                    change_to = 'DOWN'
                if event.key == pygame.K_LEFT:
                    change_to = 'LEFT'
                if event.key == pygame.K_RIGHT:
                    change_to = 'RIGHT'
                if event.key == pygame.K_SPACE:
                    pastspeed = snake_speed
                    snake_speed = snake_speed + round(snake_speed / 2)
                    playsound("dash")
                    dashon = True
                if event.key == pygame.K_ESCAPE:
                    root = tk.Tk()
                    tk.Label(text=f"Your score:\n{score}", font=("Helvica", 25)).pack()
                    zenbox = tk.Checkbutton(text="Zen mode", font=("Helvica", 50),
                                            command=lambda: togglevar("zen"))
                    if zen:
                        zenbox.select()
                    zenbox.pack()
                    borderbox = tk.Checkbutton(text="Tping borders", font=("Helvica", 50),
                                               command=lambda: togglevar("tpborder"))
                    borderbox.pack()
                    if tpborder:
                        borderbox.select()
                        changebox = tk.Checkbutton(text="Size Change", font=("Helvica", 50),
                                                   command=lambda: togglevar("borderchange"))
                        if borderchange:
                            changebox.select()
                        changebox.pack()
                    root.bind('<Escape>', lambda x:root.destroy())
                    root.mainloop()
            if event.type == pygame.KEYUP:
                if event.key == pygame.K_SPACE:
                    playsound("stopdash")
                    snake_speed = pastspeed
                    dashon = False

        if change_to == 'UP' and direction != 'DOWN':
            direction = 'UP'
        if change_to == 'DOWN' and direction != 'UP':
            direction = 'DOWN'
        if change_to == 'LEFT' and direction != 'RIGHT':
            direction = 'LEFT'
        if change_to == 'RIGHT' and direction != 'LEFT':
            direction = 'RIGHT'

        if direction == 'UP':
            snake_pos.insert(0, [snake_pos[0][0], snake_pos[0][1] - 10])
        if direction == 'DOWN':
            snake_pos.insert(0, [snake_pos[0][0], snake_pos[0][1] + 10])
        if direction == 'LEFT':
            snake_pos.insert(0, [snake_pos[0][0] - 10, snake_pos[0][1]])
        if direction == 'RIGHT':
            snake_pos.insert(0, [snake_pos[0][0] + 10, snake_pos[0][1]])
        if food_pos[0] > win_width:
            food_spawn = False
        if food_pos[1] > win_height:
            food_spawn = False
        if math.isclose(snake_pos[0][0], food_pos[0], abs_tol=25 if dashon else 10) and math.isclose(snake_pos[0][1],
                                                                                                     food_pos[1],
                                                                                                     abs_tol=25 if dashon else 10):
            score += 1
            snake_speed += 5 if dashon else 1
            pastspeed += 1
            playsound("eat")
            food_spawn = False
        else:
            snake_pos.pop()

        if not food_spawn:
            food_pos = [random.randrange(5, win_width // 10) * 10, random.randrange(5, win_height // 10) * 10]
        food_spawn = True
        screen.fill(black)
        our_snake(snake_pos, dashon)
        pygame.draw.rect(screen, red, pygame.Rect(food_pos[0], food_pos[1], 10, 10))

        # Game over conditions
        if tpborder:
            if snake_pos[0][0] >= win_width:
                snake_pos[0][0] = 0
                if borderchange:
                    pygame.display.set_mode((win_width + score, win_height))
                    win_width = pygame.display.get_window_size()[0]
            if snake_pos[0][0] < 0:
                snake_pos[0][0] = win_width - (score if borderchange else 0)
                if borderchange:
                    pygame.display.set_mode((win_width - score, win_height))
                    win_width = pygame.display.get_window_size()[0]
            if snake_pos[0][1] >= win_height:
                snake_pos[0][1] = 0
                if borderchange:
                    pygame.display.set_mode((win_width, win_height + score))
                    win_height = pygame.display.get_window_size()[1]
            if snake_pos[0][1] < 0:
                snake_pos[0][1] = win_height - (score if borderchange else 0)
                if borderchange:
                    pygame.display.set_mode((win_width, win_height - score))
                    win_height = pygame.display.get_window_size()[1]
        else:
            if snake_pos[0][0] >= win_width or snake_pos[0][0] < 0 or snake_pos[0][1] >= win_height or snake_pos[0][
                1] < 0:
                game_over = True
                break

        if not zen:
            for block in snake_pos[1:]:
                if snake_pos[0] == block:
                    game_over = True
                    break

        pygame.display.update()
        clock.tick(snake_speed)
    textRect = game_over_text.get_rect()
    textRect.center = (win_width // 2 - 16, win_height // 2 - 16)
    screen.blit(game_over_text, textRect)
    pygame.display.update()
    playsound("loose")
    time.sleep(2)
    pygame.quit()
    quit()


def togglevar(vari):
    if globals()[vari]:
        globals()[vari] = False
    else:
        globals()[vari] = True


gameLoop()
