const mapping: Record<string, string> = {
  clients: 'client',
  consultations: 'consultation',
  'healthcare-providers': 'healthcare_provider',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
