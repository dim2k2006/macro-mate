import { Settings } from './settings.model';
import { SettingsRepository } from './settings.repository.ts';
import { SettingsService } from './settings.service.ts';

type ConstructorInput = {
  settingsRepository: SettingsRepository;
};

class SettingsServiceImpl implements SettingsService {
  private settingsRepository: SettingsRepository;

  constructor({ settingsRepository }: ConstructorInput) {
    this.settingsRepository = settingsRepository;
  }

  async getSettings(): Promise<Settings> {
    return this.settingsRepository.getSettings();
  }

  async updateSettings(settings: Settings): Promise<Settings> {
    return this.settingsRepository.updateSettings(settings);
  }
}

export default SettingsServiceImpl;
