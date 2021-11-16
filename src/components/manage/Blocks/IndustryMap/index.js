import axios from 'axios';
import config from '@plone/volto/registry';
import sliderSVG from '@plone/volto/icons/slider.svg';
import mapPlaceholder from '@eeacms/volto-industry-theme/components/PrivacyProtection/map_placeholder.png';
import { getEncodedQueryString } from '@eeacms/volto-industry-theme/helpers';
import IndustryMapEdit from './Edit';
import IndustryMapView from './View';

const filters = [
  {
    queryKey: 'batConclusionCode',
    featureKey: 'batConclusionCode',
    op: 'like',
  },
  { queryKey: 'EEAActivity', featureKey: 'eea_activities', op: 'like' },
  { queryKey: 'nuts_latest', featureKey: 'nuts_regions', op: 'like' },
  { queryKey: 'permitType', featureKey: 'permit_types', op: 'like' },
  { queryKey: 'permitYear', featureKey: 'permitYears', op: 'like' },
  { queryKey: 'facilityTypes', featureKey: 'facilityTypes', op: 'eqStr' },
  { queryKey: 'plantTypes', featureKey: 'plantTypes', op: 'like' },
  { queryKey: 'pollutant', featureKey: 'pollutants', op: 'like' },
  { queryKey: 'pollutantGroup', featureKey: 'air_groups', op: 'like' },
  { queryKey: 'reportingYear', featureKey: 'Site_reporting_year', op: 'eq' },
  { queryKey: 'riverBasin', featureKey: 'rbds', op: 'like' },
  { queryKey: 'siteCountry', featureKey: 'countryCode', op: 'like' },
  { queryKey: 'siteTerm', featureKey: 'siteName', op: 'like' },
];

export const dataprotection = {
  enabled: true,
  privacy_statement:
    'This map is hosted by a third party [Environmental Systems Research Institute, INC: "ESRI"]. By showing th external content you accept the terms and conditions of www.esri.com. This includes their cookie policies, which e have no control over.',
  privacy_cookie_key: 'site-location-map',
  placeholder_image: mapPlaceholder,
  type: 'big',
};

export const getStyles = (style) => {
  const obj = {};
  obj.smallCircle = new style.Style({
    image: new style.Circle({
      radius: 4,
      fill: new style.Fill({ color: '#000' }),
      stroke: new style.Stroke({ color: '#6A6A6A', width: 1 }),
      zIndex: 0,
    }),
  });
  obj.bigCircle = new style.Style({
    image: new style.Circle({
      radius: 6,
      fill: new style.Fill({ color: '#000' }),
      stroke: new style.Stroke({ color: '#6A6A6A', width: 1 }),
      zIndex: 0,
    }),
  });
  obj.smallGreenCircle = new style.Style({
    image: new style.Circle({
      radius: 4,
      fill: new style.Fill({ color: '#00FF00' }),
      stroke: new style.Stroke({ color: '#6A6A6A', width: 1 }),
      zIndex: 0,
    }),
  });
  obj.bigGreenCircle = new style.Style({
    image: new style.Circle({
      radius: 6,
      fill: new style.Fill({ color: '#00FF00' }),
      stroke: new style.Stroke({ color: '#6A6A6A', width: 1 }),
      zIndex: 0,
    }),
  });
  obj.regionCircle = new style.Style({
    image: new style.Circle({
      radius: 6,
      fill: new style.Fill({ color: '#4296B2' }),
      stroke: new style.Stroke({ color: '#6A6A6A', width: 1 }),
      zIndex: 0,
    }),
  });

  return obj;
};

export const getLayerSitesURL = (extent) => {
  return `https://air.discomap.eea.europa.eu/arcgis/rest/services/Air/IED_SiteMap/FeatureServer/0/query/?f=json&returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometry=${encodeURIComponent(
    '{"xmin":' +
      extent[0] +
      ',"ymin":' +
      extent[1] +
      ',"xmax":' +
      extent[2] +
      ',"ymax":' +
      extent[3] +
      ',"spatialReference":{"wkid":102100}}',
  )}&geometryType=esriGeometryEnvelope&inSR=102100&outFields=*&outSR=102100`;
};

export const getLayerRegionsURL = (extent) => {
  return `https://air.discomap.eea.europa.eu/arcgis/rest/services/Air/IED_Clusters_WM/FeatureServer/0/query/?f=json&returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometry=${encodeURIComponent(
    '{"xmin":' +
      extent[0] +
      ',"ymin":' +
      extent[1] +
      ',"xmax":' +
      extent[2] +
      ',"ymax":' +
      extent[3] +
      ',"spatialReference":{"wkid":102100}}',
  )}&geometryType=esriGeometryEnvelope&inSR=102100&outFields=*&outSR=102100`;
};

export const getLayerBaseURL = () =>
  'https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}';

export const getLocationExtent = (data) => {
  return axios.get(
    encodeURI(
      'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?SingleLine=' +
        data.text +
        '&f=json&outSR={"wkid":102100,"latestWkid":3857}&outFields=Match_addr,Addr_type,StAddr,City&magicKey=' +
        data.magicKey +
        '&maxLocations=6',
    ),
  );
};

export const getSiteExtent = (data) => {
  const db_version =
    process.env.RAZZLE_DB_VERSION || config.settings.db_version || 'latest';

  return axios.get(
    `${config.settings.providerUrl}?${getEncodedQueryString(`SELECT
    MIN(shape_wm.STX) AS MIN_X,
    MIN(shape_wm.STY) AS MIN_Y,
    MAX(shape_wm.STX) AS MAX_X,
    MAX(shape_wm.STY) AS MAX_Y
    FROM [IED].[${db_version}].[SiteMap]
    WHERE [siteName] COLLATE Latin1_General_CI_AI LIKE '%${data.text.replace(
      "'",
      "''",
    )}%'`)}`,
  );
};

export const getCountriesExtent = (countries) => {
  const requests = [];
  countries.forEach((country) => {
    requests.push(
      axios.get(
        `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?SingleLine=${country}&f=pjson&maxLocations=1`,
      ),
    );
  });
  return Promise.all(requests);
};

// https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?SingleLine=Romania&f=pjson&maxLocations=1

export const filterFeature = (feature, query = {}) => {
  let ok = true;
  const properties = feature.getProperties();

  for (let filter = 0; filter < filters.length; filter++) {
    const { queryKey, featureKey, op } = filters[filter];
    if (!ok) {
      break;
    }
    if (Array.isArray(query[queryKey])) {
      for (let item = 0; item < query[queryKey].length; item++) {
        const value = query[queryKey][item];
        if (
          value &&
          ((op === 'like' && !properties[featureKey]?.includes(value)) ||
            (op === 'eq' && properties[featureKey] !== value))
        ) {
          ok = false;
          break;
        }
      }
    } else if (query[queryKey]) {
      const value = query[queryKey];
      if (
        (op === 'like' && !properties[featureKey]?.includes(value)) ||
        (op === 'eq' && properties[featureKey] !== value)
      ) {
        ok = false;
        break;
      }
    }
  }

  return ok;
};

export const getWhereStatement = (query = {}) => {
  let where = [];
  for (let filter = 0; filter < filters.length; filter++) {
    const { queryKey, featureKey, op } = filters[filter];
    if (Array.isArray(query[queryKey])) {
      where[filter] = [];
      for (let item = 0; item < query[queryKey].length; item++) {
        const value = query[queryKey][item];
        if (op === 'like' && value) {
          where[filter].push(`${featureKey} LIKE '%${value}%'`);
        } else if (op === 'eq' && value) {
          where[filter].push(`${featureKey} = ${value}`);
        } else if (op === 'eqStr' && value) {
          where[filter].push(`${featureKey} = '${value}''`);
        }
      }
    } else if (query[queryKey]) {
      where[filter] = [];
      const value = query[queryKey];
      if (op === 'like' && value) {
        where[filter].push(`${featureKey} LIKE '%${value}%'`);
      } else if (op === 'eq' && value) {
        where[filter].push(`${featureKey} = ${value}`);
      } else if (op === 'eqStr' && value) {
        where[filter].push(`${featureKey} = '${value}''`);
      }
    }
  }

  return where
    .filter((w) => w.length)
    .map((w) => `(${w.join(' OR ')})`)
    .join(' AND ');
};

export const getRegionsWhereStatement = (query = {}) => {
  let where = [];
  if (Array.isArray(query.siteCountry)) {
    for (let item = 0; item < query.siteCountry.length; item++) {
      const value = query.siteCountry[item];
      if (value) {
        where.push(`CNTR_CODE LIKE '%${value}%'`);
      }
    }
  }
  return where.join(' AND ');
};

export default (config) => {
  config.blocks.blocksConfig.industry_map = {
    id: 'industry_map',
    title: 'Industry map',
    icon: sliderSVG,
    group: 'eprtr_blocks',
    edit: IndustryMapEdit,
    view: IndustryMapView,
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
