import { Settings } from './settings.model';

export interface SettingsService {
  getSettings(): Promise<Settings>;
  updateSettings(settings: Settings): Promise<Settings>;
}
