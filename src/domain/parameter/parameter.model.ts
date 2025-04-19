export type Parameter = {
  id: string;
  userId: string;
  name: string;
  description: string;
  dataType: ParameterType;
  unit: string;
  createdAt: string;
  updatedAt: string;
};

type ParameterType = 'float';

type MeasurementType = 'float';

export type Measurement = MeasurementFloat;

type MeasurementFloat = BaseMeasurement & {
  type: 'float';
  value: number;
};

type BaseMeasurement = {
  type: MeasurementType;
  id: string;
  userId: string;
  parameterId: string;
  timestamp: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};
