const lostData = {
	id: 123,
	name: 'Mac Book Pro',
	description: 'This is a Mac Book Pro',
	type: 'Lost',
	status: 'Open',
	tags: ['Electronics', 'Laptop', 'Hardware'],
	category: 'Electronics',
	reportedDate: '2023-10-10',
	reportedLocation: 'Babbio Center',
	reportedBy: 'John Doe',
	currentLocation: 'Babbio Center',
	claims: [
		{
			id: 1,
			user: {
				id: 1,
				name: '50 Cent'
			},
			date: '2021-10-10',
			description: 'This is my Mac Book Pro, Lost it last saturday around Babbio Center',
		},
	],
	disputes: [],
	timelineDetails: [
		{
			id: 1,
			date: '2021-10-10',
			location: 'Babbio Center',
			description: 'Mac Book Pro was lost',
		},
		{
			id: 2,
			date: '2021-10-12',
			location: 'Babbio Center',
			description: 'Item reported to team member',
		},
		{
			id: 3,
			date: '2021-10-12',
			location: 'Babbio Center',
			description: 'Item yet to be claimed',
		}
	],
	comments: [
		{
			id: 1,
			user: {
				id: 1,
				name: '50 Cent'
			},
			date: '2021-10-10',
			location: 'Babbio Center',
			description: 'Please hemp me find my Mac Book Pro',
		},
		{
			id: 2,
			user: {
				id: 2,
				name: 'Eminem'
			},
			date: '2021-10-12',
			location: 'Babbio Center',
			description: 'I will help you find your Mac Book Pro',
		}
	],
	images: [
		"https://www.technied.com/wp-content/uploads/Macbook-Pro-2018-Lost-Documents-Recovery.jpg"
	]
}

const foundData = {
	id: 123,
	name: 'Mac Book Pro',
	description: 'This is a Mac Book Pro',
	type: 'Found',
	status: 'Open',
	tags: ['Electronics', 'Laptop', 'Hardware'],
	category: 'Electronics',
	reportedDate: '2023-10-10',
	reportedLocation: 'Babbio Center',
	reportedBy: 'John Doe',
	currentLocation: 'Babbio Center',
	claims: [
		{
			id: 1,
			user: {
				id: 1,
				name: '50 Cent'
			},
			date: '2021-10-10',
			location: 'Babbio Center',
			description: 'This is my Mac Book Pro, Lost it last saturday around Babbio Center',
			status: 'Pending'
		},
		{
			id: 2,
			user: {
				id: 2,
				name: 'Jay-Z'
			},
			date: '2021-10-10',
			location: 'Babbio Center',
			description: 'I also lost my Mac Book Pro recently, need to check if this is mine',
			status: 'Open'
		}
	],
	disputes: [],
	timelineDetails: [
		{
			id: 1,
			date: '2021-10-10',
			location: 'Babbio Center',
			description: 'Mac Book Pro was lost',
		},
		{
			id: 2,
			date: '2021-10-12',
			location: 'Babbio Center',
			description: 'Item reported to team member',
		},
		{
			id: 3,
			date: '2021-10-12',
			location: 'Babbio Center',
			description: 'Item yet to be claimed',
		}
	],
	comments: [
		{
			id: 1,
			user: {
				id: 1,
				name: '50 Cent'
			},
			date: '2021-10-10',
			location: 'Babbio Center',
			description: 'Pleaase hemp me find my Mac Book Pro',
		},
		{
			id: 2,
			user: {
				id: 2,
				name: 'Eminem'
			},
			date: '2021-10-12',
			location: 'Babbio Center',
			description: 'I will help you find your Mac Book Pro',
		}
	],
	images: [
		"https://www.technied.com/wp-content/uploads/Macbook-Pro-2018-Lost-Documents-Recovery.jpg"
	]
}


export { lostData, foundData };