

module "pictures" {
  source = "./base"
  STAGE = var.STAGE
  BUCKET_NAME = var.PICTURES_BUCKET
}