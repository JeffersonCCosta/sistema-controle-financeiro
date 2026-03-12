package com.controlefinanceiro.controle_financeiro.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void enviarEmailRecuperacao(String destino, String link) {
        SimpleMailMessage mensagem = new SimpleMailMessage();

        mensagem.setTo(destino);
        mensagem.setSubject("Recuperação de senha - FinControl");

        mensagem.setText(
                "Olá!\n\n" +
                "Recebemos uma solicitação para redefinir sua senha.\n\n" +
                "Clique no link abaixo:\n\n" +
                link +
                "\n\nEsse link expira em 30 minutos."
        );
        mailSender.send(mensagem);
    }
}
