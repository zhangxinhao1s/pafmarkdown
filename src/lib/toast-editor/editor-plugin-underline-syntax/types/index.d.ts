import type { PluginContext, PluginInfo } from '@toast-ui/editor';

export interface PluginOptions {
  preset?: string[];
}

export default function underlinePlugin(context: PluginContext, options: PluginOptions): PluginInfo;
