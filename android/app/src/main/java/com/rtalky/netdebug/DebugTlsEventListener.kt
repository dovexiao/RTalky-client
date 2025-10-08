package com.rtalky.netdebug

import android.util.Log
import okhttp3.Call
import okhttp3.EventListener
import okhttp3.Handshake
import javax.net.ssl.SSLHandshakeException
import javax.net.ssl.SSLPeerUnverifiedException

/**
 * Debug-only TLS EventListener for monitoring SSL/TLS handshake process
 * Only active when BuildConfig.DEBUG is true
 */
class DebugTlsEventListener private constructor() : EventListener() {
    companion object {
        private const val TAG = "TLS/IgnoreSSL"
        
        fun factory(): Factory {
            return object : Factory {
                override fun create(call: Call): EventListener {
                    return DebugTlsEventListener()
                }
            }
        }
    }

    override fun secureConnectStart(call: Call) {
        val host = call.request().url.host
        val port = call.request().url.port
        Log.d(TAG, "secureConnectStart -> host=$host port=$port")
    }

    override fun secureConnectEnd(call: Call, handshake: Handshake?) {
        val host = call.request().url.host
        val tlsVersion = handshake?.tlsVersion?.javaName ?: "N/A"
        val cipherSuite = handshake?.cipherSuite?.javaName ?: "N/A"
        val peerCertificates = handshake?.peerCertificates?.size ?: 0
        
        Log.i(TAG, "secureConnectEnd -> host=$host tls=$tlsVersion cipher=$cipherSuite certs=$peerCertificates")
        
        // Warn if this might be using ignored certificate validation
        if (handshake != null) {
            Log.w(TAG, "TLS handshake completed (Debug-only: certificate validation may be ignored)")
        }
    }

    override fun callFailed(call: Call, ioe: java.io.IOException) {
        val host = call.request().url.host
        val exceptionType = ioe::class.java.simpleName
        val message = ioe.message ?: ""
        val isTlsRelated = ioe is SSLHandshakeException || ioe is SSLPeerUnverifiedException
        
        if (isTlsRelated) {
            Log.w(TAG, "callFailed (TLS-related) -> host=$host type=$exceptionType msg=$message")
        } else {
            Log.d(TAG, "callFailed -> host=$host type=$exceptionType msg=$message")
        }
    }

    // Removed connectStart, connectEnd, connectFailed methods to avoid OkHttp version compatibility issues
    // These methods have different signatures across OkHttp versions
}
