import localForage from 'localforage';
import { Settings } from './settings.model';
import { SettingsRepository } from './settings.repository.ts';

class SettingsRepositoryLocal implements SettingsRepository {
  private readonly storageKey: string;

  constructor() {
    this.storageKey = 'settings';
  }

  async getSettings(): Promise<Settings> {
    const settings = await localForage.getItem<Settings>(this.storageKey);
    if (!settings) {
      return {
        llmKey: '',
        macroGoals: {
          calories: 0,
          proteins: 0,
          fats: 0,
          carbs: 0,
        },
        lng: 'en',
      };
    }
    return settings;
  }

  async updateSettings(settings: Settings): Promise<Settings> {
    await localForage.setItem(this.storageKey, settings);
    return settings;
  }
}

export default SettingsRepositoryLocal;
