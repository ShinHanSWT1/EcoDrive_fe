# EcoDrive Payback - Project Specification

## 1. Project Overview
- **Name**: EcoDrive Payback
- **Description**: A data-driven mobility platform that connects driving behavior (Safety/Eco scores) with car insurance premium discounts.
- **Core Philosophy**: Focus on **Insurance Renewal Benefits** (Annual) rather than monthly rewards. Points and missions are secondary motivators.

## 2. UI/UX Architecture
### Layout & Navigation
- **Responsive Design**:
  - **Desktop**: Header-based navigation with a "More" menu for secondary features (Challenge, Admin).
  - **Mobile**: Bottom tab bar (Home, Report, Insurance, Pay, My).
- **Layout Types**:
  - `AppLayout`: For general users (Header, Main, Footer).
  - `AdminLayout`: For administrators (Sidebar-based).
- **PageContainer**: Consistent max-width (1280px) and padding for all content.

### Navigation Structure
1. **Home (Dashboard)**: Overview of driving scores, next renewal premium, and cumulative savings.
2. **Report**: Detailed driving analysis (Safety/Eco scores, events, trends).
3. **Insurance**: Insurance comparison, next renewal premium calculation, and discount rate tracking.
4. **Pay (Shop)**: Insurance premium payment hub, point usage, and lifestyle benefits.
5. **My (Profile)**: User settings and vehicle information.

## 3. Key Features & Logic
### Insurance Renewal Focus (Refactored)
- **Annual Renewal Perspective**: All premium-related terminology is centered around the **"Next Renewal"** period.
- **Key Metrics**:
  - **Estimated Premium at Next Renewal**: Projected cost based on current driving habits.
  - **Cumulative Estimated Savings**: Total discount accumulated since the last renewal.
  - **Discount Rate Trend**: Visualizing how driving behavior impacts future costs.

### Onboarding Flow (Simplified)
- **Step 1: Vehicle Registration**: Automatic lookup via connected car networks (no separate "Connect Data" step).
- **Step 2: Insurance Info**: Basic current policy input to calculate potential savings.

### Pay & Rewards
- **Pay-Centric Shop**: The shop is a "Pay/Payment" hub where users pay premiums or use points for lifestyle benefits.
- **Toned-down Gamification**: Challenges and rankings are secondary to the core financial benefit of insurance discounts.

## 4. Technical Stack
- **Frontend**: React (Vite), TypeScript.
- **Styling**: Tailwind CSS (Mobile-first).
- **Animations**: Framer Motion (`motion/react`).
- **Charts**: Recharts (Customized for a professional financial look).
- **Icons**: Lucide React.

## 5. Recent Refinements
- **Refactored Layout**: Removed the admin-like sidebar for general users to improve the service feel.
- **Annual Billing Update**: Replaced all "Monthly" terminology with "Annual Renewal" context.
- **Responsive Navigation**: Implemented distinct Header (Desktop) and Tab Bar (Mobile) structures.
- **Social Login**: Integrated Naver and Google login buttons in the landing/login pages.
