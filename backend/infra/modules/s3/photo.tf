

module "photo" {
  source = "./base"
  STAGE = var.STAGE
  BUCKET_NAME = var.PHOTOS_BUCKET
}