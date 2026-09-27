// lib/api/mock/bookmakers.ts

export interface Bookmaker {
  /** Filename stem in /public/bookmakers-optimized — also the stable id. */
  id: string;
  name: string;
  logo: string;
}

function bookmaker(id: string, name: string): Bookmaker {
  return { id, name, logo: `/bookmakers-optimized/${id}.webp` };
}

/** Derived from the logos in /public/bookmakers-optimized. */
export const MOCK_BOOKMAKERS: Bookmaker[] = [
  bookmaker("1win", "1win"),
  bookmaker("1xbet", "1xBet"),
  bookmaker("888sports", "888sport"),
  bookmaker("bcgames", "BC.Game"),
  bookmaker("bet365", "bet365"),
  bookmaker("betano", "Betano"),
  bookmaker("betboom", "BetBoom"),
  bookmaker("betcity", "BetCity"),
  bookmaker("betdaq", "Betdaq"),
  bookmaker("betfair", "Betfair"),
  bookmaker("betforward", "BetForward"),
  bookmaker("betking", "BetKing"),
  bookmaker("betmomo", "BetMomo"),
  bookmaker("betonline", "BetOnline"),
  bookmaker("betpawa", "betPawa"),
  bookmaker("betrebels", "BetRebels"),
  bookmaker("betsafe", "Betsafe"),
  bookmaker("betway", "Betway"),
  bookmaker("betwbg", "BetWBG"),
  bookmaker("bwin", "bwin"),
  bookmaker("cloudbet", "Cloudbet"),
  bookmaker("codere", "Codere"),
  bookmaker("dafabet", "Dafabet"),
  bookmaker("danskespil", "Danske Spil"),
  bookmaker("everygame", "Everygame"),
  bookmaker("favbet", "Favbet"),
  bookmaker("fonbet", "Fonbet"),
  bookmaker("ggbet", "GGBet"),
  bookmaker("interwtten", "Interwetten"),
  bookmaker("konfambet", "KonfamBet"),
  bookmaker("ladbrokes", "Ladbrokes"),
  bookmaker("leonbets", "Leon"),
  bookmaker("ligastavok", "Liga Stavok"),
  bookmaker("livescorebet", "LiveScore Bet"),
  bookmaker("lottomatica", "Lottomatica"),
  bookmaker("marathonbet", "Marathonbet"),
  bookmaker("matchbook", "Matchbook"),
  bookmaker("melbet", "Melbet"),
  bookmaker("mostbet", "Mostbet"),
  bookmaker("msport", "MSport"),
  bookmaker("nairabet", "NairaBet"),
  bookmaker("netbet", "NetBet"),
  bookmaker("olimp", "Olimp"),
  bookmaker("pinnacle", "Pinnacle"),
  bookmaker("polymarket", "Polymarket"),
  bookmaker("sbobet", "SBOBET"),
  bookmaker("smarkets", "Smarkets"),
  bookmaker("snai", "SNAI"),
  bookmaker("sportybet", "SportyBet"),
  bookmaker("surebet247", "Surebet247"),
  bookmaker("tempobet", "Tempobet"),
  bookmaker("tennisi", "Tennisi"),
  bookmaker("unibet", "Unibet"),
  bookmaker("vbet", "VBET"),
  bookmaker("winline", "Winline"),
  bookmaker("zenitbet", "ZenitBet"),
];
