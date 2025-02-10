package com.discovery.P18_Discovery;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

@SpringBootApplication
@EnableEurekaServer
public class P18DiscoveryApplication {

	public static void main(String[] args) {
		SpringApplication.run(P18DiscoveryApplication.class, args);
	}

}
