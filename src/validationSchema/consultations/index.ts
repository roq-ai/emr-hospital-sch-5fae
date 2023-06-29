import * as yup from 'yup';

export const consultationValidationSchema = yup.object().shape({
  time_spent: yup.number().integer().required(),
  client_id: yup.string().nullable(),
  healthcare_provider_id: yup.string().nullable(),
});
