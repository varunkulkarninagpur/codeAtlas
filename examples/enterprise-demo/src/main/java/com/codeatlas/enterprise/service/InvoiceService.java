package com.codeatlas.enterprise.service;
import com.codeatlas.enterprise.repository.InvoiceRepository;
import org.springframework.stereotype.Service;
@Service
public class InvoiceService {
    private final InvoiceRepository invoiceRepository;
    public InvoiceService(InvoiceRepository invoiceRepository) {
        this.invoiceRepository = invoiceRepository;
    }
}