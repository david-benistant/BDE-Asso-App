

module "profiles" {
  source = "./base"
  STAGE = var.STAGE
  BUCKET_NAME = var.PROFILES_BUCKET
}