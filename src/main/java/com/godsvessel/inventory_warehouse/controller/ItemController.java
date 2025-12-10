package com.godsvessel.inventory_warehouse.controller;

import com.godsvessel.inventory_warehouse.model.Item;
import com.godsvessel.inventory_warehouse.service.ItemService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/items")
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

    @GetMapping("/{id}")
    public Item getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    public Item create(@RequestBody Item item) {
        return service.save(item);
    }

    @PutMapping("/{id}")
    public Item update(@PathVariable Long id, @RequestBody Item item) {
        item.setId(id);
        return service.save(item);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}