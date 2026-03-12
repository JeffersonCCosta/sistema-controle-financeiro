package com.controlefinanceiro.controle_financeiro.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

@Service
public class EmailService {

    @Value("${RESEND_API_KEY}")
    private String apiKey;

    public void enviarEmailRecuperacao(String destino, String link) {
        try {
            URL url = new URL("https://api.resend.com/emails");
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();

            conn.setRequestMethod("POST");
            conn.setRequestProperty("Authorization", "Bearer " + apiKey);
            conn.setRequestProperty("Content-Type", "application/json");

            conn.setDoOutput(true);

            String json = """
            {
              "from": "FinControl <onboarding@resend.dev>",
              "to": ["%s"],
              "subject": "Recuperação de senha - FinControl",
              "html": "<p>Recebemos uma solicitação para redefinir sua senha.</p><p><a href='%s'>Clique aqui para redefinir</a></p>"
            }
            """.formatted(destino, link);

            try (OutputStream os = conn.getOutputStream()) {
                os.write(json.getBytes());
                os.flush();
            }

            conn.getResponseCode();

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
