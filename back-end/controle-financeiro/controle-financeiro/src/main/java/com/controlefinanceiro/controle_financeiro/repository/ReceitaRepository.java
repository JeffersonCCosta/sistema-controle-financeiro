package com.controlefinanceiro.controle_financeiro.repository;

import com.controlefinanceiro.controle_financeiro.model.Despesa;
import com.controlefinanceiro.controle_financeiro.model.Receita;
import com.controlefinanceiro.controle_financeiro.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReceitaRepository extends JpaRepository<Receita, Long> {
    List<Receita> findByUsuario(Usuario usuario);
    List<Receita> findByUsuarioId(Integer usuarioId);
}
