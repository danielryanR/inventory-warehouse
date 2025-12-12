package com.godsvessel.inventory_warehouse.repository;

import com.godsvessel.inventory_warehouse.model.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ItemRepository extends JpaRepository<Item, Long> {

    // For ManyToOne: Item.warehouse.id
    List<Item> findByWarehouse_Id(Long warehouseId);

    Optional<Item> findBySkuAndWarehouse_Id(String sku, Long warehouseId);

    // SUM returns Long in JPQL
    @Query("select coalesce(sum(i.quantity), 0) from Item i where i.warehouse.id = :warehouseId")
    Long getTotalQuantityForWarehouse(@Param("warehouseId") Long warehouseId);
}