package com.fanscale.shared.web;

import java.io.IOException;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public final class ApiErrorWriter {

    private ApiErrorWriter() {
    }

    public static void write(
            HttpServletRequest request,
            HttpServletResponse response,
            int status,
            String code,
            String message) throws IOException {
        String correlationId = CorrelationIdFilter.from(request);
        response.setStatus(status);
        response.setCharacterEncoding("UTF-8");
        response.setContentType("application/json");
        response.setHeader(CorrelationIdFilter.HEADER_NAME, correlationId);
        response.getWriter().write("{\"code\":\"%s\",\"message\":\"%s\",\"correlationId\":\"%s\"}"
                .formatted(code, message, correlationId));
    }
}
