package com.hanginout.common.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
@Tag(name = "Health", description = "Application health and status endpoints for uptime monitoring")
public class HealthController {

    @GetMapping
    @Operation(summary = "Application health status", description = "Returns service health status for load balancers and uptime monitors")
    public ResponseEntity<Map<String, Object>> getHealth() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "service", "hanginout-backend",
                "timestamp", Instant.now().toString()
        ));
    }
}
