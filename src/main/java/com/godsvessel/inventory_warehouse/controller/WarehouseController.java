// src/main/java/com/godsvessel/inventory_warehouse/controller/WarehouseController.java
package com.godsvessel.inventory_warehouse.controller;

import com.godsvessel.inventory_warehouse.model.Warehouse;
import com.godsvessel.inventory_warehouse.service.WarehouseService;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@RestController
@RequestMapping("/api/warehouses")
@CrossOrigin(origins = "http://localhost:5173")
public class WarehouseController {

    private final WarehouseService service;

    public WarehouseController(WarehouseService service) {
        this.service = service;
    }

    @GetMapping
    public List<Warehouse> getAll() {
        return service.getAllWh();
    }

    @GetMapping("/{id}")
    public Warehouse getById(@PathVariable Long id) {
        return service.getWhById(id);
    }

    @PostMapping
    public Warehouse create(@RequestBody Warehouse warehouse) {
        return service.saveWh(warehouse);
    }

    @PutMapping("/{id}")
    public Warehouse update(@PathVariable Long id, @RequestBody Warehouse warehouse) {
        warehouse.setId(id);
        return service.saveWh(warehouse);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.deleteWh(id);
    }
}