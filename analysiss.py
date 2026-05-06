# ================== IMPORTS ==================
import pandas as pd
import numpy as np

from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import IsolationForest, RandomForestClassifier
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime, timedelta

# ================== LOAD DATA ==================
df = pd.read_csv("data/upi_data.csv")

print("First 5 rows:\n", df.head())

print("\nFraud count:\n", df['isFraud'].value_counts())
print("\nFraud Percentage:\n", df['isFraud'].value_counts(normalize=True) * 100)

# ================== ADD SYNTHETIC COLUMNS ==================
np.random.seed(42)

df['upi_app'] = np.random.choice(['GPay', 'PhonePe', 'Paytm','AmazonPay','BHIM'], len(df))
df['device_type'] = np.random.choice(['Android', 'iOS'], len(df))
df['location'] = np.random.choice(['Mumbai', 'Delhi', 'Bangalore','Pune','Hyderabad'], len(df))

# ================== ADD REALISTIC TIMESTAMP ==================

start_time = datetime.now() - timedelta(days=30)

df['timestamp'] = [
    start_time + timedelta(minutes=i)
    for i in range(len(df))
]

# ================== BASIC ANALYSIS ==================
print("\nFraud by transaction type:\n", df.groupby('type')['isFraud'].mean())
print("\nAverage amount (fraud vs normal):\n", df.groupby('isFraud')['amount'].mean())

# ================== FEATURE ENGINEERING ==================

df['balance_error'] = df['oldbalanceOrg'] - df['newbalanceOrig'] - df['amount']
df['amount_ratio'] = df['amount'] / (df['oldbalanceOrg'] + 1)

# ================== DEFINE FEATURES ==================
X = df[['amount','oldbalanceOrg','newbalanceOrig',
        'oldbalanceDest','newbalanceDest',
        'balance_error','amount_ratio']]

y = df['isFraud']

# ================== TRAIN TEST SPLIT ==================
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

X_train = X_train.copy()
X_test = X_test.copy()

threshold = X_train['amount'].quantile(0.95)

X_train['is_large_txn'] = (X_train['amount'] > threshold).astype(int)
X_test['is_large_txn'] = (X_test['amount'] > threshold).astype(int)

print("\nFeature sample:\n", X_train.head())

# ================== ISOLATION FOREST ==================
model = IsolationForest(contamination=0.001, random_state=42)
model.fit(X_train)

y_pred_iso = model.predict(X_test)
y_pred_iso = np.where(y_pred_iso == -1, 1, 0)

print("\nIsolation Forest Evaluation:\n")
print(classification_report(y_test, y_pred_iso))

# ================== LOGISTIC REGRESSION ==================

# Scaling required
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

lr_model = LogisticRegression(max_iter=1000, class_weight='balanced')
lr_model.fit(X_train_scaled, y_train)

# Probability-based prediction
y_prob_lr = lr_model.predict_proba(X_test_scaled)[:, 1]
y_pred_lr = (y_prob_lr > 0.7).astype(int)

print("\nLogistic Regression Evaluation:\n")
print(classification_report(y_test, y_pred_lr))

# ================== RANDOM FOREST ==================
rf_model = RandomForestClassifier(
    n_estimators=20,
    class_weight='balanced',
    random_state=42,
    n_jobs=-1
)

rf_model.fit(X_train, y_train)

y_prob_rf = rf_model.predict_proba(X_test)[:, 1]
y_pred_rf = (y_prob_rf > 0.7).astype(int)

print("\nRandom Forest Evaluation:\n")
print(classification_report(y_test, y_pred_rf))

# ================== USE BEST MODEL ==================
y_prob = y_prob_lr  # Using Logistic Regression probabilities for risk analysis

# ================== RISK CATEGORIZATION ==================

def risk_category(prob):
    if prob > 0.7:
        return "High Risk"
    elif prob > 0.3:
        return "Medium Risk"
    else:
        return "Low Risk"

X_test_copy = X_test.copy()

X_test_copy['fraud_probability'] = y_prob
X_test_copy['risk_level'] = [risk_category(p) for p in y_prob]
X_test_copy['actual'] = y_test.values

print("\nSample Predictions:\n")
print(X_test_copy[['fraud_probability', 'risk_level', 'actual']].head())

# ================== RISK ANALYSIS ==================

print("\nRisk Level Distribution:\n")
print(X_test_copy['risk_level'].value_counts())

print("\nFraud distribution by risk level:\n")
print(X_test_copy.groupby('risk_level')['actual'].mean())

print("\nProbability Range:")
print("Max:", y_prob.max())
print("Min:", y_prob.min())

# ================== Visualization ==================

# Fraud vs Normal
sns.countplot(x=y)
plt.title("Fraud vs Normal Transactions")
plt.show()

# Risk Level Distribution
sns.countplot(x=X_test_copy['risk_level'])
plt.title("Risk Level Distribution")
plt.show()

X_test_copy['upi_app'] = df.loc[X_test.index, 'upi_app']
X_test_copy['location'] = df.loc[X_test.index, 'location']
X_test_copy['timestamp'] = df.loc[X_test.index, 'timestamp']

X_test_copy.to_csv("risk_analysis.csv", index=False)

# ================== Job Lib ==================
import joblib

joblib.dump(lr_model, "backend/lr_model.pkl")
joblib.dump(scaler, "backend/scaler.pkl")
joblib.dump(rf_model, "backend/rf_model.pkl")
joblib.dump(model, "backend/if_model.pkl")