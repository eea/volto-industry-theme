import CopyPaste from './CopyPaste';

export default (config) => {
  config.settings.appExtras = [
    ...(config.settings.appExtras || []),
    {
      match: ['/edit', '/**/edit'],
      component: CopyPaste,
    },
  ];

  return config;
};
