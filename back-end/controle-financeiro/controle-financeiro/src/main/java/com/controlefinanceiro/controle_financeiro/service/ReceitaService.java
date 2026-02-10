package com.controlefinanceiro.controle_financeiro.service;

import com.controlefinanceiro.controle_financeiro.model.Categoria;
import com.controlefinanceiro.controle_financeiro.model.Despesa;
import com.controlefinanceiro.controle_financeiro.model.Receita;
import com.controlefinanceiro.controle_financeiro.model.Usuario;
import com.controlefinanceiro.controle_financeiro.repository.ReceitaRepository;
import com.controlefinanceiro.controle_financeiro.repository.UsuarioRepository;
import jakarta.persistence.criteria.CriteriaBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ReceitaService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ReceitaRepository repository;

    @Autowired
    private CategoriaService categoriaService;

    public List <Receita> listar(Integer usuarioId){
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Usuário não encontrato."
                ));
        return repository.findByUsuario(usuario);
        //return repository.findAll();
    }

    public List<Receita> listarPorUsuario(Integer usuarioId){
        return repository.findByUsuarioId(usuarioId);
    }

    public Receita buscarPorId(Long id) {
        return repository.findById(id).orElseThrow(() ->
                new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Receita não encontrada."
                ));
    }

    public Receita salvar(Receita receita){
        Categoria categoria = categoriaService.buscarPorId(receita.getCategoria().getId());
        receita.setCategoria(categoria);

        receita.setCategoria(categoria);
        return repository.save(receita);

        /*
        Usuario usuario = usuarioRepository.findByNome("Jefferson")
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Usuário não encontrato."
                ));

        receita.setUsuario(usuario);
        return repository.save(receita);
        */
    }

    public Receita atualizar(Long id, Receita receitaAtualizada){
        Receita receita = buscarPorId(id);

        receita.setDescricao(receitaAtualizada.getDescricao());
        receita.setValor(receitaAtualizada.getValor());
        receita.setData(receitaAtualizada.getData());
        receita.setCategoria(receitaAtualizada.getCategoria());
        receita.setObservacao(receitaAtualizada.getObservacao());

        return repository.save(receita);
    }

    public void deletar(Long id){
        if (!repository.existsById(id)){
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Receita não encontrada."
            );
        }
        repository.deleteById(id);
    }
}
