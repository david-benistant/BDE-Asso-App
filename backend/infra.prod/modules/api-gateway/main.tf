resource "aws_apigatewayv2_api" "api" {
  name          = "bde-asso-api"
  protocol_type = "HTTP"

  cors_configuration {
    allow_origins = ["*"]
    allow_methods = ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    allow_headers = [
      "Content-Type",
      "Authorization",
      "X-Amz-Date",
      "X-Api-Key",
      "X-Amz-Security-Token"
    ]
  }
}

resource "aws_apigatewayv2_stage" "api_stage" {
  api_id      = aws_apigatewayv2_api.api.id
  name        = var.STAGE
  auto_deploy = true
}

output "api_stage_url" {
  value = aws_apigatewayv2_stage.api_stage.invoke_url
}

output "api_id" {
  value = aws_apigatewayv2_api.api.id
}

output "api_execution_arn" {
  value = aws_apigatewayv2_api.api.execution_arn
}
