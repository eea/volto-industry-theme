/* REACT IMPORTS */
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { Dimmer, Loader } from 'semantic-ui-react';
import { flattenToAppURL } from '@plone/volto/helpers';

import './style.less';

const RedirectView = (props) => {
  const history = useHistory();
  const [redirect, setRedirect] = useState(false);
  const currentPage = flattenToAppURL(props.content?.['@id'] || '/');
  const redirectPage = flattenToAppURL(
    props.content?.relatedItems?.[0]?.['@id'] || '/',
  );

  useEffect(() => {
    if (!redirect && currentPage !== redirectPage) {
      history.push(redirectPage);
      setRedirect(true);
    }
    /* eslint-disable-next-line */
  }, []);

  return (
    <Dimmer active inverted className="redirect-loader">
      <Loader inverted>European Environment Agency</Loader>
    </Dimmer>
  );
};

export default connect((state) => ({
  navigation: state.navigation,
}))(RedirectView);
