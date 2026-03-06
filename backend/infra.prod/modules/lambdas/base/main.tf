
variable "lambdas" {
  type = map(object({
    path   = string
    method = string
    route  = string
  }))
}
variable "namespace" { type =  string }
variable "api_id" { type =  string }
variable "api_execution_arn" { type =  string }
variable "lambda_role_arn" { type =  string }

data "archive_file" "lambdas_zip" {
  for_each   = var.lambdas
  type       = "zip"
  source_dir = "${each.value.path}/dist"
  output_path = "${each.value.path}/dist.zip"
}

resource "aws_lambda_function" "lambda" {
  for_each = var.lambdas

  function_name = "${var.namespace}-${each.key}-${var.STAGE}"
  runtime       = "nodejs20.x"
  handler       = "index.handler"
  role          = var.lambda_role_arn

  filename         = data.archive_file.lambdas_zip[each.key].output_path
  source_code_hash = filebase64sha256(data.archive_file.lambdas_zip[each.key].output_path)
  environment {
    variables = {
      JWT_SECRET = var.JWT_SECRET
      MAILGUN_KEY = var.MAILGUN_KEY
    }
  }
  timeout = 30
}


resource "aws_apigatewayv2_integration" "lambda_integration" {
  for_each = aws_lambda_function.lambda

  api_id           = var.api_id
  integration_type = "AWS_PROXY"
  integration_uri  = aws_lambda_function.lambda[each.key].arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "lambda_routes" {
  for_each = var.lambdas

  api_id    = var.api_id
  route_key = "${each.value.method} ${each.value.route}"
  target    = "integrations/${aws_apigatewayv2_integration.lambda_integration[each.key].id}"
}

resource "aws_lambda_permission" "apigw_invoke" {
  for_each = aws_lambda_function.lambda

  statement_id  = "AllowAPIGatewayInvoke-${each.key}"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.lambda[each.key].function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${var.api_execution_arn}/*/*"
}
