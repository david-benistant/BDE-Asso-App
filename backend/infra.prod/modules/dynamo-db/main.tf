variable "STAGE" { type = string}

variable "USERS_TABLE" { type = string }
variable "CLUBS_TABLE" { type = string }
variable "NOTIFICATIONS_TABLE" { type = string }
variable "JOIN_REQUEST_TABLE" { type = string }
variable "EVENTS_TABLE" { type = string }
resource "aws_dynamodb_table" "user_table" {
  name           = "${var.USERS_TABLE}-${var.STAGE}"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "id"
  deletion_protection_enabled = true

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
  deletion_protection_enabled = true

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

resource "aws_dynamodb_table" "notifications_table" {
  name           = "${var.NOTIFICATIONS_TABLE}-${var.STAGE}"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "userId"
  range_key      = "id"
  deletion_protection_enabled = true

  attribute {
    name = "userId"
    type = "S"
  }
  attribute {
    name = "id"
    type = "S"
  }
  ttl {
    attribute_name = "expiresAt"
    enabled        = true
  }
}

resource "aws_dynamodb_table" "join_request_table" {
  name           = "${var.JOIN_REQUEST_TABLE}-${var.STAGE}"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "clubId"
  range_key      = "userId"
  deletion_protection_enabled = true

  attribute {
    name = "clubId"
    type = "S"
  }

  attribute {
    name = "userId"
    type = "S"
  }
  ttl {
    attribute_name = "expiresAt"
    enabled        = true
  }
}

resource "aws_dynamodb_table" "events_table" {
  name           = "${var.EVENTS_TABLE}-${var.STAGE}"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "clubId"
  range_key      = "id"
  deletion_protection_enabled = true

  attribute {
    name = "clubId"
    type = "S"
  }

  attribute {
    name = "id"
    type = "S"
  }

  attribute {
    name = "weekBucket"
    type = "N"
  }

  ttl {
    attribute_name = "expiresAt"
    enabled        = true
  }

  global_secondary_index {
    name            = "weeksIndex"
    hash_key        = "weekBucket"
    projection_type = "ALL"
  }
}

