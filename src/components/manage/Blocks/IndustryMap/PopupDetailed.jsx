import React from 'react';
import { UniversalLink } from '@plone/volto/components';
import { Modal } from 'semantic-ui-react';

class PopupDetailed extends React.PureComponent {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
    this.onClose = this.onClose.bind(this);
    this.state = {
      data: {},
    };
  }

  onClick(e) {
    if (JSON.stringify(e.detail) !== JSON.stringify(this.state.data)) {
      this.setState({ data: e.detail });
    }
  }

  onClose() {
    this.setState({ data: {} });
    this.props.overlay.current.setPosition(undefined);
  }

  componentDidMount() {
    document
      .querySelector('#industry-map')
      .addEventListener('ol-click', this.onClick);
  }

  componentWillUnmount() {
    document
      .querySelector('#industry-map')
      .removeEventListener('ol-click', this.onClick);
  }

  render() {
    const { data } = this.state;
    const open = !!Object.keys(data).length;

    return (
      <Modal
        id="popup-detailed"
        closeOnDimmerClick={false}
        open={open}
        onClose={this.onClose}
      >
        <Modal.Header>
          <span>{data.siteName}</span>
          <i aria-hidden className="delete icon" onClick={this.onClose} />
        </Modal.Header>
        <Modal.Content>
          <h3>Site contents</h3>
          {data.nFacilities ? (
            <p>
              {data.nFacilities + ' '}
              Facilit
              {data.nFacilities > 1 ? 'ies' : 'y'}
            </p>
          ) : (
            ''
          )}
          {data.nInstallations ? (
            <p>
              {data.nInstallations + ' '}
              Installation
              {data.nInstallations > 1 ? 's' : ''}
            </p>
          ) : (
            ''
          )}
          {data.nLCP ? (
            <p>
              {data.nLCP + ' '}
              Large combustion plant
              {data.nLCP > 1 ? 's' : ''}
            </p>
          ) : (
            ''
          )}
          <h3>Pollutant emissions</h3>
          {data.pollutants ? (
            <p>{data.pollutants}</p>
          ) : (
            <p>There are no data regarding the pollutants</p>
          )}
          <h3>Regulatory information</h3>
          {data.Site_reporting_year ? (
            <p>
              Inspections in {data.Site_reporting_year}:{' '}
              {data.numInspections || 0}
            </p>
          ) : (
            ''
          )}
        </Modal.Content>
        <Modal.Actions className="solid-button">
          <UniversalLink
            className="solid dark-blue display-inline-block"
            href={`/industrial-site/environmental-information?siteInspireId=${data.InspireSiteId}&siteName=${data.siteName}&siteReportingYear=${data.Site_reporting_year}`}
          >
            Site details
          </UniversalLink>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default PopupDetailed;
