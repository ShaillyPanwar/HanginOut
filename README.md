# HanginOut 🎯

> **Student-Focused Affordable Hangout Discovery and Collaborative Group Matching Platform**  
> *"Making memories shouldn't cost ₹1000."*

HanginOut is a web platform designed to eliminate social decision fatigue and financial friction for students and friend groups. Using an intuitive Hinge/Tinder-style swipe deck, users discover curated free and budget-friendly activities. Groups can swipe collaboratively in private sessions, with our matching engine calculating unanimous and high-consensus hangout destinations with instant plan generation.

---

## 🛠️ Tech Stack

| Domain | Technology |
|---|---|
| **Frontend** | React 18 (Vite), Tailwind CSS, Framer Motion, Axios, React Router DOM, Canvas Confetti |
| **Backend** | Java 17, Spring Boot 3.3, Spring Web, Spring Security, Spring Data JPA |
| **Persistence** | PostgreSQL (Neon Cloud / Local), Flyway Database Migrations, Hibernate ORM |
| **Authentication** | Stateless JWT (JJWT) with BCrypt password hashing & Role-Based Access Control |
| **Documentation** | OpenAPI 3 / Swagger UI (`/swagger-ui.html`) |
| **Deployment** | Vercel (Frontend), Render (Backend), Neon (PostgreSQL) |

---

## 📂 Repository Structure

```
HanginOut/
├── Backend/                 # Spring Boot 3 modular monolith backend
│   ├── src/main/java/com/hanginout/
│   │   ├── auth/            # JWT authentication & registration
│   │   ├── user/            # Profile management
│   │   ├── preference/      # User onboarding & interest preferences
│   │   ├── activity/        # Activity & physical spot catalog
│   │   ├── recommendation/  # Pluggable rule-based scoring engine
│   │   ├── swipe/           # Individual swipe history & interactions
│   │   ├── saved/           # Saved hangouts ("My Hangouts")
│   │   ├── group/           # Group creation, invites & collaborative matching
│   │   ├── plan/            # Hangout scheduling and planning
│   │   ├── feedback/        # Star ratings & activity feedback
│   │   ├── admin/           # Catalog management & analytics
│   │   └── common/          # Security, exceptions, DTO wrappers
│   └── src/main/resources/
│       ├── application.yml
│       └── db/migration/    # Version-controlled Flyway DDL & seed scripts
├── Frontend/                # React + Vite responsive web application
│   ├── src/
│   │   ├── components/      # Swipeable cards, navbar, modals, buttons
│   │   ├── pages/           # Discover, Groups, Plans, Saved, Onboarding, Admin
│   │   ├── context/         # AuthContext, GroupContext
│   │   └── services/        # Axios API client modules
└── Documentation/           # Authoritative DRD and architectural designs
    └── DRD.pdf
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18+ (tested with v24.14.1)
- **Java JDK**: 17+ LTS (tested with Oracle JDK 17.0.12)
- **Git**

### 1. Backend Setup
```bash
cd Backend
# Build and run with Maven Wrapper (no global Maven installation required)
./mvnw clean spring-boot:run
# On Windows PowerShell:
.\mvnw.cmd clean spring-boot:run
```
- API Base URL: `http://localhost:8080/api`
- Swagger Documentation: `http://localhost:8080/swagger-ui.html`

### 2. Frontend Setup
```bash
cd Frontend
npm install
npm run dev
```
- Application URL: `http://localhost:5173`

---

## 📄 License
Educational MCA Capstone Project — JIMS.
