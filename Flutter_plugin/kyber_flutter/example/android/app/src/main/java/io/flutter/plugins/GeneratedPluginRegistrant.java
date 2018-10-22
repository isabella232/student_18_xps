package io.flutter.plugins;

import io.flutter.plugin.common.PluginRegistry;
import dedis.epfl.ch.kyberflutter.KyberFlutterPlugin;

/**
 * Generated file. Do not edit.
 */
public final class GeneratedPluginRegistrant {
  public static void registerWith(PluginRegistry registry) {
    if (alreadyRegisteredWith(registry)) {
      return;
    }
    KyberFlutterPlugin.registerWith(registry.registrarFor("dedis.epfl.ch.kyberflutter.KyberFlutterPlugin"));
  }

  private static boolean alreadyRegisteredWith(PluginRegistry registry) {
    final String key = GeneratedPluginRegistrant.class.getCanonicalName();
    if (registry.hasPlugin(key)) {
      return true;
    }
    registry.registrarFor(key);
    return false;
  }
}
