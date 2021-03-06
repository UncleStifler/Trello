import React, {useCallback} from 'react';
import {AddItemForm} from "../../features/AddItemForm";
import {EditableSpan} from "../../features/EditableSpan";
import {Task} from "../tasks/Task";
import {Delete} from "@mui/icons-material";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import {TaskStatuses} from "../api/todolists-api";
import {FilterValuesType} from "../state/todolists-reducer";
import {RequestStatusType} from "../state/app-reducer";
import {TasksDomain_Type} from "../state/tasks-reducer";

export type TodoListType = {
    todoListId: string
    todoListTitle: string
    tasks: TasksDomain_Type[]
    removeTask: (idTasks: string, todolistId: string) => void
    changeFilter: (value: FilterValuesType, todoListId: string) => void
    addTask: (title: string, todolistId: string) => void
    changeStatusCheckbox: (tasksID: string, status: TaskStatuses, todoListId: string) => void
    changeTaskTitle: (id: string, newValue: string, todoListId: string) => void
    changeTodoListTitle: (todoListId: string, newTodoListTitle: string) => void
    filter: FilterValuesType
    removeTodoList: (todoListId: string) => void
    entityStatus: RequestStatusType
}

export const TodoList = React.memo(function (props: TodoListType) {

    const {
        changeFilter, todoListId,
        removeTodoList, addTask, changeTodoListTitle,
        tasks, filter, todoListTitle, removeTask,
        changeStatusCheckbox, changeTaskTitle, entityStatus
    } = props

    const onAllClickHandler = useCallback(() => {
        changeFilter("all", todoListId)
    }, [changeFilter, todoListId])

    const onCompletedClickHandler = useCallback(() => {
        changeFilter("completed", todoListId)
    }, [changeFilter, todoListId])

    const onActiveClickHandler = useCallback(() => {
        changeFilter("active", todoListId)
    }, [changeFilter, todoListId])

    const removeTodoListHandler = () => {
        removeTodoList(todoListId)
    }

    const addTaskForAddItem = useCallback((title: string) => {
        addTask(title, todoListId)
    }, [addTask, todoListId])

    const changeTodoListTitleHandler = useCallback((newTodoListTitle: string) => {
        changeTodoListTitle(todoListId, newTodoListTitle)
    }, [changeTodoListTitle, todoListId])

    let tasksForTodolist = props.tasks

    if (filter === "completed") {
        tasksForTodolist = tasks.filter(t => t.status === TaskStatuses.New)
    }
    if (filter === "active") {
        tasksForTodolist = tasks.filter(t => t.status === TaskStatuses.Completed)
    }

   // console.log(JSON.parse(JSON.stringify(tasksForTodolist)))

    return (
        <div>
            <Link>
                <h3>
                    <EditableSpan
                        title={todoListTitle}
                        onChange={changeTodoListTitleHandler}/>
                    <IconButton
                        onClick={removeTodoListHandler}
                        disabled={entityStatus === 'loading'}>
                        <Delete/>
                    </IconButton>
                </h3>
            </Link>
            <AddItemForm
                addItem={addTaskForAddItem}
                disabled={entityStatus === 'loading'}
            />
            <ul>
                {tasksForTodolist && tasksForTodolist.map(t =>
                    <Task
                        key={t.id}
                        todoListId={todoListId}
                        removeTask={removeTask}
                        changeStatusCheckbox={changeStatusCheckbox}
                        changeTaskTitle={changeTaskTitle}
                        task={t}
                        entityStatus={entityStatus}
                        entityTaskStatus={t.entityTaskStatus}
                    />)}
            </ul>
            <div>
                <Button
                    variant={filter === "all" ? "outlined" : "text"}
                    onClick={onAllClickHandler}>
                    All
                </Button>
                <Button
                    color={'success'}
                    variant={filter === "active" ? "outlined" : "text"}
                    onClick={onActiveClickHandler}>
                    Active
                </Button>
                <Button
                    color={'warning'}
                    variant={filter === "active" ? "outlined" : "text"}
                    onClick={onCompletedClickHandler}>
                    Completed
                </Button>
            </div>
        </div>
    );
});

export default TodoList




