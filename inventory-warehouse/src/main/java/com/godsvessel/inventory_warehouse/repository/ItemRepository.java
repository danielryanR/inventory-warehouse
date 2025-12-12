package com.godsvessel.inventory_warehouse.repository;

import com.godsvessel.inventory_warehouse.model.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ItemRepository extends JpaRepository<Item, Long> {

    @Query("select i from Item i where i.warehouse.id = :warehouseId")
    List<Item> findByWarehouseId(@Param("warehouseId") Long warehouseId);

    @Query("select coalesce(sum(i.quantity), 0) from Item i where i.warehouse.id = :warehouseId")
    int getTotalQuantityForWarehouse(@Param("warehouseId") Long warehouseId);

    @Query("select i from Item i where i.sku = :sku and i.warehouse.id = :warehouseId")
    Optional<Item> findBySkuAndWarehouseId(@Param("sku") String sku,
                                          @Param("warehouseId") Long warehouseId);
}