import { ParameterService } from './parameter.service';
import { ParameterRepository } from './parameter.repository';

type ConstructorInput = {
  parameterRepository: ParameterRepository;
};

class ParameterServiceImpl implements ParameterService {
  private readonly parameterRepository: ParameterRepository;

  constructor({ parameterRepository }: ConstructorInput) {
    this.parameterRepository = parameterRepository;
  }

  async listParametersByUser(userId: string) {
    return this.parameterRepository.listParametersByUser(userId);
  }

  async listMeasurementsByParameter(parameterId: string) {
    return this.parameterRepository.listMeasurementsByParameter(parameterId);
  }
}

export default ParameterServiceImpl;
