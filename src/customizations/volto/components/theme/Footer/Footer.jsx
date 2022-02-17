/**
 * Footer component.
 * @module components/theme/Footer/Footer
 */

import React from 'react';
import { Container, Grid, Segment, List } from 'semantic-ui-react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { UniversalLink } from '@plone/volto/components';
import eeaLogo from '@eeacms/volto-industry-theme/theme/site/assets/icons/eea.png';
import eclogo from '@eeacms/volto-industry-theme/theme/site/assets/icons/ec.png';

/**
 * Component to display the footer.
 * @function Footer
 * @param {Object} intl Intl object
 * @returns {string} Markup of the component
 */
const Footer = () => (
  <Segment
    vertical
    inverted
    id="footer"
    className="footer-wrapper"
    role="contentinfo"
    color="blue"
    padded="very"
  >
    <Container>
      <Grid>
        <Grid.Column mobile={12} tablet={3} computer={3}>
          <List>
            <List.Item>
              <UniversalLink className="item" href="/">
                <FormattedMessage id="home" defaultMessage="Home" />
              </UniversalLink>
            </List.Item>
            <List.Item>
              <UniversalLink className="item" href="/explore">
                <FormattedMessage id="explore" defaultMessage="Explore" />
              </UniversalLink>
            </List.Item>
            <List.Item>
              <UniversalLink className="item" href="/analyse">
                <FormattedMessage id="analyse" defaultMessage="Analyse" />
              </UniversalLink>
            </List.Item>
            <List.Item>
              <UniversalLink className="item" href="/download">
                <FormattedMessage id="download" defaultMessage="Download" />
              </UniversalLink>
            </List.Item>
            <List.Item>
              <UniversalLink className="item" href="/pollutants">
                <FormattedMessage id="pollutants" defaultMessage="Pollutants" />
              </UniversalLink>
            </List.Item>
            <List.Item>
              <UniversalLink className="item" href="/about">
                <FormattedMessage id="about" defaultMessage="About" />
              </UniversalLink>
            </List.Item>
          </List>
        </Grid.Column>
        <Grid.Column mobile={12} tablet={9} computer={6}>
          <Grid>
            <Grid.Row>
              <Grid.Column mobile={12} tablet={6} computer={5}>
                <div className="logo">
                  <UniversalLink
                    href="https://ec.europa.eu/"
                    title="European Commission"
                    style={{ display: 'block' }}
                  >
                    <img
                      className="footerLogo"
                      style={{ height: '53px' }}
                      src={eeaLogo}
                      alt="EEA"
                      title="EEA"
                    />
                  </UniversalLink>
                  <img
                    className="footerLogo"
                    style={{ height: '53px' }}
                    src={eclogo}
                    alt="EC"
                    title="EC"
                  />
                </div>
              </Grid.Column>
              <Grid.Column mobile={12} tablet={6} computer={7}>
                <p>
                  European Environment Agency (EEA)
                  <br />
                  Kongens Nytorv 6
                  <br />
                  1050 Copenhagen K
                  <br />
                  Denmark
                  <br />
                  <a
                    className="item"
                    rel="noreferrer"
                    href="mailto:industry.helpdesk@eea.europa.eu"
                    target="_blank"
                  >
                    Contact us
                  </a>
                </p>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Grid.Column>
        <Grid.Column mobile={12} tablet={12} computer={3}>
          <p>
            The European Environment Agency (EEA) is an agency of the European
            Union.
          </p>
          <List>
            <List.Item>
              <UniversalLink className="item" href="/legal_notice">
                <FormattedMessage
                  id="legal_notice"
                  defaultMessage="Legal notice"
                />
              </UniversalLink>
            </List.Item>
            <List.Item>
              <UniversalLink className="item" href="/privacy-statement">
                <FormattedMessage
                  id="privacy_statement"
                  defaultMessage="Privacy statement"
                />
              </UniversalLink>
            </List.Item>
            <List.Item>
              <UniversalLink
                className="item"
                href="https://status.eea.europa.eu"
              >
                EEA systems status
              </UniversalLink>
            </List.Item>
          </List>
        </Grid.Column>
      </Grid>
    </Container>
  </Segment>
);

/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
Footer.propTypes = {
  /**
   * i18n object
   */
};

export default injectIntl(Footer);
