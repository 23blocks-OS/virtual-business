#!/bin/bash
set -e

echo "🗑️  Tearing down AWS Infrastructure..."
echo "⚠️  WARNING: This will destroy all resources!"
read -p "Are you sure? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "Cancelled."
    exit 0
fi

cd infrastructure

# Get S3 bucket name before destroying
S3_BUCKET=$(terraform output -raw frontend_s3_bucket 2>/dev/null || echo "")

if [ ! -z "$S3_BUCKET" ]; then
    echo "🗑️  Emptying S3 bucket..."
    aws s3 rm s3://$S3_BUCKET --recursive || true
fi

# Destroy
echo "💥 Destroying infrastructure..."
terraform destroy

echo "✅ Infrastructure destroyed successfully!"
