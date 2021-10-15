const applyConfig = (config) => {
  config.settings = {
    ...config.settings,
    excludeFromNavigation: ['/industrial-site'],
  };

  return config;
};

export default applyConfig;
