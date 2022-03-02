import React from 'react';
import { EditableSpan } from ".";
import {action} from '@storybook/addon-actions'

export default {
    title: 'EditableSpan Component',
    component: EditableSpan,
};

const callback = action("Span changed")

export const EditableSpanBaseExample = () => {
    return <EditableSpan onChange={callback} title={'React'}/>
}