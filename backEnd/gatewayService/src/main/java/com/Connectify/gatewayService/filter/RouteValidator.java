package com.Connectify.gatewayService.filter;

import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.function.Predicate;

@Component
public class RouteValidator {

//    it will list the endpoint no need to verify allow them to the service
    public static final List<String> openApiEndpoints = List.of(
            "/register",
            "/login",
        "/validate/token",
        "/validate-otp?**",
        "/reset-password?**",
        "/send-otp?**",
        "/get-user/**"

            );
    public Predicate<ServerHttpRequest> isSecured = request -> openApiEndpoints
            .stream()
            .noneMatch(uri -> request
                    .getURI()
                    .getPath()
                    .contains(uri));
}
