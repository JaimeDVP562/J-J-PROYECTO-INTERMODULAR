output "bastion_elastic_ip" {
    description = "IP elástica pública del Bastion (usar para SSH y GitHub Secrets)"
    value       = aws_eip.bastion.public_ip
}

output "frontend_public_ip" {
    description = "IP pública del servidor Frontend"
    value       = aws_instance.frontend.public_ip
}

output "api_private_ip" {
    description = "IP privada del servidor API (usar como GITHUB Secret API_HOST)"
    value       = aws_instance.api.private_ip
}

output "database_private_ip" {
    description = "IP privada del servidor Base de Datos"
    value       = aws_instance.database.private_ip
}
