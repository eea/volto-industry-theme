import imageSVG from '@plone/volto/icons/image.svg';
import PollutantIndexView from './View';
import PollutantIndexEdit from './Edit';

export default (config) => {
  config.blocks.blocksConfig.pollutantIndex = {
    id: 'pollutantIndex',
    title: 'Pollutant Index',
    icon: imageSVG,
    group: 'eprtr_blocks',
    view: PollutantIndexView,
    edit: PollutantIndexEdit,
    restricted: false,
    mostUsed: false,
    sidebarTab: 1,
    security: {
      addPermission: [],
      view: [],
    },
  };
  return config;
};
