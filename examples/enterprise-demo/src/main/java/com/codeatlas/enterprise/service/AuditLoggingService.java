package com.codeatlas.enterprise.service;
import com.codeatlas.enterprise.repository.AuditLogRepository;
import org.springframework.stereotype.Service;
@Service
public class AuditLoggingService {
    private final AuditLogRepository auditLogRepository;
    public AuditLoggingService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }
}