import React, {ChangeEvent, useState} from "react";
import {TextField} from "@material-ui/core";

type EditableSpanType = {
    title: string
    onChange: (newValue: string) => void
}
export const EditableSpan = React.memo((props: EditableSpanType) => {
    console.log('editable span has been called')
    const [editMode, setEditMode] = useState(false)
    const [title, setTitle] = useState("")

    const activateEditMode = () => {
        setEditMode(true)
        setTitle(props.title)
    }
    const activateViewMode = () => {
        setEditMode(false)
        props.onChange(title)
    }

    const onChangeTitleForEditableName = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }

    return (
        editMode
            ? <TextField
                size="small"
                variant="outlined"
                value={title}
                onBlur={activateViewMode}
                autoFocus
                onChange={onChangeTitleForEditableName}/>
            : <span onDoubleClick={activateEditMode}>{props.title}</span>
    )
})