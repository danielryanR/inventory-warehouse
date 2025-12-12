// warehouse service
package com.godsvessel.inventory_warehouse.service;

import com.godsvessel.inventory_warehouse.model.Warehouse;
import com.godsvessel.inventory_warehouse.repository.WarehouseRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WarehouseService {

    private final WarehouseRepository repo;

    public WarehouseService(WarehouseRepository repo) {
        this.repo = repo;
    }

    public List<Warehouse> getAllWh() {
        return repo.findAll();
    }

    public Warehouse getWhById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Warehouse not found with id " + id));
    }

    public Warehouse saveWh(Warehouse warehouse) {
        return repo.save(warehouse);
    }

    public void deleteWh(Long id) {
        repo.deleteById(id);
    }
}