import { defineStore } from 'pinia'
import type { RegisterPayload, LoginPayload, StatePayload, UserResponse } from '@/types'
import { postRequest } from '@/helpers/fetch'
import { setLocalStorage } from '@/helpers/store'

export const useUserStore = defineStore({
    id: 'user',
    state: () => ({
    	userId: null as null | number,
    	token: null as null | string,
    	isLoggedIn: false,

    	firstName: null as null | string,
    	lastName: null as null | string,
    	role: null as null | string,
		userDepartment: null as null | string,
		balance: null as null | number,

    	overview: null as null | string
    }),
    actions: {
		updateStateFromStorage(payload: StatePayload) {
			this.userId = payload.userId
			this.token = payload.token
			this.isLoggedIn = payload.status
			this.firstName = payload.firstName
			this.lastName = payload.lastName
			this.role = payload.role
			this.userDepartment= payload.department,
			this.balance = payload.balance
		},
		updateState(payload: UserResponse) {
			const user = payload.user
			const token = payload.token

			if (user && token) {
				this.userId = user.id
				this.token = token
				this.isLoggedIn = true
				this.firstName = user.firstName
				this.lastName = user.lastName
				this.role = user.role
				this.userDepartment= user.department
				this.balance = user.balance
			}
		},
		updateOverview(payload: string) {
			this.overview = payload
		},
    	async register(payload: RegisterPayload) {
        	const url = "/api/register"
        	const body = {
          		firstName: payload.firstName,
          		lastName: payload.lastName,
          		email: payload.email,
          		password: payload.password,
          		role: payload.role,
				department: payload.department
        	}
        	
			const response = await postRequest(url, body)
		
			if (response) {
				this.updateState(response)
				setLocalStorage(response)
				return response
			}
      	},
		async login(payload: LoginPayload) {
			const url = "/api/login"
			const body = {
				email: payload.email,
				password: payload.password
			}

			const response = await postRequest(url, body)

			if (response) {
				this.updateState(response)
				setLocalStorage(response)
				return response
			}
		}	
    }
})
