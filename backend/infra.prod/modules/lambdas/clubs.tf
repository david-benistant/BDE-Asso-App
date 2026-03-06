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

    follow = {
      path   = "../lambdas/clubs/src/routes/follow"
      method = "PUT"
      route  = "/clubs/{id}/follow"
    }

    unfollow = {
      path   = "../lambdas/clubs/src/routes/unfollow"
      method = "PUT"
      route  = "/clubs/{id}/unfollow"
    }

    join = {
      path   = "../lambdas/clubs/src/routes/join"
      method = "PUT"
      route  = "/clubs/{id}/join"
    }

    accectJoin = {
      path   = "../lambdas/clubs/src/routes/accept-join"
      method = "PUT"
      route  = "/clubs/{id}/join/accept"
    }
    refuseJoin = {
      path   = "../lambdas/clubs/src/routes/refuse-join"
      method = "PUT"
      route  = "/clubs/{id}/join/refuse"
    }
    pendingJoin = {
      path   = "../lambdas/clubs/src/routes/pending-join"
      method = "GET"
      route  = "/clubs/{id}/join/pending"
    }
    putMember = {
      path   = "../lambdas/clubs/src/routes/put-members"
      method = "PUT"
      route  = "/clubs/{id}/members"
    }
    deleteMember = {
      path   = "../lambdas/clubs/src/routes/delete-member"
      method = "DELETE"
      route  = "/clubs/{id}/members/{userId}"
    }

    listPending = {
      path   = "../lambdas/clubs/src/routes/list-pending"
      method = "GET"
      route  = "/clubs/{id}/join/pendings"
    }

    leave = {
      path   = "../lambdas/clubs/src/routes/leave"
      method = "PUT"
      route  = "/clubs/{id}/leave"
    }

    put-president = {
      path   = "../lambdas/clubs/src/routes/put-president"
      method = "PUT"
      route  = "/clubs/{id}/president/{memberId}"
    }

    
  }

  source = "./base"

  api_id = var.api_id
  api_execution_arn = var.api_execution_arn
  lambda_role_arn = aws_iam_role.lambda_role.arn
  JWT_SECRET = var.JWT_SECRET
  MAILGUN_KEY = var.MAILGUN_KEY
  STAGE = var.STAGE
}
