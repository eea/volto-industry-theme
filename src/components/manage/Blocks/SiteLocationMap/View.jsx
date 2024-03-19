import React from 'react';
import { connect } from 'react-redux';
import { Loader } from 'semantic-ui-react';
import Map from '@eeacms/volto-openlayers-map/Map';
import { Interactions } from '@eeacms/volto-openlayers-map/Interactions';
import { Controls } from '@eeacms/volto-openlayers-map/Controls';
import { Layers, Layer } from '@eeacms/volto-openlayers-map/Layers';
import { openlayers } from '@eeacms/volto-openlayers-map';
import { getSiteLocationURL } from './index';
import qs from 'querystring';
import PrivacyProtection from '@eeacms/volto-industry-theme/components/PrivacyProtection';
import mapPlaceholder from '@eeacms/volto-industry-theme/components/PrivacyProtection/map_placeholder_small.jpg';
import './styles.less';

const View = (props) => {
  const map = React.useRef();
  const [options, setOptions] = React.useState({});
  const [vectorSource, setVectorSource] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const { format, proj, source, style } = openlayers;
  const { siteInspireId } = props.query;

  const dataprotection = {
    enabled: true,
    privacy_statement:
      'This map is hosted by a third party [Environmental Systems Research Institute, INC: "ESRI"]. By showing the external content you accept the terms and conditions of www.esri.com. This includes their cookie policies, which we have no control over.',
    privacy_cookie_key: 'site-location-map',
    placeholder_image: mapPlaceholder,
    type: 'small',
  };

  React.useEffect(() => {
    if (__SERVER__) return;
    const vs = vectorSource || new source.Vector();
    if (!vectorSource) {
      setVectorSource(vs);
    }
    if (!siteInspireId) return;
    const esrijsonFormat = new format.EsriJSON();
    // Get site feature
    const url = getSiteLocationURL(
      siteInspireId,
      props.query.siteReportingYear,
    );
    vs.refresh();
    setLoading(true);
    fetch(url).then(function (response) {
      if (response.status !== 200) return;
      response.json().then(function (data) {
        const features = esrijsonFormat.readFeatures(data);
        setLoading(false);
        if (features.length > 0) {
          vs.addFeatures(features);
          setOptions({
            ...options,
            extent: features[0]?.getGeometry()?.getExtent(),
          });
        }
      });
    });
    /* eslint-disable-next-line */
  }, [siteInspireId, props.query.siteReportingYear]);

  React.useEffect(() => {
    if (map.current) {
      map.current.updateSize();
    }
  }, [props.screen]);

  if (__SERVER__ || !vectorSource) return '';

  const siteStyle = new style.Style({
    image: new style.Circle({
      radius: 6,
      fill: new style.Fill({ color: '#00FF00' }),
      stroke: new style.Stroke({ color: '#6A6A6A', width: 1 }),
      zIndex: 0,
    }),
  });

  return (
    <div className="site-location-map" id="site-location-map">
      <PrivacyProtection data={{ dataprotection }}>
        <Map
          view={{
            center: proj.fromLonLat([20, 50]),
            showFullExtent: true,
            maxZoom: 12,
            minZoom: 12,
            zoom: 12,
          }}
          renderer="webgl"
          ref={(data) => {
            map.current = data?.map;
          }}
          {...options}
        >
          <Layers>
            <Layer.Tile
              source={
                new source.XYZ({
                  url: 'https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
                })
              }
              zIndex={0}
            />
            <Layer.VectorImage
              source={vectorSource}
              style={siteStyle}
              title="1.Sites"
              zIndex={1}
            />
          </Layers>
          <Controls attribution={false} zoom={false} />
          <Interactions
            doubleClickZoom={false}
            dragAndDrop={false}
            dragPan={false}
            keyboardPan={false}
            keyboardZoom={false}
            mouseWheelZoom={false}
            pointer={false}
            select={false}
          />
          <Loader active={loading} />
        </Map>
      </PrivacyProtection>
    </div>
  );
};

export default connect((state) => ({
  query: {
    ...qs.parse(state.router.location.search.replace('?', '')),
    ...(state.query.search || {}),
  },
  screen: state.screen,
}))(View);
