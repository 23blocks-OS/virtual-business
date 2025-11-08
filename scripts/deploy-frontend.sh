#!/bin/bash
set -e

echo "🚀 Deploying Frontend to AWS..."

# Get infrastructure outputs
cd infrastructure
BACKEND_URL=$(terraform output -raw backend_url)
S3_BUCKET=$(terraform output -raw frontend_s3_bucket)
CF_DIST_ID=$(terraform output -json cloudfront_distribution_id | jq -r .)
cd ..

# Build frontend
cd frontend
echo "📦 Building frontend..."

# Create production env
cat > .env.production <<EOF
VITE_API_URL=$BACKEND_URL
VITE_WS_URL=ws://${BACKEND_URL#http://}
EOF

npm run build

# Upload to S3
echo "☁️  Uploading to S3..."
aws s3 sync dist/ s3://$S3_BUCKET/ --delete

# Invalidate CloudFront cache
echo "🔄 Invalidating CloudFront cache..."
aws cloudfront create-invalidation --distribution-id $CF_DIST_ID --paths "/*"

cd ..

echo "✅ Frontend deployed successfully!"
echo "🌐 URL: https://$(cd infrastructure && terraform output -json frontend_url | jq -r . | sed 's|https://||')"
