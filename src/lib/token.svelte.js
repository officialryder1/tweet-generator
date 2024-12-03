let tokens = $state(10)
const maxToken = 10
const keyTokens = $state("tweet_token")
const keyLastUsed = $state("last_used_date")


export function loadToken(){
    const lastUsedDate = localStorage.getItem(keyLastUsed)
    const today = new Date().toDateString()

    if (lastUsedDate !== today){
        tokens = maxToken;
        localStorage.setItem(keyLastUsed, today)
        return tokens
    } else {
        const storedTokens = parseInt(localStorage.getItem(keyTokens), 10)
        tokens = isNaN(storedTokens) ? maxToken : storedTokens

        return tokens
    }
}

export function useToken(){
    if(tokens > 0){
        tokens--
        localStorage.setItem(keyTokens, tokens)
        return tokens
    }
}