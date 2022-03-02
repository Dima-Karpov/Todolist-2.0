import React, {ChangeEvent, useCallback, useState, KeyboardEvent} from "react";
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import ControlPoint from "@mui/icons-material/ControlPoint";

type AddItemFormPropsType = {
    addItem: (param: {title: string}) => void
    disabled?: boolean
}

export const AddItemForm: React.FC<AddItemFormPropsType> = React.memo(props => {
    const {addItem, disabled, } = props;

    const [newTaskTitle, setNewTaskTitle] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const onChangeNewTaskTitle = (e: ChangeEvent<HTMLInputElement>) => {
        setNewTaskTitle(e.currentTarget.value);
    };

    const addNewItem = useCallback(() => {
        if (newTaskTitle.trim() !== '')
        {
            addItem({title: newTaskTitle.trim()});
            setNewTaskTitle('');
        } else
        {
            setError('Title is requared')
        }
    }, [addItem, newTaskTitle]);

    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (error !== null)
        {
            setError(null);
        }
        if (e.key === 'Enter')
        {
            addNewItem();
        }
    };

    const blurHandler = useCallback(() => setError(null), []); // проследить по перерисовке;

    return (
        <div>
            <TextField
                value={newTaskTitle}
                onChange={onChangeNewTaskTitle}
                onKeyPress={onKeyPressHandler}
                error={!!error}
                label="Type value"
                variant={'outlined'}
                helperText={error}
                onBlur={blurHandler}
                disabled={disabled}
            />

            <IconButton
                onClick={addNewItem}
                color={'primary'}
                onBlur={blurHandler}
                disabled={disabled}
            >
                <ControlPoint />
            </IconButton>

        </div>
    )
});