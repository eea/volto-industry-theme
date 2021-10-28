import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { cloneDeep } from 'lodash';
import { Modal, Checkbox } from 'semantic-ui-react';
import { setQuery } from '@eeacms/volto-industry-theme/actions';
import { inputsKeys, permitTypes } from './dictionary';
import SelectWrapper from './SelectWrapper';

const filterOptionsByParent = (options, input) => {
  if (!options || !input) return [];
  return options.filter((option) => {
    return (
      option.value === null ||
      input.filter((value) => option.key.includes(value)).length
    );
  });
};

const filterInputByParent = (input, parentInput) => {
  if (!input || !parentInput) return [];
  return input.filter((value) => {
    return (
      value &&
      parentInput.filter((parentValue) => value.includes(parentValue)).length
    );
  });
};

const filterInputByParentKey = (input, options, parentInput) => {
  if (!input || !parentInput) return [];
  let keys = {};
  options
    .filter((opt) => input.includes(opt.value))
    .forEach((opt) => {
      keys[input.indexOf(opt.value)] = opt.key;
    });
  return input.filter((value, index) => {
    return (
      value &&
      parentInput.filter((parentValue) => keys[index].includes(parentValue))
        .length
    );
  });
};

const ModalView = ({
  data,
  providers_data,
  open,
  options,
  query,
  setOpen,
  setQuery,
}) => {
  const [inputs, setInputs] = React.useState({});

  React.useEffect(() => {
    setInitialInputs();
    /* eslint-disable-next-line */
  }, [open]);

  /*---------- Actions ----------*/
  const setInitialInputs = React.useCallback(() => {
    const inputs = {};
    inputsKeys.forEach((key) => {
      inputs[key] = [...(query[key] || [])];
    });
    setInputs(inputs);
  }, [query]);

  const isChecked = React.useCallback(
    (filter, label) => {
      return (inputs[filter] || []).indexOf(label) !== -1;
    },
    [inputs],
  );

  const setCheckboxValue = React.useCallback(
    (_, data) => {
      const values = [...(inputs[data.name] || [])];
      const checked = data.checked;
      const index = values.indexOf(data.label);
      if (checked && index === -1) {
        values.push(data.label);
      }
      if (!checked && index !== -1) {
        values.splice(index, 1);
      }
      setInputs({ ...inputs, [data.name]: values });
    },
    [inputs],
  );

  const clearFilters = React.useCallback(() => {
    const newInputs = {};
    inputsKeys.forEach((key) => {
      newInputs[key] = [];
    });
    setQuery({
      ...newInputs,
      filter_change: {
        counter: (query['filter_change']?.counter || 0) + 1,
        type: 'clear',
      },
      filter_search: null,
      filter_search_value: '',
    });
    setOpen(false);
    /* eslint-disable-next-line */
  }, [query]);

  const applyFilters = React.useCallback(() => {
    setQuery({
      ...inputs,
      filter_change: {
        counter: (query['filter_change']?.counter || 0) + 1,
        type: 'advanced-filter',
      },
      filter_search: null,
      filter_search_value: '',
    });
    setOpen(false);
    /* eslint-disable-next-line */
  }, [inputs, query]);

  /*---------- On change behavior ----------*/
  const onCountriesChange = React.useCallback(({ inputs }) => {
    let newInputs = cloneDeep(inputs);
    newInputs.filter_nuts_1 = filterInputByParent(
      newInputs.filter_nuts_1,
      newInputs.filter_countries,
    );
    newInputs.filter_nuts_2 = filterInputByParent(
      newInputs.filter_nuts_2,
      newInputs.filter_nuts_1,
    );
    newInputs.filter_river_basin_districts = filterInputByParent(
      newInputs.filter_river_basin_districts,
      newInputs.filter_countries,
    );
    setInputs(newInputs);
    /* eslint-disable-next-line */
  }, []);

  const onNutsIChange = React.useCallback(({ inputs }) => {
    let newInputs = cloneDeep(inputs);
    newInputs.filter_nuts_2 = filterInputByParent(
      newInputs.filter_nuts_2,
      newInputs.filter_nuts_1,
    );
    setInputs(newInputs);
    /* eslint-disable-next-line */
  }, []);

  const onPollutantGroupsChange = React.useCallback(
    ({ inputs }) => {
      let newInputs = cloneDeep(inputs);
      newInputs.filter_pollutants = filterInputByParentKey(
        newInputs.filter_pollutants,
        options.pollutants,
        newInputs.filter_pollutant_groups,
      );
      setInputs(newInputs);
    },
    /* eslint-disable-next-line */
    [options.pollutants, options.pollutant_groups],
  );

  /*---------- Custom options ----------*/
  const nutsIOptions = React.useMemo(
    () => filterOptionsByParent(options.nuts_1, inputs.filter_countries),
    [options.nuts_1, inputs.filter_countries],
  );

  const nutsIIOptions = React.useMemo(
    () => filterOptionsByParent(options.nuts_2, inputs.filter_nuts_1),
    [options.nuts_2, inputs.filter_nuts_1],
  );

  const riverBasinDistrictsOptions = React.useMemo(
    () =>
      filterOptionsByParent(
        options.river_basin_districts,
        inputs.filter_countries,
      ),
    [options.river_basin_districts, inputs.filter_countries],
  );

  const pollutantsOptions = React.useMemo(
    () =>
      filterOptionsByParent(options.pollutants, inputs.filter_pollutant_groups),
    [options.pollutants, inputs.filter_pollutant_groups],
  );

  return (
    <Modal
      className="filters-block"
      closeOnDimmerClick={false}
      open={open}
      onClose={() => {
        setOpen(false);
      }}
    >
      <Modal.Header>
        <span>Advanced search and filter</span>
        <i
          aria-hidden
          className="delete icon"
          onClick={() => {
            setOpen(false);
          }}
        />
      </Modal.Header>
      <Modal.Content>
        <h3>Industry</h3>
        <SelectWrapper
          inputs={inputs}
          name="industries"
          placeholder="Select industry"
          options={options.industries}
          setInputs={setInputs}
        />
        <h3>Geographical specifics</h3>
        <SelectWrapper
          inputs={inputs}
          name="countries"
          placeholder="Select country"
          options={options.countries}
          setInputs={setInputs}
          onChange={onCountriesChange}
        />
        <SelectWrapper
          inputs={inputs}
          name="nuts_1"
          placeholder="Select NUTS 1"
          options={nutsIOptions}
          setInputs={setInputs}
          onChange={onNutsIChange}
        />
        <SelectWrapper
          inputs={inputs}
          name="nuts_2"
          placeholder="Select NUTS 2"
          options={nutsIIOptions}
          setInputs={setInputs}
        />
        <SelectWrapper
          inputs={inputs}
          name="river_basin_districts"
          placeholder="Select riven basin district"
          options={riverBasinDistrictsOptions}
          setInputs={setInputs}
        />
        <h3>Pollutants</h3>
        <SelectWrapper
          inputs={inputs}
          name="pollutant_groups"
          placeholder="Select pollutant group"
          options={options.pollutant_groups}
          setInputs={setInputs}
          onChange={onPollutantGroupsChange}
        />
        <SelectWrapper
          inputs={inputs}
          name="pollutants"
          placeholder="Select pollutant"
          options={pollutantsOptions}
          setInputs={setInputs}
        />
        <h3>Reporting year</h3>
        <SelectWrapper
          inputs={inputs}
          name="reporting_years"
          placeholder="Select reporting year"
          options={options.reporting_years}
          setInputs={setInputs}
        />
        <h3>Combustion plant type</h3>
        <SelectWrapper
          inputs={inputs}
          name="plant_types"
          placeholder="Select plant type"
          options={options.plant_types}
          setInputs={setInputs}
        />
        <h3>BAT sonclusions</h3>
        <SelectWrapper
          inputs={inputs}
          name="bat_conclusions"
          placeholder="Select BAT conclusion"
          options={options.bat_conclusions}
          setInputs={setInputs}
        />
        <h3>Permit</h3>
        <SelectWrapper
          inputs={inputs}
          name="permit_types"
          placeholder="Select permit type"
          options={permitTypes}
          setInputs={setInputs}
        />
        <SelectWrapper
          inputs={inputs}
          name="permit_years"
          placeholder="Select permit year"
          options={options.permit_years}
          setInputs={setInputs}
        />
        <h3>Facility type</h3>
        <form autoComplete="filter_facility_types">
          <Checkbox
            name="filter_facility_types"
            label="EPRTR"
            style={{ marginRight: '1rem' }}
            checked={isChecked('filter_facility_types', 'EPRTR')}
            onChange={setCheckboxValue}
          />
          <Checkbox
            name="filter_facility_types"
            label="NONEPRTR"
            checked={isChecked('filter_facility_types', 'NONEPRTR')}
            onChange={setCheckboxValue}
          />
        </form>
      </Modal.Content>
      <Modal.Actions className="outline-button">
        <button onClick={clearFilters} className="clear-button">
          Clear filters
        </button>
        <button onClick={applyFilters} className="filter-button">
          Apply filters
        </button>
      </Modal.Actions>
    </Modal>
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
)(ModalView);
