package com.godsvessel.inventory_warehouse.repository;

import com.godsvessel.inventory_warehouse.model.Item;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ItemRepository extends JpaRepository<Item, Long> {

    List<Item> findByWarehouseId(Long warehouseId);
}