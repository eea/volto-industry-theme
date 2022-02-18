export default {
  title: 'Title settings',

  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['hide_title', 'no_space_top', 'no_space_bottom'],
    },
  ],

  properties: {
    hide_title: {
      title: 'Hide title',
      description: 'Hide page title on View',
      type: 'boolean',
    },
    no_space_top: {
      title: 'No space top',
      type: 'boolean',
    },
    no_space_bottom: {
      title: 'No space bottom',
      type: 'boolean',
    },
  },
  required: [],
};
