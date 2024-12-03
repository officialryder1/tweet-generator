<script>
    import '../style.css'
    import '@fontsource/poppins';
    let { children } = $props();
</script>

{@render children()}

<style>
    :global(body){
        font-family: 'Poppins', sans-serif;
    }
    
</style>