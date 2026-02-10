package com.controlefinanceiro.controle_financeiro.controller;

import com.controlefinanceiro.controle_financeiro.model.Categoria;
import com.controlefinanceiro.controle_financeiro.service.CategoriaService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categorias")
@CrossOrigin(origins = "*")
public class CategoriaController {

    private final CategoriaService service;

    public CategoriaController(CategoriaService service) {
        this.service = service;
    }

    @GetMapping
    public List<Categoria> listar(){
        return service.listarTodas();
    }

    @GetMapping("/{id}")
    public Categoria obter(@PathVariable Integer id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    public Categoria criar(@RequestBody Categoria categoria) {
        return service.criar(categoria);
    }

    @PutMapping("/{id}")
    public Categoria atualizar(@PathVariable Integer id, @RequestBody Categoria categoria) {
        return service.atualizar(id, categoria);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Integer id) {
        service.deletar(id);
    }

}
