import axios from 'axios';
import queryString from 'query-string';
import { HealthcareProviderInterface, HealthcareProviderGetQueryInterface } from 'interfaces/healthcare-provider';
import { GetQueryInterface } from '../../interfaces';

export const getHealthcareProviders = async (query?: HealthcareProviderGetQueryInterface) => {
  const response = await axios.get(`/api/healthcare-providers${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createHealthcareProvider = async (healthcareProvider: HealthcareProviderInterface) => {
  const response = await axios.post('/api/healthcare-providers', healthcareProvider);
  return response.data;
};

export const updateHealthcareProviderById = async (id: string, healthcareProvider: HealthcareProviderInterface) => {
  const response = await axios.put(`/api/healthcare-providers/${id}`, healthcareProvider);
  return response.data;
};

export const getHealthcareProviderById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/healthcare-providers/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteHealthcareProviderById = async (id: string) => {
  const response = await axios.delete(`/api/healthcare-providers/${id}`);
  return response.data;
};
