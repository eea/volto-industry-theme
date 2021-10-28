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
      fields: ['ignoreScroll', 'parent', 'pages'],
    },
  ],
  properties: {
    parent: {
      title: 'Parent',
      widget: 'object_by_path',
    },
    pages: {
      title: 'Pages',
      schema: pagesSchema,
      widget: 'object_list',
    },
    ignoreScroll: {
      title: 'Ignore scroll',
      type: 'boolean',
    },
  },
  required: [],
};
