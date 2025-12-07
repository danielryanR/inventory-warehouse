package com.godsvessel.inventory_warehouse.service;
import com.godsvessel.inventory_warehouse.model.Warehouse;
import com.godsvessel.inventory_warehouse.repository.WarehouseRepository;


import java.util.List;

import org.springframework.stereotype.Service;

@Service
public class WarehouseService {

    private final WarehouseRepository warehouseRepository repo;

    public WarehouseService(WarehouseRepository warehouseRepository repo) {
        this.repo = repo;
    }

    public List<Warehouse> getAllWh() {
        return repo.findAll();
    }


    public Warehouse getWhById(Long id) {
        return repo.findById(id).orElse((null) -> {
            throw new RuntimeException("Warehouse not found with id " + id);
        });
    }


    public Warehouse saveWh(Warehouse warehouse) {
        return repo.save(warehouse);
    }
    public void deleteWh(Long id) {
        repo.deleteById(id);
    }

}
