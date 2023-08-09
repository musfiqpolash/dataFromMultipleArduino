# Data From Multiple Arduino
This is a Nodejs application to detect and connect multiple arduino connected to a PC

# Installation
Clone this application from git hub [dataFromMultipleArduino](http://github.com/musfiqpolash/dataFromMultipleArduino)  
> `git clone http://github.com/musfiqpolash/dataFromMultipleArduino`  

Then run 
> `npm ce`  

which requires [Nodejs](https://nodejs.org/de/download) to be isntalled in the machine

# Arduino Code
Example arduino code can be found in **resources/arduinoSketch/multi** folder  
The required library to run the code is [ArduinoJson](https://arduinojson.org/v6/doc/installation/)

# Linux
For linux OS copy **99-arduino.rules** form **resources** folder to **/etc/udev/rules.d/** folder in the OS