import React from 'react';
import { App } from "./App"
import { Story, Meta } from '@storybook/react';
import { BrowserRouterDecorator, ReduxStoreProviderDecorator } from '../stories/decorators/ReduxStoreProviderDecorator';
import { Provider } from 'react-redux';
import { store } from '../state/store';

export default {
    title: 'AppWithRedux Component',
    component: App,
    decorators: [ReduxStoreProviderDecorator, BrowserRouterDecorator],
} as Meta;

const Template: Story = (args) => <Provider store={ store }><App {...args} /></Provider>;

export const AppWithReduxExample = Template.bind({});
AppWithReduxExample.args = {};