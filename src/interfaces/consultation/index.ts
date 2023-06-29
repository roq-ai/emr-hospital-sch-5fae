import { ClientInterface } from 'interfaces/client';
import { HealthcareProviderInterface } from 'interfaces/healthcare-provider';
import { GetQueryInterface } from 'interfaces';

export interface ConsultationInterface {
  id?: string;
  client_id?: string;
  healthcare_provider_id?: string;
  time_spent: number;
  created_at?: any;
  updated_at?: any;

  client?: ClientInterface;
  healthcare_provider?: HealthcareProviderInterface;
  _count?: {};
}

export interface ConsultationGetQueryInterface extends GetQueryInterface {
  id?: string;
  client_id?: string;
  healthcare_provider_id?: string;
}
