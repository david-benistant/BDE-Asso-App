module "deploy_auth" {

  namespace = "auth"
  lambdas = {
    login = {
      path   = "../lambdas/auth/src/routes/login"
      method = "POST"
      route  = "/auth/login"
    }
    revoke = {
      path   = "../lambdas/auth/src/routes/revoke"
      method = "GET"
      route  = "/auth/revoke"
    }
  }

  source = "./base"

  api_id = var.api_id
  api_execution_arn = var.api_execution_arn
  lambda_role_arn = aws_iam_role.lambda_role.arn
  JWT_SECRET = var.JWT_SECRET
}
