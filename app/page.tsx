"use client";
import { useState, useEffect } from "react";
type Habit = { id: string; name: string; streak: number; goalDays: number; lastCompleted: string | null; perkUntil: string | null; doneToday?: boolean }
export default function Page() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [name, setName] = useState("");
useEffect(() => {
  const saved = localStorage.getItem("habits");
  if (saved) setHabits(JSON.parse(saved));
  if (Notification && Notification.permission !== "granted") {
    Notification.requestPermission();
  }
  const check = setInterval(() => {
    const now = new Date();
    if (now.getHours() === 9 && now.getMinutes() === 0) {
      new Notification("🔥 AI Habit Tracker", { body: "Time to complete your habits!" });
    }
  }, 60000);
  return () => clearInterval(check);
}, []);
useEffect(() => {
  localStorage.setItem("habits", JSON.stringify(habits));
}, [habits]);
const [insights, setInsights] = useState<any[]>([]);
useEffect(() => {
  if (habits.length === 0) return;
  fetch("/api/brain", { method: "POST", body: JSON.stringify({ habits }) })
    .then(r=>r.json()).then(d=> setInsights(d.insights));
}, [habits]);
const [board, setBoard] = useState<any[]>([]);
useEffect(()=>{ fetch("/api/leaderboard").then(r=>r.json()).then(setBoard); },[]);
const toggleHabit = (id: string) => {
  const h = habits.find(x=>x.id===id);
  if (h && !h.doneToday) {
    const el = document.createElement("div");
    el.textContent = "🎉";
    el.className = "fixed top-1/2 left-1/2 text-6xl animate-ping";
    document.body.appendChild(el);
    setTimeout(()=> el.remove(), 800);
  }
  setHabits(habits.map(h => {
    if (h.id !== id) return h;
    const doneToday = !h.doneToday;
    let streak = h.streak;
    let perkUntil = h.perkUntil;
    let lastCompleted = h.lastCompleted;
if (doneToday) {
  streak = h.streak + 1;
  lastCompleted = new Date().toISOString().split('T')[0];
  const bonus = streak % 7 === 0 ? 50 : 10;
  setTimeout(() => alert(`🔥 +${bonus} Vault Points! Streak ${streak}${streak % 7 === 0 ? ' 🏆 Vault Unlocked!' : ''}`), 100);
  if (streak >= (h.goalDays || 7)) {
    const d = new Date(); d.setDate(d.getDate() + 7);
    perkUntil = d.toISOString();
  }
} else {
  streak = Math.max(0, h.streak - 1);
}
    return { ...h, doneToday, streak, 
    perkUntil, lastCompleted };
  }));
};
const addHabit = () => {
  if (!name.trim()) return;
  setHabits([...habits, { id: Date.now().toString(), name, streak: 0, goalDays: 7, lastCompleted: null, perkUntil: null, doneToday: false }]);
  setName("");
};
const deleteHabit = (id: string) => {
  setHabits(habits.filter(h => h.id !== id));
};
const totalStreak = habits.reduce((sum, h) => sum + h.streak, 0);
  return (
<main className="min-h-screen text-white p-6 bg-gradient-to-br from-[#0a0a1a] via-[#1a1033] to-[#2a0a2a] flex flex-col items-center">
<header className="flex justify-between items-center w-full max-w-5xl mx-auto px-6 py-4">
<div className="w-full max-w-5xl mx-auto">
  <h1 className="text-4xl font-black bg-gradient-to-r from-purple-300 via-pink-300 to-purple-400 bg-clip-text text-transparent">AI HABIT TRACKER</h1>
  <div className="flex gap-2">
    <button onClick={()=>{const b=new Blob([JSON.stringify(habits,null,2)],{type:"application/json"});const u=URL.createObjectURL(b);Object.assign(document.createElement("a"),{href:u,download:"habits.json"}).click();}} className="px-3 py-1 bg-white/10 border border-white/20 rounded-lg text-sm">⬇ Export</button>
    <button onClick={()=>navigator.share?.({title:"My Streak",text:`🔥 ${totalStreak} day streak ${location.href}`})} className="px-3 py-1 bg-white text-black rounded-full text-sm font-bold">Share Streak</button>
  </div>
</header>
{/* Rewards Shop */}
<div className="p-4 rounded-xl bg-black/40 border border-yellow-500/20">
  <h3 className="text-yellow-400 font-bold mb-2">🎁 Rewards Shop</h3>
  <p className="text-sm text-gray-400 mb-3">Spend Vault: {totalStreak*10} Points</p>
  <button onClick={()=>alert('🎉 Reward claimed!')} className="px-4 py-2 bg-yellow-500 text-black rounded font-bold disabled:opacity-50" disabled={totalStreak*10<50}>Claim - 50 Points</button>
</div>
<p className="text-center text-purple-300 mb-2">CINEMATIC DISCIPLINE</p>
<div className="text-center text-3xl font-bold mb-6 bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">🔥 Streak: {totalStreak} days</div>
<div className="max-w-xl mx-auto flex gap-2 mb-4">
  <input value={name} onChange={e=>setName(e.target.value)} placeholder="Add habit..." className="flex-1 px-4 py-2 rounded bg-white/10 border border-white/20" />
  <button onClick={addHabit} className="px-6 py-2 bg-purple-600 rounded font-bold hover:bg-purple-700">Add</button>
</div>
<div className="max-w-xl mx-auto flex gap-2 mb-8 justify-center">
  {["💧 Drink Water","💪 Exercise","📚 Read"].map(n=>(
    <button key={n} onClick={()=>setName(n.replace(/^[^\s]+\s/,""))} className="px-3 py-1 bg-white/10 rounded-full text-sm border border-white/20 hover:bg-white/20">{n}</button>
  ))}
</div>
<div className="max-w-xl mx-auto space-y-3">
{habits.map(h=>(
  <div key={h.id} className="flex items-center justify-between p-4 bg-white/10 rounded-xl border border-purple-400/20 backdrop-blur">
    <div>
      <p className="font-semibold">{h.name}</p>
      <p className="text-sm text-white/60">Streak: {h.streak} 🔥</p>
    </div>
    <div className="flex gap-2">
      <button onClick={()=>toggleHabit(h.id)} className={`px-4 py-1 rounded font-bold ${h.doneToday?'bg-green-600':'bg-white/20 hover:bg-white/30'}`}>{h.doneToday?'Done':'Do'}</button>
      <button onClick={()=>deleteHabit(h.id)} className="text-red-400 px-2 hover:text-red-300">×</button>
    </div>
  </div>
))}
</div>
<div className="max-w-xl mx-auto mt-6 p-4 bg-purple-500/10 rounded-xl border border-purple-400/20 text-center">
  AI Insight: {habits.length===0 ? "Add your first habit to begin your legend." : `You have ${habits.filter(h=>h.doneToday).length}/${habits.length} done today. Keep forging!`}
</div>
<div className="max-w-xl mx-auto mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
  <h3 className="font-bold mb-2">Weekly Forecast</h3>
  <div className="flex gap-2">
    {habits.length===0 ? <p className="text-white/60 text-sm">Complete habits to see forecast</p> : habits.map(h=>{
      const rate = Math.round((habits.filter(x=>x.doneToday).length/habits.length)*100);
      return <div key={h.id} className="flex-1 text-center"><div className="text-2xl font-bold text-purple-400">{rate}%</div><div className="text-xs text-white/60 truncate">{h.name}</div></div>
    })}
  </div>
  <p className="text-xs text-center text-white/40 mt-2">AI Prediction: Keep 3-day streak to reach 90% mastery</p>
</div>
{habits.some(h=> h.perkUntil && new Date(h.perkUntil) > new Date()) && (
  <div className="max-w-xl mx-auto mt-4 p-3 bg-gradient-to-r from-yellow-400 to-amber-600 rounded-xl text-black font-bold text-center shadow-lg">
    👑 VAULT THEME UNLOCKED
  </div>
)}
</div>
</main>
);
}
