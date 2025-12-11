// src/main/java/com/godsvessel/inventory_warehouse/controller/ItemController.java
package com.godsvessel.inventory_warehouse.controller;

import com.godsvessel.inventory_warehouse.model.Item;
import com.godsvessel.inventory_warehouse.service.ItemService;

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
@RequestMapping("/api/items")
@CrossOrigin(origins = "http://localhost:5173")
public class ItemController {

    private final ItemService service;

    public ItemController(ItemService service) {
        this.service = service;
    }

    @GetMapping
    public List<Item> getAll() {
        return service.getAll();
    }

    @GetMapping("/warehouse/{warehouseId}")
    public List<Item> getByWarehouse(@PathVariable Long warehouseId) {
        return service.getByWarehouse(warehouseId);
    }

    @PostMapping
    public Item create(@RequestBody Item item) {
        return service.save(item);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    @PutMapping("/{id}")
    public Item update(@PathVariable Long id, @RequestBody Item item) {
        item.setId(id);
        return service.save(item);
    }
}
