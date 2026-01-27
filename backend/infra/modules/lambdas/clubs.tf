module "deploy_clubs" {

  namespace = "clubs"
  lambdas = {
    post = {
      path   = "../lambdas/clubs/src/routes/post"
      method = "POST"
      route  = "/clubs"
    }
    get = {
      path   = "../lambdas/clubs/src/routes/get"
      method = "GET"
      route  = "/clubs/{id}"
    }
    list = {
      path   = "../lambdas/clubs/src/routes/list"
      method = "GET"
      route  = "/clubs"
    }

    put = {
      path   = "../lambdas/clubs/src/routes/put"
      method = "PUT"
      route  = "/clubs/{id}"
    }

    put-thumbnail = {
      path   = "../lambdas/clubs/src/routes/put-thumbnail"
      method = "PUT"
      route  = "/clubs/{id}/thumbnail"
    }

    put-picutres = {
      path   = "../lambdas/clubs/src/routes/put-pictures"
      method = "PUT"
      route  = "/clubs/{id}/pictures"
    }

    delete-picutres = {
      path   = "../lambdas/clubs/src/routes/delete-pictures"
      method = "PUT"
      route  = "/clubs/{id}/pictures/delete"
    }
  }

  source = "./base"

  api_id = var.api_id
  api_execution_arn = var.api_execution_arn
  lambda_role_arn = aws_iam_role.lambda_role.arn
  JWT_SECRET = var.JWT_SECRET
}
