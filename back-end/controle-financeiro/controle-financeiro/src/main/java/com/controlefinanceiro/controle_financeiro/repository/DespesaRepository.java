package com.controlefinanceiro.controle_financeiro.repository;

import com.controlefinanceiro.controle_financeiro.model.Despesa;
import com.controlefinanceiro.controle_financeiro.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DespesaRepository extends JpaRepository<Despesa, Integer> {
    List<Despesa> findByUsuario(Usuario usuario);
    List<Despesa> findByUsuarioId(Integer usuarioId);

}
