package com.twitch.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/home")
public class HomeController {
	@ResponseBody
	@RequestMapping("/test")
	public ResponseEntity<String> test() throws Exception{
		return new ResponseEntity<>("oh" , HttpStatus.OK);
	}
}
