package com.controlefinanceiro.controle_financeiro.service;

import com.controlefinanceiro.controle_financeiro.model.Categoria;
import com.controlefinanceiro.controle_financeiro.model.Despesa;
import com.controlefinanceiro.controle_financeiro.model.Usuario;
import com.controlefinanceiro.controle_financeiro.repository.CategoriaRepository;
import com.controlefinanceiro.controle_financeiro.repository.DespesaRepository;
import com.controlefinanceiro.controle_financeiro.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class DespesaService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private DespesaRepository repository;

    @Autowired
    private CategoriaService categoriaService;

    public List<Despesa> listar(Integer usuarioId){
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Usuário não encontrato."
                ));
        return repository.findByUsuario(usuario);
        //return repository.findAll();
    }
    public List<Despesa> listarPorUsuario(Integer usuarioId) {
        return repository.findByUsuarioId(usuarioId);
    }


    public Despesa buscarPorId(Integer id){
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Despesa não encontrada!"));
    }

    public Despesa salvar(Despesa d){
        Categoria categoria= categoriaService.buscarPorId(d.getCategoria().getId());
        d.setCategoria(categoria);

        d.setCategoria(categoria);
        return repository.save(d);
    }

    public Despesa atualizar(Integer id, Despesa d){
        Despesa existente = buscarPorId(id);

        existente.setDescricao(d.getDescricao());
        existente.setValor(d.getValor());
        existente.setData(d.getData());


        Categoria categoria = categoriaService.buscarPorId(d.getCategoria().getId());
        existente.setCategoria(categoria);
        existente.setObservacao(d.getObservacao());

        return repository.save(existente);
    }

    public void deletar(Integer id){
        if (!repository.existsById(id)){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Despesa não encontrada!");
        }
        repository.deleteById(id);
    }
}
