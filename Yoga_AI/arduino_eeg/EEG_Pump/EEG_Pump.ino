#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <SoftwareSerial.h>

LiquidCrystal_I2C lcd(0x27, 16, 2);
SoftwareSerial sim800(2, 3);

int button = A0;
String number = "+917355757326";

unsigned long previousMillis = 0;
int animationFrame = 0;
int breachFrame = 0; 

int previousDoorState = HIGH; 
bool systemBooted = false;
bool isBreached = false;

void setup()
{
  delay(1000); 
  
  pinMode(button, INPUT_PULLUP);

  // 🔥 ANTI-FREEZE PROTECTION 🔥
  Wire.begin();
  Wire.setWireTimeout(3000, true); 

  lcd.init();
  lcd.backlight();
  lcd.clear();

  sim800.begin(9600);
  Serial.begin(9600);

  bootAnimation();

  previousDoorState = digitalRead(button);
  systemBooted = true;
}

void loop()
{
  int currentDoorState = digitalRead(button);
  
  // --------------------------------------------------------------------------
  // ALARM TRIGGER LOGIC
  // --------------------------------------------------------------------------
  if (currentDoorState == HIGH && previousDoorState == LOW && systemBooted)
  {
    delay(500); // Let solenoid spike pass
    
    // 🔧 FIX: lcd.clear() is not enough! We must completely re-initialize 
    // the LCD to resync the 4-bit mode after the EMI spike corrupts it.
    Wire.begin();
    lcd.init();
    lcd.backlight();
    lcd.clear();
    
    securityAlert(); 
    sendSMS();       
    makeCall();      
    
    isBreached = true; 
    lcd.clear();    
  }
  
  // SYSTEM RESET (Door closed back to Safe)
  if (currentDoorState == LOW && previousDoorState == HIGH && systemBooted)
  {
    delay(500); // Let solenoid spike pass
    
    // 🔧 FIX: Re-initialize here as well when the door closes
    Wire.begin();
    lcd.init();
    lcd.backlight();
    lcd.clear();
    
    isBreached = false; 
  }

  // --------------------------------------------------------------------------
  // CONTINUOUS ANIMATION LOGIC
  // --------------------------------------------------------------------------
  if (isBreached)
  {
    breachedContinuousScreen(); 
  }
  else
  {
    safeContinuousScreen(); 
  }

  previousDoorState = currentDoorState;
}

void bootAnimation()
{
  lcd.setCursor(3, 0);
  lcd.print("ARGUS");

  lcd.setCursor(1, 1);
  lcd.print("Initializing");

  for (int i = 0; i < 16; i++)
  {
    lcd.setCursor(i, 1);
    lcd.write(255); 
    delay(80);
  }

  delay(1000);
  lcd.clear();

  lcd.setCursor(2, 0);
  lcd.print("ANTI THEFT");

  lcd.setCursor(3, 1);
  lcd.print("SYSTEM");

  delay(2000);
  lcd.clear();
}

void safeContinuousScreen()
{
  unsigned long currentMillis = millis();

  if (currentMillis - previousMillis >= 2500)
  {
    previousMillis = currentMillis;
    animationFrame++;

    if (animationFrame % 3 == 0)
    {
      lcd.setCursor(0, 0);
      lcd.print(" HI! I AM ARGUS ");
      lcd.setCursor(0, 1);
      lcd.print(" SYSTEM SECURE  ");
    }
    else if (animationFrame % 3 == 1)
    {
      lcd.setCursor(0, 0);
      lcd.print(" CURRENTLY DOOR ");
      lcd.setCursor(0, 1);
      lcd.print("   IS OPEN    ");
    }
    else
    {
      lcd.setCursor(0, 0);
      lcd.print("   NO THREAT    ");
      lcd.setCursor(0, 1);
      lcd.print("    OBSERVED    ");
    }
  }
}

// --------------------------------------------------------------------------
// 🔥 SUPER-CHARGED BREACH ANIMATIONS 🔥
// --------------------------------------------------------------------------
void breachedContinuousScreen()
{
  unsigned long currentMillis = millis();

  // Flash super fast every 0.6 seconds!
  if (currentMillis - previousMillis >= 600)
  {
    previousMillis = currentMillis;
    breachFrame++;

    if (breachFrame >= 6) {
      breachFrame = 0;
    }

    switch(breachFrame) {
      case 0:
        lcd.setCursor(0, 0);
        lcd.print(" !! THREAT !!   ");
        lcd.setCursor(0, 1);
        lcd.print("[POLICE ALERTED]");
        break;
      case 1:
        lcd.setCursor(0, 0);
        lcd.print(" >> BREACH <<   ");
        lcd.setCursor(0, 1);
        lcd.print("SYSTEM SECURING ");
        break;
      case 2:
        lcd.setCursor(0, 0);
        lcd.print("! ACCESS DENIED!");
        lcd.setCursor(0, 1);
        lcd.print("! EVACUATE NOW !");
        break;
      case 3:
        lcd.setCursor(0, 0);
        lcd.print(" >> TARGETING <<");
        lcd.setCursor(0, 1);
        lcd.print(" >> TARGETING <<");
        break;
      case 4:
        lcd.setCursor(0, 0);
        lcd.print("  !! THREAT !!  ");
        lcd.setCursor(0, 1);
        lcd.print("ALARM ACTIVE... ");
        break;
      case 5:
        lcd.setCursor(0, 0);
        lcd.print("[POLICE ALERTED]");
        lcd.setCursor(0, 1);
        lcd.print("[POLICE ALERTED]");
        break;
    }
  }
}

void securityAlert()
{
  lcd.setCursor(0, 0);
  lcd.print("THREAT DETECTED "); 
  lcd.setCursor(0, 1);
  lcd.print("  DOOR LOCKED!  "); 
  delay(2500);

  lcd.setCursor(0, 0);
  lcd.print(" Calling POLICE!"); 
  lcd.setCursor(0, 1);
  lcd.print(" Sending SMS... "); 
  delay(2000);
}

void sendSMS()
{
  sim800.println("AT");
  delay(1000);
  sim800.println("AT+CMGF=1");
  delay(1000);
  sim800.print("AT+CMGS=\"");
  sim800.print(number);
  sim800.println("\"");
  delay(1000);
  sim800.print("Hi, I am ARGUS. I have detected a Cyber Crime or Robbery attempt. The door has been locked.");
  delay(500);
  sim800.write(26);
  delay(10000);
}

void makeCall()
{
  sim800.print("ATD");
  sim800.print(number);
  sim800.println(";");
  delay(20000);
  sim800.println("ATH");
}
