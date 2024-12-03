<script>
    import { theme } from "$lib/theme";

    let currentTheme = $state('')

    if(typeof window !== 'undefined'){
        theme.subscribe((value) => (currentTheme = value))
    }

    function toggleTheme(){
        theme.set(currentTheme === 'light' ? 'dark' : 'light')
    }
</script>

<button onclick={toggleTheme}>
    {#if currentTheme === 'light'}
        🌙 Switch to Dark Mode
    {:else}
        ☀️ Switch to Light Mode
    {/if}
</button>

<style>
    button{
        border: none;
        height: 35px;
        border-radius: 5px;
        font-weight: 700;
    }
</style>