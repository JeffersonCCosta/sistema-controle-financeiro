package com.controlefinanceiro.controle_financeiro.config;

import com.controlefinanceiro.controle_financeiro.model.Usuario;
import com.controlefinanceiro.controle_financeiro.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

@Configuration
public class UsuarioSeed implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;

    public UsuarioSeed(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public void run(String... args) {

        if (usuarioRepository.count() == 0) {

            Usuario usuario = new Usuario();
            usuario.setNome("admin");
            usuario.setEmail("admin@controle.com");
            usuario.setSenha("123456");
            usuario.setTipo_usuario("ADMIN");
            usuarioRepository.save(usuario);

            System.out.println("✅ Usuário admin criado com sucesso!");
        }
    }
}