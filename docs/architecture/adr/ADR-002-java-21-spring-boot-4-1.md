# ADR-002: Java 21 and Spring Boot 4.1

## Status

Accepted

## Context

The existing machine has Java 17, but FanScale is creating a new production backend and requires a current LTS baseline and stable Spring generation.

## Decision

Target Java 21 LTS and Spring Boot 4.1.1. Use Maven Wrapper 3.3.4 with Maven 3.9.16. Use only stable dependencies: Spring Modulith 2.1.0 and Springdoc 3.1.0. Do not downgrade the source/toolchain target to match the current workstation.

## Consequences

Developers and CI must install JDK 21. The current Java 17 workstation cannot run the full build. Maintenance updates remain deliberate and must verify the Boot/Modulith/Springdoc compatibility set together.
