import { NextResponse } from "next/server";
let board:any[] = [];
export async function GET(){ return NextResponse.json(board.sort((a,b)=>b.streak-a.streak).slice(0,10)); }
export async function POST(req:Request){ const {name,streak}=await req.json(); board.push({name,streak,at:new Date().toISOString()}); return NextResponse.json({ok:true}); }
