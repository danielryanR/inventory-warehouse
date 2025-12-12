package com.godsvessel.inventory_warehouse.repository;

import com.godsvessel.inventory_warehouse.model.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ItemRepository extends JpaRepository<Item, Long> {

    List<Item> findByWarehouseId(Long warehouseId);

        @Query("select coalesce(sum(i.quantity),0) from Item i where i.warehouse.id = :warehouseId")
            int getTotalQuantityForWarehouse(@Param("warehouseId") Long warehouseId);

    Optional<Item> findBySkuAndWarehouseId(String sku, Long warehouseId);
}