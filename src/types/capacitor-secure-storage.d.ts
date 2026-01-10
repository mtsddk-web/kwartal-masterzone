// Type declarations for capacitor-secure-storage-plugin
// This module is only available on native platforms (iOS/Android)
// On web, the hook falls back to localStorage with obfuscation

declare module 'capacitor-secure-storage-plugin' {
  export interface SecureStoragePluginPlugin {
    get(options: { key: string }): Promise<{ value: string }>;
    set(options: { key: string; value: string }): Promise<void>;
    remove(options: { key: string }): Promise<void>;
    clear(): Promise<void>;
    keys(): Promise<{ value: string[] }>;
  }

  export const SecureStoragePlugin: SecureStoragePluginPlugin;
}
