# Virtual Office Infrastructure

Terraform configurations for deploying Virtual AI Office to AWS.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     CloudFront CDN                       │
│                  (Frontend Distribution)                 │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│                   S3 Static Website                      │
│              (React Frontend Build)                      │
└──────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                Application Load Balancer                 │
│                    (Backend API)                         │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│                    ECS Fargate                           │
│              (Backend Node.js + Socket.io)               │
│                                                           │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐         │
│  │  Task 1    │  │  Task 2    │  │  Task 3    │         │
│  │  (Backend) │  │  (Backend) │  │  (Backend) │         │
│  └────────────┘  └────────────┘  └────────────┘         │
│                                                           │
│              Auto-scaling (1-4 tasks)                     │
└──────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                         VPC                              │
│                                                           │
│  ┌──────────────────┐  ┌──────────────────┐             │
│  │  Public Subnet   │  │  Public Subnet   │             │
│  │    (AZ 1)        │  │    (AZ 2)        │             │
│  │  - NAT Gateway   │  │  - NAT Gateway   │             │
│  │  - ALB           │  │  - ALB           │             │
│  └──────────────────┘  └──────────────────┘             │
│                                                           │
│  ┌──────────────────┐  ┌──────────────────┐             │
│  │ Private Subnet   │  │ Private Subnet   │             │
│  │    (AZ 1)        │  │    (AZ 2)        │             │
│  │  - ECS Tasks     │  │  - ECS Tasks     │             │
│  └──────────────────┘  └──────────────────┘             │
└──────────────────────────────────────────────────────────┘
```

## Resources Created

### Frontend
- **S3 Bucket** - Static website hosting
- **CloudFront Distribution** - Global CDN
- **CloudFront Origin Access Identity** - Secure S3 access

### Backend
- **ECR Repository** - Docker image storage
- **ECS Cluster** - Container orchestration
- **ECS Service** - Backend application (Fargate)
- **Application Load Balancer** - Traffic distribution
- **Auto Scaling** - Dynamic scaling (1-4 tasks)
- **CloudWatch Logs** - Centralized logging

### Networking
- **VPC** - Isolated network (10.0.0.0/16)
- **Public Subnets** (2) - ALB and NAT Gateways
- **Private Subnets** (2) - ECS tasks
- **Internet Gateway** - Public internet access
- **NAT Gateways** (2) - Outbound internet for private subnets
- **Security Groups** - Firewall rules

## Prerequisites

1. **AWS Account** with appropriate permissions
2. **AWS CLI** configured
   ```bash
   aws configure
   ```
3. **Terraform** >= 1.0 installed
   ```bash
   terraform --version
   ```
4. **Docker** (for building backend image)
5. **Anthropic API Key** from https://console.anthropic.com/

## Deployment Steps

### 1. Configure Terraform Variables

```bash
cd infrastructure
cp terraform.tfvars.example terraform.tfvars
```

Edit `terraform.tfvars`:
```hcl
aws_region          = "us-east-1"
environment         = "dev"
anthropic_api_key   = "your-actual-api-key-here"
```

### 2. Initialize Terraform

```bash
terraform init
```

### 3. Review Plan

```bash
terraform plan
```

### 4. Deploy Infrastructure

```bash
terraform apply
```

Type `yes` to confirm. This takes ~10-15 minutes.

### 5. Build and Push Backend Docker Image

After infrastructure is created, get the ECR repository URL from outputs:

```bash
export ECR_URL=$(terraform output -raw backend_ecr_repository | cut -d'/' -f1)
export ECR_REPO=$(terraform output -raw backend_ecr_repository)

# Create Dockerfile for backend
cd ../backend
cat > Dockerfile <<'EOF'
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["node", "dist/index.js"]
EOF

# Build and push
docker build -t $ECR_REPO:latest .
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin $ECR_URL
docker push $ECR_REPO:latest
```

### 6. Build and Deploy Frontend

```bash
cd ../frontend

# Update .env with production URLs
export BACKEND_URL=$(cd ../infrastructure && terraform output -raw backend_url)
cat > .env.production <<EOF
VITE_API_URL=$BACKEND_URL
VITE_WS_URL=ws://${BACKEND_URL#http://}
EOF

# Build
npm run build

# Deploy to S3
export S3_BUCKET=$(cd ../infrastructure && terraform output -raw frontend_s3_bucket)
aws s3 sync dist/ s3://$S3_BUCKET/

# Invalidate CloudFront cache
export CF_DIST_ID=$(cd ../infrastructure && terraform output -raw cloudfront_distribution_id)
aws cloudfront create-invalidation --distribution-id $CF_DIST_ID --paths "/*"
```

### 7. Access Your Application

```bash
cd ../infrastructure
echo "Frontend: $(terraform output -raw frontend_url)"
echo "Backend: $(terraform output -raw backend_url)"
```

## Terraform Modules

### networking
- VPC, subnets, route tables, NAT gateways
- Multi-AZ for high availability

### s3-cloudfront
- S3 bucket for static hosting
- CloudFront distribution with HTTPS

### ecs
- ECS cluster and service
- Application Load Balancer
- Auto-scaling policies
- ECR repository

## Cost Estimation

**Monthly costs (us-east-1, approximate):**

- ECS Fargate (1 task, 0.25 vCPU, 0.5GB): ~$12/month
- Application Load Balancer: ~$20/month
- NAT Gateways (2): ~$65/month
- S3 + CloudFront: ~$1-5/month (depends on traffic)
- **Total: ~$100-110/month**

To reduce costs:
- Use 1 NAT Gateway instead of 2 (removes high availability)
- Use smaller ECS task sizes
- Stop services when not in use

## Environment Variables

### Backend (set in ECS task definition)
- `ANTHROPIC_API_KEY` - Claude API key
- `PORT` - Server port (3000)
- `NODE_ENV` - Environment (production)
- `CORS_ORIGIN` - Frontend URL

### Frontend (set during build)
- `VITE_API_URL` - Backend API URL
- `VITE_WS_URL` - WebSocket URL

## Updating the Application

### Update Backend
```bash
cd backend
docker build -t $ECR_REPO:latest .
docker push $ECR_REPO:latest

# Force new deployment
aws ecs update-service \
  --cluster dev-virtual-office-cluster \
  --service dev-virtual-office-backend \
  --force-new-deployment
```

### Update Frontend
```bash
cd frontend
npm run build
aws s3 sync dist/ s3://$S3_BUCKET/ --delete
aws cloudfront create-invalidation --distribution-id $CF_DIST_ID --paths "/*"
```

## Monitoring

### CloudWatch Logs
```bash
# View backend logs
aws logs tail /ecs/dev-virtual-office-backend --follow
```

### ECS Service Status
```bash
aws ecs describe-services \
  --cluster dev-virtual-office-cluster \
  --services dev-virtual-office-backend
```

### Application Health
```bash
curl $(terraform output -raw backend_url)/health
```

## Cleanup

To destroy all resources:

```bash
cd infrastructure
terraform destroy
```

Type `yes` to confirm.

**Note:** Make sure to empty the S3 bucket before destroying:
```bash
aws s3 rm s3://$S3_BUCKET --recursive
```

## Troubleshooting

### ECS Tasks Not Starting
- Check CloudWatch Logs: `/ecs/dev-virtual-office-backend`
- Verify ECR image exists
- Check security group rules

### Frontend Not Loading
- Check S3 bucket policy
- Verify CloudFront distribution is deployed
- Check browser console for CORS errors

### WebSocket Connection Failing
- Verify ALB security group allows WebSocket
- Check backend logs for connection errors
- Ensure frontend uses correct WebSocket URL

## Security Best Practices

1. **Enable AWS WAF** on CloudFront and ALB
2. **Use AWS Secrets Manager** for sensitive data
3. **Enable VPC Flow Logs** for network monitoring
4. **Set up AWS GuardDuty** for threat detection
5. **Enable CloudTrail** for audit logs
6. **Use custom domain** with ACM certificate for HTTPS
7. **Implement authentication** before production

## Custom Domain Setup

1. Request ACM certificate in `us-east-1`
2. Add to `terraform.tfvars`:
   ```hcl
   domain_name     = "virtual-office.yourdomain.com"
   certificate_arn = "arn:aws:acm:us-east-1:xxx:certificate/xxx"
   ```
3. Update Route53 DNS records to point to CloudFront

## Support

For issues, check:
- CloudWatch Logs
- ECS Service Events
- CloudFront Distribution Status
- S3 Bucket Permissions
