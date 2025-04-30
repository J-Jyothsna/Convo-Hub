package com.Connectify.gatewayService.filter;

import com.Connectify.gatewayService.exception.InvalidTokenException;
import com.Connectify.gatewayService.exception.MissingAuthorizationHeaderException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
public class AuthenticationFilter extends AbstractGatewayFilterFactory<AuthenticationFilter.Config> {

    @Autowired
    private RouteValidator validator;



    public AuthenticationFilter() {
        super(Config.class);
    }

    public static class Config {}

    @Override
    public GatewayFilter apply(Config config) {
        return ((exchange, chain) -> {
            // for the uris NOT specified in the RouteValidator do the following steps
            if (validator.isSecured.test(exchange.getRequest())) {
                if (!exchange.getRequest().getHeaders().containsKey(HttpHeaders.AUTHORIZATION)) {
                    throw new MissingAuthorizationHeaderException("Authorization header is missing");
                }

                String authHeaderToken = exchange.getRequest().getHeaders().get(HttpHeaders.AUTHORIZATION).get(0);
                if (authHeaderToken != null && authHeaderToken.startsWith("Bearer")) {
                    authHeaderToken = authHeaderToken.substring(7);
                } else {
                    throw new InvalidTokenException("Token is malformed or missing the Bearer prefix");
                }


                try {
                    RestClient restClient = RestClient.create();
                    Boolean isValid = restClient
                            .get()
                            .uri("http://localhost:8090/api/auth/validate/token?token=" + authHeaderToken)
                            .retrieve()
                            .body(Boolean.class);

                    if (!isValid) {

                        throw new InvalidTokenException("Token validation failed");
                    }
                } catch (Exception e) {
                    throw new InvalidTokenException("Token validation failed: " + e.getMessage());
                }
            }

            // for other uris simply chain the request.
            return chain.filter(exchange);
        });
    }
}
