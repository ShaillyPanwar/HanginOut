package com.hanginout.activity.repository;

import com.hanginout.activity.entity.Spot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SpotRepository extends JpaRepository<Spot, Long> {
    List<Spot> findByCityAndIsActiveTrue(String city);
}
