package com.controlefinanceiro.controle_financeiro.service;

import com.controlefinanceiro.controle_financeiro.model.Categoria;
import com.controlefinanceiro.controle_financeiro.repository.CategoriaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class CategoriaService {

    private final CategoriaRepository repository;

    public CategoriaService(CategoriaRepository repository){
        this.repository = repository;
    }

    public List<Categoria> listarTodas() {
        return repository.findAll();
    }

    public Categoria buscarPorId(Integer id) {
        return repository.findById(id).
                orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Categoria não encontrada."));
    }

    public Categoria criar(Categoria categoria) {
        return repository.save(categoria);
    }

    public Categoria atualizar(Integer id, Categoria dto) {
        Categoria existente = buscarPorId(id);
        existente.setNome(dto.getNome());
        existente.setTipo(dto.getTipo());
        return repository.save(existente);
    }

    public void deletar(Integer id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Categoria não Encontrada");
        }
        repository.deleteById(id);
    }

}
