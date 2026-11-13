terraform {
  required_version = ">= 1.10" # use_lockfile below needs 1.10+

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }

  # The bucket is created once with the AWS CLI
  backend "s3" {
    bucket       = "betanyc-boundaries-tfstate"
    key          = "boundaries/terraform.tfstate"
    region       = "us-east-1"
    use_lockfile = true
  }
}

provider "aws" {
  region = "us-east-1"

  default_tags {
    tags = {
      Project   = "boundaries-map"
      ManagedBy = "terraform"
    }
  }
}

data "aws_caller_identity" "current" {}

data "aws_vpc" "default" {
  default = true
}

# Newest Ubuntu 24.04 AMI ID here
data "aws_ssm_parameter" "ubuntu" {
  name = "/aws/service/canonical/ubuntu/server/24.04/stable/current/amd64/hvm/ebs-gp3/ami-id"
}

resource "aws_instance" "server" {
  ami                    = data.aws_ssm_parameter.ubuntu.insecure_value
  instance_type          = "t3.medium"
  vpc_security_group_ids = [aws_security_group.server.id]
  iam_instance_profile   = aws_iam_instance_profile.server.name
  user_data              = file("${path.module}/user_data.sh")
  # No SSH, access by SSM
  # IMDS issues credentials for IAM role
  metadata_options {
    http_tokens = "required" # IMDSv2 only
    # Reaching Dagster's Docker container via network bridge requires an additional hop
    http_put_response_hop_limit = 2
  }

  root_block_device {
    volume_type = "gp3"
    volume_size = 40
    encrypted   = true
  }

  tags = {
    Name = "boundaries"
  }

  lifecycle {
    # Don't rebuild server on new AMI. Changes to user_data apply to new instance
    ignore_changes = [ami, user_data]
    # Remove this line destroy or replace the server
    prevent_destroy = true
  }
}

resource "aws_eip" "server" {
  instance = aws_instance.server.id
  domain   = "vpc"

  tags = {
    Name = "boundaries"
  }

  lifecycle {
    # DNS points here. A released Elastic IP usually can't be claimed back
    prevent_destroy = true
  }
}

resource "aws_security_group" "server" {
  name        = "boundaries-server"
  description = "HTTP and HTTPS in, all out. No SSH."
  vpc_id      = data.aws_vpc.default.id
}

# IPv4 only
resource "aws_vpc_security_group_ingress_rule" "http" {
  security_group_id = aws_security_group.server.id
  description       = "Certificate validation and redirect to HTTPS" # AWS rejects apostrophes here
  cidr_ipv4         = "0.0.0.0/0"
  ip_protocol       = "tcp"
  from_port         = 80
  to_port           = 80
}

resource "aws_vpc_security_group_ingress_rule" "https" {
  security_group_id = aws_security_group.server.id
  description       = "API"
  cidr_ipv4         = "0.0.0.0/0"
  ip_protocol       = "tcp"
  from_port         = 443
  to_port           = 443
}

# Terraform removes the allow-all egress rule AWS adds to new groups
resource "aws_vpc_security_group_egress_rule" "all" {
  security_group_id = aws_security_group.server.id
  cidr_ipv4         = "0.0.0.0/0"
  ip_protocol       = "-1"
}

resource "aws_s3_bucket" "dumps" {
  bucket = "betanyc-boundaries-dumps"
}

# The server can't delete dumps. An overwrite keeps the old dump as a prior version
resource "aws_s3_bucket_versioning" "dumps" {
  bucket = aws_s3_bucket.dumps.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_public_access_block" "dumps" {
  bucket                  = aws_s3_bucket.dumps.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

output "instance_id" {
  value = aws_instance.server.id
}

output "public_ip" {
  value = aws_eip.server.public_ip
}

output "deploy_role_arn" {
  value = aws_iam_role.deploy.arn
}

output "dumps_bucket" {
  value = aws_s3_bucket.dumps.bucket
}
