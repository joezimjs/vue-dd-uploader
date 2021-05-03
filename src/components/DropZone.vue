<template>
	<div :data-active="active" @dragenter.prevent="setActive" @dragover.prevent="setActive" @dragleave.prevent="setInactive" @drop.prevent="onDrop">
		<slot :dropZoneActive="active"></slot>
	</div>
</template>

<script>
export default {
	name: 'DropZone',
	emits: ['files-dropped'],

	data: () => ({
		active: false,
		inActiveTimeout: null
	}),

	methods: {
		// setActive and setInactive use timeouts, so that when you drag an item over a child element,
		// the dragleave event that is fired won't cause a flicker. A few ms should be plenty of
		// time to wait for the next dragenter event to clear the timeout and set it back to active.
		setActive() {
			this.active = true
			clearTimeout(this.inActiveTimeout)
		},
		setInactive() {
			this.inActiveTimeout = setTimeout(() => {
				this.active = false
			}, 15)
		},

		onDrop(e) {
			this.setInactive()
			this.$emit('files-dropped', [...e.dataTransfer.files])
		},

		preventDefaults(e) {
			e.preventDefault()
		}
	},
	created() {
		;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
			document.body.addEventListener(eventName, this.preventDefaults)
		})
	},
	unounted() {
		;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
			document.body.removeEventListener(eventName, this.preventDefaults)
		})
	}
}
</script>

<style></style>
