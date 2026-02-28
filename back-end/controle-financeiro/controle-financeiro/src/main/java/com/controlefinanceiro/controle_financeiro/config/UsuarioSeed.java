package com.controlefinanceiro.controle_financeiro.config;

import com.controlefinanceiro.controle_financeiro.model.Usuario;
import com.controlefinanceiro.controle_financeiro.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class UsuarioSeed implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${seed.admin.email}")
    private String adminEmail;

    @Value("${seed.admin.senha}")
    private String adminSenha;

    public UsuarioSeed(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public void run(String... args) {

        if (usuarioRepository.count() == 0) {

            Usuario usuario = new Usuario();
            usuario.setNome("admin");
            usuario.setEmail(adminEmail);
            usuario.setSenha(passwordEncoder.encode(adminSenha));
            usuario.setTipo_usuario("ADMIN");
            usuarioRepository.save(usuario);

            System.out.println("✅ Usuário admin criado com sucesso!");
        }
    }
}