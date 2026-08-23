package com.fanscale;

import com.fanscale.configuration.FanScaleProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.security.autoconfigure.UserDetailsServiceAutoConfiguration;

@SpringBootApplication(exclude = UserDetailsServiceAutoConfiguration.class)
@EnableConfigurationProperties(FanScaleProperties.class)
public class FanScaleApplication {

    public static void main(String[] args) {
        SpringApplication.run(FanScaleApplication.class, args);
    }
}
