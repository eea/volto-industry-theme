const pagesSchema = {
  title: 'Page',
  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['title', 'url'],
    },
  ],
  properties: {
    title: {
      title: 'Title',
    },
    url: {
      title: 'Pages',
      widget: 'textarea',
    },
  },
  required: [],
};

export default {
  title: 'Navigation block',
  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['ignoreScroll', 'isExact', 'parent', 'pages'],
    },
  ],
  properties: {
    parent: {
      title: 'Parent',
      widget: 'url',
    },
    pages: {
      title: 'Pages',
      schema: pagesSchema,
      widget: 'object_list',
    },
    isExact: {
      title: 'Is exact',
      type: 'boolean',
    },
    ignoreScroll: {
      title: 'Ignore scroll',
      type: 'boolean',
    },
  },
  required: [],
};
