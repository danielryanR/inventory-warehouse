package com.godsvessel.inventory_warehouse.service;

import com.godsvessel.inventory_warehouse.model.Item;
import com.godsvessel.inventory_warehouse.model.Warehouse;
import com.godsvessel.inventory_warehouse.repository.ItemRepository;
import com.godsvessel.inventory_warehouse.repository.WarehouseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ItemService {

    private final ItemRepository repo;
    private final WarehouseRepository warehouseRepo;

    public ItemService(ItemRepository repo, WarehouseRepository warehouseRepo) {
        this.repo = repo;
        this.warehouseRepo = warehouseRepo;
    }

    public List<Item> getAll() {
        return repo.findAll();
    }

    public List<Item> getByWarehouse(Long warehouseId) {
        return repo.findByWarehouse_Id(warehouseId);
    }

    public Item getById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Item not found with id " + id));
    }

    public Item save(Item item) {
        if (warehouseRepo.count() == 0) {
            throw new IllegalStateException("Cannot create items until at least one warehouse exists.");
        }

        Long warehouseId = (item.getWarehouse() != null) ? item.getWarehouse().getId() : null;
        if (warehouseId == null) {
            throw new IllegalArgumentException("Warehouse is required.");
        }

        if (isBlank(item.getName()) || isBlank(item.getSku()) || isBlank(item.getSize())) {
            throw new IllegalArgumentException("Name, SKU, and size are required.");
        }

        if (item.getQuantity() < 0) {
            throw new IllegalArgumentException("Quantity cannot be negative.");
        }

        Warehouse wh = warehouseRepo.findById(warehouseId)
                .orElseThrow(() -> new IllegalArgumentException("Warehouse not found: " + warehouseId));

        item.setWarehouse(wh);

        return repo.save(item);
    }

    public void delete(Long id) {
        if (!repo.existsById(id)) {
            throw new IllegalArgumentException("Item not found with id " + id);
        }
        repo.deleteById(id);
    }

    private boolean isBlank(String s) {
        return s == null || s.trim().isEmpty();
    }

    // ✅ Make transfer atomic
    @Transactional
    public Item transfer(Long itemId, Long targetWarehouseId, int quantity) {
        if (targetWarehouseId == null) {
            throw new IllegalArgumentException("Target warehouse is required.");
        }

        Item sourceItem = getById(itemId);

        if (sourceItem.getWarehouse() == null || sourceItem.getWarehouse().getId() == null) {
            throw new IllegalStateException("Source item has no warehouse assigned.");
        }

        Long sourceWarehouseId = sourceItem.getWarehouse().getId();

        if (targetWarehouseId.equals(sourceWarehouseId)) {
            throw new IllegalArgumentException("Target warehouse must be different from source warehouse.");
        }

        if (quantity <= 0) {
            throw new IllegalArgumentException("Transfer quantity must be at least 1.");
        }

        if (quantity > sourceItem.getQuantity()) {
            throw new IllegalArgumentException("Invalid transfer quantity: not enough stock.");
        }

        Warehouse targetWarehouse = warehouseRepo.findById(targetWarehouseId)
                .orElseThrow(() -> new IllegalArgumentException("Target warehouse not found: " + targetWarehouseId));

        Long currentTargetQtyLong = repo.getTotalQuantityForWarehouse(targetWarehouseId);
        long currentTargetQty = (currentTargetQtyLong == null) ? 0L : currentTargetQtyLong;

        long maxCapacity = targetWarehouse.getMaxCapacity();

        if (currentTargetQty + quantity > maxCapacity) {
            throw new IllegalStateException("Transfer would exceed warehouse capacity.");
        }

        // Reduce source
        sourceItem.setQuantity(sourceItem.getQuantity() - quantity);

        // Find matching SKU item in target warehouse (or create it)
        Item targetItem = repo.findBySkuAndWarehouse_Id(sourceItem.getSku(), targetWarehouseId)
                .orElseGet(() -> {
                    Item i = new Item();
                    i.setName(sourceItem.getName());
                    i.setSku(sourceItem.getSku());
                    i.setDescription(sourceItem.getDescription());
                    i.setSize(sourceItem.getSize());
                    i.setImageUrl(sourceItem.getImageUrl());
                    i.setWarehouse(targetWarehouse);
                    i.setQuantity(0);
                    return i;
                });

        // Add to target
        targetItem.setQuantity(targetItem.getQuantity() + quantity);

        repo.save(sourceItem);
        return repo.save(targetItem);
    }
}