#!/bin/bash
set -e

echo "🏗️  Setting up AWS Infrastructure..."

cd infrastructure

# Check if terraform.tfvars exists
if [ ! -f terraform.tfvars ]; then
    echo "⚠️  terraform.tfvars not found. Creating from example..."
    cp terraform.tfvars.example terraform.tfvars
    echo "❗ Please edit infrastructure/terraform.tfvars and add your settings, especially ANTHROPIC_API_KEY"
    exit 1
fi

# Initialize Terraform
echo "🔧 Initializing Terraform..."
terraform init

# Validate configuration
echo "✅ Validating Terraform configuration..."
terraform validate

# Plan
echo "📋 Creating Terraform plan..."
terraform plan -out=tfplan

echo ""
echo "Review the plan above. To apply, run:"
echo "  cd infrastructure && terraform apply tfplan"
echo ""
echo "Or run the full deployment:"
echo "  cd infrastructure && terraform apply"
