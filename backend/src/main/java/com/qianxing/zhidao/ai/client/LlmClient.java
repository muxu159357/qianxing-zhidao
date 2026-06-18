package com.qianxing.zhidao.ai.client;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.net.URI;
import java.util.List;
import java.util.Map;

@Component
public class LlmClient {
    private static final Logger log = LoggerFactory.getLogger(LlmClient.class);

    private final RestTemplate restTemplate;
    private final String apiBaseUrl;
    private final String cleanApiKey;
    private final String model;
    private final boolean configured;

    public LlmClient(RestTemplate restTemplate,
                     @Value("${llm.api-base-url:}") String rawApiBaseUrl,
                     @Value("${llm.api-key:}") String rawApiKey,
                     @Value("${llm.model:}") String rawModel) {
        this.restTemplate = restTemplate;
        this.apiBaseUrl = sanitizeUrl(rawApiBaseUrl);
        this.cleanApiKey = sanitizeApiKey(rawApiKey);
        this.model = sanitizeModel(rawModel);
        this.configured = cleanApiKey != null && !cleanApiKey.isBlank()
                && apiBaseUrl != null && !apiBaseUrl.isBlank();

        logDiagnostics();
    }

    private String sanitizeUrl(String raw) {
        if (raw == null) return null;
        return raw.trim().replaceAll("/+$", "");
    }

    private String sanitizeApiKey(String raw) {
        if (raw == null) return null;
        String key = raw.trim();
        // strip surrounding quotes
        if ((key.startsWith("\"") && key.endsWith("\"")) || (key.startsWith("'") && key.endsWith("'"))) {
            key = key.substring(1, key.length() - 1).trim();
        }
        // strip accidental Bearer prefix
        if (key.startsWith("Bearer ") || key.startsWith("bearer ")) {
            key = key.substring(7).trim();
        }
        return key;
    }

    private String sanitizeModel(String raw) {
        if (raw == null) return "deepseek-chat";
        return raw.trim();
    }

    private void logDiagnostics() {
        String masked = cleanApiKey != null && cleanApiKey.length() >= 6
                ? cleanApiKey.substring(0, 3) + "***" + cleanApiKey.substring(cleanApiKey.length() - 3)
                : "null";
        log.info("LLM_AUTH_DIAG: baseUrlHost={} model={} apiKeyPresent={} apiKeyLength={} apiKeyMasked={}",
                apiBaseUrl, model, configured, cleanApiKey != null ? cleanApiKey.length() : 0, masked);
    }

    public boolean isConfigured() { return configured; }

    public String chat(String systemPrompt, String userMessage) {
        if (!configured) throw new IllegalStateException("LLM not configured");

        String url = apiBaseUrl + "/chat/completions";
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
            headers.setBearerAuth(cleanApiKey);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

            log.info("LLM_REQUEST: {} {}", "POST", URI.create(url).getHost() + URI.create(url).getPath());
            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, entity, Map.class);
            Map<String, Object> respBody = response.getBody();

            if (respBody == null) {
                log.error("LLM_FALLBACK_EMPTY_RESPONSE");
                throw new RuntimeException("LLM response body is null");
            }

            List<Map<String, Object>> choices = (List<Map<String, Object>>) respBody.get("choices");
            if (choices == null || choices.isEmpty()) {
                log.error("LLM_FALLBACK_NO_CHOICES: resp={}", respBody);
                throw new RuntimeException("LLM returned no choices");
            }

            Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
            String content = (String) message.get("content");
            if (content == null || content.isBlank()) {
                log.error("LLM_FALLBACK_EMPTY_CONTENT");
                throw new RuntimeException("LLM returned empty content");
            }

            log.info("LLM_SUCCESS: contentLength={}", content.length());
            return content;
        } catch (HttpClientErrorException e) {
            String status = e.getStatusCode().toString();
            String resp = e.getResponseBodyAsString();
            log.error("LLM_FALLBACK_HTTP_ERROR: status={} resp={}", status, resp != null ? resp.substring(0, Math.min(200, resp.length())) : "null");
            throw new RuntimeException("大模型调用失败: " + status + " " + (resp != null ? resp : ""));
        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            log.error("LLM_FALLBACK_PARSE_ERROR: {}", e.getMessage());
            throw new RuntimeException("大模型调用失败: " + e.getMessage());
        }
    }

    public String getModelName() { return model; }
}
