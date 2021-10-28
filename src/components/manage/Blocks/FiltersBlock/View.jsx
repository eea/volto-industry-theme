import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { connectBlockToMultipleProviders } from '@eeacms/volto-datablocks/hocs';
import { setQuery } from '@eeacms/volto-industry-theme/actions';
import Search from './Search';
import Modal from './Modal';
import { getOptions, permitTypes } from './dictionary';

import './styles.less';

class View extends React.Component {
  constructor(props) {
    super(props);
    this.timers = {};
    this.setOpen = this.setOpen.bind(this);
    this.setInitialFilters = this.setInitialFilters.bind(this);
    this.updateOptions = this.updateOptions.bind(this);
    this.state = {
      open: false,
      options: {},
    };
  }

  setOpen(open, callback) {
    this.setState({ open }, callback);
  }

  setInitialFilters(filters = {}) {
    const { dispatch, query = {} } = this.props;
    const keys = Object.keys(filters);
    const queryKeys = Object.keys(query);
    for (const key of keys) {
      if (queryKeys.includes(key)) {
        return false;
      }
    }
    dispatch(setQuery(filters));
    return true;
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
      if (!newOptions['permit_types']) {
        newOptions['permit_types'] = permitTypes;
      }
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
    this.setInitialFilters({ filter_reporting_years: [2019] });
    this.updateOptions();
  }

  render() {
    const { data, providers_data } = this.props;
    const { open, options } = this.state;

    return (
      <div className="filters-block outline-button">
        <Search data={data} providers_data={providers_data} />
        <button onClick={() => this.setOpen(true)}>Advanced Filter</button>
        <Modal
          data={data}
          providers_data={providers_data}
          open={open}
          options={options}
          setOpen={this.setOpen}
        />
      </div>
    );
  }
}

export default compose(
  connectBlockToMultipleProviders,
  connect((state) => ({
    query: state.query.search,
  })),
)(View);
