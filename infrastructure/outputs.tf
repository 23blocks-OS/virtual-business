output "frontend_url" {
  description = "CloudFront URL for frontend"
  value       = module.frontend.cloudfront_url
}

output "frontend_s3_bucket" {
  description = "S3 bucket name for frontend"
  value       = module.frontend.s3_bucket_name
}

output "backend_url" {
  description = "ALB URL for backend API"
  value       = module.backend.alb_dns_name
}

output "backend_ecr_repository" {
  description = "ECR repository URL for backend"
  value       = module.backend.ecr_repository_url
}

output "vpc_id" {
  description = "VPC ID"
  value       = module.networking.vpc_id
}

output "deployment_instructions" {
  description = "Next steps for deployment"
  value       = <<-EOT

    ✅ Infrastructure Created Successfully!

    Next Steps:

    1. Build and push backend Docker image:
       cd ../backend
       docker build -t ${module.backend.ecr_repository_url}:latest .
       aws ecr get-login-password --region ${var.aws_region} | docker login --username AWS --password-stdin ${module.backend.ecr_repository_url}
       docker push ${module.backend.ecr_repository_url}:latest

    2. Build and deploy frontend:
       cd ../frontend
       npm run build
       aws s3 sync dist/ s3://${module.frontend.s3_bucket_name}/
       aws cloudfront create-invalidation --distribution-id <DISTRIBUTION_ID> --paths "/*"

    3. Update frontend environment variables:
       VITE_API_URL=${module.backend.alb_dns_name}
       VITE_WS_URL=ws://${module.backend.alb_dns_name}

    4. Access your application:
       Frontend: ${module.frontend.cloudfront_url}
       Backend:  ${module.backend.alb_dns_name}

  EOT
}
