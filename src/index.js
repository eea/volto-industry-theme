import {
  installCustomViews,
  installTitleBlock,
  installNavigationBlock,
  installEprtrSpecificBlocks,
  installCustomConnectedBlocks,
  installAppExtras,
} from '@eeacms/volto-industry-theme/components';
import addonReducers from '@eeacms/volto-industry-theme/reducers';

import iconC from '@eeacms/volto-columns-block/ColumnsBlock/icons/one-third-right.svg';

const applyConfig = (config) => {
  config.settings = {
    ...config.settings,
    navDepth: 5,
    providerUrl: 'https://discodata.eea.europa.eu/sql',
    excludeFromNavigation: ['/industrial-site'],
    metaDescription: 'European Environment Agency',
    matomoSiteId: 48,
    tableauVersion: '2.3.0',
    available_colors: [
      '#81C9DB',
      '#5397B2',
      '#12435D',
      '#E2776B',
      '#CD3B1F',
      '#F6F6F6',
      '#EDEDED',
    ],
    db_version: 'v1',
  };

  config.blocks.groupBlocksOrder = [
    ...config.blocks.groupBlocksOrder,
    { id: 'eprtr_blocks', title: 'Eprtr Blocks' },
  ];

  config.addonReducers = {
    ...config.addonReducers,
    ...addonReducers,
  };

  config.settings.pluggableStyles = [
    ...(config.settings.pluggableStyles || []),
    {
      id: 'outlineButton',
      title: 'Outline button',
      cssClass: 'outline-button',
    },
    {
      id: 'solidButton',
      title: 'Solid button',
      cssClass: 'solid-button',
    },
    {
      id: 'type1',
      title: 'Type 1',
      cssClass: 'type-1',
    },
    {
      id: 'industrialSiteStyle',
      title: 'Industrial site style',
      cssClass: 'industrial-site-style',
    },
    {
      id: 'padded',
      title: 'Padded',
      cssClass: 'padded',
    },
  ];

  config.blocks.blocksConfig.columnsBlock = {
    ...(config.blocks.blocksConfig.columnsBlock || {}),
    gridSizes: {
      ...(config.blocks.blocksConfig.columnsBlock?.gridSizes || {}),
      twoFifthsFull: {
        mobile: 12,
        tablet: 12,
        computer: 5,
      },
      threeFifthsFull: {
        mobile: 12,
        tablet: 12,
        computer: 7,
      },
    },
    variants: [
      ...(config.blocks.blocksConfig.columnsBlock?.variants || []),
      {
        icon: iconC,
        defaultData: {
          gridSize: 12,
          gridCols: ['twoFifthsFull', 'threeFifthsFull'],
        },
        common: true,
        title: '40 / 60',
      },
    ],
  };

  return [
    installCustomViews,
    installTitleBlock,
    installNavigationBlock,
    installEprtrSpecificBlocks,
    installCustomConnectedBlocks,
    installAppExtras,
  ].reduce((acc, apply) => apply(acc), config);
};

export default applyConfig;
