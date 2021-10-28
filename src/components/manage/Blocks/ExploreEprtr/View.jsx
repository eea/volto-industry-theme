import React from 'react';
import { Grid } from 'semantic-ui-react';
import { UniversalLink } from '@plone/volto/components';
import about from './images/about.png';
import analyse from './images/analyse.png';
import download from './images/download.png';
import explore from './images/explore.png';

import './styles.less';

const View = () => {
  return (
    <Grid className="explore-eprtr" columns="12">
      <Grid.Column
        className="explore-map"
        widescreen="8"
        largeScreen="8"
        computer="8"
        tablet="7"
        mobile="12"
      >
        <UniversalLink href="/explore">
          <img src={explore} alt="Explore the data" />
        </UniversalLink>
      </Grid.Column>
      <Grid.Column
        className="description"
        widescreen="4"
        largeScreen="4"
        computer="4"
        tablet="5"
        mobile="12"
      >
        <UniversalLink href="/analyse">
          <div className="explore-tile">
            <img src={analyse} alt="Analyse" />
            <div>
              <p className="title">ANALYSE</p>
              <p>
                Find the biggest polluters and compare data across countries
              </p>
            </div>
          </div>
        </UniversalLink>
        <UniversalLink href="/download">
          <div className="explore-tile">
            <img src={download} alt="Download" />
            <div>
              <p className="title">DOWNLOAD</p>
              <p>Work with raw datasheets on your own choice of software</p>
            </div>
          </div>
        </UniversalLink>
        <UniversalLink href="/about">
          <div className="explore-tile">
            <img src={about} alt="About" />

            <div>
              <p className="title">ABOUT</p>
              <p>New to this topic?</p>
              <p>Understand the Industry portal</p>
            </div>
          </div>
        </UniversalLink>
      </Grid.Column>
    </Grid>
  );
};

export default View;
