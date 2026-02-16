variable "STAGE" { type = string}

variable "AWS_ACCOUNT_ID" {
  type = string
}

variable "USERS_TABLE" { type = string }
variable "CLUBS_TABLE" { type = string }
variable "NOTIFICATIONS_TABLE" { type = string }
variable "JOIN_REQUEST_TABLE" { type = string }
variable "EVENTS_TABLE" { type = string }

variable "PROFILES_BUCKET" { type = string }
variable "PICTURES_BUCKET" { type = string }
variable "ATTACHMENTS_BUCKET" { type = string }
