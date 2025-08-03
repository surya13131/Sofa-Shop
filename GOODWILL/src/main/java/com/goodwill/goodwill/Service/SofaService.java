package com.goodwill.goodwill.Service;

import com.goodwill.goodwill.model.Sofa;
import com.goodwill.goodwill.Repository.SofaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SofaService {

    @Autowired
    private SofaRepository sofaRepository;

    public List<Sofa> getAllSofas() {
        return sofaRepository.findAll();
    }

    public Sofa addSofa(Sofa sofa) {
        return sofaRepository.save(sofa);
    }

    public Sofa updateSofa(Long id, Sofa updatedSofa) {
        Sofa existing = sofaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sofa not found"));

        existing.setName(updatedSofa.getName());
        existing.setPrice(updatedSofa.getPrice());
        existing.setDiscount(updatedSofa.getDiscount());
        existing.setEmi(updatedSofa.getEmi());
        existing.setDescription(updatedSofa.getDescription());
        existing.setImage(updatedSofa.getImage());

        return sofaRepository.save(existing);
    }

    public void deleteSofa(Long id) {
        sofaRepository.deleteById(id);
    }
}
