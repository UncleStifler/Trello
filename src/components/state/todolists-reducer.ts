import {FilterValuesType, ToDoListType} from "../../App";
import {v1} from "uuid";

type ActionTypes =
    RemoveTodoListActionType |
    AddTodoListActionType |
    ChangeTodoListTitleActionType |
    ChangeTodoListFilterActionType


type RemoveTodoListActionType = {
    type: 'REMOVE-TODOLIST'
    id: string
}

type AddTodoListActionType = {
    type: 'ADD-TODOLIST'
    todoListTitle: string
}

type ChangeTodoListTitleActionType = {
    type: 'CHANGE-TODOLIST-TITLE'
    id: string
    todoListTitle: string
}

type ChangeTodoListFilterActionType = {
    type: 'CHANGE-TODOLIST-FILTER'
    id: string
    filter: FilterValuesType
}


export const todoListsReducer = (state: ToDoListType[], action: ActionTypes): ToDoListType[] => {
    switch (action.type) {
        case 'REMOVE-TODOLIST': {
            return state.filter(t => t.id !== action.id)
        }
        case 'ADD-TODOLIST': {
            return [...state, {
                id: v1(),
                todoListTitle: action.todoListTitle,
                filter: 'all'
            }]
        }
        case 'CHANGE-TODOLIST-TITLE' : {
            let todoList = state.find(t => t.id === action.id)
            if (todoList) {
                todoList.todoListTitle = action.todoListTitle
            }
            return [...state]
        }

        case 'CHANGE-TODOLIST-FILTER' : {
            let todolist = state.find(t => t.id === action.id)
            if (todolist) {
                todolist.filter = action.filter

            }
            return [...state]
        }

        default:
            throw new Error("I don't understand this type")

    }
}

export const RemoveTodoListAC = (todoListID: string): RemoveTodoListActionType => {
    return {
        type: 'REMOVE-TODOLIST',
        id: todoListID
    }
}
export const AddTodoListAC = (todoListTitle: string): AddTodoListActionType => {
    return {
        type: 'ADD-TODOLIST',
        todoListTitle: todoListTitle
    }
}

export const ChangeTodoListTitleAC = (todoListID: string, title: string): ChangeTodoListTitleActionType => {
    return {
        type: 'CHANGE-TODOLIST-TITLE',
        id: todoListID,
        todoListTitle: title
    }
}

export const ChangeTodoListFilterAC = (todoListID: string, filter: FilterValuesType) : ChangeTodoListFilterActionType => {
    return {
        type: 'CHANGE-TODOLIST-FILTER',
        id: todoListID,
        filter: filter
    }
}