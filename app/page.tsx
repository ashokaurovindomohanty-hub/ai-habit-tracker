"use client"
import { useState, useEffect } from "react"
export default function Home(){
  const [habits,setHabits]=useState([
    {id:1, name:"Drink Water", done:false},
    {id:2, name:"Exercise", done:false},
    {id:3, name:"Read", done:false}
  ])
  const [streak, setStreak] = useState(0)
  const [input,setInput]=useState("")
// streak freeze - allows 1 miss
let freezeUsed = false;
function checkFreeze(streak) {
  if (streak > 0 && !freezeUsed) return true;
  return false;
}
const showReward = streak === 7 || streak === 30;
// 7-day reward animation
  useEffect(() => {
    if(habits.length > 0 && habits.every(h => h.done)) setStreak(s => s+1)
  }, [habits])
return(
<main className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white p-10">
<div className="max-w-xl mx-auto">
<div className="text-center text-amber-400 font-bold">🔥 Streak: {streak} days</div>
<div className="text-center py-10 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl">
<h1 className="text-5xl font-black">AI HABIT TRACKER</h1>
<p className="text-white/70 mt-2 tracking-widest text-sm">CINEMATIC DISCIPLINE</p>
</div>
<div className="flex gap-2 mt-8">
<input value={input} onChange={e=>setInput(e.target.value)} placeholder="New habit..." className="flex-1 p-3 rounded-xl bg-white/10 border border-white/10 outline-none" />
<button onClick={()=>{if(input){setHabits([...habits,{id:Date.now(), name:input, done:false}]);setInput("")}}} className="px-6 py-3 bg-white text-black rounded-xl font-bold">Add</button>
</div>
<ul className="mt-6 space-y-2">
{habits.map(h=> (
<li key={h.id} className="flex justify-between p-3 bg-white/10 rounded-xl">
<span>{h.name}</span>
<input type="checkbox" checked={h.done} onChange={()=> setHabits(a=> a.map(x=> x.id===h.id ? {...x, done:!x.done}:x))} />
</li>
))}
{showReward && <div className="animate-bounce text-yellow-400">🔥 Legendary Streak!</div>}
</ul>
</div>
</main>
)
}
