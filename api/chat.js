// Proxy serverless (Vercel, Node 18+): inoltra la richiesta del dialogo all'API Anthropic
// con la chiave del server, in streaming. Variabili d'ambiente:
//   ANTHROPIC_API_KEY  (obbligatoria)
//   ACCESS_CODE        (facoltativa: se c'è, la pagina chiede questo codice prima di parlare)
export default async function handler(req, res){
  if(req.method !== "POST"){ res.status(405).end(); return; }
  const key = process.env.ANTHROPIC_API_KEY;
  if(!key){ res.status(500).json({error:{message:"ANTHROPIC_API_KEY mancante sul server"}}); return; }
  const codice = process.env.ACCESS_CODE;
  if(codice && (req.headers["x-codice"] || "") !== codice){ res.status(401).json({error:{message:"codice d'accesso mancante o sbagliato"}}); return; }
  let body = req.body;
  if(typeof body === "string"){ try{ body = JSON.parse(body); }catch(e){ body = null; } }
  if(!body || !Array.isArray(body.messages) || !body.messages.length){ res.status(400).json({error:{message:"corpo non valido"}}); return; }
  const corpo = {};
  for(const k of ["messages","system","thinking","output_config","fallbacks"]) if(k in body) corpo[k] = body[k];
  corpo.model = "claude-opus-5";
  corpo.stream = true;
  corpo.max_tokens = Math.min(Number(body.max_tokens) || 8192, 16000);
  const up = await fetch("https://api.anthropic.com/v1/messages", {
    method:"POST",
    headers:{ "content-type":"application/json", "x-api-key":key, "anthropic-version":"2023-06-01", "anthropic-beta":"server-side-fallback-2026-07-01" },
    body: JSON.stringify(corpo)
  });
  res.status(up.status);
  res.setHeader("content-type", up.headers.get("content-type") || "text/event-stream");
  res.setHeader("cache-control", "no-cache");
  const reader = up.body.getReader();
  while(true){ const {value, done} = await reader.read(); if(done) break; res.write(Buffer.from(value)); }
  res.end();
}
export const config = { maxDuration: 60 };
