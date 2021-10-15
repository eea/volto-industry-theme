import React from 'react';
import cx from 'classnames';
import { Image } from 'semantic-ui-react';

import eclogo from '@eeacms/volto-industry-theme/theme/site/assets/icons/ec.png';
import eealogo from '@eeacms/volto-industry-theme/theme/site/assets/icons/eea.png';

const Parteners = ({ className }) => {
  return (
    <div className={cx('header-partner-section', className)}>
      <Image
        className="ec-logo"
        src={eclogo}
        alt="European Comission"
        title="European Comission"
        height={55}
        style={{ marginRight: '10px' }}
      />
      <Image
        className="eea-logo"
        src={eealogo}
        alt="EEA"
        title="EEA"
        height={55}
      />
    </div>
  );
};

export default Parteners;
