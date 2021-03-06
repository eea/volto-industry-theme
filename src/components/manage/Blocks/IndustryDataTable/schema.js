export default () => ({
  title: 'Industry datatable',
  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['link'],
    },
  ],
  properties: {
    link: {
      title: 'Site details path',
      widget: 'url',
    },
  },
  required: [],
});
