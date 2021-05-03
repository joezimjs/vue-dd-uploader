export default async function uploadFile(file, url) {
	// set up the request data
	let formData = new FormData()
	formData.append('file', file.file)

	// track status and upload file
	file.status = 'loading'
	let response = await fetch(url, { method: 'POST', body: formData })

	// change status to indicate the success of the upload request
	file.status = response.ok

	return response
}

export function createUploader(url) {
	return function fileUploader(file) {
		return uploadFile(file, url)
	}
}
