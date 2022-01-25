import React from 'react';
import { compose } from 'redux';
import { SidebarPortal } from '@plone/volto/components';
import InlineForm from '@plone/volto/components/manage/Form/InlineForm';
import { connectToProviderData } from '@eeacms/volto-datablocks/hocs';
import ExploreEprtrView from './View';
import schema from './schema';

const Edit = (props) => {
  const { data = {}, block = null, selected = false, onChangeBlock } = props;

  return (
    <>
      <ExploreEprtrView {...props} mode="edit" />

      <SidebarPortal selected={selected}>
        <InlineForm
          schema={schema}
          title={schema.title}
          onChangeField={(id, value) => {
            onChangeBlock(block, {
              ...data,
              [id]: value,
            });
          }}
          formData={data}
        />
      </SidebarPortal>
    </>
  );
};

export default compose(
  connectToProviderData((props) => {
    return {
      provider_url: props.data?.provider_url,
    };
  }),
)(Edit);
