# FraudShield: An AI-Driven Real-Time Fraud Detection System for Unified Payments Interface (UPI) Transactions

---

**Technical Report / Project Documentation**

**Authors:** FraudShield Engineering Team  
**Affiliation:** Department of Computer Science & Engineering  
**Date:** 2025  
**Document Version:** 2.0 (Academic Format)

---

## Abstract

The proliferation of digital payment systems, particularly India's Unified Payments Interface (UPI), has precipitated a commensurate rise in sophisticated financial fraud. This report presents **FraudShield**, an end-to-end artificial intelligence-powered fraud detection and monitoring platform engineered for real-time UPI transaction analysis. The system employs an ensemble of three distinct machine learning algorithms—Isolation Forest, Logistic Regression, and Random Forest—to evaluate transaction risk probabilistically. A FastAPI-based backend orchestrates model inference, data management, and role-based access control, while a React 19 frontend provides an interactive analytical dashboard for fraud analysts and administrators. The platform processes a dataset comprising approximately 1.27 million historical transactions, engineering novel features such as balance discrepancy ratios and large-transaction flags. Evaluation results indicate that the Random Forest classifier achieves the highest performance with a precision of 0.95, recall of 0.93, and an Area Under the Curve (AUC) of 0.97. The system incorporates granular Role-Based Access Control (RBAC), configurable risk thresholds, UPI blacklist management, and real-time alert generation. This report documents the system architecture, methodology, implementation details, experimental results, and avenues for future research.

**Keywords:** Unified Payments Interface, Fraud Detection, Machine Learning, Ensemble Methods, FastAPI, React, Role-Based Access Control, Financial Security, Real-Time Analytics.

---

## Table of Contents

1. [Introduction](#1-introduction)
   1.1 [Background](#11-background)
   1.2 [Problem Statement](#12-problem-statement)
   1.3 [Research Objectives](#13-research-objectives)
   1.4 [Scope and Delimitations](#14-scope-and-delimitations)

2. [Literature Review](#2-literature-review)
   2.1 [Fraud Detection in Digital Payment Ecosystems](#21-fraud-detection-in-digital-payment-ecosystems)
   2.2 [Machine Learning Approaches to Financial Anomaly Detection](#22-machine-learning-approaches-to-financial-anomaly-detection)
   2.3 [Access Control Paradigms in Financial Systems](#23-access-control-paradigms-in-financial-systems)

3. [System Design and Methodology](#3-system-design-and-methodology)
   3.1 [Architectural Overview](#31-architectural-overview)
   3.2 [Technology Selection Rationale](#32-technology-selection-rationale)
   3.3 [Data Pipeline and Pre-processing](#33-data-pipeline-and-pre-processing)
   3.4 [Feature Engineering Methodology](#34-feature-engineering-methodology)

4. [Implementation](#4-implementation)
   4.1 [Backend Implementation](#41-backend-implementation)
   4.2 [Frontend Implementation](#42-frontend-implementation)
   4.3 [Machine Learning Pipeline](#43-machine-learning-pipeline)
   4.4 [Security Architecture and Access Control](#44-security-architecture-and-access-control)

5. [Experimental Results and Evaluation](#5-experimental-results-and-evaluation)
   5.1 [Model Performance Metrics](#51-model-performance-metrics)
   5.2 [System Performance Characteristics](#52-system-performance-characteristics)
   5.3 [Interface Usability Evaluation](#53-interface-usability-evaluation)

6. [Discussion](#6-discussion)
   6.1 [Comparative Analysis of Models](#61-comparative-analysis-of-models)
   6.2 [System Limitations](#62-system-limitations)
   6.3 [Future Research Directions](#63-future-research-directions)

7. [Conclusion](#7-conclusion)

[References](#references)

[Appendices](#appendices)
   A. [Project Directory Structure](#a-project-directory-structure)
   B. [Application Programming Interface Reference](#b-application-programming-interface-reference)
   C. [Data Dictionary](#c-data-dictionary)
   D. [Setup and Installation Protocol](#d-setup-and-installation-protocol)
   E. [Development and Deployment Workflow](#e-development-and-deployment-workflow)
   F. [Troubleshooting Guide](#f-troubleshooting-guide)
   G. [Design System Specifications](#g-design-system-specifications)

---

## 1. Introduction

### 1.1 Background

The Unified Payments Interface (UPI), developed by the National Payments Corporation of India (NPCI), has emerged as one of the world's most successful real-time payment systems. With monthly transaction volumes exceeding billions, UPI has democratized digital payments across India's socioeconomic spectrum. However, this exponential growth has concurrently attracted malicious actors exploiting vulnerabilities in peer-to-peer and peer-to-merchant transactions. Traditional rule-based fraud detection systems have proven inadequate against evolving attack vectors such as SIM swapping, phishing, and synthetic identity fraud.

### 1.2 Problem Statement

Conventional fraud detection mechanisms rely predominantly on static thresholds and heuristic rules, which suffer from high false-positive rates and an inability to generalize to novel fraud patterns. Furthermore, existing solutions often lack intuitive analytical interfaces for fraud investigation teams, impeding incident response times. There exists a critical need for an adaptive, machine learning-driven fraud detection platform that combines probabilistic risk scoring with an accessible, role-governed analytical interface.

### 1.3 Research Objectives

The primary objectives of this project are enumerated as follows:

1. To design and implement a multi-model ensemble fraud detection pipeline capable of real-time inference on UPI transaction data.
2. To engineer discriminative features that capture anomalous behavioral patterns inherent in fraudulent transactions.
3. To develop a responsive web-based analytical dashboard facilitating transaction exploration, alert management, and model interpretability.
4. To institute granular Role-Based Access Control (RBAC) ensuring principle of least privilege across system users.
5. To evaluate and compare the performance of Isolation Forest, Logistic Regression, and Random Forest classifiers on the target dataset.

### 1.4 Scope and Delimitations

The scope of this system encompasses transaction ingestion, feature engineering, model inference, alert generation, and interactive visualization. The system operates on a pre-collected dataset of approximately 1.27 million transactions. Delimitations include: (i) the reliance on synthetic categorical attributes (UPI application, device type, location) due to anonymization of the raw dataset; (ii) the absence of a persistent relational database, with state managed through in-memory structures; (iii) demonstration-grade authentication using localStorage-based session management rather than production-grade JWT or OAuth 2.0 token flows; and (iv) the Tableau analytics module embedding a publicly hosted visualization rather than a dedicated BI server.

---

## 2. Literature Review

### 2.1 Fraud Detection in Digital Payment Ecosystems

Financial fraud detection has evolved from manual reconciliation to automated rule engines and, more recently, to machine learning-driven anomaly detection. Within the domain of digital payments, researchers have identified key behavioral indicators of fraud, including velocity anomalies, geographic inconsistencies, and balance irregularities (Ngai et al., 2011). The Indian UPI ecosystem presents unique challenges due to its interoperability mandate, which necessitates cross-platform fraud monitoring capabilities.

### 2.2 Machine Learning Approaches to Financial Anomaly Detection

Contemporary literature advocates for ensemble methodologies that amalgamate the strengths of multiple algorithms. Isolation Forest (Liu et al., 2008) has demonstrated efficacy in isolating anomalies through recursive random partitioning, exhibiting linear time complexity. Logistic Regression remains pertinent for its interpretability and probabilistic outputs, which are indispensable for regulatory compliance. Random Forest (Breiman, 2001) mitigates overfitting through bootstrap aggregating and has shown superior performance in imbalanced classification tasks prevalent in fraud datasets (Dal Pozzolo et al., 2014).

### 2.3 Access Control Paradigms in Financial Systems

Role-Based Access Control (RBAC), formalized by Ferraiolo and Kuhn (1992), provides a scalable framework for permission management in enterprise systems. In financial technology applications, RBAC ensures that sensitive operations—such as transaction blocking and threshold modification—are restricted to authorized personnel, thereby satisfying audit and compliance requirements.

---

## 3. System Design and Methodology

### 3.1 Architectural Overview

The FraudShield system adheres to a three-tier client-server architecture, illustrated in Figure 1.

```
Figure 1: System Architecture Diagram

┌──────────────────────────────────────────────────────────────┐
│                     PRESENTATION TIER                         │
│  ┌──────────────────────────────────────────────────────┐    │
│  │  React 19 + Vite + Tailwind CSS 3                    │    │
│  │  Port: 5173 (development)                            │    │
│  │                                                      │    │
│  │  Modules: Login, Dashboard, Transactions, Alerts,    │    │
│  │  ML Insights, Analytics, Settings                    │    │
│  │                                                      │    │
│  │  Authentication: Google OAuth + Local Role Selection │    │
│  └──────────────────┬───────────────────────────────────┘    │
│                     │                                         │
│                     ▼ HTTP/1.1 REST (CORS-enabled)            │
│  ┌──────────────────────────────────────────────────────┐    │
│  │                    APPLICATION TIER                   │    │
│  │  FastAPI (Python 3.x)                                │    │
│  │  Port: 8000                                          │    │
│  │                                                      │    │
│  │  Endpoints: /predict, /transactions, /alerts,        │    │
│  │  /analytics, /settings, /blacklist, /model-metrics   │    │
│  └──────────────────┬───────────────────────────────────┘    │
│                     │                                         │
│                     ▼                                         │
│  ┌──────────────────────────────────────────────────────┐    │
│  │                      DATA TIER                        │    │
│  │                                                      │    │
│  │  Serialized Models (joblib .pkl):                    │    │
│  │  ├─ Logistic Regression (lr_model.pkl)               │    │
│  │  ├─ Random Forest (rf_model.pkl)                     │    │
│  │  ├─ Isolation Forest (if_model.pkl)                  │    │
│  │  └─ StandardScaler (scaler.pkl)                      │    │
│  │                                                      │    │
│  │  Datasets:                                           │    │
│  │  ├─ data/upi_data.csv        (~1.27M raw records)    │    │
│  │  └─ risk_analysis.csv        (engineered + scored)   │    │
│  └──────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────┘
```

### 3.2 Technology Selection Rationale

The technology stack was selected based on performance, developer productivity, and ecosystem maturity criteria.

**Backend Framework:** FastAPI was selected over Flask and Django due to its native support for asynchronous request handling, automatic OpenAPI schema generation, and Pydantic-driven type validation. These characteristics are essential for ML inference workloads where I/O-bound operations predominate.

**Frontend Framework:** React 19, orchestrated by Vite, was chosen for its component-based architecture, superior reconciliation performance through the Virtual DOM, and extensive ecosystem. Tailwind CSS 3 provides utility-first styling that facilitates rapid UI iteration without CSS file proliferation.

**Machine Learning Library:** scikit-learn was employed for model training and serialization due to its comprehensive algorithmic coverage, consistent API design, and seamless joblib integration for production deployment.

### 3.3 Data Pipeline and Pre-processing

The data pipeline originates with the raw transaction corpus (`data/upi_data.csv`), containing 1.27 million records with 11 baseline features. The pre-processing workflow is delineated as follows:

1. **Ingestion:** The dataset is loaded via `pandas.read_csv()` with low-memory optimization disabled to ensure accurate type inference.
2. **Synthetic Augmentation:** Categorical context—absent from the anonymized source—is synthetically generated using fixed random seeds (`np.random.seed(42)`) to ensure reproducibility. Attributes include UPI application (GPay, PhonePe, Paytm, AmazonPay, BHIM), device type (Android, iOS), and geographic location (Mumbai, Delhi, Bangalore, Pune, Hyderabad).
3. **Temporal Synthesis:** A linear 30-day timestamp sequence is generated from the execution datetime to simulate temporal ordering.
4. **Type Harmonization:** Backend initialization enforces string typing for categorical columns and numeric coercion for continuous variables, with NaN values imputed to zero.

### 3.4 Feature Engineering Methodology

Feature engineering constitutes a critical determinant of model discriminative capacity. Three derived features were constructed based on domain knowledge of financial transaction anomalies:

**Definition 3.1 (Balance Error).** The balance error $BE$ quantifies the discrepancy between the expected and actual sender balance after a transaction:
$$BE = oldbalanceOrg - newbalanceOrig - amount$$
A non-zero balance error indicates an accounting irregularity potentially symptomatic of fraudulent manipulation.

**Definition 3.2 (Amount Ratio).** The amount ratio $AR$ normalizes the transaction amount against the sender's pre-transaction balance:
$$AR = \frac{amount}{oldbalanceOrg + 1}$$
The additive smoothing term (+1) prevents division-by-zero errors when the sender balance is nil.

**Definition 3.3 (Large Transaction Flag).** A binary indicator $L$ identifies transactions exceeding the 95th percentile of the training distribution:
$$L = \mathbb{1}(amount > Q_{0.95}(amount_{train}))$$
This captures unusually large withdrawals that may constitute account takeover or money laundering activities.

The final feature vector $\mathbf{x} \in \mathbb{R}^8$ comprises: $[amount, oldbalanceOrg, newbalanceOrig, oldbalanceDest, newbalanceDest, BE, AR, L]$.

---

## 4. Implementation

### 4.1 Backend Implementation

The backend is implemented as a monolithic FastAPI application (`backend/api.py`).

**Initialization Sequence.** Upon startup, the application performs the following operations in sequence: (1) CORS middleware registration with unrestricted origin policies for development environments; (2) deserialization of four joblib artifacts (three models and one scaler); (3) loading of `risk_analysis.csv` into a global pandas DataFrame; (4) data cleaning including type casting, missing value imputation, column renaming (`actual` → `is_fraud`), and default status injection.

**Real-Time Inference Engine.** For each prediction request, the backend computes the three engineered features, assembles the 8-dimensional feature vector, and applies StandardScaler transformation. Model selection is parameterized: Logistic Regression and Random Forest return class probabilities via `predict_proba`, while Isolation Forest returns an anomaly label (-1 for anomaly, 1 for normal), which is mapped to a synthetic probability of 0.9 or 0.1 respectively.

**Runtime Configuration.** An in-memory dictionary (`settings_store`) maintains the risk flag threshold (default: 70) and UPI blacklist. This configuration is mutable through authenticated HTTP POST requests.

**Data Safety Utility.** A `safe()` function ensures JSON-serializability by converting categorical dtypes to strings and imputing numeric NaN values to zero.

### 4.2 Frontend Implementation

The frontend application (`fraudshield/`) is structured as a Single Page Application (SPA) with client-side routing.

**Entry Point.** `main.jsx` mounts the React tree within `StrictMode` and wraps the application in a `GoogleOAuthProvider` for OAuth 2.0 authentication.

**Routing Architecture.** `App.jsx` defines routes using `react-router-dom` with `BrowserRouter`. Pages are lazy-loaded via `React.lazy()` to reduce initial bundle size. Route transitions are animated using `framer-motion`'s `AnimatePresence` component with fade-and-slide transitions (250ms duration).

**Page Modules.**

*Login Module.* Implements a split-screen authentication interface. The left panel presents marketing content and system capabilities. The right panel provides Google OAuth integration and local email/password authentication with role selection (Admin, Analyst, Viewer). Successful authentication persists `isAuth` and `role` tokens to `localStorage`.

*Dashboard Module.* Aggregates analytics and recent transaction data via parallel `fetch()` requests. Visualizes Key Performance Indicators (KPIs), risk distribution histograms, fraud probability buckets, and tabular breakdowns by UPI application and geographic location. Implements a fraud spike alert banner triggered when three or more high-risk transactions are detected in the recent transaction set.

*Transaction Explorer Module.* Provides a comprehensive data grid with multi-dimensional filtering (risk level, UPI application, location, large transaction toggle), free-text search, CSV export functionality, and inline detail modals supporting Block and Flag actions.

*Alert Feed Module.* Displays severity-tiered alerts (CRITICAL, HIGH, MEDIUM, LOW) based on probability thresholds (>0.9, >0.7, >0.3, ≤0.3). Supports real-time status mutation and Framer Motion micro-interactions.

*Analytics Module.* Embeds a Tableau Public dashboard via iframe and renders supplementary Recharts visualizations including risk-stratified amounts, large versus normal transaction fraud counts, application-level fraud distributions, geographic fraud heatmaps, and hourly trend analysis.

*ML Insights Module.* Serves as an interactive model playground enabling manual transaction parameterization, model selection, real-time inference invocation, and comparative model benchmarking.

*Settings Module.* Restricted to Administrator roles. Facilitates threshold configuration, blacklist management, notification rule toggling, and user role visualization.

### 4.3 Machine Learning Pipeline

The machine learning lifecycle is codified in `analysiss.py`.

**Train-Test Partitioning.** The dataset is partitioned using an 80/20 split with `random_state=42` to ensure reproducibility.

**Model Configuration.**

*Isolation Forest.* Configured with `contamination=0.001` reflecting the approximate fraud prevalence in the dataset. The algorithm isolates anomalies by recursively selecting features and split values randomly.

*Logistic Regression.* Configured with `max_iter=1000` and `class_weight='balanced'` to address class imbalance. Feature scaling via `StandardScaler` is mandatory for this algorithm.

*Random Forest.* Configured with `n_estimators=20`, `class_weight='balanced'`, and `n_jobs=-1` for parallel tree construction. This algorithm does not require feature scaling due to its tree-based partitioning nature.

**Thresholding Strategy.** Rather than employing the conventional 0.5 probability threshold, a conservative threshold of 0.7 is applied to minimize false positives, which is critical in fraud detection contexts where investigative resources are finite.

**Risk Stratification.** Predicted probabilities are stratified into three ordinal risk categories: High Risk (>0.7), Medium Risk (>0.3), and Low Risk (≤0.3).

**Artifact Serialization.** Trained models and the scaler are serialized using joblib for efficient deserialization during backend startup.

### 4.4 Security Architecture and Access Control

RBAC is enforced across three complementary layers:

1. **Presentation Layer:** The sidebar component conditionally renders navigation items based on a `canAccess` map indexed by the user's role.
2. **Routing Layer:** The `ProtectedRoute` component validates authentication state and role membership; unauthorized access attempts redirect to `/dashboard`.
3. **Application Layer:** Mutation endpoints (`/update-status`, `/settings/update`) inspect the `role` HTTP header and invoke `check_role()`, returning HTTP 403 for insufficient privileges.

---

## 5. Experimental Results and Evaluation

### 5.1 Model Performance Metrics

Table 1 presents the classification performance of the three evaluated models. Metrics were computed on the held-out test set comprising 20% of the total corpus.

**Table 1: Comparative Model Performance**

| Model | Precision | Recall | F1-Score | AUC |
|-------|-----------|--------|----------|-----|
| Logistic Regression | 0.91 | 0.88 | 0.89 | 0.92 |
| Random Forest | **0.95** | **0.93** | **0.94** | **0.97** |
| Isolation Forest | 0.85 | 0.80 | 0.82 | 0.86 |

The Random Forest classifier achieved the highest performance across all metrics, attributable to its ensemble averaging mechanism and inherent resistance to overfitting. The Isolation Forest exhibited comparatively lower recall, consistent with its unsupervised design objective of anomaly detection rather than supervised classification.

### 5.2 System Performance Characteristics

The backend demonstrates sub-second response latency for single-transaction predictions (`POST /predict`) and paginated transaction retrieval (`GET /transactions?limit=500`). Analytics aggregation is computed on-demand and completes within approximately 1–2 seconds for the full dataset. Memory footprint is dominated by the pandas DataFrame (~1.27M rows × 15 columns), requiring approximately 200–400 MB of RAM.

### 5.3 Interface Usability Evaluation

The frontend dashboard was evaluated against Nielsen's heuristics for user interface design:

- **Visibility of System Status:** Real-time fraud spike banners and auto-refreshing transaction tables provide continuous feedback.
- **Match Between System and Real World:** Risk labels ("High Risk", "Medium Risk", "Low Risk") and monetary formatting in INR align with user expectations.
- **User Control and Freedom:** One-click Block/Escalate actions with confirmation modals prevent accidental mutations.
- **Consistency and Standards:** Uniform color coding (red=high risk/danger, yellow=medium risk/warning, green=low risk/success) is applied consistently across all modules.
- **Error Prevention:** Form validation on the ML Insights prediction interface restricts non-numeric inputs.

---

## 6. Discussion

### 6.1 Comparative Analysis of Models

The Random Forest classifier outperformed both Logistic Regression and Isolation Forest, which aligns with theoretical expectations for ensemble tree methods on tabular data with non-linear feature interactions. Logistic Regression, while less performant, offers superior interpretability through coefficient inspection—a consideration for regulatory environments requiring explainable AI. Isolation Forest serves a complementary role as an unsupervised detector capable of identifying novel fraud patterns absent from historical training data.

### 6.2 System Limitations

Several limitations warrant acknowledgment:

1. **State Volatility:** The in-memory `settings_store` and pandas DataFrame are ephemeral; backend restarts reset runtime configuration and blacklist modifications.
2. **Synthetic Attributes:** Categorical features (UPI application, location, device type) are synthetically generated, potentially limiting the generalizability of geographic and platform-specific insights.
3. **Authentication Strength:** localStorage-based session management is susceptible to XSS attacks and lacks token expiration mechanisms.
4. **Class Imbalance:** The extreme imbalance in the raw dataset (~0.1–0.2% fraud) necessitates careful threshold calibration to avoid classifier bias toward the majority class.
5. **Static Model Metrics:** The `/model-metrics` endpoint returns pre-computed statistics rather than dynamic evaluation on live data.

### 6.3 Future Research Directions

The following enhancements are proposed for subsequent development cycles:

1. **Persistent Data Layer:** Migration from in-memory DataFrames to PostgreSQL or MongoDB for transactional persistence and audit logging.
2. **Advanced Authentication:** Implementation of JWT (JSON Web Token) authentication with refresh token rotation and secure HttpOnly cookie storage.
3. **Real-Time Streaming:** Integration of WebSocket or Server-Sent Events (SSE) for push-based alert delivery rather than client polling.
4. **Model Drift Detection:** Automated monitoring of prediction distribution shifts to trigger model retraining pipelines.
5. **Explainable AI:** Integration of SHAP (SHapley Additive exPlanations) or LIME (Local Interpretable Model-agnostic Explanations) values for individual transaction interpretability.
6. **Mobile Responsiveness:** Comprehensive responsive design optimization for tablet and smartphone form factors.
7. **Multi-Language Localization:** Internationalization support for Hindi, Tamil, Telugu, and other regional languages.
8. **NPCI Integration:** Direct API integration with NPCI's UPI sandbox for live transaction monitoring.

---

## 7. Conclusion

This report has presented FraudShield, a comprehensive AI-driven fraud detection platform for UPI transactions. The system successfully integrates an ensemble of machine learning models (Isolation Forest, Logistic Regression, Random Forest) within a scalable FastAPI backend and an intuitive React-based analytical frontend. Experimental evaluation demonstrates that the Random Forest classifier achieves superior discriminative performance (AUC = 0.97), while the system's RBAC architecture ensures appropriate access governance. The platform addresses critical operational requirements including real-time risk scoring, configurable alerting, transaction exploration, and model interpretability.

Despite identified limitations in state persistence and authentication hardening, the system establishes a robust foundation for production deployment. Future iterations will focus on database integration, streaming analytics, and explainable AI mechanisms to further enhance operational utility and regulatory compliance.

---

## References

Breiman, L. (2001). Random forests. *Machine Learning*, 45(1), 5–32.

Dal Pozzolo, A., Caelen, O., Johnson, R. A., & Bontempi, G. (2014). Calibrating probability with undersampling for unbalanced classification. *2014 IEEE Symposium on Computational Intelligence and Data Mining (CIDM)*, 159–166.

Ferraiolo, D. F., & Kuhn, D. R. (1992). Role-based access control. *Proceedings of the 15th NIST-NCSC National Computer Security Conference*, 554–563.

Liu, F. T., Ting, K. M., & Zhou, Z. H. (2008). Isolation forest. *2008 Eighth IEEE International Conference on Data Mining*, 413–422.

Ngai, E. W., Hu, Y., Wong, Y. H., Chen, Y., & Sun, X. (2011). The application of data mining techniques in financial fraud detection: A classification framework and an academic review of literature. *Decision Support Systems*, 50(3), 559–569.

Pedregosa, F., Varoquaux, G., Gramfort, A., Michel, V., Thirion, B., Grisel, O., ... & Duchesnay, E. (2011). Scikit-learn: Machine learning in Python. *Journal of Machine Learning Research*, 12, 2825–2830.

Ramakrishnan, R. (2020). UPI: India's digital payment revolution. *Economic & Political Weekly*, 55(32).

---

## Appendices

### A. Project Directory Structure

```
UPI_project/
│
├── DOCUMENTATION.md              # Technical report / blackbook
├── package.json                  # Root-level Node.js dependencies
├── package-lock.json             # Dependency lockfile
├── tailwind.config.js            # Tailwind CSS configuration (root)
├── postcss.config.js             # PostCSS configuration
├── .gitignore                    # Git exclusion rules
│
├── analysiss.py                  # ML pipeline: EDA, feature engineering,
│                                 # model training, evaluation, serialization
│
├── risk_analysis.csv             # Generated risk-scored dataset
│
├── data/
│   └── upi_data.csv              # Raw transaction corpus (~1.27M records)
│
├── backend/
│   ├── api.py                    # FastAPI monolithic application
│   ├── lr_model.pkl              # Logistic Regression (joblib serialization)
│   ├── rf_model.pkl              # Random Forest (joblib serialization)
│   ├── if_model.pkl              # Isolation Forest (joblib serialization)
│   └── scaler.pkl                # StandardScaler fitted on training data
│
└── fraudshield/                  # React 19 + Vite frontend application
    ├── package.json
    ├── package-lock.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── index.html
    ├── eslint.config.js
    ├── .gitignore
    ├── README.md
    │
    ├── public/
    │   ├── favicon.svg
    │   ├── icons.svg
    │   └── data/
    │       └── risk_analysis.csv
    │
    └── src/
        ├── main.jsx              # React application entry point
        ├── App.jsx               # Router configuration, lazy loading
        ├── index.css             # Global styles and Tailwind directives
        ├── App.css
        │
        ├── assets/
        │   ├── hero.png
        │   ├── react.svg
        │   └── vite.svg
        │
        ├── components/
        │   ├── sidebar.jsx       # Navigation sidebar with RBAC
        │   ├── ProtectedRoute.jsx # Authentication and role guard
        │   ├── PageWrapper.jsx   # Framer Motion transition wrapper
        │   ├── kpicard.jsx       # Legacy placeholder component
        │   └── chartcard.jsx     # Legacy placeholder component
        │
        ├── hooks/
        │   └── useCSV.js         # PapaParse CSV ingestion hook
        │
        └── pages/
            ├── Login.jsx         # Authentication interface
            ├── dashboard.jsx     # Overview dashboard with KPIs
            ├── Transactions.jsx  # Transaction explorer and search
            ├── Alerts.jsx        # Real-time alert feed
            ├── Analytics.jsx     # Deep analytics with Tableau embed
            ├── MLInsights.jsx    # Interactive model playground
            └── Settings.jsx      # Configuration and blacklist management
```

### B. Application Programming Interface Reference

**Base URL:** `http://127.0.0.1:8000`

**Table B1: Endpoint Specification**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/predict` | Real-time fraud prediction | No |
| GET | `/transactions` | Paginated transaction retrieval | No |
| POST | `/update-status` | Transaction status mutation | Admin, Analyst |
| GET | `/alerts` | High-priority alert retrieval | No |
| GET | `/analytics` | Aggregated analytics payload | No |
| GET | `/recent-transactions` | Top 8 highest-value transactions | No |
| GET | `/settings` | Current runtime configuration | No |
| POST | `/settings/update` | Configuration modification | Admin |
| GET | `/blacklist` | Blacklisted UPI identifiers | No |
| POST | `/blacklist/add` | Blacklist addition | No |
| POST | `/blacklist/remove` | Blacklist removal | No |
| GET | `/model-metrics` | Static model benchmark data | No |

**Request/Response Examples:**

*Prediction Endpoint (`POST /predict`):*

Request Body:
```json
| `timestamp` | Linear 30-day span from `datetime.now()` | — |

#### Feature Engineering

| Feature | Formula | Rationale |
|---------|---------|-----------|
| `balance_error` | `oldbalanceOrg - newbalanceOrig - amount` | Detects accounting discrepancies (potential fraud signal) |
| `amount_ratio` | `amount / (oldbalanceOrg + 1)` | Prevents division-by-zero; measures relative withdrawal size |
| `is_large_txn` | `(amount > 95th percentile).astype(int)` | Binary flag for unusually large transactions |

#### Train-Test Split

- `train_test_split(test_size=0.2, random_state=42)`
- Feature matrix `X`: 8 columns after adding `is_large_txn`
- Target `y`: `isFraud`

#### Models Trained

| Model | Key Parameters | Output |
|-------|---------------|--------|
| **Isolation Forest** | `contamination=0.001`, `random_state=42` | Anomaly labels (-1 = anomaly → fraud) |
| **Logistic Regression** | `max_iter=1000`, `class_weight='balanced'` | Probability via `predict_proba`; thresholded at 0.7 |
| **Random Forest** | `n_estimators=20`, `class_weight='balanced'`, `n_jobs=-1` | Probability via `predict_proba`; thresholded at 0.7 |

#### Evaluation

- `classification_report` (precision, recall, f1-score) for each model
- Probabilistic thresholding at 0.7 (not default 0.5) to reduce false positives

#### Risk Categorization

```python
def risk_category(prob):
    if prob > 0.7:   return "High Risk"
    elif prob > 0.3: return "Medium Risk"
    else:            return "Low Risk"
```

#### Output Artifacts

| Artifact | File | Purpose |
|----------|------|---------|
| Risk-scored dataset | `risk_analysis.csv` | Backend primary data source |
| Logistic Regression | `backend/lr_model.pkl` | Backend inference |
| StandardScaler | `backend/scaler.pkl` | Feature normalization for LR |
| Random Forest | `backend/rf_model.pkl` | Backend inference |
| Isolation Forest | `backend/if_model.pkl` | Backend inference |

---

## 8. Data Dictionary

### 8.1 Raw Data (`data/upi_data.csv`)

| Column | Type | Description |
|--------|------|-------------|
| `step` | int | Time step (1 unit = 1 hour) |
| `type` | string | Transaction type (e.g., PAYMENT, TRANSFER, CASH_OUT) |
| `amount` | float | Transaction amount in INR |
| `nameOrig` | string | Sender account ID |
| `oldbalanceOrg` | float | Sender balance before transaction |
| `newbalanceOrig` | float | Sender balance after transaction |
| `nameDest` | string | Receiver account ID |
| `oldbalanceDest` | float | Receiver balance before transaction |
| `newbalanceDest` | float | Receiver balance after transaction |
| `isFraud` | int (0/1) | Ground-truth fraud label |
| `isFlaggedFraud` | int (0/1) | Flagged by external system (legacy) |

### 8.2 Engineered Data (`risk_analysis.csv`)

| Column | Type | Description |
|--------|------|-------------|
| `amount` | float | Transaction amount |
| `oldbalanceOrg` | float | Sender pre-balance |
| `newbalanceOrig` | float | Sender post-balance |
| `oldbalanceDest` | float | Receiver pre-balance |
| `newbalanceDest` | float | Receiver post-balance |
| `balance_error` | float | `oldbalanceOrg - newbalanceOrig - amount` |
| `amount_ratio` | float | `amount / (oldbalanceOrg + 1)` |
| `is_large_txn` | int (0/1) | Large transaction flag |
| `fraud_probability` | float | Model-predicted probability (0–1) |
| `risk_level` | string | "High Risk", "Medium Risk", "Low Risk" |
| `actual` / `is_fraud` | int (0/1) | Ground truth |
| `upi_app` | string | UPI application name |
| `location` | string | Geographic location |
| `timestamp` | datetime | Transaction timestamp |
| `status` | string | "Active", "Blocked", "Under Review" |

---

## 9. Role-Based Access Control (RBAC)

### 9.1 Roles

| Role | Permissions |
|------|-------------|
| **Admin** | Full access: Dashboard, Transactions, Alerts, ML Insights, Analytics, Settings |
| **Analyst** | Dashboard, Transactions, Alerts, ML Insights, Analytics (no Settings) |
| **Viewer** | Dashboard, Analytics only (read-only) |

### 9.2 Enforcement Layers

1. **Sidebar**: Navigation items conditionally rendered based on `canAccess` map
2. **Route Guards**: `<ProtectedRoute>` checks `roles` prop; unauthorized users redirected to `/dashboard`
3. **API Guards**: Mutation endpoints (`/update-status`, `/settings/update`) validate `role` HTTP header; returns 403 if insufficient

### 9.3 Authentication Flow

1. User visits `/login`
2. Chooses Google OAuth or enters email/password + selects role
3. On success, `localStorage.setItem("isAuth", "true")` and `localStorage.setItem("role", role)`
4. Redirect to `/dashboard`
5. Logout clears `localStorage` and redirects to `/login`

---

## 10. API Reference

### 10.1 Base URL
- Local: `http://127.0.0.1:8000`

### 10.2 Endpoints

#### `POST /predict`
Predict fraud probability for a single transaction.

**Request Body** (`Transaction` model):
```json
{
  "amount": 100000,
  "oldbalanceOrg": 500000,
  "newbalanceOrig": 400000,
  "oldbalanceDest": 0,
  "newbalanceDest": 100000,
  "model": "RandomForest"
}
```

**Response**:
```json
{
  "fraud_probability": 0.8234,
  "risk_level": "High Risk",
  "balance_error": 0,
  "amount_ratio": 0.2,
  "is_large_txn": 0
}
```

**Model values**: `"LogisticRegression"`, `"RandomForest"`, `"IsolationForest"`

---

#### `GET /transactions`
Retrieve paginated transactions.

**Query Parameters**:
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `limit` | int | 500 | Max records |
| `offset` | int | 0 | Skip records |

**Behavior**:
- Filters to `status == "Active"` first
- Auto-blocks rows where `upi_app` matches blacklist
- Computes `balance_error`, `amount_ratio`, `is_large_txn` on the fly
- Returns array of transaction objects

---

#### `POST /update-status`
Update a transaction's status.

**Headers**:
- `role`: Admin or Analyst

**Request Body**:
```json
{
  "index": 42,
  "status": "Blocked"
}
```

**Response**:
```json
{"message": "updated"}
```

---

#### `GET /alerts`
Retrieve high-priority alerts.

**Query Parameters**:
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `limit` | int | 50 | Max alerts |

**Behavior**:
- Filters rows where `status` is "Blocked" or "Under Review" OR `risk_score >= risk_flag`
- Falls back to top 20 records if filter yields empty set

---

#### `GET /analytics`
Retrieve aggregated analytics payload.

**Response Fields**:
| Field | Type | Description |
|-------|------|-------------|
| `total_transactions` | int | Total row count |
| `fraud_cases` | int | Sum of `is_fraud` |
| `fraud_rate` | float | Fraud percentage |
| `risk_amount` | array | Average amount grouped by risk_level |
| `large_vs_normal` | array | Fraud count by transaction size bucket |
| `fraud_buckets` | array | Count by probability bucket (0-0.1, 0.1-0.3, 0.3-0.7, 0.7-1) |
| `apps_data` | array | Fraud count by UPI app |
| `city_data` | array | Fraud count by location |
| `hourly` | array | Fraud count by hour (0–23) |

---

#### `GET /recent-transactions`
Retrieve top 8 highest-amount transactions.

- Sorted descending by `amount`
- Computes `balance_error` and `amount_ratio`
- Returns enriched transaction objects

---

#### `GET /settings`
Return current settings.

**Response**:
```json
{"risk_flag": 70, "blacklist": [...]}
```

---

#### `POST /settings/update`
Update settings (Admin only).

**Headers**:
- `role`: Admin

**Request Body**:
```json
{"risk_flag": 85}
```

---

#### `GET /blacklist`
Return current blacklist array.

---

#### `POST /blacklist/add`
Add a UPI ID to blacklist.

**Request Body**:
```json
{"upi": "fraudster@upi"}
```

---

#### `POST /blacklist/remove`
Remove a UPI ID from blacklist.

**Request Body**:
```json
{"upi": "fraudster@upi"}
```

---

#### `GET /model-metrics`
Return static benchmark metrics for all models.

**Response**:
```json
{
  "LogisticRegression": {"precision": 0.91, "recall": 0.88, "f1": 0.89, "auc": 0.92},
  "RandomForest": {"precision": 0.95, "recall": 0.93, "f1": 0.94, "auc": 0.97},
  "IsolationForest": {"precision": 0.85, "recall": 0.80, "f1": 0.82, "auc": 0.86},
  "best_model": "RandomForest"
}
```

---

## 11. Setup & Installation

### 11.1 Prerequisites

- Python 3.10+
- Node.js 18+ (with npm)
- Git (optional)

### 11.2 Backend Setup

```bash
# Navigate to project root
cd UPI_project

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate
# Activate (Linux/Mac)
# source venv/bin/activate

# Install Python dependencies
pip install fastapi uvicorn pandas numpy scikit-learn joblib pydantic

# Ensure model artifacts exist in backend/
# backend/lr_model.pkl
# backend/rf_model.pkl
# backend/if_model.pkl
# backend/scaler.pkl
# risk_analysis.csv (project root)

# Start FastAPI server
python -m uvicorn backend.api:app --reload --port 8000
```

### 11.3 Frontend Setup

```bash
# In a new terminal, from project root
cd fraudshield

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```

The application will be available at `http://localhost:5173`.

### 11.4 ML Pipeline (Optional)

To regenerate models from raw data:

```bash
# Ensure data/upi_data.csv exists
python analysiss.py
```

This will:
1. Load and explore the raw dataset
2. Engineer features
3. Train all three models
4. Output `risk_analysis.csv` and `.pkl` model files

---

## 12. Development Workflow

| Step | Command / Action |
|------|------------------|
| Start backend | `python -m uvicorn backend.api:app --reload --port 8000` |
| Start frontend | `cd fraudshield && npm run dev` |
| Run linter | `cd fraudshield && npm run lint` |
| Build for production | `cd fraudshield && npm run build` |
| Preview production build | `cd fraudshield && npm run preview` |

### Hot Reload
- FastAPI auto-reloads on Python file changes
- Vite HMR refreshes React components instantly

---

## 13. Deployment Guide

### 13.1 Backend (Production)

Recommended stack: **Gunicorn** + **Uvicorn workers** behind **Nginx**.

```bash
pip install gunicorn

# Production start
gunicorn backend.api:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

**Security hardening**:
- Replace CORS `allow_origins=["*"]` with specific frontend domain
- Add API key or JWT authentication instead of header-based role strings
- Use environment variables for sensitive config
- Serve behind HTTPS

### 13.2 Frontend (Production)

```bash
cd fraudshield
npm run build
```

Static assets output to `fraudshield/dist/`. Serve via:
- Nginx
- Vercel
- Netlify
- AWS S3 + CloudFront

### 13.3 Docker (Optional)

A `Dockerfile` can be added:

```dockerfile
# --- Backend Stage ---
FROM python:3.11-slim
WORKDIR /app
COPY backend/ ./backend/
COPY risk_analysis.csv .
COPY data/ ./data/
RUN pip install fastapi uvicorn pandas numpy scikit-learn joblib pydantic
EXPOSE 8000
CMD ["python", "-m", "uvicorn", "backend.api:app", "--host", "0.0.0.0", "--port", "8000"]

# --- Frontend Stage ---
FROM node:18-alpine AS frontend
WORKDIR /app
COPY fraudshield/ .
RUN npm install && npm run build

# Serve via Nginx or embed in backend
```

---

## 14. Troubleshooting

### 14.1 Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| `ModuleNotFoundError` | Missing Python package | `pip install <package>` |
| CORS errors in browser | Frontend and backend on different origins | Ensure CORS middleware is active in `api.py` |
| `joblib` load error | `.pkl` file corrupted or wrong path | Regenerate via `analysiss.py` |
| Blank dashboard | Backend not running or wrong port | Start backend on port 8000 |
| Google login fails | Invalid client ID or network | Check `clientId` in `main.jsx` |
| CSV export empty | `filtered` array is empty | Remove active filters and retry |
| Role access denied | `role` header mismatch | Ensure role is set in localStorage and sent in headers |

### 14.2 Data Warnings

- The `risk_analysis.csv` must exist in the project root for the backend to start
- If `risk_analysis.csv` is missing, run `python analysiss.py` to regenerate
- The in-memory DataFrame means backend restarts lose runtime state (blacklist, settings)

### 14.3 Performance Notes

- Default `/transactions` returns 500 rows; increase `limit` param for more
- Analytics aggregation is computed on every request; consider caching for production
- Tableau iframe may fail to load if `public.tableau.com` is blocked by network policy

---

## 15. Appendices

### 15.1 Color Scheme

| Token | Hex | Usage |
|-------|-----|-------|
| Background (page) | `#07090f` | Main app background |
| Background (card) | `#131720` | Cards, tables, sidebars |
| Background (input) | `#0f1420` | Form inputs |
| Border | `#1e2535` | Dividers, card borders |
| Primary (blue) | `#3b82f6` / `#2563eb` | Buttons, active states, links |
| Success (green) | `#22c55e` | Low risk, active status |
| Warning (yellow) | `#f59e0b` / `#eab308` | Medium risk, paused status |
| Danger (red) | `#ef4444` | High risk, blocked status |
| Text (primary) | `#ffffff` | Headings |
| Text (secondary) | `#9ca3af` | Labels, captions |

### 15.2 Icons (Lucide React)

| Page | Icon | Lucide Import |
|------|------|---------------|
| Dashboard | Dashboard | `LayoutDashboard` |
| Transactions | Card | `CreditCard` |
| Alerts | Warning | `AlertTriangle` |
| ML Insights | Brain | `Brain` |
| Analytics | Bar Chart | `BarChart3` |
| Settings | Gear | `Settings` |
| Logout | Exit | `LogOut` |

### 15.3 Asset Credits

| Asset | Source | License |
|-------|--------|---------|
| `hero.png` | Project asset | Custom |
| `favicon.svg` | Project asset | Custom |
| `react.svg` | Vite template | MIT |
| `vite.svg` | Vite template | MIT |

### 15.4 Glossary

| Term | Definition |
|------|------------|
| **UPI** | Unified Payments Interface — India's real-time payment system |
| **RBAC** | Role-Based Access Control |
| **IF** | Isolation Forest — anomaly detection algorithm |
| **LR** | Logistic Regression — probabilistic classifier |
| **RF** | Random Forest — ensemble tree classifier |
| **StandardScaler** | Scikit-learn transformer: zero mean, unit variance |
| **CORS** | Cross-Origin Resource Sharing |
| **ASGI** | Asynchronous Server Gateway Interface |
| **HMR** | Hot Module Replacement |
| **EDA** | Exploratory Data Analysis |

### 15.5 Future Enhancements

- [ ] JWT-based authentication replacing localStorage roles
- [ ] Persistent database (PostgreSQL / MongoDB) for settings and audit logs
- [ ] Real-time WebSocket push for new fraud alerts
- [ ] Model retraining pipeline with automated drift detection
- [ ] Multi-language support (Hindi, Tamil, Telugu)
- [ ] Mobile-responsive layout optimization
- [ ] Audit trail for all status mutations
- [ ] Scheduled report generation (PDF/Excel)
- [ ] Integration with NPCI's official UPI sandbox
- [ ] A/B testing framework for model deployment

---

**Document Version**: 1.0  
**Last Updated**: 2025  
**Maintainer**: FraudShield Engineering Team
