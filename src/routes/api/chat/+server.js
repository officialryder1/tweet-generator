import Groq from "groq-sdk";
import { GROQ_API_KEY } from "$env/static/private";

const groq = new Groq({apiKey: GROQ_API_KEY})


export async function POST({ request}) {
    try{
        const {input} = await request.json()

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: `generate a tweet with topic about ${input}`
                },
            ],
            model: "llama3-8b-8192",
            stream: true,
        });

        // const output = `You entered: ${input}`

        return new Response(
            new ReadableStream({
                async start(controller){
                    try{
                        for await(const chunk of completion){
                            const content = chunk.choices[0]?.delta?.content || ""
                            controller.enqueue(new TextEncoder().encode(content))
                        }
                        controller.close()
                    }catch(error){
                        controller.error(error)
                    }
                }
            }),
            {
                headers: {
                    "Content-Type": "text/plain; charset=utf-8",
                    "Cache-Control": "no-cache"
                }
            }
        )
    }
    catch(error){
        return new Response(
            JSON.stringify({
                success:false, error: error.message
            }),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application'
                }
            }
        )
    }
}