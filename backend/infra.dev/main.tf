
terraform {
  backend "s3" {
    bucket         = "asso-app-terraform-state-bucket-dev"
    key            = "terraform.tfstate"
    region         = "eu-west-3"
    encrypt        = true
  }
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}


provider "aws" {
  region = "eu-west-3"
}

module "s3" {
  source = "./modules/s3"
  STAGE = local.STAGE
  PROFILES_BUCKET = var.PROFILES_BUCKET
  PICTURES_BUCKET = var.PICTURES_BUCKET
  ATTACHMENTS_BUCKET = var.ATTACHMENTS_BUCKET
}
module "dynamo-db" {
  source = "./modules/dynamo-db"
  STAGE = local.STAGE
  USERS_TABLE = var.USERS_TABLE
  CLUBS_TABLE = var.CLUBS_TABLE
  NOTIFICATIONS_TABLE = var.NOTIFICATIONS_TABLE
  JOIN_REQUEST_TABLE = var.JOIN_REQUEST_TABLE
  EVENTS_TABLE = var.EVENTS_TABLE
}

module "api-gateway" {
  source = "./modules/api-gateway"
  STAGE = local.STAGE
}


module "lambdas" {
  source = "./modules/lambdas"

  api_execution_arn = module.api-gateway.api_execution_arn
  api_id = module.api-gateway.api_id
  JWT_SECRET = var.JWT_SECRET
  MAILGUN_KEY = var.MAILGUN_KEY
  STAGE = local.STAGE
  USERS_TABLE = var.USERS_TABLE
  AWS_ACCOUNT_ID = var.AWS_ACCOUNT_ID
}

