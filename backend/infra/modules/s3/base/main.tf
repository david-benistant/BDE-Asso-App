variable "STAGE" { type = string}
variable "BUCKET_NAME" { type = string}

resource "aws_s3_bucket" "bucket" {
  bucket = "${var.BUCKET_NAME}-${var.STAGE}"
}

resource "aws_s3_bucket_cors_configuration" "cors" {
  bucket = aws_s3_bucket.bucket.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "PUT", "POST", "DELETE", "HEAD"]
    allowed_origins = ["*"]
    max_age_seconds = 3000
    expose_headers  = []
  }
}
