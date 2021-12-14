<template>
	<div id="app">
		<DropZone class="drop-area" @files-dropped="addFiles" v-slot:default="{ dropZoneActive }">
			<label for="file-input">
				<div v-if="dropZoneActive">
					<div>Drop Them Here</div>
					<div class="smaller">to add them</div>
				</div>
				<div v-else>
					<div>Drag Your Files Here</div>
					<div class="smaller">
						or <strong><em>click here</em></strong> to select files
					</div>
				</div>

				<input type="file" id="file-input" multiple @change="onInputChange" />
			</label>
			<ul class="image-list" v-show="files.length">
				<FilePreview v-for="file of files" :key="file.id" :file="file" tag="li" @remove="removeFile" />
			</ul>
		</DropZone>
		<button @click.prevent="uploadFiles(files)" class="upload-button">Upload</button>
	</div>
</template>

<script setup>
// Components
import DropZone from './components/DropZone.vue'
import FilePreview from './components/FilePreview.vue'

// File Management
import useFileList from '@/compositions/file-list'
const { files, addFiles, removeFile } = useFileList()

function onInputChange(e) {
	addFiles(e.target.files)
	e.target.value = null // reset so that selecting the same file again will still cause it to fire this change
}

// Uploader
import createUploader from '@/compositions/file-uploader'
const { uploadFiles } = createUploader('YOUR URL HERE')
</script>

<style lang="stylus">
html {
	height: 100%;
	width: 100%;
	background-color: #b6d6f5;

	/* Overlapping Stripes Background, based off https://codepen.io/MinzCode/pen/Exgpqpe */
	--color1: rgba(55, 165, 255, 0.35);
	--color2: rgba(96, 181, 250, 0.35);
	--rotation: 135deg;
	--size: 10px;
	background-blend-mode: multiply;
	background-image: repeating-linear-gradient(
			var(--rotation),
			var(--color1) calc(var(--size) * 0),
			var(--color1) calc(var(--size) * 9),
			var(--color2) calc(var(--size) * 9),
			var(--color2) calc(var(--size) * 12),
			var(--color1) calc(var(--size) * 12)
		),
		repeating-linear-gradient(
			calc(var(--rotation) + 90deg),
			var(--color1) calc(var(--size) * 0),
			var(--color1) calc(var(--size) * 9),
			var(--color2) calc(var(--size) * 9),
			var(--color2) calc(var(--size) * 12),
			var(--color1) calc(var(--size) * 12)
		);
}

body {
	height: 100%;
	margin: 0;
	padding: 0;
}
</style>

<style scoped lang="stylus">
#app {
	font-family: Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	margin: 0 auto;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
}

.drop-area {
	width: 100%;
	max-width: 800px;
	margin: 0 auto;
	padding: 50px;
	background: #ffffff55;
	box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
	transition: .2s ease;

	&[data-active=true] {
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
		background: #ffffffcc;
	}
}

label {
	font-size: 36px;
	cursor: pointer;

	input[type=file] {
		position: absolute;
		visibility: hidden;
		pointer-events: none;
	}

	.smaller {
		font-size: 16px;
	}
}

.image-list {
	display: flex;
	list-style: none;
	flex-wrap: wrap;
	padding: 0;
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

button {
	cursor: pointer;
}
</style>
