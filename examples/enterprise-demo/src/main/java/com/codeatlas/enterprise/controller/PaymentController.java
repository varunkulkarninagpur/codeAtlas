package com.codeatlas.enterprise.controller;
import com.codeatlas.enterprise.repository.PaymentRepository;
import com.codeatlas.enterprise.service.PaymentService;
import org.springframework.web.bind.annotation.RestController;
@RestController
public class PaymentController {
    private final PaymentRepository paymentRepository;
    private final PaymentService paymentService;
    public PaymentController(PaymentRepository paymentRepository, PaymentService paymentService) {
        this.paymentRepository = paymentRepository;
        this.paymentService = paymentService;
    }
}