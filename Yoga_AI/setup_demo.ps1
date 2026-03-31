# Setup Demo Environment for Round 3

# 1. Open the Submission Folder (To show the ZIP/Architecture)
Invoke-Item "C:\Users\ASUS\OneDrive\Desktop\Yoga_AI\Round2_Submission IIT BHU"

# 2. Open a new Terminal window ready to run the App (The "Working Prototype")
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'C:\Users\ASUS\OneDrive\Desktop\Yoga_AI\yoga-ai-web'; Clear-Host; Write-Host 'Ready to run Yoga AI... Type: python yogi.py' -ForegroundColor Green"

Write-Host "Demo Environment Ready!" -ForegroundColor Cyan
Write-Host "1. Submission Folder is open."
Write-Host "2. Terminal is ready for yogi.py."
