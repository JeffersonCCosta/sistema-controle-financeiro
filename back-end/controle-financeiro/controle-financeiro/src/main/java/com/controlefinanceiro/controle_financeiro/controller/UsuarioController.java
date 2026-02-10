package com.controlefinanceiro.controle_financeiro.controller;

import com.controlefinanceiro.controle_financeiro.model.Usuario;
import com.controlefinanceiro.controle_financeiro.repository.UsuarioRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    private final UsuarioRepository repository;

    public UsuarioController(UsuarioRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Usuario> listar(){
        return repository.findAll();
    }

    @PostMapping
    public Usuario criar(@RequestBody Usuario usuario){
        return repository.save(usuario);
    }
}
