/**
 * Add your components here.
 * @module components
 * @example
 * import Footer from './Footer/Footer';
 *
 * export {
 *   Footer,
 * };
 */
import Parteners from './Parteners';
/*---  Custom views  ---*/
import RedirectView from './theme/View/RedirectView';
/*---  Common blocks  ---*/
import installNavigationBlock from './manage/Blocks/NavigationBlock';
/*---  EPRTR specific blocks  ---*/
import installEnvironmentalFacilityDetails from './manage/Blocks/SiteBlocks/EnvironmentalFacilityDetails';
import installEnvironmentalLcpDetails from './manage/Blocks/SiteBlocks/EnvironmentalLcpDetails';
import installEnvironmentalSiteDetails from './manage/Blocks/SiteBlocks/EnvironmentalSiteDetails';
import installExploreEprtr from './manage/Blocks/ExploreEprtr';
import installFiltersBlock from './manage/Blocks/FiltersBlock';
import installIndustryDataTable from './manage/Blocks/IndustryDataTable';
import installIndustryMap from './manage/Blocks/IndustryMap';
import installRegulatoryBATConclusions from './manage/Blocks/SiteBlocks/RegulatoryBATConclusions';
import installRegulatoryPermits from './manage/Blocks/SiteBlocks/RegulatoryPermits';
import installRegulatorySiteDetails from './manage/Blocks/SiteBlocks/RegulatorySiteDetails';
import installSiteHeader from './manage/Blocks/SiteBlocks/Header';
import installSiteLocationMap from './manage/Blocks/SiteLocationMap';
import installSiteStructureSidebar from './manage/Blocks/SiteStructureSidebar';
import installSiteTableau from './manage/Blocks/SiteTableau';
import installPollutantIndex from './manage/Blocks/PollutantIndex';
/*---  Custom connected blocks  ---*/
import installCustomConnectedList from './manage/Blocks/List';
import installCustomConnectedSelect from './manage/Blocks/Select';
import installCustomTableau from './manage/Blocks/TableauBlock';
/*---  App extras  ---*/
import installAppExtras from './theme/AppExtras';

const installCustomViews = (config) => {
  config.views = {
    ...config.views,
    layoutViews: {
      ...config.views.layoutViews,
      redirect_view: RedirectView,
    },
  };

  return config;
};

const installCustomConnectedBlocks = (config) => {
  return [
    installCustomConnectedList,
    installCustomConnectedSelect,
    installCustomTableau,
  ].reduce((acc, apply) => apply(acc), config);
};

const installEprtrSpecificBlocks = (config) => {
  return [
    installEnvironmentalFacilityDetails,
    installEnvironmentalLcpDetails,
    installEnvironmentalSiteDetails,
    installExploreEprtr,
    installFiltersBlock,
    installIndustryDataTable,
    installIndustryMap,
    installRegulatoryBATConclusions,
    installRegulatoryPermits,
    installRegulatorySiteDetails,
    installSiteHeader,
    installSiteLocationMap,
    installSiteStructureSidebar,
    installSiteTableau,
    installPollutantIndex,
  ].reduce((acc, apply) => apply(acc), config);
};

export {
  Parteners,
  installCustomViews,
  installNavigationBlock,
  installEprtrSpecificBlocks,
  installCustomConnectedBlocks,
  installAppExtras,
};
