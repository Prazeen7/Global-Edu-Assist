```
# 🌍 Global Edu Assist

> A comprehensive web-based platform helping Nepali students make informed decisions about studying abroad by providing reliable, personalized guidance for eligibility assessment, financial planning, documentation guidance, and application tracking.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-4.4+-green.svg)
![Express](https://img.shields.io/badge/Express-4.18+-lightgrey.svg)
![React](https://img.shields.io/badge/React-18.2+-cyan.svg)
![Node](https://img.shields.io/badge/Node-16.x-green.svg)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Problem Statement](#problem-statement)
- [Aims & Objectives](#aims--objectives)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [User Roles](#user-roles)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## 🎯 Overview

**Global Edu Assist** is a platform designed to help Nepali students make informed decisions about studying abroad. It addresses the common issues of confusing information and biased agents by offering clear academic, financial, and documentation support through a centralized digital ecosystem.

### Key Highlights
- ✅ **Eligibility Assessment** - Academic score and financial criteria-based matching
- 💰 **Cost Estimation** - Transparent cost breakdown and scholarship information
- 📄 **Documentation Guidance** - Step-by-step document preparation with source department information
- 📊 **Progress Tracking** - Visual checklist with real-time application stage monitoring
- 💬 **Agent Connect** - Direct communication channel with verified agents
- 🏛️ **Institution Discovery** - Comprehensive university and course information

---

## ⚠️ Problem Statement

Nepali students face significant challenges when navigating the study abroad process:

| Issue | Impact |
|-------|--------|
| **Misinformation** | Confusing and conflicting information from various sources |
| **Biased Agents** | Profit-driven consultants making unrealistic promises |
| **Hidden Fees** | Non-refundable charges and unexpected costs |
| **Documentation Confusion** | Unclear requirements and source departments |
| **Lack of Transparency** | No clear visibility into application progress |
| **Eligibility Uncertainty** | Unclear academic and financial requirements |

> **Research Finding**: According to Susa Thieme (2017) and Dahal (2023), educational consultants in Nepal often employ exploitative practices including hidden fees, misleading marketing, and unregistered agency operations.

---

## 🎯 Aims & Objectives

1. **Simplify University Search** - Implement filters for academic scores, financial constraints, and locations
2. **Documentation Guidance** - Provide step-by-step document lists with source department information
3. **Cost Transparency** - Breakdown of application costs, fees, and scholarships
4. **Eligibility Assessment** - Academic and financial eligibility checking system
5. **Stage Tracking** - Visual progress indicators with checklist boxes
6. **Agent Management** - Registration, login, and information management for agents
7. **Admin Management** - Agent registration decisions and content management
8. **Post & Chat System** - Advertisement posting and real-time communication

---

## ✨ Key Features

### User Management System
- User Registration with eligibility check
- User Login
- Search institutions, courses, and agents
- View available locations
- Access fee information
- View entry requirements
- Check GS requirements

### University/Institution Management System
- Institution general information
- Courses offered
- Available locations
- Fee information
- Entry requirements

### Academic & Financial Eligibility Check System
- Academic criteria evaluation
- Financial criteria assessment
- Eligibility options display

### Documentation Guidance System
- Document lists
- Step-by-step document preparation guidance
- Document source departments information

### Cost Estimation System
- Cost parameters
- Cost breakdown
- Fee details & scholarships

### Progress Tracking System
- Progress tracking with visual indicators
- Checklist boxes
- Visual progress indicator
- Update information display

### Agent Management System
- Agent registration
- Agent login
- Agent information display
- Agent registration decision
- Agent information update decision
- Add/Remove/Edit contents

### Admin Management System
- Admin login
- Agent registration decision
- Agent information update decision
- Content management

### Post & Chat Management System
- Post advertisements
- Real-time chat system
- Advertisement management

---

## 🛠️ Tech Stack

### Backend
Runtime: Node.js
Framework: Express.js
Database: MongoDB (with Mongoose ODM)
Auth: JWT (JSON Web Tokens)
Email: Nodemailer


### Frontend
Framework: React.js
State: React Context API
Routing: React Router DOM
Styling: CSS Modules
HTTP Client: Axios
Charts: Recharts

### Development Tools
Version Control: Git
Package Manager: npm
Environment: dotenv
Global-Edu-Assist
├─ g-e-a
│  ├─ Backend
│  │  ├─ config
│  │  │  ├─ cloudinary.js
│  │  │  ├─ db.js
│  │  │  └─ multerConfig.js
│  │  ├─ controllers
│  │  │  ├─ agentAuthController.js
│  │  │  ├─ agentController.js
│  │  │  ├─ authController.js
│  │  │  ├─ chatController.js
│  │  │  ├─ documentController.js
│  │  │  ├─ institutionController.js
│  │  │  ├─ postController.js
│  │  │  ├─ progressController.js
│  │  │  ├─ superAdminController.js
│  │  │  └─ userController.js
│  │  ├─ index.js
│  │  ├─ middleware
│  │  │  └─ authMiddleware.js
│  │  ├─ Models
│  │  │  ├─ admin.js
│  │  │  ├─ agent.js
│  │  │  ├─ agents.js
│  │  │  ├─ chat.js
│  │  │  ├─ documents.js
│  │  │  ├─ institutions.js
│  │  │  ├─ like.js
│  │  │  ├─ post.js
│  │  │  ├─ progressTracking.js
│  │  │  └─ user.js
│  │  ├─ package-lock.json
│  │  ├─ package.json
│  │  ├─ routes
│  │  │  ├─ adminRoutes.js
│  │  │  ├─ agentRoutes.js
│  │  │  ├─ authRoutes.js
│  │  │  ├─ chatRoutes.js
│  │  │  ├─ documentRoutes.js
│  │  │  ├─ institutionRoutes.js
│  │  │  ├─ postRoutes.js
│  │  │  ├─ progressRoutes.js
│  │  │  └─ userRoutes.js
│  │  ├─ services
│  │  │  └─ emailService.js
│  │  └─ START_SERVER.md
│  └─ Frontend
│     ├─ index.html
│     ├─ package-lock.json
│     ├─ package.json
│     ├─ project_structure.text
│     ├─ public
│     │  └─ Logo.png
│     ├─ README.md
│     └─ src
│        ├─ App.css
│        ├─ App.jsx
│        ├─ App.test.jsx
│        ├─ components
│        │  ├─ AccountMenu.jsx
│        │  ├─ Admin
│        │  │  ├─ AddInstitutions.jsx
│        │  │  ├─ DocumentForm.jsx
│        │  │  ├─ OverviewChart.jsx
│        │  │  ├─ PageHeader.jsx
│        │  │  ├─ Sidebar.jsx
│        │  │  ├─ StatCard.jsx
│        │  │  └─ SuperAdminMenu.jsx
│        │  ├─ Agents
│        │  │  ├─ PostSystem.jsx
│        │  │  └─ ProfileMenu.jsx
│        │  ├─ AllDocumentsChecklist.jsx
│        │  ├─ Calculation.jsx
│        │  ├─ ChatSystem.jsx
│        │  ├─ Estimation.jsx
│        │  ├─ Footer.css
│        │  ├─ Footer.jsx
│        │  ├─ Loading.jsx
│        │  ├─ NavBar.css
│        │  ├─ NavBar.jsx
│        │  ├─ ProctectedRoute
│        │  │  ├─ AuthRoute.jsx
│        │  │  └─ ProtectedRoute.jsx
│        │  ├─ ProgramCard.jsx
│        │  ├─ ProgressTracking.jsx
│        │  ├─ Report.jsx
│        │  ├─ SearchBar.jsx
│        │  ├─ stages
│        │  │  ├─ COEStage.jsx
│        │  │  ├─ GSStage.jsx
│        │  │  ├─ OfferStage.jsx
│        │  │  └─ VisaStage.jsx
│        │  ├─ TabPanel.jsx
│        │  └─ verify.jsx
│        ├─ Context
│        │  ├─ AuthContext.jsx
│        │  └─ context.jsx
│        ├─ images
│        │  ├─ BestFit.png
│        │  ├─ financial.jpg
│        │  ├─ Financial.png
│        │  ├─ ham.png
│        │  ├─ Institutions
│        │  │  └─ ACU
│        │  │     ├─ ACU.png
│        │  │     ├─ Ballarat.jpg
│        │  │     ├─ Blacktown.jpg
│        │  │     ├─ Brisbane.jpg
│        │  │     ├─ Canberra.jpg
│        │  │     ├─ Melbourne.jpg
│        │  │     ├─ North Sydney.jpg
│        │  │     └─ Strathfield.jpg
│        │  ├─ LandingPageBG.png
│        │  ├─ Logo.png
│        │  ├─ offerLette.png
│        │  ├─ offerLetter.jpg
│        │  └─ thingsToConsider.png
│        ├─ index.css
│        ├─ layouts
│        │  └─ Admin
│        │     └─ DashboardLayout.jsx
│        ├─ main.jsx
│        ├─ Pages
│        │  ├─ About
│        │  │  └─ About.jsx
│        │  ├─ Admin
│        │  │  ├─ Agents.jsx
│        │  │  ├─ Dashboard.jsx
│        │  │  ├─ Documents.jsx
│        │  │  ├─ ForgotPassword.jsx
│        │  │  ├─ InstitutionPage.jsx
│        │  │  ├─ Institutions.jsx
│        │  │  ├─ Login.jsx
│        │  │  └─ ManageAdmins.jsx
│        │  ├─ Agents
│        │  │  ├─ Agents.jsx
│        │  │  ├─ Dashboard
│        │  │  │  └─ Dashboard.jsx
│        │  │  ├─ Login
│        │  │  │  ├─ ForgotPassword.jsx
│        │  │  │  └─ Login.jsx
│        │  │  ├─ Registration
│        │  │  │  └─ Registration.jsx
│        │  │  └─ Resubmit.jsx
│        │  ├─ Documents
│        │  │  ├─ Documents.css
│        │  │  └─ Documents.jsx
│        │  ├─ Institutions
│        │  │  ├─ InstitutionPage.jsx
│        │  │  ├─ institutions.css
│        │  │  └─ Institutions.jsx
│        │  ├─ LandingPage
│        │  │  ├─ LandingPage.css
│        │  │  └─ LandingPage.jsx
│        │  ├─ Login
│        │  │  ├─ ForgotPassword.jsx
│        │  │  └─ Login.jsx
│        │  ├─ profile.jsx
│        │  ├─ Programs
│        │  │  └─ Programs.jsx
│        │  └─ Signup
│        │     └─ Signup.jsx
│        ├─ reportWebVitals.jsx
│        ├─ setupTests.jsx
│        └─ utils
│           ├─ authService.jsx
│           ├─ axiosConfig.jsx
│           ├─ imageUtils.js
│           ├─ parseJwt.jsx
│           └─ utils.jsx
└─ README.md
```
