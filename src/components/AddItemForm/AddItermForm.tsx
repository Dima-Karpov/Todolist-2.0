import React, { ChangeEvent, useCallback, useState, KeyboardEvent } from "react";

type AddItemFormPropsType = {
    addItem: (title: string) => void
}

export const AddItemForm: React.FC<AddItemFormPropsType> = React.memo(props => {
    const {  addItem, } = props;

    const [newTaskTitle, setNewTaskTitle] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const onChangeNewTaskTitle = (e: ChangeEvent<HTMLInputElement>) => {
        setNewTaskTitle(e.currentTarget.value);
    };

    const addNewItem = useCallback(() => {
        if (newTaskTitle.trim() !== '') {
            addItem(newTaskTitle.trim());
            setNewTaskTitle('');
        } else {
            setError('Title is requared')
        }
    }, [addItem, newTaskTitle]);

    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        setError(null);
        if (e.key === 'Enter') {
            addNewItem();
        }
    };

    return (
        <div>
            <input
                value={newTaskTitle}
                onChange={onChangeNewTaskTitle}
                onKeyPress={onKeyPressHandler}
                className={error ? 'error' : ''}
            />
            <button onClick={addNewItem} >+</button>
            {error && <div className='error-message'>{error}</div>}
        </div>
    )
})