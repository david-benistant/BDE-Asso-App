module "deploy_clubs" {

  namespace = "clubs"
  lambdas = {
    post = {
      path   = "../lambdas/clubs/src/routes/post"
      method = "POST"
      route  = "/clubs"
    }
  }

  source = "./base"

  api_id = var.api_id
  api_execution_arn = var.api_execution_arn
  lambda_role_arn = aws_iam_role.lambda_role.arn
  JWT_SECRET = var.JWT_SECRET
}
