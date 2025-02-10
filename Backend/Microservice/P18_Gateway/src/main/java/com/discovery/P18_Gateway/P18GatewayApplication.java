package com.discovery.P18_Gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class P18GatewayApplication {

	public static void main(String[] args) {
		SpringApplication.run(P18GatewayApplication.class, args);
	}
}
