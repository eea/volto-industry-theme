import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import jsonp from 'jsonp';
import qs from 'querystring';
import { toast } from 'react-toastify';
import { doesNodeContainClick } from 'semantic-ui-react/dist/commonjs/lib';
import { Icon, Toast } from '@plone/volto/components';
import { connectBlockToMultipleProviders } from '@eeacms/volto-datablocks/hocs';
import { Map } from '@eeacms/volto-openlayers-map/Map';
import { Interactions } from '@eeacms/volto-openlayers-map/Interactions';
import { Overlays } from '@eeacms/volto-openlayers-map/Overlays';
import { Controls, Control } from '@eeacms/volto-openlayers-map/Controls';
import { Layers, Layer } from '@eeacms/volto-openlayers-map/Layers';
import { openlayers } from '@eeacms/volto-openlayers-map';

import PrivacyProtection from '@eeacms/volto-industry-theme/components/PrivacyProtection';
import { inputsKeys } from '@eeacms/volto-industry-theme/components/manage/Blocks/FiltersBlock/dictionary';
import { setQuery } from '@eeacms/volto-industry-theme/actions';
import { emitEvent } from '@eeacms/volto-industry-theme/helpers';
import {
  dataprotection,
  getStyles,
  getLayerSitesURL,
  getLayerRegionsURL,
  getLayerBaseURL,
  getLocationExtent,
  getSiteExtent,
  getCountriesExtent,
} from './index';

import Sidebar from './Sidebar';
import Popup from './Popup';
import PopupDetailed from './PopupDetailed';

import navigationSVG from '@plone/volto/icons/navigation.svg';

import './styles.less';

let _REQS = 0;
const zoomSwitch = 6;
let timer;

const debounce = (func, ...args) => {
  if (timer) clearTimeout(timer);
  timer = setTimeout(func, 200, ...args);
};

const arrayContainsString = (arr = [], value) => {
  let contains = false;
  let nullValues = 0;
  for (let i = 0; i < arr.length; i++) {
    if (!arr[i]) {
      nullValues++;
    } else if (
      value &&
      typeof value === 'string' &&
      typeof arr[i] === 'string' &&
      arr[i].includes(value)
    ) {
      contains = true;
      break;
      /* eslint-disable-next-line */
    } else if (value && arr[i] == value) {
      contains = true;
      break;
    }
  }
  if (!contains && nullValues === arr.length) return true;
  return contains;
};

const stringContainedInArray = (value, arr = []) => {
  let contains = false;
  let nullValues = 0;
  for (let i = 0; i < arr.length; i++) {
    if (!arr[i]) {
      nullValues++;
    } else if (value && value.includes(arr[i])) {
      contains = true;
      break;
    }
  }
  if (!contains && nullValues === arr.length) return true;
  return contains;
};

const facility_types = {
  'EPRTR, NONEPRTR': 'EPRTR',
  'NONEPRTR, EPRTR': 'EPRTR',
  EPRTR: 'EPRTR',
  NONEPRTR: 'NONEPRTR',
};

class View extends React.PureComponent {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {};

  /**
   * Constructor
   * @method constructor
   * @param {Object} props Component properties
   * @constructs Navigation
   */
  constructor(props) {
    super(props);
    const { style } = openlayers;
    this.updateLayersStyle = this.updateLayersStyle.bind(this);
    this.onFeatureLoad = this.onFeatureLoad.bind(this);
    this.centerToPosition = this.centerToPosition.bind(this);
    this.centerToUserLocation = this.centerToUserLocation.bind(this);
    this.getFeatureInRange = this.getFeatureInRange.bind(this);
    this.onPointermove = this.onPointermove.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onMoveend = this.onMoveend.bind(this);
    this.isFeatureVisible = this.isFeatureVisible.bind(this);
    this.state = {
      hasFilters: false,
      mapRendered: false,
      loading: false,
    };
    this.styles = __CLIENT__ ? getStyles(style) : {};
    this.map = React.createRef();
    this.layerRegions = React.createRef();
    this.layerSites = React.createRef();
    this.overlayPopup = React.createRef();
    this.overlayPopupDetailed = React.createRef();
  }

  componentDidMount() {
    document
      .querySelector('#industry-map')
      .addEventListener('ol-features-load', this.onFeatureLoad);
  }

  componentWillUnmount() {
    document
      .querySelector('#industry-map')
      .removeEventListener('ol-features-load', this.onFeatureLoad);
    this.setState({ mapRendered: false });
  }

  componentDidUpdate(prevProps, prevState) {
    if (!this.state.mapRendered || !this.map.current) return;
    const { extent, proj } = openlayers;
    const { filter_change, filter_search } = this.props.query;
    const filter_countries = (this.props.query.filter_countries || []).filter(
      (value) => value,
    );
    if (!prevState.mapRendered) {
      this.centerToUserLocation();
      this.updateLayersStyle();
    }
    if (filter_change?.counter !== prevProps.query.filter_change?.counter) {
      /* Trigger update of features style */
      this.updateLayersStyle();
      /* Fit view if necessary */
      if (filter_change.type === 'search-location') {
        getLocationExtent(filter_search).then(({ data }) => {
          if (data.candidates?.length > 0) {
            this.map.current
              .getView()
              .fit(
                [
                  data.candidates[0].extent.xmin,
                  data.candidates[0].extent.ymin,
                  data.candidates[0].extent.xmax,
                  data.candidates[0].extent.ymax,
                ],
                {
                  maxZoom: 16,
                  duration: 1000,
                },
              );
          }
        });
      } else if (filter_change.type === 'search-site') {
        getSiteExtent(filter_search).then(({ data }) => {
          const extent = data?.results?.[0] || {};
          if (
            extent.MIN_X === null ||
            extent.MIN_Y === null ||
            extent.MAX_X === null ||
            extent.MAX_Y === null
          ) {
            toast.warn(
              <Toast
                warn
                title=""
                content={`No results for ${filter_search.text}`}
              />,
            );
          } else {
            this.map.current
              .getView()
              .fit([extent.MIN_X, extent.MIN_Y, extent.MAX_X, extent.MAX_Y], {
                maxZoom: 16,
                duration: 1000,
              });
          }
        });
      } else if (
        (filter_change.type === 'advanced-filter' ||
          filter_change.type === 'simple-filter') &&
        filter_countries.length
      ) {
        const countriesOptions = this.props.providers_data.countries || {};
        const countries = [];
        (countriesOptions.opt_key || []).forEach((code, index) => {
          if ((filter_countries || []).includes(code)) {
            countries.push(countriesOptions.opt_text[index]);
          }
        });
        getCountriesExtent(countries).then((responses) => {
          let _extent = extent.createEmpty();
          responses.forEach(({ data }) => {
            const reqExtent = data.candidates?.[0]?.extent || null;
            if (reqExtent) {
              extent.extend(
                _extent,
                proj.transformExtent(
                  [
                    reqExtent.xmin,
                    reqExtent.ymin,
                    reqExtent.xmax,
                    reqExtent.ymax,
                  ],
                  'EPSG:4326',
                  'EPSG:3857',
                ),
              );
            }
          });
          if (!extent.isEmpty(_extent)) {
            this.map.current.getView().fit(_extent, {
              maxZoom: 16,
              duration: 1000,
            });
          }
        });
      }
    }
  }

  updateLayersStyle() {
    const { query } = this.props;
    let hasFilters = false;
    for (const key of inputsKeys) {
      if ((query[key] || []).filter((v) => v).length) {
        hasFilters = true;
        break;
      }
    }
    if (query.filter_search?.text && query.filter_search?.type) {
      hasFilters = true;
    }
    if (hasFilters) {
      this.layerSites.current.setStyle((feature) => {
        if (!this.map.current) return;
        const zoom = this.map.current.getView().getZoom();
        const visible = this.isFeatureVisible(feature);
        if (!visible) return;
        const style =
          zoom >= 8
            ? visible === 'highlight'
              ? this.styles.bigGreenCircle
              : this.styles.bigCircle
            : visible === 'highlight'
            ? this.styles.smallGreenCircle
            : this.styles.smallCircle;
        return style;
      });
      this.layerRegions.current.setStyle(() => {
        return;
      });
    } else {
      this.layerSites.current.setStyle((feature) => {
        if (!this.map.current) return;
        const zoom = this.map.current.getView().getZoom();
        if (zoom < zoomSwitch) return;
        const visible = this.isFeatureVisible(feature);
        if (!visible) return;
        const style =
          zoom >= 8
            ? visible === 'highlight'
              ? this.styles.bigGreenCircle
              : this.styles.bigCircle
            : visible === 'highlight'
            ? this.styles.smallGreenCircle
            : this.styles.smallCircle;
        return style;
      });
      this.layerRegions.current.setStyle(() => {
        if (!this.map.current) return;
        const zoom = this.map.current.getView().getZoom();
        if (zoom >= zoomSwitch) return;
        return this.styles.regionCircle;
      });
    }
  }

  onFeatureLoad(e) {
    const { loaded } = e.detail;
    if (loaded && this.state.loading) {
      this.setState({ loading: false });
    } else if (!loaded && !this.state.loading) {
      this.setState({ loading: true });
    }
  }

  centerToPosition(position, zoom) {
    const { proj } = openlayers;
    return this.map.current.getView().animate({
      center: proj.fromLonLat([
        position.coords.longitude,
        position.coords.latitude,
      ]),
      duration: 1000,
      zoom,
    });
  }

  centerToUserLocation(ignoreExtent = false) {
    if (__SERVER__ || !this.map.current || !navigator?.geolocation) return;
    const extent = this.props.query.map_extent;
    if (!extent || ignoreExtent) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          return this.centerToPosition(position, 12);
        },
        // Errors
        () => {},
      );
    } else {
      this.map.current
        .getView()
        .fit([extent[0], extent[1], extent[2], extent[3]], {
          maxZoom: 16,
          duration: 1000,
        });
    }
  }

  getFeatureInRange(map, point, range = 3) {
    let x = 0;
    let y = 0;
    let dx = 0;
    let dy = -1;
    for (let i = 0; i <= range * range; i++) {
      const features =
        map.getFeaturesAtPixel([point[0] + x, point[1] + y]) || null;
      if (features?.length) {
        return features;
      }
      if (x === y || (x < 0 && x === -y) || (x > 0 && x === 1 - y)) {
        let temp = dx;
        dx = -dy;
        dy = temp;
      }
      x += dx;
      y += dy;
    }
    return null;
  }

  onPointermove(e) {
    if (__SERVER__ || !this.overlayPopup.current) return;
    if (e.dragging) {
      e.map.getTarget().style.cursor = 'grabbing';
      return;
    }
    if (
      doesNodeContainClick(
        document.querySelector('#map-sidebar'),
        e.originalEvent,
      )
    ) {
      this.overlayPopup.current.setPosition(undefined);
      e.map.getTarget().style.cursor = '';
      return;
    }
    const { coordinate, proj } = openlayers;
    const mapElement = document.querySelector('#industry-map');
    const pixel = e.map.getEventPixel(e.originalEvent);
    const hit = e.map.hasFeatureAtPixel(pixel);
    debounce(() => {
      if (hit) {
        const features = e.map.getFeaturesAtPixel(pixel);
        if (!features[0]) return;
        let hdms = coordinate.toStringHDMS(
          proj.toLonLat(features[0].getGeometry().flatCoordinates),
        );
        const featuresProperties = features[0].getProperties();
        emitEvent(mapElement, 'ol-pointermove', {
          bubbles: false,
          detail: {
            ...featuresProperties,
            hdms,
            flatCoordinates: features[0].getGeometry().flatCoordinates,
          },
        });
      }
    });
    if (hit) {
      this.overlayPopup.current.setPosition(e.coordinate);
      e.map.getTarget().style.cursor = 'pointer';
    } else {
      this.overlayPopup.current.setPosition(undefined);
      e.map.getTarget().style.cursor = 'grab';
      emitEvent(mapElement, 'ol-pointermove', {
        bubbles: false,
        detail: {},
      });
    }
  }

  onClick(e) {
    const zoom = e.map.getView().getZoom();
    if (
      __SERVER__ ||
      zoom < zoomSwitch ||
      !this.overlayPopup.current ||
      !this.overlayPopupDetailed.current
    ) {
      return;
    }
    const { coordinate, proj } = openlayers;
    const mapElement = document.querySelector('#industry-map');
    const pixel = e.map.getEventPixel(e.originalEvent);
    const features = this.getFeatureInRange(e.map, pixel, 9);
    if (features?.length) {
      let hdms = coordinate.toStringHDMS(
        proj.toLonLat(features[0].getGeometry().flatCoordinates),
      );
      const featuresProperties = features[0].getProperties();
      e.map.getTarget().style.cursor = '';
      this.overlayPopup.current.setPosition(undefined);
      this.overlayPopupDetailed.current.setPosition(e.coordinate);
      emitEvent(mapElement, 'ol-click', {
        bubbles: false,
        detail: {
          ...featuresProperties,
          hdms,
          flatCoordinates: features[0].getGeometry().flatCoordinates,
        },
      });
    } else {
      emitEvent(mapElement, 'ol-click', {
        bubbles: false,
        detail: {},
      });
    }
  }

  onMoveend(e) {
    const extent = e.map.getView().calculateExtent(e.map.getSize());
    this.props.setQuery({
      map_extent: extent,
    });
  }

  isFeatureVisible(feature) {
    const properties = feature.getProperties();
    const {
      filter_bat_conclusions,
      filter_countries,
      filter_facility_types,
      filter_industries,
      filter_nuts_1,
      filter_nuts_2,
      filter_permit_types,
      filter_permit_years,
      filter_plant_types,
      filter_pollutant_groups,
      filter_pollutants,
      filter_reporting_years,
      filter_river_basin_districts,
      filter_search,
    } = this.props.query;
    const {
      bat_conclusions,
      countryCode,
      facilityTypes,
      eea_activities,
      nuts_regions,
      permit_types,
      permit_years,
      plantTypes,
      air_groups,
      water_groups,
      pollutants,
      Site_reporting_year,
      rbds,
      siteName,
    } = properties;
    if (filter_search?.type === 'site' && filter_search.text !== siteName) {
      return false;
    } else if (
      filter_search?.type === 'site' &&
      filter_search.text === siteName
    ) {
      return 'highlight';
    }
    if (!arrayContainsString(filter_reporting_years, Site_reporting_year)) {
      return false;
    }
    if (!arrayContainsString(filter_countries, countryCode)) return false;
    if (!stringContainedInArray(nuts_regions, filter_nuts_2)) return false;
    if (!stringContainedInArray(nuts_regions, filter_nuts_1)) return false;
    if (!stringContainedInArray(rbds, filter_river_basin_districts)) {
      return false;
    }
    if (!arrayContainsString(filter_bat_conclusions, bat_conclusions)) {
      return false;
    }
    if (!arrayContainsString(filter_industries, eea_activities)) return false;
    if (!stringContainedInArray(permit_types, filter_permit_types)) {
      return false;
    }
    if (!arrayContainsString(filter_permit_years, permit_years)) return false;
    if (!arrayContainsString(filter_plant_types, plantTypes)) return false;
    if (
      !arrayContainsString(filter_pollutant_groups, air_groups) &&
      !arrayContainsString(filter_pollutant_groups, water_groups)
    ) {
      return false;
    }
    if (!stringContainedInArray(pollutants, filter_pollutants)) return false;
    if ((filter_facility_types || []).filter((item) => item).length) {
      const type = facility_types[facilityTypes];
      for (let i = 0; i < filter_facility_types.length; i++) {
        if (filter_facility_types[i] === type) {
          return true;
        }
      }
      return false;
    }
    return true;
  }

  render() {
    const { format, loadingstrategy, proj, source, tilegrid } = openlayers;

    if (__SERVER__) return '';
    return (
      <div className="industry-map-wrapper">
        <div id="industry-map" className="industry-map">
          <PrivacyProtection data={{ dataprotection }}>
            <Map
              ref={(data) => {
                this.map.current = data?.map;
                if (data?.mapRendered && !this.state.mapRendered) {
                  this.setState({ mapRendered: true });
                }
              }}
              view={{
                center: proj.fromLonLat([20, 50]),
                showFullExtent: true,
                maxZoom: 16,
                minZoom: 2,
                zoom: 2,
              }}
              renderer="webgl"
              onPointermove={this.onPointermove}
              onClick={this.onClick}
              onMoveend={this.onMoveend}
            >
              <Controls attribution={false} zoom={true}>
                <Control className="ol-custom">
                  <button
                    className="navigation-button"
                    title="Center to user location"
                    onClick={() => {
                      this.centerToUserLocation(true);
                    }}
                  >
                    <Icon name={navigationSVG} size="1em" fill="white" />
                  </button>
                </Control>
              </Controls>
              <Interactions
                doubleClickZoom={true}
                keyboardZoom={true}
                mouseWheelZoom={true}
                pointer={true}
                select={true}
              />
              <Layers>
                <Layer.Tile
                  source={
                    new source.XYZ({
                      url: getLayerBaseURL(),
                    })
                  }
                  zIndex={0}
                />
                <Layer.VectorImage
                  className="ol-layer-regions"
                  ref={(data) => {
                    this.layerRegions.current = data?.layer;
                  }}
                  source={
                    new source.Vector({
                      loader: function (extent, _, projection) {
                        const esrijsonFormat = new format.EsriJSON();
                        let url = getLayerRegionsURL(extent);
                        jsonp(url, {}, (error, response) => {
                          if (!error) {
                            let features = esrijsonFormat.readFeatures(
                              response,
                              {
                                featureProjection: projection,
                              },
                            );
                            if (features?.length > 0) {
                              this.addFeatures(features);
                            }
                          }
                        });
                      },
                      strategy: loadingstrategy.tile(
                        tilegrid.createXYZ({
                          tileSize: 256,
                        }),
                      ),
                    })
                  }
                  style={null}
                  title="1.Regions"
                  zIndex={1}
                />
                <Layer.VectorImage
                  ref={(data) => {
                    this.layerSites.current = data?.layer;
                  }}
                  className="ol-layer-sites"
                  source={
                    new source.Vector({
                      loader: function (extent, resolution, projection) {
                        const mapElement = document.querySelector(
                          '#industry-map',
                        );
                        _REQS++;
                        const esrijsonFormat = new format.EsriJSON();
                        this.resolution = resolution;
                        let url = getLayerSitesURL(extent);
                        jsonp(url, {}, (error, response) => {
                          if (!error) {
                            let features = esrijsonFormat.readFeatures(
                              response,
                              {
                                featureProjection: projection,
                              },
                            );
                            if (features?.length > 0) {
                              this.addFeatures(features);
                            }
                          }
                          if (!--_REQS) {
                            this.dispatchEvent('load');
                            emitEvent(mapElement, 'ol-features-load', {
                              bubbles: false,
                              detail: {
                                loaded: true,
                              },
                            });
                          }
                        });
                        emitEvent(mapElement, 'ol-features-load', {
                          bubbles: false,
                          detail: {
                            loaded: false,
                          },
                        });
                      },
                      strategy: function (extent, resolution) {
                        const tileGrid = tilegrid.createXYZ({
                          tileSize: 256,
                        });
                        let z = tileGrid.getZForResolution(resolution);
                        let tileRange = tileGrid.getTileRangeForExtentAndZ(
                          extent,
                          z,
                        );
                        /** @type {Array<import("./extent.js").Extent>} */
                        let extents = [];
                        /** @type {import("./tilecoord.js").TileCoord} */
                        let tileCoord = [z, 0, 0];
                        for (
                          tileCoord[1] = tileRange.minX;
                          tileCoord[1] <= tileRange.maxX;
                          ++tileCoord[1]
                        ) {
                          for (
                            tileCoord[2] = tileRange.minY;
                            tileCoord[2] <= tileRange.maxY;
                            ++tileCoord[2]
                          ) {
                            extents.push(
                              tileGrid.getTileCoordExtent(tileCoord),
                            );
                          }
                        }
                        if (this.resolution && this.resolution !== resolution) {
                          extents.forEach((newExtent) => {
                            this.loadedExtentsRtree_.forEach((loadedExtent) => {
                              const bigExtent = loadedExtent.extent;
                              if (
                                openlayers.extent.containsExtent(
                                  bigExtent,
                                  newExtent,
                                ) &&
                                bigExtent[0] !== newExtent[0] &&
                                bigExtent[1] !== newExtent[1] &&
                                bigExtent[2] !== newExtent[2] &&
                                bigExtent[3] !== newExtent[3]
                              ) {
                                this.loadedExtentsRtree_.remove(loadedExtent);
                              }
                            });
                          });
                        }
                        return extents;
                      },
                    })
                  }
                  style={null}
                  title="2.Sites"
                  zIndex={1}
                />
              </Layers>
              <Overlays
                ref={(data) => {
                  this.overlayPopup.current = data?.overlay;
                }}
                className="ol-popup"
                positioning="center-center"
                stopEvent={true}
              >
                <Popup overlay={this.overlayPopup} />
              </Overlays>
              <Overlays
                ref={(data) => {
                  this.overlayPopupDetailed.current = data?.overlay;
                }}
                className="ol-popup-detailed"
                positioning="center-center"
                stopEvent={true}
              >
                <PopupDetailed overlay={this.overlayPopupDetailed} />
              </Overlays>
              <Overlays
                className="ol-dynamic-filter"
                positioning="center-center"
                stopEvent={true}
              >
                <Sidebar
                  data={this.props.data}
                  providers_data={this.props.providers_data}
                />
              </Overlays>
              {this.state.loading ? (
                <div className="loader">Loading...</div>
              ) : (
                ''
              )}
            </Map>
          </PrivacyProtection>
        </div>
      </div>
    );
  }
}

export default compose(
  connectBlockToMultipleProviders,
  connect(
    (state) => ({
      query: {
        ...qs.parse(state.router.location.search.replace('?', '')),
        ...state.query.search,
      },
    }),
    {
      setQuery,
    },
  ),
)(View);
