import React from 'react';
import { connect } from 'react-redux';
import { Portal } from 'react-portal';
import cs from 'classnames';
import { Dropdown, Checkbox } from 'semantic-ui-react';
import { Icon } from '@plone/volto/components';
import { BodyClass } from '@plone/volto/helpers';
import { setQuery } from '@eeacms/volto-industry-theme/actions';
import {
  getOptions,
  noOptions,
  inputsKeys,
} from '@eeacms/volto-industry-theme/components/manage/Blocks/FiltersBlock/dictionary';

import menuSVG from '@plone/volto/icons/menu-alt.svg';

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.isChecked = this.isChecked.bind(this);
    this.setCheckboxValue = this.setCheckboxValue.bind(this);
    this.setDropdownValue = this.setDropdownValue.bind(this);
    this.applyFilters = this.applyFilters.bind(this);
    this.clearFilters = this.clearFilters.bind(this);
    this.updateOptions = this.updateOptions.bind(this);
    this.state = {
      options: {},
      open: false,
    };
  }

  isChecked(filter, label) {
    const { query } = this.props;
    return (query[filter] || []).indexOf(label) !== -1;
  }

  setCheckboxValue(_, data) {
    const { query } = this.props;
    const values = [...(query[data.name] || [])];
    const checked = data.checked;
    const index = values.indexOf(data.label);
    if (checked && index === -1) {
      values.push(data.label);
    }
    if (!checked && index !== -1) {
      values.splice(index, 1);
    }
    this.applyFilters({ [data.name]: values });
  }

  setDropdownValue(data, filterName) {
    this.applyFilters({
      [filterName]: Array.isArray(data.value) ? data.value : [data.value],
      ...(filterName === 'filter_countries'
        ? {
            filter_nuts_1: [],
            filter_nuts_2: [],
            filter_river_basin_districts: [],
          }
        : {}),
    });
  }

  applyFilters(filters) {
    const { query } = this.props;
    const newInputs = {};
    inputsKeys.forEach((key) => {
      newInputs[key] = query[key] || [];
    });
    this.props.dispatch(
      setQuery({
        ...newInputs,
        ...filters,
        filter_change: {
          counter: (query['filter_change']?.counter || 0) + 1,
          type: 'simple-filter',
        },
        filter_search: null,
        filter_search_value: '',
      }),
    );
  }

  clearFilters() {
    const { query, dispatch } = this.props;
    const newInputs = {};
    inputsKeys.forEach((key) => {
      newInputs[key] = [];
    });
    dispatch(
      setQuery({
        ...newInputs,
        filter_change: {
          counter: (query['filter_change']?.counter || 0) + 1,
          type: 'clear',
        },
        filter_search: null,
        filter_search_value: '',
      }),
    );
  }

  updateOptions() {
    const { data, providers_data } = this.props;
    const newOptions = { ...this.options };
    if (data.providers) {
      data.providers.forEach((source) => {
        if (
          source.name &&
          !newOptions[source.name] &&
          providers_data[source.name]
        ) {
          newOptions[source.name] = getOptions(providers_data[source.name]);
        }
      });
      this.setState({ options: newOptions });
    }
  }

  componentDidUpdate(prevProps) {
    const providersData = this.props.providers_data;
    const prevProvidersData = prevProps.providers_data;
    if (providersData !== prevProvidersData) {
      this.updateOptions();
    }
  }

  componentDidMount() {
    this.updateOptions();
  }

  render() {
    const { query } = this.props;
    const { options } = this.state;
    if (__SERVER__) return '';
    return (
      <div id="map-sidebar" className="outline-button">
        <h2>
          <span>Dynamic filters</span>{' '}
          <i
            aria-hidden
            className="delete icon"
            style={{ float: 'right', cursor: 'pointer' }}
            onClick={() => {
              this.setState({ open: false });
            }}
          />
        </h2>
        <h3>Reporting year</h3>
        <Dropdown
          fluid
          search
          selection
          multiple
          upward={false}
          onChange={(_, data) => {
            this.setDropdownValue(data, 'filter_reporting_years');
          }}
          options={options.reporting_years || noOptions}
          placeholder={'Select reporting year'}
          value={query.filter_reporting_years || []}
        />
        <h3>Country</h3>
        <Dropdown
          fluid
          search
          selection
          multiple
          upward={false}
          onChange={(_, data) => {
            this.setDropdownValue(data, 'filter_countries');
          }}
          options={options.countries || noOptions}
          placeholder={'Select country'}
          value={query.filter_countries || []}
        />
        <h3>Industry</h3>
        <Dropdown
          fluid
          search
          selection
          multiple
          upward={false}
          onChange={(_, data) => {
            this.setDropdownValue(data, 'filter_industries');
          }}
          options={options.industries || noOptions}
          placeholder={'Select industry'}
          value={query.filter_industries || []}
        />
        <h3>Facility type</h3>
        <form autoComplete="filter_facility_types">
          <Checkbox
            name="filter_facility_types"
            label="EPRTR"
            style={{ marginRight: '1rem' }}
            checked={this.isChecked('filter_facility_types', 'EPRTR')}
            onChange={this.setCheckboxValue}
          />
          <Checkbox
            name="filter_facility_types"
            label="NONEPRTR"
            checked={this.isChecked('filter_facility_types', 'NONEPRTR')}
            onChange={this.setCheckboxValue}
          />
        </form>
        <button onClick={this.clearFilters} className="clear-button">
          Clear filters
        </button>
        <Portal
          node={document.querySelector('.industry-map .ol-control.ol-custom')}
        >
          <button
            className="menu-button"
            title="Toggle sidebar"
            onClick={() => {
              this.setState({ open: !this.state.open });
            }}
          >
            <Icon name={menuSVG} size="1em" fill="white" />
          </button>
        </Portal>
        <BodyClass className={cs({ 'map-sidebar-visible': this.state.open })} />
      </div>
    );
  }
}

export default connect((state) => ({
  query: state.query.search,
}))(Sidebar);
