/**
 * View title block.
 * @module components/manage/Blocks/Title/View
 */

import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { BodyClass } from '@plone/volto/helpers';

/**
 * View title block class.
 * @class View
 * @extends Component
 */
const View = ({ data, properties }) => {
  return (
    <>
      <BodyClass
        className={cx({
          'no-space-top': data.no_space_top,
          'no-space-bottom': data.no_space_bottom,
        })}
      />
      {!data.hide_title ? (
        <h2 className="documentFirstHeading">{properties.title}</h2>
      ) : (
        ''
      )}
    </>
  );
};

/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
View.propTypes = {
  properties: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default View;
