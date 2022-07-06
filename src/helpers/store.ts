import type { UserResponse } from "@/types"

export const setLocalStorage = (payload: UserResponse) => {
    const user = payload.user
    const token = payload.token

    localStorage.setItem('user', JSON.stringify({
        userId: user.id,
        token: token,
        status: true,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
    }))
}