package com.goodwill.goodwill.Contoller;

import com.goodwill.goodwill.model.Sofa;
import com.goodwill.goodwill.Service.SofaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sofas")
@CrossOrigin(origins = "*") // for frontend access
public class SofaController {

    @Autowired
    private SofaService sofaService;

    @GetMapping
    public List<Sofa> getAllSofas() {
        return sofaService.getAllSofas();
    }

    @PostMapping
    public Sofa createSofa(@RequestBody Sofa sofa) {
        return sofaService.addSofa(sofa);
    }

    @PutMapping("/{id}")
    public Sofa updateSofa(@PathVariable Long id, @RequestBody Sofa updatedSofa) {
        return sofaService.updateSofa(id, updatedSofa);
    }

    @DeleteMapping("/{id}")
    public void deleteSofa(@PathVariable Long id) {
        sofaService.deleteSofa(id);
    }
}
