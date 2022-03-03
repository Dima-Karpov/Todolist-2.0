import React, {ChangeEvent, useCallback, useState, KeyboardEvent} from "react";
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import ControlPoint from "@mui/icons-material/ControlPoint";

export type AddItemFromSubmitHelperType = {
    setError: (error: string) => void,
    setTitle: (title: string) => void,
};

type AddItemFormPropsType = {
    addItem: (param: {title: string}, helper: AddItemFromSubmitHelperType) => void,
    disabled?: boolean,
};

export const AddItemForm: React.FC<AddItemFormPropsType> = React.memo(props => {
    const {addItem, disabled, } = props;

    const [title, setTitle] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const onChangeNewTaskTitle = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value);
    };

    const addNewItem = useCallback( () => {
        if (title.trim() !== '')
        {
            addItem({title: title.trim()}, {setError, setTitle});

        } else
        {
            setError('Title is requared')
        }
    }, [addItem, title]);

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
                value={title}
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
                style={{marginLeft: '5px'}}
            >
                <ControlPoint />
            </IconButton>

        </div>
    )
});