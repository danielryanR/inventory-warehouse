package com.godsvessel.inventory_warehouse.repository;

import com.godsvessel.inventory_warehouse.model.Warehouse;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WarehouseRepository extends JpaRepository<Warehouse, Long> {
}