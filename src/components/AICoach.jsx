import { useState } from 'react'
import { metaAI } from '../lib/metaAI'
export default function AICoach() {
  const [msg, setMsg] = useState("")
  const [chat, setChat] = useState([])
  const [loading, setLoading] = useState(false)
  async function send() {
    if(!msg) return
    setLoading(true)
    const newChat = [...chat, {role:"user", content: msg}]
    setChat(newChat)
    setMsg("")
    try {
      const res = await metaAI.chat.completions.create({
        model: "llama-3.3-70b",
        messages: [
          {role:"system", content:"You are a friendly habit coach. Keep replies short and motivating."},
          ...newChat
        ]
      })
      setChat([...newChat, {role:"assistant", content: res.choices[0].message.content}])
    } catch(e) {
      setChat([...newChat, {role:"assistant", content:"Error: check API key - " + e.message}])
    }
    setLoading(false)
  }
  return (
    <div style={{border:"1px solid #333", padding:16, borderRadius:12}}>
      <h3>AI Coach</h3>
      <div style={{minHeight:120, margin:"12px 0"}}>
        {chat.map((c,i)=><p key={i}><b>{c.role}:</b> {c.content}</p>)}
        {loading && <p>thinking...</p>}
      </div>
      <input value={msg} onChange={e=>setMsg(e.target.value)} placeholder="Ask about your habits..." style={{width:"70%"}} />
      <button onClick={send} disabled={loading}>Send</button>
    </div>
  )
}
