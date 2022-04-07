import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import axios from 'axios';
import { Input, List } from 'semantic-ui-react';
import { doesNodeContainClick } from 'semantic-ui-react/dist/commonjs/lib';
import Highlighter from 'react-highlight-words';
import config from '@plone/volto/registry';
import { trackSiteSearch } from '@eeacms/volto-matomo/utils';
import { setQuery } from '@eeacms/volto-industry-theme/actions';
import { getEncodedQueryString } from '@eeacms/volto-industry-theme/helpers';
import { inputsKeys } from './dictionary';

const MAX_RESULTS = 6;
let timer;

const debounce = (func, ...args) => {
  if (timer) clearTimeout(timer);
  timer = setTimeout(func, 600, ...args);
};

const getSites = (value) => {
  const providerUrl = config.settings.providerUrl;
  const db_version =
    process.env.RAZZLE_DB_VERSION || config.settings.db_version || 'latest';
  const query = `SELECT siteName
    FROM [IED].[${db_version}].[SiteMap]
    WHERE [siteName] COLLATE Latin1_General_CI_AI LIKE '%${value}%'
    GROUP BY siteName
    ORDER BY [siteName]`;

  return axios.get(
    providerUrl + `?${getEncodedQueryString(query)}&p=1&nrOfHits=6`,
  );
};

const getLocations = (value, providers_data) => {
  const countries = providers_data.countries?.opt_value?.join(',') || '';
  return axios.get(
    `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/suggest?f=json&text=${value}&maxSuggestions=6${
      countries.length ? `&countryCode=${countries}` : ''
    }`,
  );
};

const Search = ({ data, providers_data, query, setQuery, ...props }) => {
  const searchContainer = React.useRef();
  const [loading, setLoading] = React.useState(false);
  const [showResults, setShowResults] = React.useState(false);
  const [sites, setSites] = React.useState([]);
  const [locations, setLocations] = React.useState([]);

  const value = React.useMemo(() => {
    return query.filter_search_value;
  }, [query.filter_search_value]);

  const setValue = React.useCallback((value) => {
    setQuery({ filter_search_value: value });
    /* eslint-disable-next-line */
  }, []);

  React.useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside, false);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside, false);
    };
    /* eslint-disable-next-line */
  }, []);

  const items = React.useMemo(() => {
    if (loading) return [];
    const half = MAX_RESULTS / 2;
    let _locations = locations.slice(0, half);
    let _sites = sites.slice(0, half);
    if (_locations.length < half) {
      _sites = sites.slice(0, MAX_RESULTS - _locations.length);
    }
    if (_sites.length < half) {
      _locations = locations.slice(0, MAX_RESULTS - _sites.length);
    }

    return [..._locations, ..._sites];
  }, [sites, locations, loading]);

  const handleClickOutside = React.useCallback((event) => {
    if (!doesNodeContainClick(searchContainer.current, event)) {
      setShowResults(false);
      return;
    }
    setShowResults(true);
  }, []);

  const onChange = React.useCallback(
    (data) => {
      const { value } = data;
      const requests = [];
      if (value.length >= 3) {
        requests.push(getSites(value));
        requests.push(getLocations(value, providers_data));

        Promise.all(requests).then((responses) => {
          setSites(
            responses[0].data?.results?.map((item) => ({
              text: item.siteName,
              type: 'site',
            })) || [],
          );
          setLocations(
            responses[1].data?.suggestions?.map((item) => ({
              ...item,
              type: 'location',
            })) || [],
          );
        });
        setLoading(false);
      } else {
        setLoading(false);
        setSites([]);
        setLocations([]);
      }
    },
    [providers_data],
  );

  const search = React.useCallback(
    (value, type, magicKey) => {
      debounce(onChange, { value });
      setLoading(true);
      const newInputs = {};
      inputsKeys.forEach((filter) => {
        newInputs[filter] = [];
      });
      setQuery({
        ...newInputs,
        filter_search:
          value && type
            ? { text: value, type, ...(magicKey ? { magicKey } : {}) }
            : null,
        filter_search_value: value,
        filter_change: {
          counter: (query['filter_change']?.counter || 0) + 1,
          type: value && type ? `search-${type}` : 'clear',
        },
      });

      if (value && type) {
        trackSiteSearch({
          category: `Map/Table search-${type}`,
          keyword: value,
        });
      }
    },
    [query, onChange, setQuery],
  );

  return (
    <div className="search-container" ref={searchContainer}>
      <form autoComplete="off" name="Map search">
        <Input
          loading={loading}
          value={value}
          aria-label="Site search"
          // autocomplete="off"
          icon={
            <>
              {!loading && value ? (
                <i
                  aria-hidden
                  className="delete icon"
                  onClick={() => {
                    search('', null);
                    setShowResults(false);
                  }}
                />
              ) : (
                ''
              )}
              <i
                aria-hidden
                className="search icon"
                onClick={() => {
                  debounce(onChange, { value });
                  setLoading(true);
                }}
              />
            </>
          }
          placeholder="Search for country, region, city or a site name"
          onChange={(_, data) => {
            debounce(onChange, data);
            setValue(data.value);
            setLoading(true);
          }}
        />
      </form>
      {items.length && showResults && value.length >= 3 ? (
        <List>
          {items.map((item, index) => (
            <List.Item
              key={`result-${index}`}
              onClick={() => {
                search(item.text, item.type, item.magicKey);
                setShowResults(false);
              }}
            >
              <Highlighter
                className="text"
                highlightClassName="highlight"
                searchWords={value?.split(' ') || []}
                autoEscape={true}
                textToHighlight={item.text}
              />
              <span className="type">{item.type}</span>
            </List.Item>
          ))}
        </List>
      ) : (
        ''
      )}
    </div>
  );
};

export default compose(
  connect(
    (state) => ({
      query: state.query.search,
    }),
    {
      setQuery,
    },
  ),
)(Search);
