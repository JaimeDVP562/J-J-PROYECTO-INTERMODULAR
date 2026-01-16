terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
      version = "6.28.0"
    }
  }
}

provider "aws" {
  region = var.region
}

#################################
# GRUPOS DE SEGURIDAD Y REGLAS
#################################

#GRUPOS

resource "aws_security_group" "bastion" {
    name = "bastion"
    description = "Grupo de seguridad para bastion"
}

resource "aws_security_group" "frontend" {
    name = "frontend"
    description = "Grupo de seguridad para frontend"
}

resource "aws_security_group" "api" {
    name = "api"
    description = "Grupo de seguridad para api"
}

#REGLAS BASTION

resource "aws_vpc_security_group_ingress_rule" "bastion_ssh" {
    security_group_id = aws_security_group.bastion.id
    ip_protocol = "tcp"
    from_port = 22
    to_port = 22
    cidr_ipv4 = "0.0.0.0/0"
}

resource "aws_vpc_security_group_egress_rule" "bastion_egress" {
    security_group_id = aws_security_group.bastion.id
    ip_protocol = "-1"
    from_port = 0
    to_port = 0
    cidr_ipv4 = "0.0.0.0/0"
}

#REGLAS FRONTEND

resource "aws_vpc_security_group_ingress_rule" "frontend_ssh" {
    security_group_id = aws_security_group.frontend.id
    ip_protocol = "tcp"
    from_port = 22
    to_port = 22
    referenced_security_group_id = aws_security_group.bastion.id
}

resource "aws_vpc_security_group_ingress_rule" "frontend_http" {
    security_group_id = aws_security_group.frontend.id
    ip_protocol = "tcp"
    from_port = 80
    to_port = 80
    cidr_ipv4 = "0.0.0.0/0"
}

resource "aws_vpc_security_group_ingress_rule" "frontend_https" {
    security_group_id = aws_security_group.frontend.id
    ip_protocol = "tcp"
    from_port = 443
    to_port = 443
    cidr_ipv4 = "0.0.0.0/0"
}

resource "aws_vpc_security_group_egress_rule" "frontend_egress" {
    security_group_id = aws_security_group.frontend.id
    ip_protocol = "-1"
    from_port = 0
    to_port = 0
    cidr_ipv4 = "0.0.0.0/0"
}

#REGLAS API

resource "aws_vpc_security_group_ingress_rule" "api_ssh" {
    security_group_id = aws_security_group.api.id
    ip_protocol = "tcp"
    from_port = 22
    to_port = 22
    referenced_security_group_id = aws_security_group.bastion.id
}

resource "aws_vpc_security_group_ingress_rule" "api_http" {
    security_group_id = aws_security_group.api.id
    ip_protocol = "tcp"
    from_port = 80
    to_port = 80
    referenced_security_group_id = aws_security_group.frontend.id
}

resource "aws_vpc_security_group_egress_rule" "api_egress" {
    security_group_id = aws_security_group.api.id
    ip_protocol = "-1"
    from_port = 0
    to_port = 0
    cidr_ipv4 = "0.0.0.0/0"
}


#################################
# INSTANCIAS
#################################

#BASTION

resource "aws_instance" "bastion" {
    ami = data.aws_ami.ubuntu.id
    instance_type = "t2.medium"
    key_name = var.key_name
    vpc_security_group_ids = [aws_security_group.bastion.id]
    user_data = templatefile("${path.module}/templates/bastion.sh.tftpl" , {
        domain = var.domain
    })
    tags = {Name = "Bastion"}
}

#FRONTEND

resource "aws_instance" "frontend" {
    ami = data.aws_ami.ubuntu.id
    instance_type = "t2.large"
    key_name = var.key_name
    vpc_security_group_ids = [aws_security_group.frontend.id]
    user_data = templatefile("${path.module}/templates/frontend.sh.tftpl" , {
        domain = var.domain
    })
    tags = {Name = "Frontend"}
}

#API

resource "aws_instance" "api" {
    ami = data.aws_ami.ubuntu.id
    instance_type = "t2.large"
    key_name = var.key_name
    vpc_security_group_ids = [aws_security_group.api.id]
    user_data = templatefile("${path.module}/templates/api.sh.tftpl" , {
        domain = var.domain
    })
    tags = {Name = "API"}
}

#################################
# ZONA DNS ROUTE53
#################################

resource "aws_route53_zone" "zona_privada" {
    name = var.domain
}

resource "aws_route53_record" "bastion" {
    zone_id = aws_route53_zone.zona_privada.zone_id
    name = "bastion.${var.domain}"
    type = "A"
    ttl = 300
    records = [aws_instance.bastion.private_ip]
}

resource "aws_route53_record" "frontend" {
    zone_id = aws_route53_zone.zona_privada.zone_id
    name = "frontend.${var.domain}"
    type = "A"
    ttl = 300
    records = [aws_instance.frontend.private_ip]
}

resource "aws_route53_record" "api" {
    zone_id = aws_route53_zone.zona_privada.zone_id
    name = "api.${var.domain}"
    type = "A"
    ttl = 300
    records = [aws_instance.api.private_ip]
}