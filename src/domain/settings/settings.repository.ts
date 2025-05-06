import { Settings } from './settings.model';

export interface SettingsRepository {
  getSettings(): Promise<Settings>;
  updateSettings(settings: Settings): Promise<Settings>;
}
