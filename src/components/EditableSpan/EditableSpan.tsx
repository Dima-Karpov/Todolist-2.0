import React, { ChangeEvent, useCallback, useState } from "react";

type EditabelSpanPropsType = {
    title: string
    onChange: (newValue: string) => void
  };
  
  export const EditableSpan: React.FC<EditabelSpanPropsType> = React.memo(props => {
  
    const { title, onChange } = props;
  
    const [editMode, setEditMode] = useState<boolean>(false);
    const [newTitle, setNewTitle] = useState<string>('');
  
    const activateEditMode = () => {
      setEditMode(true);
  
    };
    const activateViewMode = useCallback(() => {
      setEditMode(false);
      onChange(newTitle);
      // setNewTitle('');
    }, [onChange, newTitle]);
  
    const onChangeTitleHandler = (e: ChangeEvent<HTMLInputElement>) => {
      setNewTitle(e.currentTarget.value);
    };
  
    return (
      editMode
        ? <input value={newTitle} onChange={onChangeTitleHandler} onBlur={activateViewMode} autoFocus />
        : <span onDoubleClick={activateEditMode}>{title}</span>
  
    )
  });