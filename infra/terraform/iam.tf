locals {
  account_id = data.aws_caller_identity.current.account_id
}

# --- The server's own role ---

data "aws_iam_policy_document" "server_assume" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["ec2.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "server" {
  name               = "boundaries-server"
  assume_role_policy = data.aws_iam_policy_document.server_assume.json
}

# Lets the SSM agent register the instance
resource "aws_iam_role_policy_attachment" "server_ssm" {
  role       = aws_iam_role.server.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

data "aws_iam_policy_document" "server" {
  statement {
    sid     = "ReadBoundariesParameters"
    actions = ["ssm:GetParameter", "ssm:GetParameters", "ssm:GetParametersByPath"]
    # GetParametersByPath is checked against the path itself, both ARNs needed
    resources = [
      "arn:aws:ssm:us-east-1:${local.account_id}:parameter/boundaries",
      "arn:aws:ssm:us-east-1:${local.account_id}:parameter/boundaries/*",
    ]
  }

  statement {
    sid       = "ListDumps"
    actions   = ["s3:ListBucket"]
    resources = [aws_s3_bucket.dumps.arn]
  }

  # Read, write, no delete
  statement {
    sid       = "ReadWriteDumps"
    actions   = ["s3:GetObject", "s3:PutObject"]
    resources = ["${aws_s3_bucket.dumps.arn}/boundaries/*"]
  }
}

resource "aws_iam_role_policy" "server" {
  name   = "boundaries-server"
  role   = aws_iam_role.server.id
  policy = data.aws_iam_policy_document.server.json
}

resource "aws_iam_instance_profile" "server" {
  name = "boundaries-server"
  role = aws_iam_role.server.name
}

# --- CI deploys from GitHub Actions ---

# One per AWS account
resource "aws_iam_openid_connect_provider" "github" {
  url            = "https://token.actions.githubusercontent.com"
  client_id_list = ["sts.amazonaws.com"]
}

data "aws_iam_policy_document" "deploy_assume" {
  statement {
    actions = ["sts:AssumeRoleWithWebIdentity"]
    principals {
      type        = "Federated"
      identifiers = [aws_iam_openid_connect_provider.github.arn]
    }
    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:aud"
      values   = ["sts.amazonaws.com"]
    }
    # Only workflows on main in this repo
    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:sub"
      values   = ["repo:BetaNYC/nyc-boundaries:ref:refs/heads/main"]
    }
  }
}

resource "aws_iam_role" "deploy" {
  name               = "boundaries-deploy"
  assume_role_policy = data.aws_iam_policy_document.deploy_assume.json
}

data "aws_iam_policy_document" "deploy" {
  statement {
    sid     = "RunShellOnServerOnly"
    actions = ["ssm:SendCommand"]
    resources = [
      aws_instance.server.arn,
      "arn:aws:ssm:us-east-1::document/AWS-RunShellScript",
    ]
  }

  # GetCommandInvocation has no resource-level permissions
  statement {
    sid       = "ReadCommandResults"
    actions   = ["ssm:GetCommandInvocation"]
    resources = ["*"]
  }
}

resource "aws_iam_role_policy" "deploy" {
  name   = "boundaries-deploy"
  role   = aws_iam_role.deploy.id
  policy = data.aws_iam_policy_document.deploy.json
}
