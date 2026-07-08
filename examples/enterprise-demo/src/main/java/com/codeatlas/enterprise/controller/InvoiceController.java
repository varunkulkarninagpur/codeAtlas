package com.codeatlas.enterprise.controller;
import com.codeatlas.enterprise.service.InvoiceService;
import org.springframework.web.bind.annotation.RestController;
@RestController
public class InvoiceController {
    private final InvoiceService invoiceService;
    public InvoiceController(InvoiceService invoiceService) {
        this.invoiceService = invoiceService;
    }
}