<script lang="ts">
	function handleClick() {
		console.log('hello svelte-kit');
	}
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>
<button type="button" onclick={handleClick}>打印 hello svelte-kit</button>
