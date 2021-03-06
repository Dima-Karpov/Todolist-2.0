import React from 'react';
import { AddItemForm } from ".";
import {action} from '@storybook/addon-actions'

export default {
    title: 'AddItemFrom Component',
    component: AddItemForm,
};

const callback = async () => action("Button 'add' was pressed inside the form");

export const AddItemFormBaseExample = () => {
    return <AddItemForm addItem={callback}/>
}

export const AddItemDisabledFormBaseExample = () => {
    return <AddItemForm addItem={callback} disabled={true}/>
}