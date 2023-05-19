import RPi.GPIO as GPIO

import time



import tty

import sys

import termios



orig_settings = termios.tcgetattr(sys.stdin)

tty.setcbreak(sys.stdin)



GPIO.setmode(GPIO.BCM)

GPIO.setwarnings(False)

GPIO.setup(4,GPIO.OUT)

GPIO.output(4,GPIO.HIGH)



print('Press "l" to toggle LED on/off and "Esc" to exit program')



x = 0

flagExit = False

flagLedOn = False



while flagExit == False and (x != chr(27) or x!=chr(108)): # ESC

    x=sys.stdin.read(1)[0]    

    if(x==chr(27)):

        flagExit = True

    if(x==chr(108)):

        if flagLedOn:

            GPIO.output(4,GPIO.HIGH)

            print("LED toggled off")

            flagLedOn = False

        else:

            GPIO.output(4,GPIO.LOW)

            print("LED toggled on")

            flagLedOn = True





termios.tcsetattr(sys.stdin, termios.TCSADRAIN, orig_settings)    


