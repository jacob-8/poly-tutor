- Tauri 2.0: https://beta.tauri.app/
- Example project with GitHub action to automatically create an APK release on every push https://github.com/beyond-ahqsoft/tauri-mobile - uses 2.0 alpha-5
- Simpler build GitHub action example: https://github.com/FQAlmeida/Banco-Horas-Metal/blob/main/.github/workflows/publish.yml
- updater-action: https://github.com/i-c-b/example-tauri-v2-updater-action/tree/master

# Creating signing key
https://github.com/r0adkll/sign-android-release

- Install Android Studio (side effect is having the Java SDK)
- Navigate to folder where the Java SDK keytool.exe is located. For me in `D:\Program Files\AndroidStudio\jbr\bin` and then run `.\keytool -genkeypair -v -keystore D:\path\to\your_keystore.jks -keyalg RSA -keysize 2048 -validity 10000 -alias your_alias` to generate a keystore file
- Then run `openssl base64 < your_keystore.jks | tr -d '\n' | tee your_keystore.jks.base64.txt` to get it as a string and save it to GitHub project secretes along with alias, keyStorePassword, keyPassword to project secrets
