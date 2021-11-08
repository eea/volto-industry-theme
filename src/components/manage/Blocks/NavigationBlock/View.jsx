import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Container, Menu } from 'semantic-ui-react';
import { UniversalLink } from '@plone/volto/components';
import { getBaseUrl } from '@plone/volto/helpers';

import './styles.less';

const MenuWrapper = ({ children, data }) => {
  if (data.styles?.stretch === 'stretch') {
    return <Container>{children}</Container>;
  }
  return children;
};

const View = ({ location, data, navigation }) => {
  const [items, setItems] = useState([]);
  const pages = data.pages || [];
  const pathname = getBaseUrl(location.pathname);

  useEffect(() => {
    const parent = navigation.filter((item) => item.url === data.parent)[0];
    setItems(parent?.items || []);
  }, [data.parent, navigation]);

  return (
    <Menu className="navigation-block">
      <MenuWrapper data={data}>
        {items.map((item) => (
          <Menu.Item
            key={item.url}
            active={pathname.includes(getBaseUrl(item.url))}
          >
            <UniversalLink
              href={`${item.url}${location.search}`}
              ignoreScroll={data.ignoreScroll}
            >
              {item.title}
            </UniversalLink>
          </Menu.Item>
        ))}
        {pages.map((item) => {
          return item.url ? (
            <Menu.Item
              key={item.url}
              active={pathname.includes(getBaseUrl(item.url))}
            >
              <UniversalLink
                href={`${item.url}${location.search}`}
                ignoreScroll={data.ignoreScroll}
              >
                {item.title}
              </UniversalLink>
            </Menu.Item>
          ) : (
            ''
          );
        })}
      </MenuWrapper>
    </Menu>
  );
};

export default connect((state) => ({
  location: state.router.location,
  navigation: state.navigation.items,
}))(View);
