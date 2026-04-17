variable "region" {
  type    = string
  default = "us-east-1"
}

variable "public_domain" {
  type        = string
  description = "Dominio público DuckDNS para el frontend (Certbot + HTTPS)"
  default     = "j-j-proyect.duckdns.org"
}

variable "internal_domain" {
  type        = string
  description = "Zona DNS privada interna para comunicación entre instancias EC2"
  default     = "jj.internal"
}

variable "key_name" {
  type    = string
  default = "vockey"
}
