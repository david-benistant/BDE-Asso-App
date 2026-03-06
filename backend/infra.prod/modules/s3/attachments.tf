

module "attachments" {
  source = "./base"
  STAGE = var.STAGE
  BUCKET_NAME = var.ATTACHMENTS_BUCKET
}