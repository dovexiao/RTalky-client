package com.rtalky;

import static android.content.ContentValues.TAG;

import android.util.Log;
import com.facebook.react.modules.network.OkHttpClientFactory;
import com.facebook.react.modules.network.OkHttpClientFactory;
import com.facebook.react.modules.network.OkHttpClientProvider;
import com.facebook.react.modules.network.ReactCookieJarContainer;
import java.security.cert.CertificateException;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;
import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSession;
import javax.net.ssl.SSLSocketFactory;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;
import okhttp3.CipherSuite;
import okhttp3.ConnectionSpec;
import okhttp3.OkHttpClient;
import okhttp3.TlsVersion;

public class IgnoreSSLFactory implements OkHttpClientFactory {

    private static final String TAG = "TLS/IgnoreSSL";

    @Override
    public OkHttpClient createNewNetworkModuleClient() {
        try {
            if (BuildConfig.DEBUG) {
                Log.w(TAG, "Debug-only: IgnoreSSLFactory enabled - ALL certificate validation will be bypassed");

                final TrustManager[] trustAllCerts = new TrustManager[] {
                        new X509TrustManager() {
                            @Override
                            public void checkClientTrusted(
                                    java.security.cert.X509Certificate[] chain,
                                    String authType
                            ) throws CertificateException {
                                Log.d(TAG, "Debug-only: checkClientTrusted bypassed for authType=" + authType);
                            }

                            @Override
                            public void checkServerTrusted(
                                    java.security.cert.X509Certificate[] chain,
                                    String authType
                            ) throws CertificateException {
                                if (chain != null && chain.length > 0) {
                                    java.security.cert.X509Certificate cert = chain[0];
                                    String subject = cert.getSubjectX500Principal().toString();
                                    String issuer = cert.getIssuerX500Principal().toString();
                                    String notBefore = cert.getNotBefore().toString();
                                    String notAfter = cert.getNotAfter().toString();

                                    Log.w(TAG, "Debug-only: checkServerTrusted bypassed");
                                    Log.d(TAG, "Certificate details: subject=" + subject);
                                    Log.d(TAG, "Certificate details: issuer=" + issuer);
                                    Log.d(TAG, "Certificate details: validFrom=" + notBefore + " validTo=" + notAfter);

                                    // Log certificate fingerprint for identification
                                    try {
                                        byte[] certBytes = cert.getEncoded();
                                        java.security.MessageDigest sha256 = java.security.MessageDigest.getInstance("SHA-256");
                                        byte[] hash = sha256.digest(certBytes);
                                        StringBuilder hexString = new StringBuilder();
                                        for (int i = 0; i < 8; i++) { // First 8 bytes for short fingerprint
                                            String hex = Integer.toHexString(0xff & hash[i]);
                                            if (hex.length() == 1) {
                                                hexString.append('0');
                                            }
                                            hexString.append(hex);
                                        }
                                        Log.d(TAG, "Certificate fingerprint (SHA-256 first 8 bytes): " + hexString.toString());
                                    } catch (Exception e) {
                                        Log.d(TAG, "Could not generate certificate fingerprint: " + e.getMessage());
                                    }
                                } else {
                                    Log.w(TAG, "Debug-only: checkServerTrusted bypassed (no certificate chain)");
                                }
                            }

                            @Override
                            public java.security.cert.X509Certificate[] getAcceptedIssuers() {
                                Log.d(TAG, "Debug-only: getAcceptedIssuers returning empty array");
                                return new java.security.cert.X509Certificate[] {};
                            }
                        },
                };
                final SSLContext sslContext = SSLContext.getInstance("SSL");
                sslContext.init(null, trustAllCerts, new java.security.SecureRandom());
                final SSLSocketFactory sslSocketFactory = sslContext.getSocketFactory();
                OkHttpClient.Builder builder = new OkHttpClient.Builder()
                        .connectTimeout(30, TimeUnit.SECONDS)
                        .readTimeout(30, TimeUnit.SECONDS)
                        .writeTimeout(30, TimeUnit.SECONDS)
                        .cookieJar(new ReactCookieJarContainer());
                builder.sslSocketFactory(
                        sslSocketFactory,
                        (X509TrustManager) trustAllCerts[0]
                );
                builder.hostnameVerifier(
                        new HostnameVerifier() {
                            @Override
                            public boolean verify(String hostname, SSLSession session) {
                                Log.d(TAG, "Debug-only: hostnameVerifier bypassed for hostname=" + hostname);
                                return true;
                            }
                        }
                );

                Log.i(TAG, "Debug-only: OkHttpClient configured with SSL certificate validation bypass");
                OkHttpClient okHttpClient = builder.build();
                return okHttpClient;
            } else {
                Log.i(TAG, "Release build: Using standard SSL validation (no bypass)");
                return new OkHttpClient.Builder()
                        .connectTimeout(30, TimeUnit.SECONDS)
                        .readTimeout(30, TimeUnit.SECONDS)
                        .writeTimeout(30, TimeUnit.SECONDS)
                        .cookieJar(new ReactCookieJarContainer())
                        .build();
            }
        } catch (Exception e) {
            Log.e(TAG, e.getMessage());
            throw new RuntimeException(e);
        }
    }
}
