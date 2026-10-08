package com.bagus4d.apk;
import android.app.Activity; import android.os.Bundle; import android.webkit.WebView; import android.webkit.WebViewClient; import android.webkit.WebSettings;
public class MainActivity extends Activity {
 private WebView wv;
 protected void onCreate(Bundle b){super.onCreate(b); wv=new WebView(this); setContentView(wv); WebSettings s=wv.getSettings(); s.setJavaScriptEnabled(true); s.setDomStorageEnabled(true); wv.setWebViewClient(new WebViewClient()); wv.loadUrl("file:///android_asset/index.html");}
 public void onBackPressed(){if(wv.canGoBack())wv.goBack(); else super.onBackPressed();}
}
