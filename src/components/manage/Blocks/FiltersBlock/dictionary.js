export const getOptions = (data) => {
  if (!data || !data.opt_key || !data.opt_value || !data.opt_text) return [];
  return [
    { key: 'no-value', value: null, text: 'No value' },
    ...data.opt_key.map((_, index) => ({
      key: data.opt_id?.[index]
        ? `${data.opt_key[index]} - ${data.opt_id[index]}`
        : data.opt_key[index],
      value: data.opt_value[index],
      text: data.opt_text[index],
    })),
  ];
};

export const inputsKeys = [
  'filter_bat_conclusions',
  'filter_countries',
  'filter_facility_types',
  'filter_industries',
  'filter_nuts_1',
  'filter_nuts_2',
  'filter_permit_types',
  'filter_permit_years',
  'filter_plant_types',
  'filter_pollutant_groups',
  'filter_pollutants',
  'filter_reporting_years',
  'filter_river_basin_districts',
];

export const permitTypes = [
  { key: null, value: null, text: 'No value' },
  {
    key: 'permitGranted',
    value: 'permitGranted',
    text: 'Permit granted',
  },
  {
    key: 'permitReconsidered',
    value: 'permitReconsidered',
    text: 'Permit reconsidered',
  },
  {
    key: 'permitUpdated',
    value: 'permitUpdated',
    text: 'Permit updated',
  },
];

export const noOptions = [{ key: 'no-value', value: null, text: 'No value' }];
