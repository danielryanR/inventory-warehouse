package com.godsvessel.inventory_warehouse.service;

import com.godsvessel.inventory_warehouse.model.Item;
import com.godsvessel.inventory_warehouse.repository.ItemRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ItemService {

    private final ItemRepository repo;

    public ItemService(ItemRepository repo) {
        this.repo = repo;
    }

    public List<Item> getAll() {
        return repo.findAll();
    }

    public List<Item> getByWarehouse(Long warehouseId) {
        return repo.findByWarehouseId(warehouseId);
    }

    public Item getById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found with id " + id));
    }

    public Item save(Item item) {
        return repo.save(item);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}