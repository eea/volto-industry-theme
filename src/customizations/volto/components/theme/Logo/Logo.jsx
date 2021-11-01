/**
 * Logo component.
 * @module components/theme/Logo/Logo
 */

import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { Image } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import config from '@plone/volto/registry';
import { UniversalLink } from '@plone/volto/components';

import logo from '@eeacms/volto-industry-theme/theme/site/assets/icons/logo-white.png';

const messages = defineMessages({
  site: {
    id: 'Site',
    defaultMessage: 'Site',
  },
  plonesite: {
    id: 'Plone Site',
    defaultMessage: 'Plone Site',
  },
  industrialEmissions: {
    id: 'Industrial Emissions',
    defaultMessage: 'Industrial Emissions Portal',
  },
});

/**
 * Logo component class.
 * @function Logo
 * @param {Object} intl Intl object
 * @returns {string} Markup of the component.
 */
const Logo = () => {
  const lang = useSelector((state) => state.intl.locale);
  const intl = useIntl();

  return (
    <div className="logo">
      <UniversalLink
        href={config.settings.isMultilingual ? `/${lang}` : '/'}
        title={intl.formatMessage(messages.site)}
        style={{ display: 'inline-block' }}
      >
        <Image
          src={logo}
          alt={intl.formatMessage(messages.industrialEmissions)}
          title={intl.formatMessage(messages.industrialEmissions)}
          height={70}
        />
      </UniversalLink>
    </div>
  );
};

export default Logo;
