<script>
    import ThemeToggle from "$lib/component/ThemeToggle.svelte";
    import { loadToken, useToken } from "$lib/token.svelte";
    import { onMount } from "svelte";

    let input = $state(''); // Input from the form
    let response = $state(''); // Streaming response content
    let isLoading = $state(false); // Loading state for better UX
    let tokens = $state(0)

    onMount(() => {
        tokens = loadToken()
    })

    // copy to click board
    let copyStatus = $state("")

    async function copyToClipboard() {
        try{
            await navigator.clipboard.writeText(response)
            copyStatus = "Copied!"
        } catch (err){
            copyStatus = "Failed to copy!"
            console.error("Error copying to clipboard: ", err)
        
        }
    } 
  
    async function sendInput(event) {
      event.preventDefault(); // Prevent default form submission
      response = ""; // Clear previous response
      isLoading = true;
  
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ input }),
        });
  
        if (!res.body) {
          throw new Error("No response body received.");
        }
  
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
  
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          response += decoder.decode(value, { stream: true });
        }
        tokens = useToken()
      } catch (err) {
        response = `Error: ${err.message}`;
      } finally {
        isLoading = false;
      }
      
    }

    async function random(event) {
      event.preventDefault(); // Prevent default form submission
      response = ""; // Clear previous response
      isLoading = true;
      let random = 'random tweet'
      console.log(random)
  
      try {
        const res = await fetch("/api/process", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(random),
        });
        console.log(res.body)
        if (!res.body) {
          throw new Error("No response body received.");
        }
  
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
  
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          response += decoder.decode(value, { stream: true });
        }
        token = token -1
      } catch (err) {
        response = `Error: ${err.message}`;
      } finally {
        isLoading = false;
      }
      
    }
   
  </script>
  
  <main>
    <ThemeToggle/>
    <h1>Generate a Tweet <big>.</big></h1>
    <h3>Token Left:  <b>{tokens}</b></h3>
    <form onsubmit={sendInput}>
      <input type="text" placeholder="Give me a topic to tweet about" bind:value={input} />
     
      {#if tokens > 0}
      <button type="submit" disabled={isLoading}>
        {#if isLoading} ⏳ {:else} ⬆️ {/if}
      </button>
      {:else}
        <button disabled>⛔</button>
        <p class="out-token">Out of tokens for today. <br>come back tommorow</p>
      {/if}
      
    </form><br>
    <!-- <button class="random" onclick={random}>Random</button> -->
    {#if response}
        <div>
            <p><b>User:</b> {input}</p><hr>
            <p><b>GroqAI:</b> {response}</p>
            <button onclick={copyToClipboard} class="copy">📰</button>
            {#if copyStatus}
                <p>{copyStatus}</p>
            {/if}
        </div>
    {/if}
  </main>
  
  <style>
    :global(body) {
      margin: 0;
      padding: 0;
    }
    main {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      flex-wrap: wrap;
      height: 90vh;
      gap: 10px;
    }
    form input {
      width: 250px;
      height: 35px;
      border-radius: 4px;
      text-align: center;
      border: none;
      border-top: 1px solid grey;
      border-left: 1px solid grey;
      box-shadow: 3px 8px rgba(0, 0, 0, 0.3);
      margin-right: 10px;
    }
    input:focus {
      outline: none;
      box-shadow: 4px 5px rgba(0, 0, 0, 0.5);
    }
    button {
      width: 55px;
      height: 43px;
      border-radius: 5px;
      border: none;
      box-shadow: 4px 8px rgba(0, 0, 0, 0.3);
    }
    h1 {
      letter-spacing: -2px;
      padding-right: 20px;
    }
    div{
        margin: 0 auto;
        padding: 10px;
        border: 1px solid gray;
        max-width: 500px;
        border-radius: 10px;
        box-shadow: 4px 8px rgba(0, 0, 0, 0.3);
    }
    .out-token{
        color: rgb(253, 10, 10);
        font-weight: bolder;
        text-align: center;
        letter-spacing: 1px;
    }
    .copy{
        background-color: rgb(4, 141, 141);

    }
    .random{
        width: 70px;
        border: 1px orangered solid;
        background-color: #fff;
        color: #000;
        font-weight: bolder;
    }
  </style>
  