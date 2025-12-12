// ItemService
package com.godsvessel.inventory_warehouse.service;

import com.godsvessel.inventory_warehouse.model.Item;
import com.godsvessel.inventory_warehouse.model.Warehouse;
import com.godsvessel.inventory_warehouse.repository.ItemRepository;
import com.godsvessel.inventory_warehouse.repository.WarehouseRepository;
import org.springframework.stereotype.Service;

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

    public Item transfer(Long itemId, Long targetWarehouseId, int quantity) {
        Item sourceItem = getById(itemId);

        if (quantity <= 0 || quantity > sourceItem.getQuantity()) {
            throw new IllegalArgumentException("Invalid transfer quantity");
        }

        Warehouse targetWarehouse = warehouseRepo.findById(targetWarehouseId)
                .orElseThrow(() -> new RuntimeException("Target warehouse not found"));

        int currentTargetQty = repo.getTotalQuantityForWarehouse(targetWarehouseId);
        int maxCapacity = targetWarehouse.getMaxCapacity();

        if (currentTargetQty + quantity > maxCapacity) {
            throw new IllegalStateException("Transfer would exceed warehouse capacity");
        }

        sourceItem.setQuantity(sourceItem.getQuantity() - quantity);

        var targetExisting = repo.findBySkuAndWarehouseId(sourceItem.getSku(), targetWarehouseId);

        Item targetItem = targetExisting.orElseGet(() -> {
            Item i = new Item();
            i.setName(sourceItem.getName());
            i.setSku(sourceItem.getSku());
            i.setDescription(sourceItem.getDescription());
            i.setSize(sourceItem.getSize());
            i.setWarehouse(targetWarehouse);
            return i;
        });

        targetItem.setQuantity(targetItem.getQuantity() + quantity);

        repo.save(sourceItem);
        return repo.save(targetItem);
    }
}