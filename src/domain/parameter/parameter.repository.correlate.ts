import axios, { AxiosInstance } from 'axios';
import CryptoJS from 'crypto-js';
import { z } from 'zod';
import set from 'lodash/set';
import { Parameter, Measurement } from './parameter.model';
import { ParameterRepository } from './parameter.repository';
import { handleAxiosError } from '../../utils/axios';

const ParameterResponseSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  description: z.string(),
  dataType: z.enum(['float']),
  unit: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const BaseMeasurementSchema = z.object({
  type: z.literal('float'), // MeasurementType is only 'float'
  id: z.string(),
  userId: z.string(),
  parameterId: z.string(),
  timestamp: z.string(),
  notes: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// MeasurementFloat schema extends BaseMeasurementSchema with a value property.
const MeasurementFloatSchema = BaseMeasurementSchema.extend({
  value: z.number(),
});

// Since Measurement is only defined as MeasurementFloat, we export it as MeasurementSchema.
const MeasurementResponseSchema = MeasurementFloatSchema;

type ConstructorInput = {
  apiKey: string;
  baseUrl: string;
};

class ParameterRepositoryCorrelate implements ParameterRepository {
  private readonly apiKey: string;

  private readonly client: AxiosInstance;

  private readonly baseUrl: string;

  constructor({ apiKey, baseUrl }: ConstructorInput) {
    this.apiKey = apiKey;

    this.baseUrl = baseUrl;

    this.client = axios.create({
      baseURL: baseUrl,
    });

    this.client.interceptors.request.use((config) => {
      // Determine the payload string:
      let payload = '';
      const method = config.method?.toUpperCase();
      if (method === 'POST' || method === 'PUT') {
        // If the data is an object, JSON-stringify it; otherwise, use it as is.
        payload = config.data ? JSON.stringify(config.data) : '';
      }
      // For GET/DELETE, payload is an empty string (or you can use the query string if needed).

      // Generate auth headers
      const authHeaders = this.attachAuthHeaders(payload);

      // Attach the headers to the request
      set(config, 'headers', { ...config.headers, ...authHeaders });

      return config;
    });
  }

  async listParametersByUser(userId: string): Promise<Parameter[]> {
    const url = `/api/parameters/user/${userId}`;

    try {
      const response = await this.client.get(url);

      const result = z.array(ParameterResponseSchema).parse(response.data);

      return result;
    } catch (error) {
      return handleAxiosError(error, `${this.baseUrl}${url}`);
    }
  }

  async listMeasurementsByParameter(parameterId: string): Promise<Measurement[]> {
    const url = `/api/measurements/parameter/${parameterId}`;

    try {
      const response = await this.client.get(url);

      const result = z.array(MeasurementResponseSchema).parse(response.data);

      return result;
    } catch (error) {
      return handleAxiosError(error, `${this.baseUrl}${url}`);
    }
  }

  private attachAuthHeaders(payload: string) {
    const timestamp = Math.floor(Date.now() / 1000); // current Unix timestamp in seconds
    const signature = this.computeHMAC(payload, timestamp);
    return {
      'X-Timestamp': timestamp.toString(),
      'X-Signature': signature,
    };
  }

  private computeHMAC(payload: string, timestamp: number): string {
    const message = `${payload}|${timestamp}`;
    const hmac = CryptoJS.HmacSHA256(message, this.apiKey);
    return CryptoJS.enc.Base64.stringify(hmac);
  }
}

export default ParameterRepositoryCorrelate;
