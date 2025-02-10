package com.discovery.P18_Gateway;
import java.util.Arrays;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

@Configuration
public class MyBeans {
		//http://localhost:8080/api1/welcome   --  localhost:8081
		 //http://localhost:8080/api1/welcome   -- localhost:8082
		
		@Bean
		public RouteLocator customRouterLocator(RouteLocatorBuilder builder) {
			return builder.routes() 
					.route("BOOK-KARO-MOVIE-BOOKING-APP",r->r.path("/auth/**")
						//.uri("http://localhost:8182"))   
						 .uri("lb://BOOK-KARO-MOVIE-BOOKING-APP"))
					.route("MOVIEMANAGEMENT",r->r.path("/management/**")
						 //.uri("http://localhost:9183"))
						 .uri("lb://MOVIEMANAGEMENT"))
					.route("TRASACTION",r->r.path("/transaction/**")
							 //.uri("http://localhost:9184"))
						 .uri("lb://TRASACTION"))	
					.build();
			
		}
		
		/*public GlobalCorsProperties globalCorsProperties() {
			/*GlobalCorsProperties obj = new GlobalCorsProperties();
			obj.
		}*/
		
		@Bean
	    public CorsWebFilter corsWebFilter() {
	        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
	        CorsConfiguration config = new CorsConfiguration();
	        
	        config.setAllowCredentials(true);
	        config.setAllowedOrigins(Arrays.asList("http://localhost:3018")); // Frontend URL
	        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE"));
	        config.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));

	        source.registerCorsConfiguration("/**", config);
	        return new CorsWebFilter(source);
	    }
}
