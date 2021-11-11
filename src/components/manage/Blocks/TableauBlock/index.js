import sliderSVG from '@plone/volto/icons/slider.svg';
import TableauEdit from './Edit';
import TableauView from './View';

export default (config) => {
  config.blocks.blocksConfig.tableau_block = {
    id: 'tableau_block',
    title: 'Tableau',
    icon: sliderSVG,
    group: 'common',
    edit: TableauEdit,
    view: TableauView,
    restricted: false,
    mostUsed: false,
    sidebarTab: 1,
    blocks: {},
    security: {
      addPermission: [],
      view: [],
    },
    breakpoints: {
      desktop: [Infinity, 982],
      tablet: [981, 768],
      mobile: [767, 0],
    },
  };
  return config;
};
