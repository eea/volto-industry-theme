const providerSchema = {
  title: 'Provider',
  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['name', 'url'],
    },
  ],
  properties: {
    name: {
      title: 'Provider name',
    },
    url: {
      title: 'Provider url',
      widget: 'url',
    },
  },
  required: [],
};

export default {
  title: 'Filters block',
  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['providers'],
    },
  ],
  properties: {
    providers: {
      title: 'Providers',
      schema: providerSchema,
      widget: 'object_list',
    },
  },
  required: [],
};
