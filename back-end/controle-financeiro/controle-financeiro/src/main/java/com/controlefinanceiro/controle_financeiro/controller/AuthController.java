package com.controlefinanceiro.controle_financeiro.controller;

import com.controlefinanceiro.controle_financeiro.model.Usuario;
import com.controlefinanceiro.controle_financeiro.model.dto.LoginRequestDTO;
import com.controlefinanceiro.controle_financeiro.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private PasswordEncoder passwordEncoder;

    private final UsuarioRepository usuarioRepository;

    public AuthController(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
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
}
