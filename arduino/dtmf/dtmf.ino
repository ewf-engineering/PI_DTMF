//#include "RunningAverage.h"
//#include "RunningAverage.cpp"

/*=========================================================================================================
Setup digital pins to read logic from the DTMF circuit
========================================================================================================== */
void setup() {
 Serial.begin(9600);
 pinMode(3, INPUT);    //STD; Signal boolean
 pinMode(4, INPUT);    //Q4
 pinMode(5, INPUT);    //Q3
 pinMode(6, INPUT);    //Q2
 pinMode(7, INPUT);    //Q1
}
char tone_value;
bool signal;
int audioPin = 2;    // select the input pin for the potentiometer
int audio_val = 0;
int audio_print = 0;
int avg = 0;

long runningAverage(int M) {
  #define LM_SIZE 10
  static int LM[LM_SIZE];      // LastMeasurements
  static byte index = 0;
  static long sum = 0;
  static byte count = 0;

  // keep sum updated to improve speed.
  sum -= LM[index];
  LM[index] = M;
  sum += LM[index];
  index++;
  index = index % LM_SIZE;
  if (count < LM_SIZE) count++;

  return sum / count;
}

/*=========================================================================================================
Read the 5x1 array of log from the MT88700 and print the pressed key to the serial interface.
These serial outputs will be monitored by the rpi3 and output to the webserver. Ideally there will also
 be a 16x2 LCD screen to display the key presses live to the user.
========================================================================================================== */
void loop() {
 uint8_t number;
 signal = digitalRead(3);

 if(signal == HIGH)  /* If new pin pressed */
  {
   //delay(250);
   number = ( 0x00 | (digitalRead(7)<<0) | (digitalRead(6)<<1) | (digitalRead(5)<<2) | (digitalRead(4)<<3) );
     switch (number)
     {
       case 0x01:
       tone_value='1';
        break;
       case 0x02:
       tone_value='2';
        break;
       case 0x03:
       tone_value='3';
        break;
       case 0x04:
       tone_value='4';
        break;
       case 0x05:
       tone_value='5';
        break;
       case 0x06:
       tone_value='6';
        break;
       case 0x07:
       tone_value='7';
       break;
       case 0x08:
       tone_value='8';
       break;
       case 0x09:
       tone_value='9';
       break;
       case 0x0A:
       tone_value='0';
       break;
       case 0x0B:
       tone_value='*';
       break;
       case 0x0C:
       tone_value='#';
       break;
     }
 }// if SIGNAL=HIGH
audio_val = abs(analogRead(audioPin));   // read the value from the sensor
avg = runningAverage(audio_val);
audio_print = abs(audio_val - avg);

Serial.print(audio_print);Serial.print(',');
//Serial.print(avg);Serial.print(',');
//Serial.print(audio_val);Serial.print(',');
Serial.print(signal);Serial.print(',');
Serial.println(tone_value);
delay(50);
tone_value='0';
 // when characters arrive over the serial port...

 //if (Serial.available()) {
   // wait a bit for the entire message to arrive

   //delay(100);}
   // clear the screen

 }//void loop
