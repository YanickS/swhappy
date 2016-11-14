package com.swhappy.web.rest.util;

import org.springframework.http.HttpHeaders;

/**
 * Utility class for http header creation.
 *
 */
public class HeaderUtil {

    public static HttpHeaders createAlert(String message, String param) {
        HttpHeaders headers = new HttpHeaders();
        headers.add("X-swhappyApp-alert", message);
        headers.add("X-swhappyApp-params", param);
        return headers;
    }

    public static HttpHeaders createEntityCreationAlert(String entityName, String param) {
        return createAlert("swhappyApp." + entityName + ".created", param);
    }

    public static HttpHeaders createEntityUpdateAlert(String entityName, String param) {
        return createAlert("swhappyApp." + entityName + ".updated", param);
    }

    public static HttpHeaders createEntityDeletionAlert(String entityName, String param) {
        return createAlert("swhappyApp." + entityName + ".deleted", param);
    }

    public static HttpHeaders createFailureAlert(String entityName, String errorKey, String defaultMessage) {
        HttpHeaders headers = new HttpHeaders();
        headers.add("X-swhappyApp-error", "error." + errorKey);
        headers.add("X-swhappyApp-params", entityName);
        return headers;
    }
}
