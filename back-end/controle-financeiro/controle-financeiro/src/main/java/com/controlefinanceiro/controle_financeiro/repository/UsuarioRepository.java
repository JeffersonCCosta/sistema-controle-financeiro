package com.controlefinanceiro.controle_financeiro.repository;

import com.controlefinanceiro.controle_financeiro.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository <Usuario, Integer> {
    Optional<Usuario> findByNome(String nome);
    Optional<Usuario> findByEmail(String email);
}
