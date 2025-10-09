package com.rtalky.netdebug

import android.util.Log
import okhttp3.HttpUrl
import okhttp3.Interceptor
import okhttp3.Response
import kotlin.system.measureTimeMillis

/**
 * Debug-only Network Interceptor for monitoring HTTP requests and TLS information
 * Only active when BuildConfig.DEBUG is true
 */
class DebugNetworkInterceptor : Interceptor {
    companion object {
        private const val TAG = "TLS/IgnoreSSL"
    }

    override fun intercept(chain: Interceptor.Chain): Response {
        val request = chain.request()
        val url = request.url
        val method = request.method
        val host = url.host
        val port = url.port

        // Redact sensitive query parameters
        val redactedUrl = redactUrl(url.toString())

        var response: Response
        val elapsedTime = measureTimeMillis {
            response = chain.proceed(request)
        }

        // Extract TLS information from handshake
        val handshake = response.handshake
        val tlsVersion = handshake?.tlsVersion?.javaName ?: "N/A"
        val cipherSuite = handshake?.cipherSuite?.javaName ?: "N/A"
        val peerCertificates = handshake?.peerCertificates?.size ?: 0

        val responseCode = response.code
        val responseMessage = response.message

        Log.d(TAG, "HTTP Request -> $method $redactedUrl")
        Log.d(TAG, "HTTP Response -> $responseCode $responseMessage (${elapsedTime}ms)")
        Log.d(TAG, "TLS Info -> host=$host:$port tls=$tlsVersion cipher=$cipherSuite certs=$peerCertificates")

        return response
    }

    /**
     * Redact sensitive information from URL
     */
    private fun redactUrl(url: String): String {
        return try {
            // Simple string-based redaction to avoid OkHttp version compatibility issues
            var redactedUrl = url

            // Remove common sensitive query parameters using regex
            val sensitiveParams = listOf("token", "key", "secret", "password", "auth", "authorization")
            sensitiveParams.forEach { param ->
                val regex = "([?&])${param}=[^&]*".toRegex(RegexOption.IGNORE_CASE)
                redactedUrl = redactedUrl.replace(regex, "$1${param}=***")
            }

            redactedUrl
        } catch (e: Exception) {
            url // Return original if redaction fails
        }
    }
}
