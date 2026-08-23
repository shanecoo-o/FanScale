package com.fanscale.configuration.api;

import java.time.Instant;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class FoundationHealthController {

    @GetMapping("/health")
    FoundationHealthResponse health() {
        return new FoundationHealthResponse("UP", "fanscale-backend", "v1", Instant.now());
    }

    record FoundationHealthResponse(String status, String service, String apiVersion, Instant timestamp) {
    }
}
