
terraform {
  backend "s3" {
    bucket         = "asso-app-terraform-state-bucket-front"
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


resource "aws_s3_bucket" "react_bucket" {
  bucket = "asso-app-front-${var.STAGE}"
}

resource "aws_s3_object" "react_build" {

  for_each = {
    for file in fileset("${path.module}/../dist", "**") :
    file => file
    if !endswith(file, "/")
  }

  bucket = aws_s3_bucket.react_bucket.id
  key    = each.key
  source = "${path.module}/../dist/${each.value}"
  etag   = filemd5("${path.module}/../dist/${each.value}")

  content_type = lookup({
    html = "text/html"
    js   = "application/javascript"
    css  = "text/css"
    png  = "image/png"
    jpg  = "image/jpeg"
    jpeg = "image/jpeg"
    svg  = "image/svg+xml"
    json = "application/json"
    map  = "application/json"
    ico  = "image/x-icon"
  }, element(reverse(split(".", each.key)), 0), "binary/octet-stream")
}

resource "aws_cloudfront_invalidation" "react_cache_invalidation" {

  distribution_id = var.CLOUDFRONT_ID

  paths = [
    "/*"
  ]

  depends_on = [
    aws_s3_object.react_build
  ]
}