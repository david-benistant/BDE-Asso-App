
terraform {
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
  STAGE = var.STAGE
  PROFILES_BUCKET = var.PROFILES_BUCKET
  PICTURES_BUCKET = var.PICTURES_BUCKET
}
module "dynamo-db" {
  source = "./modules/dynamo-db"
  STAGE = var.STAGE
  USERS_TABLE = var.USERS_TABLE
  CLUBS_TABLE = var.CLUBS_TABLE
}

module "api-gateway" {
  source = "./modules/api-gateway"
}


module "lambdas" {
  source = "./modules/lambdas"

  api_execution_arn = module.api-gateway.api_execution_arn
  api_id = module.api-gateway.api_id
  JWT_SECRET = var.JWT_SECRET
  STAGE = var.STAGE
  USERS_TABLE = var.USERS_TABLE
  AWS_ACCOUNT_ID = var.AWS_ACCOUNT_ID
}

