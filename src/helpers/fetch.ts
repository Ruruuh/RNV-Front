import type { UserResponse } from '../types'

// Helper function for post fetch requests
export const postRequest = async (url: string, reqBody: {}) => {
    try {
    	const response = await fetch(url, {
      		method: 'POST',
      		headers: {
        		'Content-Type': 'application/json'
      		},
      		body: JSON.stringify(reqBody)
    	})

    	if (response) {
      		const json: UserResponse = await response.json()
      		return json
    	}
  	} catch(e: any) {
    	console.log(e)
  	}
}

export const secureGetReq = async (url: string, token: string) => {
	try {
		const response = await fetch(url, {
			method: 'GET',
			headers: {
				'Accepts': 'application/json',
				'Authorization': 'Bearer ' + token,
				'Content-Type': 'application/json'
			}
		})

		if (response) {
			const json = await response.json()
			return json
		}
	} catch(e: any) {
		console.log(e)
	}
}

export const securePostReq = async (url: string, token: string, reqBody: {}) => {
	try {
		const response = await fetch(url, {
			method: "POST",
			mode: "cors",
			headers: {
				"Authorization": "Bearer " + token,
				"Content-Type": "application/json"
			},
			body: JSON.stringify(reqBody)
		})

		if (response) {
			const json = await response.json()
			return json
		}
	} catch(e: any) {
		console.log(e)
	}
}

export const securePatchReq = async (url: string, token: string, reqBody: {}) => {
	try {
		const response = await fetch(url, {
			method: "PATCH",
			mode: "cors",
			headers: {
				"Authorization": "Bearer " + token,
				"Content-Type": "application/json"
			},
			body: JSON.stringify(reqBody)
		})

		if (response) {
			const json = await response.json()
			return json
		}
	} catch(e: any) {
		console.log(e)
	}
}

export const secureImgPostReq = async (url: string, token: string, reqBody: FormData) => {
	try {
		await fetch(url, {
			method: "POST",
			headers: {
				"Authorization": "Bearer " + token,
			},
			body: reqBody
		})
	} catch(e: any) {
		console.log(e)
	}
}