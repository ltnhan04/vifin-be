# ViFin: Finance Assist ✨
> Your Smart Financial Companion 📱💰

![Version](https://img.shields.io/badge/version-1.0.1-blue)
![Platform](https://img.shields.io/badge/platform-Android-green)
![Firebase](https://img.shields.io/badge/backend-Firebase-orange)

## 🎯 Overview

<div align="center">
  <img src="docs/images/logo_vifin.png" alt="ViFin Logo" width="200"/>
</div>

ViFin revolutionizes personal finance management with AI-powered features and intuitive design. Transform your receipts into insights, track expenses effortlessly, and make smarter financial decisions.

## ⚡ Core Features

### 📝 Transaction Management
- 💳 **Multi-wallet Support** - Manage multiple wallets
- 🔍 **Smart Filtering** - Filter transactions by type (income/expense) and wallet
- 📋 **Recent Activities** - Track your latest financial movements at a glance

### 🧾 Smart Receipt Processing
- 🔍 **AI-Powered OCR** - Extract data from receipts automatically
- 🤖 **Smart Categorization** - Auto-classify expenses using AI
- 🎙️ **Voice Input** - Add transactions through voice commands

### 💰 Budget Control
- 📅 **Budget Planning** - Set budgets by category
- 🔄 **Auto Renewal** - Automatic budget reset based on repeat type (custom/weekly/monthly/yearly)
- ⚡ **Spending Limits** - Track and manage spending thresholds
- 📊 **Target Progress** - Visual tracking of budget utilization
- 🔔 **Smart Alerts** - Automated notifications for budget limits and renewals

### 📊 Financial Analytics
- 📈 **Time-based Analysis** - Track transactions by weekly/monthly/yearly periods
- 💹 **Income vs Expense** - Compare financial flows across different timeframes
- 👛 **Wallet Performance** - Monitor transactions by wallet and transaction type


## 🛠️ Technology Stack

### 📱 Mobile App
<div align="center">
  <img src="https://skillicons.dev/icons?i=react,ts,redux,tailwind,firebase,babel,jest,androidstudio,githubactions,linux,ubuntu" alt="Frontend Core" />
</div>

```javascript
{
  "frontend": {
    "core": ["React Native", "Expo SDK 52"],
    "state": ["Redux Toolkit", "RTK Query"],
    "ui": ["NativeWind", "React Native Paper"],
    "forms": ["React Hook Form", "Zod"],
    "auth": ["Firebase Authentication", "Google Sign-In"],
    "ml": ["Firebase ML Kit"],
    "testing": ["Jest", "React Native Testing Library"],
    "environment": ["Ubuntu 24.04.1 LTS"]
  }
}
```

### ⚙️ Backend Services
<div align="center">
  <img src="https://skillicons.dev/icons?i=nodejs,express,firebase,jest,gcp,postman,linux,ubuntu" alt="Backend Core" />
</div>

```javascript
{
  "backend": {
    "infrastructure": ["Firebase Cloud Functions", "Express.js"],
    "ai": ["Google Generative AI", "Google Speech-to-Text"],
    "storage": ["Firestore", "Firebase Storage"],
    "notifications": ["Expo Push Notifications"],
    "testing": ["Jest"],
    "environment": ["Ubuntu 24.04.1 LTS"]
  }
}
```

## 🚀 Deployment Architecture

### 📲 Mobile Pipeline
- **Build:** EAS (Expo Application Services)
- **CI/CD:** GitHub Actions
- **Distribution:** Google Play Store
- **Environments:** Development → Staging → Production

#### EAS CI/CD Pipeline
<div align="center">
  <img src="docs/images/eas-pipeline-updated.png" alt="EAS CI/CD Pipeline" width="800"/>
</div>

### 🔧 Backend Pipeline
- **Platform:** Firebase Cloud Functions
- **Scaling:** Auto-scaling with Firebase
- **Monitoring:** Firebase Console Analytics

## 🎬 Experience The Future of Finance

### ✨ App Overview
<div align="center">
  <video width="280" height="600" controls>
    <source src="docs/demo/app_overview.webm" type="video/webm">
  </video>
</div>

### 🤖 Smart Receipt Processing
<div align="center">
  <h4>System Architecture</h4>
  <img src="docs/images/invoice-flow-final.png" alt="Invoice Classification Flow" width="800"/>
  
  <h4>Live Demo</h4>
  <video width="280" height="600" controls>
    <source src="docs/demo/ocr_flow.webm" type="video/webm">
  </video>
</div>

### 🎙️ Voice Input & Notifications
<div align="center">
  <video width="280" height="600" controls>
    <source src="docs/demo/voice&alert.mp4" type="video/mp4">
  </video>
</div>

---

## 📱 Download APK
```bash
# Android APK (version 1.0.1)
docs/build/application-ab9f3c79-a7e4-44b4-a467-5818497d4731.apk
```

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.


