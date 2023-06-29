import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createConsultation } from 'apiSdk/consultations';
import { Error } from 'components/error';
import { consultationValidationSchema } from 'validationSchema/consultations';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { ClientInterface } from 'interfaces/client';
import { HealthcareProviderInterface } from 'interfaces/healthcare-provider';
import { getClients } from 'apiSdk/clients';
import { getHealthcareProviders } from 'apiSdk/healthcare-providers';
import { ConsultationInterface } from 'interfaces/consultation';

function ConsultationCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: ConsultationInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createConsultation(values);
      resetForm();
      router.push('/consultations');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<ConsultationInterface>({
    initialValues: {
      time_spent: 0,
      client_id: (router.query.client_id as string) ?? null,
      healthcare_provider_id: (router.query.healthcare_provider_id as string) ?? null,
    },
    validationSchema: consultationValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Create Consultation
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="time_spent" mb="4" isInvalid={!!formik.errors?.time_spent}>
            <FormLabel>Time Spent</FormLabel>
            <NumberInput
              name="time_spent"
              value={formik.values?.time_spent}
              onChange={(valueString, valueNumber) =>
                formik.setFieldValue('time_spent', Number.isNaN(valueNumber) ? 0 : valueNumber)
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {formik.errors.time_spent && <FormErrorMessage>{formik.errors?.time_spent}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<ClientInterface>
            formik={formik}
            name={'client_id'}
            label={'Select Client'}
            placeholder={'Select Client'}
            fetcher={getClients}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.name}
              </option>
            )}
          />
          <AsyncSelect<HealthcareProviderInterface>
            formik={formik}
            name={'healthcare_provider_id'}
            label={'Select Healthcare Provider'}
            placeholder={'Select Healthcare Provider'}
            fetcher={getHealthcareProviders}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.name}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'consultation',
    operation: AccessOperationEnum.CREATE,
  }),
)(ConsultationCreatePage);
