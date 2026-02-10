package com.controlefinanceiro.controle_financeiro.controller;

import com.controlefinanceiro.controle_financeiro.model.Receita;
import com.controlefinanceiro.controle_financeiro.service.ReceitaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/receitas")
@CrossOrigin(origins = {
        "http://127.0.0.1:5500",
        "http://localhost:5500"
})
public class ReceitaController {

    @Autowired
    private ReceitaService service;

    @GetMapping
    public List<Receita> listar(@RequestParam Integer usuarioId){
        return service.listar(usuarioId);
    }

    @GetMapping("/usuario/{usuarioId}")
    public List<Receita> listarPorUsuario(@PathVariable Integer usuarioId){
        return service.listarPorUsuario(usuarioId);
    }

    @GetMapping("/{id}")
    public Receita buscarPorId(@PathVariable Long id){
        return service.buscarPorId(id);
    }

    @PostMapping
    public Receita salvar(@RequestBody Receita receita){
        return service.salvar(receita);
    }

    @PutMapping("/{id}")
    public Receita atualizar(@PathVariable Long id, @RequestBody Receita receita){
        return service.atualizar(id, receita);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id){
        service.deletar(id);
    }
}
