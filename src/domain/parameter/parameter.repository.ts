import { Parameter, Measurement } from './parameter.model';

export interface ParameterRepository {
  listParametersByUser(userId: string): Promise<Parameter[]>;
  listMeasurementsByParameter(parameterId: string): Promise<Measurement[]>;
}
