package com.fanscale;

import static org.hamcrest.Matchers.matchesPattern;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.flywaydb.core.Flyway;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import com.fanscale.shared.web.CorrelationIdFilter;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Import(TestcontainersConfiguration.class)
class BackendFoundationIntegrationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private Flyway flyway;

    @Test
    void healthEndpointIsPublicAndCorrelated() throws Exception {
        mockMvc.perform(get("/api/v1/health").header(CorrelationIdFilter.HEADER_NAME, "test-correlation-123"))
                .andExpect(status().isOk())
                .andExpect(header().string(CorrelationIdFilter.HEADER_NAME, "test-correlation-123"))
                .andExpect(jsonPath("$.status").value("UP"))
                .andExpect(jsonPath("$.service").value("fanscale-backend"))
                .andExpect(jsonPath("$.apiVersion").value("v1"));
    }

    @Test
    void oversizedCorrelationIdIsRejectedAndRegenerated() throws Exception {
        mockMvc.perform(get("/api/v1/health").header(CorrelationIdFilter.HEADER_NAME, "x".repeat(129)))
                .andExpect(status().isOk())
                .andExpect(header().string(
                        CorrelationIdFilter.HEADER_NAME,
                        matchesPattern("[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}")));
    }

    @Test
    void protectedApiUsesCanonicalErrorEnvelope() throws Exception {
        mockMvc.perform(get("/api/v1/me"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("UNAUTHORIZED"))
                .andExpect(jsonPath("$.message").isString())
                .andExpect(jsonPath("$.correlationId").isString());
    }

    @Test
    void flywayMigratesAndPostgresqlIsReachable() {
        Integer recordCount = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM fanscale.foundation_metadata WHERE component = 'backend-foundation'",
                Integer.class);

        org.assertj.core.api.Assertions.assertThat(recordCount).isEqualTo(1);
        org.assertj.core.api.Assertions.assertThat(flyway.info().current().getVersion().getVersion()).isEqualTo("1");
    }
}
