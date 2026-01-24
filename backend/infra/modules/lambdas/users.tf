module "deploy_users" {

  namespace = "users"
  lambdas = {
    get = {
      path   = "../lambdas/users/src/routes/get"
      method = "GET"
      route  = "/users/{id}"
    }
  }

  source = "./base"

  api_id = var.api_id
  api_execution_arn = var.api_execution_arn
  lambda_role_arn = aws_iam_role.lambda_role.arn
  JWT_SECRET = var.JWT_SECRET
}
