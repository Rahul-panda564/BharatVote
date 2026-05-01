# 🗳️ BharatVote: Interactive Election Literacy Navigator

**BharatVote** is a premium, AI-powered, and gamified web application designed to transform complex Indian election procedures into an engaging, step-by-step journey. Built for citizens—ranging from first-time 18-year-old voters to seasoned electors—it provides clarity, confidence, and civic pride through immersive simulations and intelligent guidance.

---

## 🌟 Vision
To empower every Indian citizen with the knowledge and tools required to navigate the world's largest democratic process seamlessly, ensuring that "No Voter is Left Behind."

## 🚀 Chosen Vertical: Civic Engagement & Electoral Literacy
We chose to focus on **Election Literacy** because transparency and education are the bedrock of a healthy democracy. By gamifying the experience and using high-fidelity simulations, we lower the barrier to entry for first-time voters and citizens with limited digital literacy.

---

## 🛠️ Tech Stack & Google Services
BharatVote is built on a state-of-the-art tech stack, deeply integrated with the Google ecosystem:

- **AI Engine**: **Google Gemini 2.0 Flash** (Powering "Chunav Mitra" Multilingual Assistant)
- **Infrastructure**: **Firebase** (Real-time Firestore Sync, Authentication, Analytics)
- **Accessibility**: **Google Translate Cloud** (Dynamic support for 12+ Indian languages)
- **Maps**: **Google Maps Platform** (Integrated Booth Locator & Distance Estimation)
- **Frontend**: **Next.js 15 (App Router)** & **Tailwind CSS v4** (Premium Glassmorphic Design)

---

## 📂 Project Architecture: The 7-Stage Journey
The application is logically structured into 7 master modules, mirroring the Election Commission of India's (ECI) official lifecycle:

1.  **Stage 1: Mera Pehla Vote (Registration)**: Interactive Form 6 & Form 8 simulator with real-time validation and GPS-based state detection.
2.  **Stage 2: Janch-Parch (Verification)**: Live status tracker for BLO visits and field verification milestones.
3.  **Stage 3: Chunav Ki Taiyari (Education)**: Gamified "Civic Mastery Path" with interactive quizzes and progress rings.
4.  **Stage 4: Booth Finder (Logistics)**: Integrated Maps logic to find polling stations and estimate queue times.
5.  **Stage 5: Matdan Divas (Polling Simulator)**: High-fidelity **3D EVM & VVPAT simulator** to practice the voting act safely.
6.  **Stage 6: Ginti Ka Khel (Live Results)**: Advanced Command Center with a **Coalition Simulator** (NDA vs I.N.D.I.A) and party-wise analytics.
7.  **Stage 7: Shikayat Darj (Grievance)**: Sovereign Grievance Center for filing complaints and tracking RTI applications.

---

## 🧠 Approach & Logic
- **Context-Aware AI**: The "Chunav Mitra" assistant uses Gemini to provide hyper-localized answers based on the user's current stage in the 7-stage journey.
- **Smart Geolocation**: Automatically detects the user's State and Constituency (e.g., Odisha/Bhubaneswar) to personalize the registration and candidate data.
- **Dynamic Data Sync**: Implemented a resilient Firestore sync logic with a 2.5-second "Fast-Track" fallback to ensure the app remains functional even on slow rural networks.
- **Identity-First Design**: Features a Live-Generated Digital EPIC (Voter ID) with a dynamic, scannable QR code generated in real-time.

---

## 🛡️ Competition Compliance & Assumptions
- **Repository Size**: Optimized to **~4.5 MB** (excluding `.next` and `node_modules`).
- **Public Repository**: Single-branch architecture (`main`) ready for public evaluation.
- **Assumptions**: 
  - Candidate data and election results are based on simulated 2024 Lok Sabha trends for demonstration purposes.
  - The ECI Portal integration is a high-fidelity simulation and does not submit data to actual government servers.
  - GPS detection uses coordinate-to-state mapping for major Indian regions (Odisha, Karnataka, Maharashtra, Delhi).

---

## ⚙️ How to Run Locally

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/BharatVote.git
    cd BharatVote
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**:
    Create a `.env.local` file with your Firebase and Gemini credentials (refer to the sample env section).

4.  **Run Development Server**:
    ```bash
    npm run dev
    ```

---

**BharatVote** — *Empowering the Indian Voter, One Click at a Time.* 🗳️🇮🇳
