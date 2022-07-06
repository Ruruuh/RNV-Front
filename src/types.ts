export interface RegisterPayload {
  	firstName: string,
	lastName: string,
	email: string,
	password: string,
	role: string,
	department: string
}

export interface LoginPayload {
	email: string,
	password: string
}

export interface UserResponse {
	user: {
		id: number,
    	createdAt: string,
	    updatedAt: string,
    	firstName: string,
	    lastName: string,
    	role: string,
		department: string
  	},
	token: string,
	message: string | null
}

export interface StoragePayload {
	userId: number,
	token: string,
	firstName: string,
	lastName: string,
	role: string
}

export interface StatePayload {
	userId: number,
	token: string,
	status: boolean,
	firstName: string,
	lastName: string,
	role: string,
	department: string
}

export interface Reimbursement {
	expenseDate: string,
	expenseAmount: number,
	expenseNature: string,
	rowNumber: null | number
}

export interface Remark {
	type: string,
	role: string,
	content: string
}

export interface ReimbursementRes extends Reimbursement {
	id: number,
	createdAt: Date,
	updatedAt: Date,
	ticketId: number,
	approved: boolean
}

export interface RemarkRes extends Remark {
	id: number,
	createdAt: Date,
	updatedAt: Date,
	ticketId: number
}

export interface Image {
	id: number,
	createdAt: Date,
	updatedAt: Date,
	ticketId: number,
	link: string
}

export interface Balance {
	id: number,
	ticketId: number,
	createdAt: Date,
	updatedAt: Date,
	name: string,
	balance: number,
	amount: number,
	preparedBy: string
}

export interface Ticket {
	id: number,
	creatorId: number,
	createdAt: Date,
	updatedAt: Date,
	crf: number,
	purpose: string,
	office: string,
	department: string,
	actionBy: string,
	status: string,
	rowNumber: null | number,
	reimbursements: ReimbursementRes[],
	remarks: RemarkRes[],
	images: Image[],
	balance: Balance
	creatorInfo: {
		firstName: string,
		lastName: string
	}
}
