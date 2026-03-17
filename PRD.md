Here is the project information optimized and structured as a comprehensive English **Product Requirement Document (PRD)** .

---

# Product Requirement Document (PRD): Lam Trà Digital Ecosystem

| **Project Name** | Lam Trà Online Ordering & Management System |
| :--- | :--- |
| **Document Version** | 1.0 (FINAL) |
| **Project Type** | Capstone Project / IT Graduation Thesis |
| **Team Size** | 3 Members |
| **Target Industry** | Food & Beverage (F&B) - Bubble Tea / Beverage Chain |

## 1. Executive Summary

### 1.1 Product Vision

To build a comprehensive digital ordering and internal management ecosystem for the **Lam Trà** beverage chain (specializing in milk tea, fruit tea, and blended drinks). The system aims to transition the business from traditional operations to a fully digital, data-driven model.

### 1.2 Product Objectives

- **For Customers:** Provide a seamless, personalized, and convenient online ordering experience.
- **For Staff:** Digitize the order fulfillment process with real-time updates to ensure efficiency.
- **For Management:** Offer a centralized "command center" to manage multi-branch operations, analyze business performance, and leverage AI for strategic decision-making.

### 1.3 Target Users & Access Control

The system supports three distinct user roles, each with specific permissions:

1. **Super Admin:** Head Office / System Owner (Full system control).
2. **Branch Manager:** Manager of a specific store (Operational control within a branch).
3. **Staff:** In-store employee (Daily operational tasks).
4. **Customer:** End-user placing orders.

## 2. Core Features & Requirements

The product is divided into four main subsystems that interact seamlessly.

### **Subsystem 1: Customer Web/App (Front-end & Customer Experience)**

*This is the revenue-generating front-end interface focused on user experience.*

- **Account & Authentication:**
  - **Social Login:** Quick sign-in via Zalo, Facebook, or Google.
  - **Profile Management:** Users can manage personal info and view order history.
- **Menu Discovery:**
  - Browse categorized menu (Milk Tea, Fruit Tea, Blended, etc.).
  - Search and filter products by price or popularity ("Best Seller").
- **Core Ordering Feature:**
  - **Product Customization:** Allow users to customize drinks by selecting Size (S/M/L), Ice/Sugar level (0%, 50%, 100%), and choosing Toppings.
- **Cart & Checkout:**
  - **Store Selection:** Integrate **Google Maps API** to suggest the nearest branch based on user location.
  - **Promotions:** Apply discount codes (Vouchers).
  - **Payments:** Support for Cash on Delivery (COD) and Online Payments (VNPay / Momo).
- **Loyalty Program:**
  - **Earn Points:** Accumulate points per bill (e.g., 10k VND = 1 point).
  - **Tiered Membership:** Implement a tier system (Bronze, Silver, Gold).
  - **Rewards:** Allow users to redeem points for vouchers.
- **Engagement & Feedback:**
  - **News & Promotions:** View articles about sales, new products, and events.
  - **Reviews:** Submit ratings (stars), comments, and photos after order completion.
  - **Recruitment:** View job listings and submit applications directly to the Admin.

### **Subsystem 2: Admin Dashboard (Back-end & Strategic Management)**

*This is the "brain" of the system, providing analytics and control based on Role-Based Access Control (RBAC).*

- **Role 1: Super Admin (Chain-wide Control)**
  - **Branch Management:** Create, update, and delete branches nationwide.
  - **Central Menu Management:** Manage global product catalog (categories, items, prices, toppings).
  - **HR Management:** Create and manage high-level personnel (e.g., Branch Managers).
  - **Marketing (CMS):** Publish news articles, manage banners, and launch promotions.
  - **AI Sentiment Analysis Dashboard:** View aggregated charts of customer satisfaction vs. complaints based on review analysis.
  - **Analytics:** View consolidated reports (chain revenue, branch performance comparisons).

- **Role 2: Branch Manager (Local Operational Control)**
  - **Staff Management:** Manage basic info and create accounts for branch staff.
  - **Local Inventory Control:** Toggle item availability (Out of Stock) specific to their branch.
  - **Order Management:** View branch-specific order history.
  - **Local Reporting:** View branch revenue and best-selling items.
  - **Customer Service:** Respond to reviews and complaints from customers of their branch.

### **Subsystem 3: Staff Interface (Operational Execution)**

*This is the "hands" of the system, focusing on daily workflow.*

- **Real-time Order Inbox:**
  - Receive instant notifications for new orders via **Socket.io**.
- **Order Processing Workflow:**
  - Update order status in real-time: `Pending` → `Preparing` → `Ready for Pickup/Delivery` → `Completed` / `Cancelled`.

### **Subsystem 4: Cross-cutting Technology Features (The Technology Backbone)**

*These are background services that enhance the other subsystems.*

- **Real-time Communication:** Socket.io ensures instant data flow between Customer orders and Staff interfaces.
- **AI Services:**
  - **Recommendation Engine:** Collaborative Filtering to suggest items on the customer homepage based on purchase history.
  - **Sentiment Analysis:** Python/FastAPI (or OpenAI) module to classify customer comments as Positive/Neutral/Negative for the Admin dashboard.
- **Third-party Integrations:**
  - **Zalo:** Zalo Social for login, Zalo ZNS for order confirmation/delivery notifications.
  - **Mapping:** Google Maps API for branch location and distance calculation.
  - **Payments:** VNPay and Momo gateways.

## 3. System Architecture & Data Flow

The subsystems are designed to work in a closed-loop process:

1. **Data Creation:** The **Customer App** generates data (Orders, Reviews, User Preferences).
2. **Data Execution:** The **Staff Interface** receives this data in real-time and processes it (Fulfilling orders).
3. **Data Analysis & Optimization:** The **Admin Dashboard** aggregates and analyzes all operational data to provide insights for optimizing the entire chain. AI services (Sentiment, Recommendation) feed insights back into both the Customer App (personalization) and the Admin Dashboard (analysis).

## 4. Success Metrics

- **Customer:** Increase in online order conversion rate and user retention.
- **Staff:** Reduction in order processing errors and time.
- **Admin:** Improved decision-making based on real-time data and AI insights.

---

This PRD defines the **Lam Trà** project not just as a simple selling app, but as a comprehensive digital transformation solution for a modern F&B chain.
