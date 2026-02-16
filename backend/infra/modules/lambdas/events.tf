module "deploy_events" {

  namespace = "events"
  lambdas = {
    post = {
      path   = "../lambdas/events/src/routes/post"
      method = "POST"
      route  = "/events/club/{clubId}"
    }
    put = {
      path   = "../lambdas/events/src/routes/put"
      method = "POST"
      route  = "/events/club/{clubId}/{eventId}"
    }
    listByClub = {
      path   = "../lambdas/events/src/routes/list-by-club"
      method = "GET"
      route  = "/events/club/{clubId}/{visibility}"
    }
    subscribe = {
      path   = "../lambdas/events/src/routes/subscribe"
      method = "PUT"
      route  = "/events/club/{clubId}/subscribe/{id}"
    }
    unsubscribe = {
      path   = "../lambdas/events/src/routes/unsubscribe"
      method = "PUT"
      route  = "/events/club/{clubId}/unsubscribe/{id}"
    }
  }

  source = "./base"

  api_id = var.api_id
  api_execution_arn = var.api_execution_arn
  lambda_role_arn = aws_iam_role.lambda_role.arn
  JWT_SECRET = var.JWT_SECRET
}
