# Security Policy

## Supported Versions

Currently, we support the following versions of BharatVote:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability within this project, please send an e-mail to security@bharatvote.in (placeholder). All security vulnerabilities will be promptly addressed.

## Database Security (Firestore)

This project uses Firebase Firestore. For production deployment, ensure the following rules are applied in your Firebase Console to prevent unauthorized data access:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /registrations/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /{document=**} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

## AI Content Security

BharatVote uses Google Gemini AI for the "Chunav Mitra" assistant. We implement safety filters to prevent:
- Harassment
- Hate Speech
- Sexually Explicit Content
- Dangerous Content

Users are encouraged to verify AI-generated information with official sources at [eci.gov.in](https://eci.gov.in).
