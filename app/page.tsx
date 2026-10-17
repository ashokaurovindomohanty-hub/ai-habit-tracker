"use client"
import { useState } from "react"
export default function Home() {
  const [habits, setHabits] = useState(["Drink Water","Exercise","Read"])
  const [input,setInput]=useState("")
  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white p-10">
      <div className="max-w-xl mx-auto">
        <h1 className="text-5xl font-black text-center tracking-tighter">AI HABIT TRACKER</h1>
        <p className="text-center text-white/60 mt-2 tracking-widest uppercase text-sm">Cinematic Daily Discipline</p>
        <div className="flex gap-2 mt-8">
          <input value={input} onChange={e=>setInput(e.target.value)} placeholder="New habit..." className="flex-1 p-3 rounded-xl bg-white/10 backdrop-blur border border-white/10 outline-none" />
          <button onClick={()=>{if(input){setHabits([...habits,input]); setInput("")}}} className="px-6 py-3 bg-white text-black rounded-xl font-bold">Add</button>
        </div>
        <ul className="mt-8 space-y-3">
          {habits.map(h=>(
            <li key={h} className="p-4 bg-white/5 backdrop-blur rounded-xl border border-white/10 flex justify-between items-center shadow-2xl">
              {h} <input type="checkbox" className="w-5 h-5" />
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}
