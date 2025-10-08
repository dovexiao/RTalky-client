package com.rtalky

import android.util.Log
import com.facebook.react.modules.network.OkHttpClientFactory
import com.facebook.react.modules.network.ReactCookieJarContainer
import com.rtalky.netdebug.DebugTlsEventListener
import com.rtalky.netdebug.DebugNetworkInterceptor
import okhttp3.OkHttpClient
import java.util.concurrent.TimeUnit

/**
 * Debug-enhanced OkHttpClientFactory that integrates SSL bypass with detailed logging
 * Only active when BuildConfig.DEBUG is true
 */
class DebugOkHttpClientFactory : OkHttpClientFactory {
    
    companion object {
        private const val TAG = "TLS/IgnoreSSL"
    }
    
    override fun createNewNetworkModuleClient(): OkHttpClient {
        if (BuildConfig.DEBUG) {
            Log.i(TAG, "Debug build: Creating OkHttpClient with enhanced TLS logging")
            
            // Create the base client with SSL bypass
            val baseClient = IgnoreSSLFactory().createNewNetworkModuleClient()
            
            // Add debug interceptors and event listener
            return baseClient.newBuilder()
                .addNetworkInterceptor(DebugNetworkInterceptor())
                .eventListenerFactory(DebugTlsEventListener.factory())
                .build()
        } else {
            Log.i(TAG, "Release build: Creating standard OkHttpClient")
            return OkHttpClient.Builder()
                .connectTimeout(30, TimeUnit.SECONDS)
                .readTimeout(30, TimeUnit.SECONDS)
                .writeTimeout(30, TimeUnit.SECONDS)
                .cookieJar(ReactCookieJarContainer())
                .build()
        }
    }
}
