package com.twitch;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan(basePackages = {"com.twitch.mapper"})
public class TwitchApplication {

	public static void main(String[] args) {
		SpringApplication.run(TwitchApplication.class, args);
	}

}
