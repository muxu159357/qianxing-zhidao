package com.qianxing.zhidao.ai.client;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Component
public class LlmClient {
    private static final Logger log = LoggerFactory.getLogger(LlmClient.class);

    private final RestTemplate restTemplate;
    private final String apiBaseUrl;
    private final String apiKey;
    private final String model;
    private final boolean configured;

    public LlmClient(RestTemplate restTemplate,
                     @Value("${llm.api-base-url:}") String apiBaseUrl,
                     @Value("${llm.api-key:}") String apiKey,
                     @Value("${llm.model:}") String model) {
        this.restTemplate = restTemplate;
        this.apiBaseUrl = apiBaseUrl;
        this.apiKey = apiKey;
        this.model = model;
        this.configured = apiKey != null && !apiKey.isBlank()
                && apiBaseUrl != null && !apiBaseUrl.isBlank();
    }

    public boolean isConfigured() { return configured; }

    public String chat(String systemPrompt, String userMessage) {
        if (!configured) throw new IllegalStateException("LLM not configured");

        String url = apiBaseUrl.replaceAll("/+$", "") + "/chat/completions";
        String actualModel = (model != null && !model.isBlank()) ? model : "deepseek-chat";

        Map<String, Object> body = Map.of(
                "model", actualModel,
                "messages", List.of(
                        Map.of("role", "system", "content", systemPrompt),
                        Map.of("role", "user", "content", userMessage)
                ),
                "temperature", 0.7,
                "max_tokens", 2048
        );

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, entity, Map.class);
            Map<String, Object> respBody = response.getBody();
            if (respBody == null) throw new RuntimeException("LLM response body is null");

            List<Map<String, Object>> choices = (List<Map<String, Object>>) respBody.get("choices");
            if (choices == null || choices.isEmpty()) throw new RuntimeException("LLM returned no choices");

            Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
            return (String) message.get("content");
        } catch (Exception e) {
            log.error("LLM call failed: {}", e.getMessage());
            throw new RuntimeException("大模型调用失败: " + e.getMessage());
        }
    }

    public String getModelName() { return model; }
}
