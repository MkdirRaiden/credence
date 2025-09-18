#!/bin/bash
# File: scripts/test-user-api.sh
# Usage: bash scripts/test-user-api.sh
# This script tests all user API endpoints with validation, unique constraint, success, and error cases.

BASE_URL="http://localhost:5000/users"

echo "==== 1. Validation Errors (Bad Request) ===="

echo -e "\n[Empty Body]"
curl -s -X POST $BASE_URL -H "Content-Type: application/json" -d '{}' | jq

echo -e "\n[Invalid Email]"
curl -s -X POST $BASE_URL -H "Content-Type: application/json" -d '{"email":"not-an-email","phone":"1234567890"}' | jq

echo -e "\n[Extra Field]"
curl -s -X POST $BASE_URL -H "Content-Type: application/json" -d '{"email":"alice2@example.com","phone":"1234567890","unknownField":"abc"}' | jq

echo "==== 2. Unique Constraint (Conflict) ===="

echo -e "\n[Duplicate Email/Phone]"
curl -s -X POST $BASE_URL -H "Content-Type: application/json" -d '{"email":"alice@example.com","phone":"1234567890","referralCode":"REF123"}' | jq

echo "==== 3. Successful User Creation ===="

# Create multiple users dynamically
for i in 1 2; do
  EMAIL="user$i@example.com"
  PHONE="900000000$i"
  REF="REF$i"
  echo -e "\n[Create $EMAIL]"
  RESPONSE=$(curl -s -X POST $BASE_URL -H "Content-Type: application/json" -d "{\"email\":\"$EMAIL\",\"phone\":\"$PHONE\",\"referralCode\":\"$REF\"}")
  echo $RESPONSE | jq

  # Extract ID and Email for further tests
  USER_ID=$(echo $RESPONSE | jq -r '.data.id')
  USER_EMAIL=$(echo $RESPONSE | jq -r '.data.email')

  echo "==== 4. Get User by ID ===="
  echo -e "\n[Existing ID: $USER_ID]"
  curl -s $BASE_URL/id/$USER_ID | jq

  echo -e "\n[Non-existing ID]"
  curl -s $BASE_URL/id/non-existing-id | jq

  echo "==== 5. Get User by Email ===="
  echo -e "\n[Existing Email: $USER_EMAIL]"
  curl -s $BASE_URL/email/$USER_EMAIL | jq

  echo -e "\n[Non-existing Email]"
  curl -s $BASE_URL/email/nonexistent@example.com | jq
done

echo "==== 6. Global Exception Fallback ===="
echo -e "\n[Force Error - example endpoint]"
curl -s $BASE_URL/force-error | jq
