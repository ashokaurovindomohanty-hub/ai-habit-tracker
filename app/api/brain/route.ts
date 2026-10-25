import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  const { habits } = await req.json();
  // Invisible AI: find patterns
  const insights = habits.map((h:any) => {
    const perkActive = h.perkUntil && new Date(h.perkUntil) > new Date();
    return {
      id: h.id,
      risk: h.streak > 0 && !h.doneToday ? "high break risk" : "stable",
      vault: perkActive ? "VAULT UNLOCKED - 7 day power" : ` ${ (h.goalDays||7)-h.streak } days to Vault`,
      pattern: h.streak >= 3 ? "momentum building" : "needs consistency"
    };
  });
  return NextResponse.json({ insights });
}
