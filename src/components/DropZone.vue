<template>
	<div :data-active="active" @dragenter.prevent="setActive" @dragover.prevent="setActive" @dragleave.prevent="setInactive" @drop.prevent="onDrop">
		<slot :dropZoneActive="active"></slot>
	</div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
const emit = defineEmits(['files-dropped'])

let active = ref(false)
let inActiveTimeout = ref(null)

// setActive and setInactive use timeouts, so that when you drag an item over a child element,
// the dragleave event that is fired won't cause a flicker. A few ms should be plenty of
// time to wait for the next dragenter event to clear the timeout and set it back to active.
function setActive() {
	active.value = true
	clearTimeout(inActiveTimeout.value)
}
function setInactive() {
	inActiveTimeout.value = setTimeout(() => {
		active.value = false
	}, 15)
}

function onDrop(e) {
	setInactive()
	emit('files-dropped', [...e.dataTransfer.files])
}

function preventDefaults(e) {
	e.preventDefault()
}

onMounted(() => {
	['dragenter', 'dragover', 'dragleave', 'drop'].forEach((eventName) => {
		document.body.addEventListener(eventName, preventDefaults)
	})
})

onUnmounted(() => {
	['dragenter', 'dragover', 'dragleave', 'drop'].forEach((eventName) => {
		document.body.removeEventListener(eventName, preventDefaults)
	})
})
</script>