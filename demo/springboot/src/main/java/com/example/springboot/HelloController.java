package com.example.springboot;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

import java.io.IOException;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

@RestController
public class HelloController {

	@RequestMapping("/")
	public String index() throws IOException {
		return this.run("http://localhost:3000/api");
    }
    
    OkHttpClient client = new OkHttpClient.Builder()
                            .retryOnConnectionFailure(false)
                            .build();

    String run(String url) throws IOException {
        Request request = new Request.Builder()
            .url(url)
            .header("Accept-Encoding", "identity")
            .build();

        try (Response response = client.newCall(request).execute()) {
        return response.body().string();
        }
    }
}