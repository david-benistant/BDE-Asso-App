module "deploy_notifications" {

  namespace = "notifications"
  lambdas = {
    list = {
      path   = "../lambdas/notifications/src/routes/list"
      method = "GET"
      route  = "/notifications"
    }
  }

  source = "./base"

  api_id = var.api_id
  api_execution_arn = var.api_execution_arn
  lambda_role_arn = aws_iam_role.lambda_role.arn
  JWT_SECRET = var.JWT_SECRET
}
