#!/bin/bash
set -e

echo "🚀 Deploying Backend to AWS..."

# Get infrastructure outputs
cd infrastructure
ECR_REPO=$(terraform output -raw backend_ecr_repository)
ECR_URL=$(echo $ECR_REPO | cut -d'/' -f1)
AWS_REGION=$(terraform output -json aws_region | jq -r . || echo "us-east-1")
ECS_CLUSTER=$(terraform output -raw ecs_cluster_name)
ECS_SERVICE=$(terraform output -raw ecs_service_name)
cd ..

# Build and push Docker image
cd backend
echo "🐳 Building Docker image..."
docker build -t $ECR_REPO:latest .

echo "🔐 Logging in to ECR..."
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_URL

echo "☁️  Pushing to ECR..."
docker push $ECR_REPO:latest

cd ..

# Force new deployment
echo "🔄 Updating ECS service..."
aws ecs update-service \
  --cluster $ECS_CLUSTER \
  --service $ECS_SERVICE \
  --force-new-deployment \
  --region $AWS_REGION

echo "✅ Backend deployed successfully!"
echo "⏳ Waiting for deployment to complete (this may take a few minutes)..."
echo "📊 Check status: aws ecs describe-services --cluster $ECS_CLUSTER --services $ECS_SERVICE --region $AWS_REGION"
