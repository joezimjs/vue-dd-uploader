import { ref } from 'vue'

export default function() {
	const files = ref([])

	function addFiles(newFiles) {
		let newUploadableFiles = [...newFiles].map(file => new UploadableFile(file))

		files.value = files.value.concat(newUploadableFiles)
	}

	function removeFile(index) {
		files.value.splice(index, 1)
	}

	function fileUrl(file) {
		return URL.createObjectURL(file)
	}

	return { files, addFiles, removeFile, fileUrl }
}

class UploadableFile {
	constructor(file) {
		this.file = file
		this.id = `${file.name}-${file.size}-${file.lastModified}-${file.type}`
		this.url = URL.createObjectURL(file)
		this.status = null
	}
}

/*

		addFiles (files) {
			let isChanged = false
			for (let newFile of files) {
				let id = this.createId(newFile)
				// Only add the file to the list of files if we don't already have it.
				if (!this.fileExists(id)) {
					this.files.push({ file: newFile, id, url: this.getUrl(newFile) })
					isChanged = true
				}
			}

			// Let outside components know we've updated
			if (isChanged) {
				this.$emit('input', this.files)
			}
		},
		createId (file) {
			return `${file.name}-${file.size}-${file.lastModified}-${file.type}`
		},
		fileExists (otherId) {
			return this.files.some(({ id }) => id === otherId)
		},*/
