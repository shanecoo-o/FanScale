package com.fanscale.shared.api;

import java.util.List;

public record ApiErrorResponse(
        String code,
        String message,
        String correlationId,
        List<ApiFieldError> fieldErrors) {

    public ApiErrorResponse(String code, String message, String correlationId) {
        this(code, message, correlationId, List.of());
    }
}
