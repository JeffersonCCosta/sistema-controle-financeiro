package com.controlefinanceiro.controle_financeiro.repository;

import com.controlefinanceiro.controle_financeiro.model.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoriaRepository extends JpaRepository <Categoria, Integer> {
}
