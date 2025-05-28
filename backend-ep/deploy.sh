#!/bin/bash

# Configurable
PROFILE="AdministratorAccess-878122414245"
REGION="ap-southeast-1"
REPO_NAME="ecopantry-prototype"
ACCOUNT_ID="878122414245"
IMAGE="$ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/$REPO_NAME:latest"

echo "🔐 Logging into ECR..."
aws ecr get-login-password --region $REGION --profile $PROFILE | \
  docker login --username AWS --password-stdin $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com

echo "🔨 Building Docker image for linux/amd64..."
docker buildx build --platform linux/amd64 -t $REPO_NAME .

echo "🏷️ Tagging image..."
docker tag $REPO_NAME:latest $IMAGE

echo "🚀 Pushing to ECR..."
docker push $IMAGE

echo "✅ Done! Image pushed to $IMAGE"
