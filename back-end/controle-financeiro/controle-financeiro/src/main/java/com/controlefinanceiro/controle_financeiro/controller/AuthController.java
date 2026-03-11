package com.controlefinanceiro.controle_financeiro.controller;

import com.controlefinanceiro.controle_financeiro.model.Usuario;
import com.controlefinanceiro.controle_financeiro.model.dto.ForgotPasswordRequest;
import com.controlefinanceiro.controle_financeiro.model.dto.LoginRequestDTO;
import com.controlefinanceiro.controle_financeiro.model.dto.ResetPasswordRequest;
import com.controlefinanceiro.controle_financeiro.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private PasswordEncoder passwordEncoder;

    private final UsuarioRepository usuarioRepository;

    public AuthController(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login (@RequestBody LoginRequestDTO dto){
        Usuario usuario = usuarioRepository
                .findByEmail(dto.getEmail())
                .orElse(null);

        if (usuario == null){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Usuário não encontrado.");
        }

        if (!passwordEncoder.matches(dto.getSenha(), usuario.getSenha())){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Senha inválida!");
        }

        return ResponseEntity.ok(usuario);
    }

    @PostMapping("/cadastro")
    public Usuario criar(@RequestBody Usuario usuario){
        usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));
        return usuarioRepository.save(usuario);
    }

    @PostMapping("/esqueci-senha")
    public ResponseEntity<?> esqueciSenha(@RequestBody ForgotPasswordRequest request) {
        String email = request.getEmail();

        var usuarioOpt = usuarioRepository.findByEmail(email);

        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.ok(Map.of(
                    "message", "Se o e-mail existir, enviaremos instruções para redefinição."
            ));
        }

        Usuario usuario = usuarioOpt.get();

        String token = UUID.randomUUID().toString();
        usuario.setResetToken(token);
        usuario.setResetTokenExpiracao(LocalDateTime.now().plusMinutes(30));

        usuarioRepository.save(usuario);

        String link = "https://sistema-controle-financeiro.pages.dev/Login/reset-password.html?token=" + token;
        System.out.println("LINK DE RECUPERAÇÃO: " + link);

        return ResponseEntity.ok(Map.of(
                "message", "Se o e-mail existir, enviaremos instruções para redefinição."
        ));
    }

    @PostMapping("/redefinir-senha")
    public ResponseEntity<?> redefinirSenha(@RequestBody ResetPasswordRequest request) {
        var usuarioOpt = usuarioRepository.findByResetToken(request.getToken());

        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Token inválido."));
        }

        Usuario usuario = usuarioOpt.get();

        if (usuario.getResetTokenExpiracao() == null ||
        usuario.getResetTokenExpiracao().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Token expirado"));
        }

        usuario.setSenha(passwordEncoder.encode(request.getNovaSenha()));
        usuario.setResetToken(null);
        usuario.setResetTokenExpiracao(null);

        usuarioRepository.save(usuario);

        return ResponseEntity.ok(Map.of("message", "Senha redefinida com sucesso."));
    }
}
