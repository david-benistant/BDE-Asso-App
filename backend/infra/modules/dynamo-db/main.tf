variable "STAGE" { type = string}

variable "USERS_TABLE" { type = string }
variable "CLUBS_TABLE" { type = string }

resource "aws_dynamodb_table" "user_table" {
  name           = "${var.USERS_TABLE}-${var.STAGE}"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "id"

  attribute {
    name = "id"
    type = "S"
  }

  attribute {
    name = "displayName"
    type = "S"
  }

  global_secondary_index {
    name            = "displayNameIndex"
    hash_key        = "displayName"
    projection_type = "ALL"
  }
}

resource "aws_dynamodb_table" "clubs_table" {
  name           = "${var.CLUBS_TABLE}-${var.STAGE}"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "id"

  attribute {
    name = "id"
    type = "S"
  }

  attribute {
    name = "name"
    type = "S"
  }

  global_secondary_index {
    name            = "nameIndex"
    hash_key        = "name"
    projection_type = "ALL"
  }
}
