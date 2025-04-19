import { Parameter, Measurement } from './parameter.model';

export interface ParameterService {
  listParametersByUser(userId: string): Promise<Parameter[]>;
  listMeasurementsByParameter(parameterId: string): Promise<Measurement[]>;
}
