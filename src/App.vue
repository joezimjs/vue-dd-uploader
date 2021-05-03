<template>
	<div id="app">
		<DropZone class="drop-area" @files-dropped="addFiles" v-slot:default="{ dropZoneActive }">
			<label for="file-input">
				<span v-if="!dropZoneActive">Drag Your Files Here</span>
				<span v-else>Drop Them</span>
				<input type="file" id="file-input" multiple @change="onInputChange" />
			</label>
			<ul class="image-list" v-show="files.length">
				<li v-for="(file, i) of files" :key="file.id">
					<button @click="removeFile(i)" class="close-icon">&times;</button>
					<img :src="file.url" alt="" width="500" />
					<!-- ({{ i }}) {{ file.status }} -->

					<span class="status-indicator loading-indicator" v-show="file.status == 'loading'">Loading</span>
					<span class="status-indicator success-indicator" v-show="file.status == true">Uploaded</span>
					<span class="status-indicator failure-indicator" v-show="file.status == false">Error</span>
				</li>
			</ul>
		</DropZone>
		<button @click.prevent="uploadFiles" class="upload-button">Upload</button>
	</div>
</template>

<script>
// import { ref } from 'vue'
import useFileList from '@/compositions/file-list'
import { createUploader } from '@/compositions/file-uploader'
import DropZone from './components/DropZone.vue'

const uploadFile = createUploader('YOUR URL HERE')

export default {
	name: 'app',
	components: { DropZone },

	setup() {
		const { files, addFiles, removeFile, fileUrl } = useFileList()

		return { files, addFiles, removeFile, fileUrl }
	},

	data: () => ({
		uploads: [],
		status
	}),

	methods: {
		async uploadFiles() {
			this.status = 'in progress'
			console.log(this.files, this.files.value)
			try {
				await Promise.all(this.files.map(file => uploadFile(file)))
				this.status = 'success'
			} catch (e) {
				this.status = 'fail'
			}
		},
		onInputChange(e) {
			this.addFiles(e.target.files)
			e.target.value = null // reset so that selecting the same file again will still cause it to fire this change
		}
	}
}
</script>

<style scoped lang="stylus">
#app {
	font-family: Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	margin: 60px auto 0;
	max-width: 800px;
}

button {
	cursor: pointer;
}

.drop-area {
	padding: 50px;
	background: #c5def3;
	box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);

	&[data-active=true] {
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
		// background: #96b8d3
		// color: white
	}
}

label {
	font-size: 36px;

	input[type=file] {
		position: absolute;
		visibility: hidden;
		pointer-events: none;
	}
}

.image-list {
	display: flex;
	list-style: none;
	flex-wrap: wrap;
	padding: 0;

	li {
		display: flex-item;
		width: 20%;
		margin: 1rem 2.5%;
		position: relative;
	}

	img {
		max-width: 100%;
		display: block;
	}

	.close-icon, .status-indicator {
		--size: 20px;
		position: absolute;
		line-height: var(--size);
		height: var(--size);
		border-radius: var(--size);
		box-shadow: 0 0 5px currentColor;
		right: 0.25rem;
		appearance: none;
		border: 0;
		padding: 0;
	}

	.close-icon {
		width: var(--size);
		font-size: var(--size);
		background: #933;
		color: #fff;
		top: 0.25rem;
	}

	.status-indicator {
		font-size: calc(0.75 * var(--size));
		bottom: 0.25rem;
		padding: 0 10px;
	}

	.loading-indicator {
		animation: pulse 1.5s linear 0s infinite;
		color: #000;
	}

	.success-indicator {
		background: #6c6;
		color: #040;
	}

	.failure-indicator {
		background: #933;
		color: #fff;
	}
}

.upload-button {
	display: block;
	appearance: none;
	border: 0;
	border-radius: 50px;
	padding: 0.75rem 3rem;
	margin: 1rem auto;
	font-size: 1.25rem;
	font-weight: bold;
	background: #369;
	color: #fff;
	text-transform: uppercase;
}

@keyframes pulse {
	0% {
		background: #fff;
	}

	50% {
		background: #ddd;
	}

	100% {
		background: #fff;
	}
}
</style>
