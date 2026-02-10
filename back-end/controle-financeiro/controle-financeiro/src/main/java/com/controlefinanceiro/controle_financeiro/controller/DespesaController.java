package com.controlefinanceiro.controle_financeiro.controller;

import com.controlefinanceiro.controle_financeiro.model.Despesa;
import com.controlefinanceiro.controle_financeiro.service.DespesaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/despesas")
@CrossOrigin(origins = {
        "http://127.0.0.1:5500",
        "http://localhost:5500"
})
public class DespesaController {

    @Autowired
    private DespesaService service;

    @GetMapping
    public List<Despesa> listar(@RequestParam Integer usuarioId){
        return service.listar(usuarioId);
    }

    @GetMapping("/usuario/{usuarioId}")
    public List<Despesa> listarPorUsuario(@PathVariable Integer usuarioId) {
        return service.listarPorUsuario(usuarioId);
    }

    @PostMapping
    public Despesa salvar(@RequestBody Despesa despesa){
        return service.salvar(despesa);
    }

    @PutMapping("/{id}")
    public Despesa atualizar(@PathVariable Integer id, @RequestBody Despesa despesa){
        return service.atualizar(id, despesa);
    }

    @GetMapping("/{id}")
    public Despesa buscar (@PathVariable Integer id){
        return service.buscarPorId(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletar (@PathVariable Integer id){
        service.deletar(id);
        return ResponseEntity.ok("Despesa deletada com sucesso!");
    }
}
