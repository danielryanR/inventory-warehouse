package com.godsvessel.inventory_warehouse.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.http.ResponseEntity;

import com.godsvessel.inventory_warehouse.model.Warehouse;
import com.godsvessel.inventory_warehouse.repository.WarehouseRepository;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.boot.web.servlet.server
import java.util.List;



@RestController
@RequestMapping("/api/warehouses")
public class WarehouseController {

    private final WarehouseRepository repo;

    public WarehouseController(WarehouseRepository repo) {
        this.repo = repo;
    }

    @Autowired
    private WarehouseRepository warehouseRepository;

    @GetMapping("/warehouses")
    public List<Warehouse> getAllWarehouses() {
        return warehouseRepository.findAll();
    }

    @PostMapping("/warehouses")
    public Warehouse createWarehouse(@RequestBody Warehouse warehouse) {
        return warehouseRepository.save(warehouse);
    }

    @GetMapping("/warehouses/{id}")
    public ResponseEntity<Warehouse> getWarehouseById(@PathVariable Long id) {
        return warehouseRepository.findById(id)
                .map(warehouse -> ResponseEntity.ok().body(warehouse))
                .orElse(ResponseEntity.notFound().build());
    }

}
