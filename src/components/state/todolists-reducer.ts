import {todoListsAPI, TodolistType} from "../api/todolists-api";
import {Dispatch} from "redux";
import {AppRootStateType} from "./store";
import {loadTasksTC} from "./tasks-reducer";
import {RequestStatusType, setAppErrorAC, setAppStatusAC} from "../app/app-reducer";


export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}

const initialState: TodolistDomainType[] = []

export const todoListsReducer = (state: TodolistDomainType[] = initialState, action: ActionTypes): TodolistDomainType[] => {
    switch (action.type) {
        case "TODOLIST/SET-TODOLIST": {
            return action.todoListsArray.map(t => {
                return {...t, filter: 'all', entityStatus: 'idle'}
            })
        }
        case "TODOLIST/REMOVE-TODOLIST": {
            return state.filter(t => t.id !== action.id)
        }
        case "TODOLIST/ADD-TODOLIST": {
            return [{
                id: action.todolistId,
                title: action.title,
                filter: 'all',
                addedDate: '',
                order: 0,
                entityStatus: 'idle'
            }, ...state]
        }
        case "TODOLIST/CHANGE-TODOLIST-TITLE" : {
            return state.map(tl =>
                tl.title === action.title ? {...tl, title: action.title} : tl)

        }
        case "TODOLIST/CHANGE-TODOLIST-FILTER" : {
            return state.map(tl =>
                tl.id === action.id ? {...tl, filter: action.filter} : tl)
        }
        case "TODOLIST/CHANGE-TODOLIST-ENTITY-STATUS": {
            return state.map(tl => tl.id === action.todoListId ?
                {...tl, entityStatus: action.entityStatus} : tl)
        }
        default:
            return state
    }
}

export const setTodoListsAC = (todoListsArray: TodolistType[]) => {
    return {type: 'TODOLIST/SET-TODOLIST', todoListsArray} as const
}

export const removeTodoListAC = (todoListId: string) => {
    return {type: "TODOLIST/REMOVE-TODOLIST", id: todoListId} as const
}

export const addTodoListAC = (todo: any) => {
    return {
        type: "TODOLIST/ADD-TODOLIST",
        title: todo.title,
        todolistId: todo.id
    } as const
}
export const changeTodoListTitleAC = (todoListId: string, title: string) => {
    return {
        type: "TODOLIST/CHANGE-TODOLIST-TITLE",
        id: todoListId,
        title: title
    } as const
}

export const changeTodoListFilterAC = (filter: FilterValuesType, todoListId: string) => {
    return {
        type: "TODOLIST/CHANGE-TODOLIST-FILTER",
        id: todoListId,
        filter: filter
    } as const
}

export const changeTodolistEntityStatusAC = (todoListId: string, entityStatus: RequestStatusType) => ({
    type: "TODOLIST/CHANGE-TODOLIST-ENTITY-STATUS",
    todoListId, entityStatus
} as const)

export const loadTodoListsTC = (dispatch: Dispatch<any>, getState: () => AppRootStateType): void => {
    dispatch(setAppStatusAC('loading'))
    todoListsAPI.getTodoLists()
        .then((res) => {
            dispatch(setTodoListsAC(res.data))
            res.data.forEach((todoList) => {
                dispatch(loadTasksTC(todoList.id))
                dispatch(setAppStatusAC('succeeded'))
            })
        })
}

export const removeTodoListTC = (todoListId: string) => {
    return (dispatch: Dispatch) => {
        dispatch(setAppStatusAC('loading'))
        dispatch(changeTodolistEntityStatusAC(todoListId,'loading'))
        todoListsAPI.deleteTodoList(todoListId)
            .then((res) => {
                if (res.data.resultCode === 0) {
                    dispatch(removeTodoListAC(todoListId))
                    dispatch(setAppStatusAC('succeeded'))
                } else {
                    dispatch(setAppErrorAC(res.data.messages.length ?
                        res.data.messages[0] : 'some error'))
                    dispatch(setAppStatusAC('failed'))
                }
            })
    }
}

export const createTodoListTC = (title: string) => {
    return (dispatch: Dispatch) => {
        dispatch(setAppStatusAC('loading'))
        todoListsAPI.createTodoList(title)
            .then((res) => {
                if (res.data.resultCode === 0) {
                    dispatch(addTodoListAC(res.data.data.item))
                    dispatch(setAppStatusAC('succeeded'))
                } else {
                    dispatch(setAppErrorAC(res.data.messages.length ?
                        res.data.messages[0] : 'some error'))
                    dispatch(setAppStatusAC('failed'))
                }
            })
    }
}

export const changeTodoListTitleTC = (todoListId: string, title: string) => {
    return (dispatch: Dispatch) => {
        dispatch(setAppStatusAC('loading'))
        todoListsAPI.updateTodoList(todoListId, title)
            .then(() => {
                dispatch(changeTodoListTitleAC(todoListId, title))
                dispatch(setAppStatusAC('succeeded'))
            })
    }
}

export type RemoveTodoListActionType = ReturnType<typeof removeTodoListAC>
export type AddTodoListActionType = ReturnType<typeof addTodoListAC>
export type ChangeTodoListTitleActionType = ReturnType<typeof changeTodoListTitleAC>
export type ChangeTodoListFilterActionType = ReturnType<typeof changeTodoListFilterAC>
export type changeTodoListFilterActionType = ReturnType<typeof changeTodoListFilterAC>
export type SetTodoListsActionType = ReturnType<typeof setTodoListsAC>
export type changeTodolistEntityStatusActionType = ReturnType<typeof changeTodolistEntityStatusAC>

type ActionTypes =
    RemoveTodoListActionType |
    AddTodoListActionType |
    ChangeTodoListTitleActionType |
    ChangeTodoListFilterActionType |
    SetTodoListsActionType |
    changeTodolistEntityStatusActionType




