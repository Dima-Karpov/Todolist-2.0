import React from 'react';
import { AppWithRedux } from "./AppWithRedux";
import { Story, Meta } from '@storybook/react';
import { ReduxStoreProviderDecorator } from './stories/decorators/ReduxStoreProviderDecorator';
import { Provider } from 'react-redux';
import { store } from './state/store';

export default {
    title: 'AppWithRedux Component',
    component: AppWithRedux,
    decorators: [ReduxStoreProviderDecorator],
} as Meta;

const Template: Story = (args) => <Provider store={store}><AppWithRedux {...args} /></Provider>;

export const AppWithReduxExample = Template.bind({});
AppWithReduxExample.args = {};