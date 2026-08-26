# ELEMENTAL Download Website

Site static pentru publicarea jocului ELEMENTAL pe Windows, Android și iOS.

## Structură

- index.html
- styles.css
- app.js
- assets/favicon.svg
- downloads/
  - ELEMENTAL-Windows.zip
  - ELEMENTAL-Android.apk

Fișierele Windows și Android nu sunt incluse încă. Trebuie înlocuite cu build-urile finale.

## iOS

Pentru utilizatorii obișnuiți de iPhone/iPad, distribuția trebuie făcută prin TestFlight sau App Store.

După ce ai o invitație publică TestFlight:

1. Deschide `app.js`.
2. Modifică:

```js
const ELEMENTAL_TESTFLIGHT_URL = "https://testflight.apple.com/...";
```

## Test local

Poți deschide direct `index.html`.

Mai bine, din folderul site-ului:

```powershell
python -m http.server 8080
```

Apoi deschide:

http://localhost:8080

## Publicare gratuită

Fiind un site static, îl poți publica pe servicii precum:
- GitHub Pages
- Cloudflare Pages
- Netlify
- Vercel

Pentru fișiere mari de joc, este posibil să fie mai potrivit să ții build-urile într-un release/storage separat și să modifici butoanele de download cu linkurile respective.

## Ce mai trebuie înainte de lansare

1. Windows release build.
2. Android APK/AAB release build.
3. iOS TestFlight/App Store build semnat.
4. Înlocuirea linkurilor/fișierelor placeholder.
5. Domeniu propriu opțional.
