import { useState, useRef, useEffect } from "react";
import { Plus, X, ChevronDown, ChevronUp, Download, FileText, Loader2, RotateCcw, Lock, Check, Scale, FileEdit, Zap } from "lucide-react";

/* ============================================================
   FONTS
   ============================================================ */
const PLEX_SERIF = '"IBM Plex Serif", "Palatino Linotype", Georgia, serif';
const PLEX_SANS  = '"IBM Plex Sans", "Helvetica Neue", Arial, sans-serif';
const GARAMOND   = '"EB Garamond", "Garamond", Georgia, "Times New Roman", serif';
const LIBRE_B    = '"Libre Baskerville", Georgia, Cambria, serif';
const PLAYFAIR   = '"Playfair Display", Georgia, "Times New Roman", serif';
const CORMORANT  = '"Cormorant Garamond", Georgia, "Times New Roman", serif';
const INTER      = '"Inter", "Helvetica Neue", Arial, sans-serif';
const DM_SANS    = '"DM Sans", "Helvetica Neue", Arial, sans-serif';

/* ============================================================
   HELPERS
   ============================================================ */
const h2r = (hex, a) => {
  const h=(hex||"#000").replace("#","");
  const r=parseInt(h.slice(0,2),16),g=parseInt(h.slice(2,4),16),b=parseInt(h.slice(4,6),16);
  return `rgba(${r},${g},${b},${a})`;
};
const hexToRtf = hex => { const h=(hex||"#000").replace("#",""); return {r:parseInt(h.slice(0,2),16),g:parseInt(h.slice(2,4),16),b:parseInt(h.slice(4,6),16)}; };
const esc = s => { if(s==null)return""; return String(s).replace(/\\/g,"\\\\").replace(/\{/g,"\\{").replace(/\}/g,"\\}").replace(/[\u0080-\uFFFF]/g,c=>`\\u${c.charCodeAt(0)}?`).replace(/\n/g,"\\line "); };
const dlBlob = (blob,fn) => { const u=URL.createObjectURL(blob); const a=document.createElement("a"); a.href=u; a.download=fn; a.style.display="none"; document.body.appendChild(a); a.click(); setTimeout(()=>{a.parentNode?.removeChild(a);URL.revokeObjectURL(u);},1500); };

/* ============================================================
   DATA
   ============================================================ */
const EMPTY = {
  name:"",
  contact:{ email:"", phone:"", location:"", linkedin:"", website:"" },
  summary:"",
  admissions:[],
  education:[],
  experience:[],
  transactions:[],
  practiceAreas:[],
  publications:[],
  memberships:[],
  awards:[],
};

const SAMPLE = {
  name:"Victoria Chen",
  contact:{ email:"victoria.chen@claytonutz.com", phone:"+61 2 9353 4000", location:"Sydney, NSW", linkedin:"linkedin.com/in/victoriachenlaw", website:"" },
  summary:"Senior corporate lawyer with 7 years' experience advising ASX-listed companies, private equity sponsors and major financial institutions on complex M&A transactions, private equity deals, and joint ventures across Australia and the Asia-Pacific region.",
  admissions:[
    { qualification:"Admitted as a Solicitor", authority:"Supreme Court of New South Wales", date:"2018" },
    { qualification:"Admitted as a Barrister and Solicitor", authority:"High Court of Australia", date:"2018" },
  ],
  education:[
    { degree:"Juris Doctor (First Class Honours)", institution:"University of Sydney Law School", location:"Sydney, NSW", date:"2017", notes:"Chancellor's Prize for Academic Excellence · Top of graduating cohort" },
    { degree:"Bachelor of Commerce (Finance & Accounting)", institution:"University of Sydney", location:"Sydney, NSW", date:"2015", notes:"University Medal · Dean's List (2013, 2014, 2015)" },
  ],
  experience:[
    { title:"Senior Associate — Mergers & Acquisitions", firm:"Clayton Utz", location:"Sydney, NSW", start:"Jan 2022", end:"Present",
      bullets:[
        "Advises ASX-listed companies, private equity sponsors and major financial institutions on domestic and cross-border M&A transactions, private equity buyouts, and joint ventures.",
        "Led a team of 6 lawyers on the $2.4B acquisition of a listed Australian infrastructure company, managing due diligence, transaction documentation and regulatory approvals.",
        "Recognised in Doyle's Guide as a Leading Lawyer in Corporate M&A (2023, 2024) and in Best Lawyers Australia (2024).",
        "Supervises and mentors 4 junior associates and graduate lawyers across the M&A practice group.",
      ]},
    { title:"Associate — Corporate", firm:"Clayton Utz", location:"Sydney, NSW", start:"Feb 2019", end:"Dec 2021",
      bullets:[
        "Advised on M&A transactions, private equity deals, and joint ventures across energy, infrastructure, and financial services sectors.",
        "Key role on the $1.8B Macquarie Capital buy-side mandate, coordinating a cross-jurisdictional team across Australia, Singapore, and Hong Kong.",
        "Drafted and negotiated transaction documents including SPAs, SHA, management agreements, and regulatory submissions.",
      ]},
    { title:"Graduate Lawyer", firm:"King & Wood Mallesons", location:"Sydney, NSW", start:"Feb 2018", end:"Jan 2019",
      bullets:[
        "Rotated through M&A, Banking & Finance, and Capital Markets practice groups.",
        "Assisted in a $450M ASX IPO including drafting prospectus sections and coordinating with ASIC.",
      ]},
  ],
  transactions:[
    { name:"$2.4B acquisition of listed Australian infrastructure company", role:"Lead associate — acted for acquirer; managed full due diligence and regulatory approval process." },
    { name:"$1.8B Macquarie Capital buy-side mandate", role:"Key associate — cross-border deal across Australia, Singapore, and Hong Kong." },
    { name:"$650M private equity buyout in the healthcare sector", role:"Associate — led vendor due diligence and advised on management equity arrangements." },
    { name:"$450M ASX IPO — financial services company", role:"Junior associate — prospectus drafting and ASIC coordination." },
  ],
  practiceAreas:["Mergers & Acquisitions","Private Equity","Joint Ventures","Corporate Governance","Capital Markets","Due Diligence","Regulatory Approvals","Cross-Border Transactions"],
  publications:[
    { title:"ESG Considerations in Australian M&A: Emerging Obligations for Acquirers", publication:"Australian Law Journal", date:"2024" },
    { title:"Private Equity in Australia: Market Trends and Deal Structuring", publication:"Journal of Corporate Law Studies", date:"2022" },
  ],
  memberships:[
    "Law Society of New South Wales — Member",
    "Women in Law Australia — Committee Member (2021–present)",
    "Australian Private Equity & Venture Capital Association (AVCAL) — Associate Member",
  ],
  awards:[
    "Doyle's Guide — Leading Lawyer, Corporate M&A (2023, 2024)",
    "Best Lawyers Australia — Corporate Law (2024)",
    "Clayton Utz Pro Bono Achievement Award (2022)",
  ],
};

/* ============================================================
   COVER LETTER DATA
   ============================================================ */
const EMPTY_CL = {
  senderName:"", senderTitle:"", senderEmail:"", senderPhone:"", senderLocation:"", senderLinkedin:"",
  recipientName:"", recipientTitle:"", company:"", companyAddress:"", date:"",
  opening:"", body1:"", body2:"", body3:"", closing:"",
};

const SAMPLE_CL = {
  senderName:"Victoria Chen",
  senderTitle:"Senior Associate — Mergers & Acquisitions",
  senderEmail:"victoria.chen@claytonutz.com",
  senderPhone:"+61 2 9353 4000",
  senderLocation:"Sydney, NSW",
  senderLinkedin:"linkedin.com/in/victoriachenlaw",
  recipientName:"James Morrison",
  recipientTitle:"Partner — Mergers & Acquisitions",
  company:"Herbert Smith Freehills",
  companyAddress:"ANZ Tower, 161 Castlereagh St, Sydney NSW 2000",
  date:"June 15, 2026",
  opening:"Seven years of M&A practice teaches you quickly that the difference between a good deal and a great one rarely comes down to price — it comes down to the quality of advice. Herbert Smith Freehills' reputation for delivering exactly that kind of advice, across some of the most complex cross-border transactions in the Asia-Pacific, is what draws me to this opportunity.",
  body1:"At Clayton Utz I have built a practice that spans domestic and cross-border M&A, private equity, and joint ventures, advising ASX-listed companies and major financial institutions on transactions including a $2.4B infrastructure acquisition and a $1.8B Macquarie Capital buy-side mandate. I have led teams, managed regulatory approval processes, and been recognised in both Doyle's Guide and Best Lawyers Australia for the quality of that work. I am now looking for a platform that will allow me to take the next step in my career.",
  body2:"What appeals to me about Herbert Smith Freehills specifically is the depth and breadth of your M&A practice — your track record across energy, infrastructure, and financial services mirrors the sectors where I have built my expertise. I am also drawn to your firm's commitment to developing its people, and the opportunity to work alongside and learn from a partner group of your calibre.",
  body3:"I would welcome the opportunity to speak with you about how my experience and practice might fit within your team. I am happy to provide any further information, work samples, or references at your request.",
  closing:"Thank you for your time and consideration.",
};
const TEMPLATES = [
  { id:"chambers",   label:"Chambers",   blurb:"Classical BigLaw: centred serif name, double gold rule.",       accent:"#0D1B2A", accent2:"#B8963E", layout:"chambers",   nameFont:PLAYFAIR,  bodyFont:GARAMOND,  swatch:["#0D1B2A","#B8963E"] },
  { id:"meridian",   label:"Meridian",   blurb:"Investment banking: dark header, gold accent, two-column.",     accent:"#0D1B2A", accent2:"#B8963E", layout:"meridian",   nameFont:PLEX_SANS, bodyFont:PLEX_SANS, swatch:["#0D1B2A","#C4A35A"] },
  { id:"counsel",    label:"Counsel",    blurb:"Mid-level legal: thin left accent, practice area chips.",        accent:"#1B3A5C", accent2:null,       layout:"counsel",    nameFont:CORMORANT, bodyFont:INTER,     swatch:["#1B3A5C","#E8EEF5"] },
  { id:"analyst",    label:"Analyst",    blurb:"Finance/consulting: clean modern, metrics-forward.",            accent:"#111827", accent2:null,       layout:"analyst",    nameFont:PLEX_SANS, bodyFont:PLEX_SANS, swatch:["#111827","#F3F4F6"] },
  { id:"partner",    label:"Partner",    blurb:"Senior/partner-track: full dark header, gold name, editorial.", accent:"#0A0A14", accent2:"#C9A84C", layout:"partner",    nameFont:PLAYFAIR,  bodyFont:LIBRE_B,   swatch:["#0A0A14","#C9A84C"] },
  { id:"compliance", label:"Compliance", blurb:"ATS-safe: single column, zero graphics, maximum compatibility.", accent:"#1B3A5C", accent2:null,       layout:"compliance", nameFont:PLEX_SANS, bodyFont:PLEX_SANS, swatch:["#1B3A5C","#EEF2F7"] },
];

const ACCENT_PRESETS = [
  "#0D1B2A","#1B3A5C","#0A0A14","#2C1810","#1A3A1A","#4A1942","#B8963E","#8B6914","#2C3E50","#1A1A1A"
];

/* ============================================================
   SHARED RESUME COMPONENTS
   ============================================================ */
function SecTitle({ children, accent, gold, bodyFont, style={} }) {
  return (
    <div style={{ marginTop:"0.18in", marginBottom:"0.08in", paddingBottom:"0.04in", borderBottom:`1px solid ${h2r(accent,0.25)}`, display:"flex", alignItems:"center", gap:"0.1in", breakAfter:"avoid", pageBreakAfter:"avoid", ...style }}>
      {gold && <div style={{ width:"0.25in", height:"1.5px", background:gold, flexShrink:0 }} />}
      <div style={{ fontFamily:bodyFont, fontSize:"8.5pt", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.18em", color:accent }}>{children}</div>
    </div>
  );
}

function ExpBlock({ exp, accent, bodyFont, i, total }) {
  return (
    <div style={{ marginBottom:i===total-1?"0":"0.14in", breakInside:"avoid", pageBreakInside:"avoid" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", gap:"0.2in" }}>
        <div style={{ fontFamily:bodyFont, fontWeight:700, fontSize:"10.5pt", color:"#111" }}>
          {exp.title}
          {exp.firm&&<span style={{ fontWeight:400, color:"#555" }}>, {exp.firm}</span>}
          {exp.location&&<span style={{ fontWeight:400, color:"#777", fontSize:"9.5pt" }}> ({exp.location})</span>}
        </div>
        <div style={{ fontFamily:bodyFont, fontSize:"9pt", color:"#666", whiteSpace:"nowrap", flexShrink:0 }}>{[exp.start,exp.end].filter(Boolean).join(" – ")}</div>
      </div>
      {(exp.bullets||[]).length>0&&<ul style={{ margin:"0.04in 0 0", paddingLeft:"0.2in" }}>{exp.bullets.map((b,j)=><li key={j} style={{ fontFamily:bodyFont, fontSize:"9.5pt", color:"#222", marginBottom:"0.025in", lineHeight:1.6, breakInside:"avoid", pageBreakInside:"avoid" }}>{b}</li>)}</ul>}
    </div>
  );
}

function EduBlock({ ed, accent, bodyFont }) {
  return (
    <div style={{ marginBottom:"0.1in", breakInside:"avoid", pageBreakInside:"avoid" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", gap:"0.2in" }}>
        <div style={{ fontFamily:bodyFont, fontWeight:700, fontSize:"10.5pt", color:"#111" }}>{ed.degree}</div>
        <div style={{ fontFamily:bodyFont, fontSize:"9pt", color:"#666", whiteSpace:"nowrap", flexShrink:0 }}>{ed.date}</div>
      </div>
      <div style={{ fontFamily:bodyFont, fontSize:"10pt", color:accent, fontWeight:500 }}>{ed.institution}{ed.location&&<span style={{ fontWeight:400, color:"#777" }}>, {ed.location}</span>}</div>
      {ed.notes&&<div style={{ fontFamily:bodyFont, fontSize:"9pt", color:"#666", fontStyle:"italic", marginTop:"0.02in" }}>{ed.notes}</div>}
    </div>
  );
}

function PracticeChips({ areas, accent, bodyFont, gold }) {
  if(!areas?.length) return null;
  return (
    <div style={{ display:"flex", flexWrap:"wrap", gap:"0.05in" }}>
      {areas.map((a,i)=>(
        <span key={i} style={{ fontFamily:bodyFont, fontSize:"8pt", background:h2r(accent,0.07), color:accent, padding:"0.025in 0.1in", border:`1px solid ${h2r(accent,0.2)}`, fontWeight:600 }}>{a}</span>
      ))}
    </div>
  );
}

/* ============================================================
   LAYOUT: CHAMBERS (classical BigLaw, centred serif)
   ============================================================ */
function LayoutChambers({ data, accent, accent2, nameFont, bodyFont }) {
  const gold = accent2||"#B8963E";
  const ci = [data.contact?.email,data.contact?.phone,data.contact?.location,data.contact?.linkedin].filter(Boolean);
  return (
    <div style={{ width:"8.5in", background:"#FEFDFB", fontFamily:bodyFont, boxSizing:"border-box", boxShadow:"0 12px 40px -10px rgba(0,0,0,0.2)" }}>
      <div style={{ padding:"0.6in 0.85in 0.3in", boxSizing:"border-box", textAlign:"center" }}>
        <h1 style={{ fontFamily:nameFont, fontSize:"30pt", fontWeight:400, color:"#0D1B2A", margin:0, lineHeight:1.15, letterSpacing:"0.04em" }}>{data.name||"Your Name"}</h1>
        {data.contact?.location&&<div style={{ fontFamily:bodyFont, fontSize:"10pt", color:"#666", marginTop:"0.06in", fontStyle:"italic" }}>{data.contact.location}</div>}
        {ci.length>0&&<div style={{ fontFamily:bodyFont, fontSize:"8.5pt", color:"#555", marginTop:"0.09in", letterSpacing:"0.02em" }}>{ci.join("  ·  ")}</div>}
        <div style={{ margin:"0.18in auto 0.06in", display:"flex", flexDirection:"column", alignItems:"center", gap:"3px" }}>
          <div style={{ width:"2.5in", height:"2px", background:accent }} />
          <div style={{ width:"2.5in", height:"1px", background:gold }} />
        </div>
      </div>
      <div style={{ padding:"0.1in 0.85in 0.6in", boxSizing:"border-box" }}>
        {data.summary&&<div style={{ fontFamily:bodyFont, fontSize:"10pt", color:"#333", lineHeight:1.7, marginBottom:"0.15in", textAlign:"justify", fontStyle:"italic", borderLeft:`3px solid ${gold}`, paddingLeft:"0.15in" }}>{data.summary}</div>}
        {data.admissions?.length>0&&<><SecTitle accent={accent} gold={gold} bodyFont={bodyFont}>Admissions &amp; Qualifications</SecTitle>{data.admissions.map((a,i)=><div key={i} style={{ display:"flex", justifyContent:"space-between", fontFamily:bodyFont, fontSize:"9.5pt", color:"#333", marginBottom:"0.05in", breakInside:"avoid", pageBreakInside:"avoid" }}><span><span style={{ fontWeight:600 }}>{a.qualification}</span>{a.authority&&` — ${a.authority}`}</span><span style={{ color:"#777", flexShrink:0 }}>{a.date}</span></div>)}</>}
        {data.education?.length>0&&<><SecTitle accent={accent} gold={gold} bodyFont={bodyFont}>Education</SecTitle>{data.education.map((ed,i)=><EduBlock key={i} ed={ed} accent={accent} bodyFont={bodyFont}/>)}</>}
        {data.experience?.length>0&&<><SecTitle accent={accent} gold={gold} bodyFont={bodyFont}>Professional Experience</SecTitle>{data.experience.map((exp,i)=><ExpBlock key={i} exp={exp} accent={accent} bodyFont={bodyFont} i={i} total={data.experience.length}/>)}</>}
        {data.transactions?.length>0&&<><SecTitle accent={accent} gold={gold} bodyFont={bodyFont}>Selected Transactions &amp; Matters</SecTitle>{data.transactions.map((t,i)=><div key={i} style={{ marginBottom:"0.09in", breakInside:"avoid", pageBreakInside:"avoid" }}><div style={{ fontFamily:bodyFont, fontSize:"9.5pt", fontWeight:700, color:"#111" }}>{t.name}</div>{t.role&&<div style={{ fontFamily:bodyFont, fontSize:"9pt", color:"#555", fontStyle:"italic" }}>{t.role}</div>}</div>)}</>}
        {data.practiceAreas?.length>0&&<><SecTitle accent={accent} gold={gold} bodyFont={bodyFont}>Practice Areas</SecTitle><PracticeChips areas={data.practiceAreas} accent={accent} bodyFont={bodyFont} gold={gold}/></>}
        {data.publications?.length>0&&<><SecTitle accent={accent} gold={gold} bodyFont={bodyFont}>Publications</SecTitle>{data.publications.map((p,i)=><div key={i} style={{ fontFamily:bodyFont, fontSize:"9.5pt", color:"#333", marginBottom:"0.07in", breakInside:"avoid", pageBreakInside:"avoid" }}><span style={{ fontStyle:"italic" }}>"{p.title}"</span>{p.publication&&<span>, {p.publication}</span>}{p.date&&<span style={{ color:"#777" }}> ({p.date})</span>}</div>)}</>}
        {data.memberships?.length>0&&<><SecTitle accent={accent} gold={gold} bodyFont={bodyFont}>Professional Memberships</SecTitle>{data.memberships.map((m,i)=><div key={i} style={{ fontFamily:bodyFont, fontSize:"9.5pt", color:"#333", marginBottom:"0.04in", breakInside:"avoid", pageBreakInside:"avoid" }}>{m}</div>)}</>}
        {data.awards?.length>0&&<><SecTitle accent={accent} gold={gold} bodyFont={bodyFont}>Awards &amp; Recognition</SecTitle>{data.awards.map((a,i)=><div key={i} style={{ fontFamily:bodyFont, fontSize:"9.5pt", color:"#333", marginBottom:"0.04in", breakInside:"avoid", pageBreakInside:"avoid" }}>{a}</div>)}</>}
      </div>
    </div>
  );
}

/* ============================================================
   LAYOUT: MERIDIAN (investment banking, dark header, two-col)
   ============================================================ */
function LayoutMeridian({ data, accent, accent2, nameFont, bodyFont }) {
  const gold = accent2||"#B8963E";
  const ci = [data.contact?.email,data.contact?.phone,data.contact?.location,data.contact?.linkedin].filter(Boolean);
  return (
    <div style={{ width:"8.5in", background:"#FAFAFA", fontFamily:bodyFont, boxSizing:"border-box", boxShadow:"0 12px 40px -10px rgba(0,0,0,0.22)" }}>
      <div style={{ background:accent, padding:"0.42in 0.7in 0.38in", boxSizing:"border-box", position:"relative" }}>
        <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"3px", background:gold }} />
        <h1 style={{ fontFamily:nameFont, fontSize:"28pt", fontWeight:700, color:"#fff", margin:0, lineHeight:1.1, letterSpacing:"0.01em" }}>{data.name||"Your Name"}</h1>
        {data.summary&&<div style={{ fontFamily:bodyFont, fontSize:"9.5pt", color:`rgba(255,255,255,0.75)`, marginTop:"0.08in", lineHeight:1.5, maxWidth:"5in" }}>{data.summary}</div>}
        <div style={{ color:`rgba(255,255,255,0.65)`, fontSize:"8.5pt", marginTop:"0.1in", fontFamily:bodyFont }}>{ci.join("  ·  ")}</div>
      </div>
      <div style={{ display:"flex", padding:"0.35in 0.7in 0.6in", gap:"0.45in", boxSizing:"border-box" }}>
        <div style={{ width:"2.1in", flexShrink:0 }}>
          {data.admissions?.length>0&&<><div style={{ fontFamily:bodyFont, fontSize:"8pt", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.15em", color:gold, marginBottom:"0.07in", marginTop:0 }}>Admissions</div>{data.admissions.map((a,i)=><div key={i} style={{ fontFamily:bodyFont, fontSize:"8.5pt", color:"#333", marginBottom:"0.07in" }}><div style={{ fontWeight:600, color:"#111" }}>{a.qualification}</div>{a.authority&&<div style={{ color:"#666", fontSize:"8pt" }}>{a.authority}</div>}{a.date&&<div style={{ color:gold, fontWeight:600 }}>{a.date}</div>}</div>)}</>}
          {data.education?.length>0&&<><div style={{ fontFamily:bodyFont, fontSize:"8pt", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.15em", color:gold, marginBottom:"0.07in", marginTop:"0.18in", paddingTop:"0.15in", borderTop:`1px solid ${h2r(accent,0.12)}` }}>Education</div>{data.education.map((ed,i)=><div key={i} style={{ fontFamily:bodyFont, fontSize:"8.5pt", color:"#333", marginBottom:"0.1in" }}><div style={{ fontWeight:600, color:"#111" }}>{ed.degree}</div><div style={{ color:gold, fontWeight:500 }}>{ed.institution}</div>{ed.date&&<div style={{ color:"#777" }}>{ed.date}</div>}{ed.notes&&<div style={{ fontStyle:"italic", color:"#777", fontSize:"8pt" }}>{ed.notes}</div>}</div>)}</>}
          {data.practiceAreas?.length>0&&<><div style={{ fontFamily:bodyFont, fontSize:"8pt", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.15em", color:gold, marginBottom:"0.07in", marginTop:"0.18in", paddingTop:"0.15in", borderTop:`1px solid ${h2r(accent,0.12)}` }}>Areas</div>{data.practiceAreas.map((a,i)=><div key={i} style={{ fontFamily:bodyFont, fontSize:"8.5pt", color:"#333", marginBottom:"0.03in", paddingLeft:"0.08in", borderLeft:`2px solid ${h2r(gold,0.5)}` }}>{a}</div>)}</>}
          {data.memberships?.length>0&&<><div style={{ fontFamily:bodyFont, fontSize:"8pt", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.15em", color:gold, marginBottom:"0.07in", marginTop:"0.18in", paddingTop:"0.15in", borderTop:`1px solid ${h2r(accent,0.12)}` }}>Memberships</div>{data.memberships.map((m,i)=><div key={i} style={{ fontFamily:bodyFont, fontSize:"8pt", color:"#444", marginBottom:"0.05in", lineHeight:1.45 }}>{m}</div>)}</>}
        </div>
        <div style={{ flex:1 }}>
          {data.experience?.length>0&&<><SecTitle accent={accent} gold={gold} bodyFont={bodyFont} style={{ marginTop:0 }}>Experience</SecTitle>{data.experience.map((exp,i)=><ExpBlock key={i} exp={exp} accent={accent} bodyFont={bodyFont} i={i} total={data.experience.length}/>)}</>}
          {data.transactions?.length>0&&<><SecTitle accent={accent} gold={gold} bodyFont={bodyFont}>Selected Transactions</SecTitle>{data.transactions.map((t,i)=><div key={i} style={{ marginBottom:"0.09in", paddingLeft:"0.12in", borderLeft:`2px solid ${h2r(gold,0.5)}` }}><div style={{ fontFamily:bodyFont, fontSize:"9.5pt", fontWeight:700, color:"#111" }}>{t.name}</div>{t.role&&<div style={{ fontFamily:bodyFont, fontSize:"9pt", color:"#666", fontStyle:"italic" }}>{t.role}</div>}</div>)}</>}
          {data.publications?.length>0&&<><SecTitle accent={accent} gold={gold} bodyFont={bodyFont}>Publications</SecTitle>{data.publications.map((p,i)=><div key={i} style={{ fontFamily:bodyFont, fontSize:"9.5pt", color:"#333", marginBottom:"0.07in" }}><span style={{ fontStyle:"italic" }}>"{p.title}"</span>{p.publication&&<span>, <span style={{ color:gold, fontWeight:500 }}>{p.publication}</span></span>}{p.date&&<span style={{ color:"#777" }}> ({p.date})</span>}</div>)}</>}
          {data.awards?.length>0&&<><SecTitle accent={accent} gold={gold} bodyFont={bodyFont}>Awards &amp; Recognition</SecTitle>{data.awards.map((a,i)=><div key={i} style={{ fontFamily:bodyFont, fontSize:"9.5pt", color:"#333", marginBottom:"0.04in" }}>{a}</div>)}</>}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   LAYOUT: COUNSEL (mid-level legal, left accent strip)
   ============================================================ */
function LayoutCounsel({ data, accent, nameFont, bodyFont }) {
  const ci = [data.contact?.email,data.contact?.phone,data.contact?.location,data.contact?.linkedin].filter(Boolean);
  return (
    <div style={{ width:"8.5in", background:"#F9F8F5", fontFamily:bodyFont, boxSizing:"border-box", display:"flex", boxShadow:"0 12px 40px -10px rgba(0,0,0,0.18)" }}>
      <div style={{ width:"0.14in", background:accent, flexShrink:0 }} />
      <div style={{ flex:1, padding:"0.55in 0.65in 0.7in 0.5in", boxSizing:"border-box" }}>
        <div style={{ paddingBottom:"0.2in", marginBottom:"0.2in", borderBottom:`1.5px solid ${h2r(accent,0.15)}` }}>
          <h1 style={{ fontFamily:nameFont, fontSize:"32pt", fontWeight:300, color:accent, margin:0, lineHeight:1.1, letterSpacing:"-0.01em" }}>{data.name||"Your Name"}</h1>
          {data.contact?.location&&<div style={{ fontFamily:bodyFont, fontSize:"10pt", color:"#666", marginTop:"0.05in", fontStyle:"italic" }}>{data.contact.location}</div>}
          {ci.length>0&&<div style={{ fontFamily:bodyFont, fontSize:"8.5pt", color:"#777", marginTop:"0.08in" }}>{ci.join("  ·  ")}</div>}
        </div>
        {data.practiceAreas?.length>0&&<div style={{ marginBottom:"0.15in" }}><PracticeChips areas={data.practiceAreas} accent={accent} bodyFont={bodyFont}/></div>}
        {data.summary&&<div style={{ fontFamily:bodyFont, fontSize:"10pt", color:"#444", lineHeight:1.7, marginBottom:"0.18in", textAlign:"justify" }}>{data.summary}</div>}
        {data.admissions?.length>0&&<><SecTitle accent={accent} bodyFont={bodyFont} style={{ marginTop:0 }}>Admissions &amp; Qualifications</SecTitle>{data.admissions.map((a,i)=><div key={i} style={{ display:"flex", justifyContent:"space-between", fontFamily:bodyFont, fontSize:"9.5pt", color:"#333", marginBottom:"0.05in" }}><span><span style={{ fontWeight:600 }}>{a.qualification}</span>{a.authority&&` — ${a.authority}`}</span><span style={{ color:"#777", flexShrink:0 }}>{a.date}</span></div>)}</>}
        {data.education?.length>0&&<><SecTitle accent={accent} bodyFont={bodyFont}>Education</SecTitle>{data.education.map((ed,i)=><EduBlock key={i} ed={ed} accent={accent} bodyFont={bodyFont}/>)}</>}
        {data.experience?.length>0&&<><SecTitle accent={accent} bodyFont={bodyFont}>Experience</SecTitle>{data.experience.map((exp,i)=><ExpBlock key={i} exp={exp} accent={accent} bodyFont={bodyFont} i={i} total={data.experience.length}/>)}</>}
        {data.transactions?.length>0&&<><SecTitle accent={accent} bodyFont={bodyFont}>Selected Matters &amp; Transactions</SecTitle>{data.transactions.map((t,i)=><div key={i} style={{ marginBottom:"0.09in" }}><div style={{ fontFamily:bodyFont, fontSize:"9.5pt", fontWeight:700, color:"#111" }}>{t.name}</div>{t.role&&<div style={{ fontFamily:bodyFont, fontSize:"9pt", color:"#666", fontStyle:"italic" }}>{t.role}</div>}</div>)}</>}
        {data.publications?.length>0&&<><SecTitle accent={accent} bodyFont={bodyFont}>Publications</SecTitle>{data.publications.map((p,i)=><div key={i} style={{ fontFamily:bodyFont, fontSize:"9.5pt", color:"#333", marginBottom:"0.07in" }}><span style={{ fontStyle:"italic" }}>"{p.title}"</span>{p.publication&&`, ${p.publication}`}{p.date&&<span style={{ color:"#777" }}> ({p.date})</span>}</div>)}</>}
        {data.memberships?.length>0&&<><SecTitle accent={accent} bodyFont={bodyFont}>Professional Memberships</SecTitle>{data.memberships.map((m,i)=><div key={i} style={{ fontFamily:bodyFont, fontSize:"9.5pt", color:"#333", marginBottom:"0.04in" }}>{m}</div>)}</>}
        {data.awards?.length>0&&<><SecTitle accent={accent} bodyFont={bodyFont}>Awards &amp; Recognition</SecTitle>{data.awards.map((a,i)=><div key={i} style={{ fontFamily:bodyFont, fontSize:"9.5pt", color:"#333", marginBottom:"0.04in" }}>{a}</div>)}</>}
      </div>
    </div>
  );
}

/* ============================================================
   LAYOUT: ANALYST (finance, clean modern, metrics-forward)
   ============================================================ */
function LayoutAnalyst({ data, accent, nameFont, bodyFont }) {
  const ci = [data.contact?.email,data.contact?.phone,data.contact?.location,data.contact?.linkedin].filter(Boolean);
  return (
    <div style={{ width:"8.5in", background:"#FFFFFF", fontFamily:bodyFont, boxSizing:"border-box", boxShadow:"0 12px 40px -10px rgba(0,0,0,0.15)" }}>
      <div style={{ background:accent, padding:"0.45in 0.75in 0.35in", boxSizing:"border-box" }}>
        <h1 style={{ fontFamily:nameFont, fontSize:"26pt", fontWeight:700, color:"#fff", margin:0, lineHeight:1.1, letterSpacing:"0.01em" }}>{data.name||"Your Name"}</h1>
        {ci.length>0&&<div style={{ color:"rgba(255,255,255,0.65)", fontSize:"8.5pt", marginTop:"0.1in", fontFamily:bodyFont }}>{ci.join("  ·  ")}</div>}
      </div>
      <div style={{ background:h2r(accent,0.05), padding:"0.12in 0.75in", boxSizing:"border-box", borderBottom:`1px solid ${h2r(accent,0.1)}` }}>
        {data.practiceAreas?.length>0&&<div style={{ display:"flex", flexWrap:"wrap", gap:"0.05in" }}>{data.practiceAreas.map((a,i)=><span key={i} style={{ fontFamily:bodyFont, fontSize:"8pt", background:"#fff", color:accent, padding:"0.025in 0.1in", border:`1px solid ${h2r(accent,0.2)}`, fontWeight:600 }}>{a}</span>)}</div>}
        {data.summary&&!data.practiceAreas?.length&&<div style={{ fontFamily:bodyFont, fontSize:"9.5pt", color:accent, fontStyle:"italic" }}>{data.summary}</div>}
      </div>
      <div style={{ padding:"0.3in 0.75in 0.6in", boxSizing:"border-box" }}>
        {data.summary&&data.practiceAreas?.length>0&&<div style={{ fontFamily:bodyFont, fontSize:"10pt", color:"#444", lineHeight:1.7, marginBottom:"0.18in", paddingBottom:"0.15in", borderBottom:`1px solid ${h2r(accent,0.08)}` }}>{data.summary}</div>}
        {data.admissions?.length>0&&<><SecTitle accent={accent} bodyFont={bodyFont} style={{ marginTop:0 }}>Qualifications &amp; Certifications</SecTitle>{data.admissions.map((a,i)=><div key={i} style={{ display:"flex", justifyContent:"space-between", fontFamily:bodyFont, fontSize:"9.5pt", color:"#333", marginBottom:"0.05in" }}><span><span style={{ fontWeight:600 }}>{a.qualification}</span>{a.authority&&` — ${a.authority}`}</span><span style={{ color:"#777", flexShrink:0 }}>{a.date}</span></div>)}</>}
        {data.education?.length>0&&<><SecTitle accent={accent} bodyFont={bodyFont}>Education</SecTitle>{data.education.map((ed,i)=><EduBlock key={i} ed={ed} accent={accent} bodyFont={bodyFont}/>)}</>}
        {data.experience?.length>0&&<><SecTitle accent={accent} bodyFont={bodyFont}>Professional Experience</SecTitle>{data.experience.map((exp,i)=><ExpBlock key={i} exp={exp} accent={accent} bodyFont={bodyFont} i={i} total={data.experience.length}/>)}</>}
        {data.transactions?.length>0&&<><SecTitle accent={accent} bodyFont={bodyFont}>Selected Transactions</SecTitle><div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.1in" }}>{data.transactions.map((t,i)=><div key={i} style={{ background:h2r(accent,0.04), padding:"0.09in 0.12in", border:`1px solid ${h2r(accent,0.1)}` }}><div style={{ fontFamily:bodyFont, fontSize:"9pt", fontWeight:700, color:accent }}>{t.name}</div>{t.role&&<div style={{ fontFamily:bodyFont, fontSize:"8.5pt", color:"#666", fontStyle:"italic", marginTop:"0.02in" }}>{t.role}</div>}</div>)}</div></>}
        {data.publications?.length>0&&<><SecTitle accent={accent} bodyFont={bodyFont}>Publications</SecTitle>{data.publications.map((p,i)=><div key={i} style={{ fontFamily:bodyFont, fontSize:"9.5pt", color:"#333", marginBottom:"0.07in" }}><span style={{ fontStyle:"italic" }}>"{p.title}"</span>{p.publication&&`, ${p.publication}`}{p.date&&<span style={{ color:"#777" }}> ({p.date})</span>}</div>)}</>}
        {(data.memberships?.length||data.awards?.length)>0&&<><SecTitle accent={accent} bodyFont={bodyFont}>Memberships &amp; Awards</SecTitle>{[...(data.memberships||[]),...(data.awards||[])].map((m,i)=><div key={i} style={{ fontFamily:bodyFont, fontSize:"9.5pt", color:"#333", marginBottom:"0.04in" }}>{m}</div>)}</>}
      </div>
    </div>
  );
}

/* ============================================================
   LAYOUT: PARTNER (senior, full dark header, gold name)
   ============================================================ */
function LayoutPartner({ data, accent, accent2, nameFont, bodyFont }) {
  const gold = accent2||"#C9A84C";
  const ci = [data.contact?.email,data.contact?.phone,data.contact?.location,data.contact?.linkedin].filter(Boolean);
  return (
    <div style={{ width:"8.5in", background:"#F8F6F2", fontFamily:bodyFont, boxSizing:"border-box", boxShadow:"0 12px 40px -10px rgba(0,0,0,0.25)" }}>
      <div style={{ background:accent, padding:"0.52in 0.75in 0.4in", boxSizing:"border-box", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:0, right:0, width:"4in", height:"100%", background:`rgba(255,255,255,0.02)`, clipPath:"polygon(40% 0, 100% 0, 100% 100%, 0% 100%)" }} />
        <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"2px", background:gold }} />
        <div style={{ position:"relative" }}>
          <h1 style={{ fontFamily:nameFont, fontSize:"32pt", fontWeight:400, color:gold, margin:0, lineHeight:1.1, letterSpacing:"0.04em" }}>{data.name||"Your Name"}</h1>
          {data.practiceAreas?.length>0&&<div style={{ color:`rgba(255,255,255,0.65)`, fontSize:"9pt", marginTop:"0.08in", fontFamily:bodyFont, letterSpacing:"0.04em" }}>{data.practiceAreas.slice(0,5).join("  ·  ")}</div>}
          {ci.length>0&&<div style={{ color:`rgba(255,255,255,0.5)`, fontSize:"8.5pt", marginTop:"0.09in", fontFamily:bodyFont }}>{ci.join("  ·  ")}</div>}
        </div>
      </div>
      <div style={{ display:"flex", padding:"0.35in 0.75in 0.6in", gap:"0.45in", boxSizing:"border-box" }}>
        <div style={{ width:"2in", flexShrink:0 }}>
          {data.admissions?.length>0&&<><div style={{ fontFamily:bodyFont, fontSize:"7.5pt", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.2em", color:gold, marginBottom:"0.07in" }}>Admissions</div>{data.admissions.map((a,i)=><div key={i} style={{ fontFamily:bodyFont, fontSize:"8.5pt", color:"#333", marginBottom:"0.07in" }}><div style={{ fontWeight:600, color:"#111" }}>{a.qualification}</div>{a.authority&&<div style={{ color:"#777", fontSize:"8pt" }}>{a.authority}</div>}{a.date&&<div style={{ color:gold, fontWeight:600 }}>{a.date}</div>}</div>)}</>}
          {data.education?.length>0&&<><div style={{ fontFamily:bodyFont, fontSize:"7.5pt", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.2em", color:gold, marginBottom:"0.07in", marginTop:"0.18in", paddingTop:"0.15in", borderTop:`1px solid ${h2r(accent,0.12)}` }}>Education</div>{data.education.map((ed,i)=><div key={i} style={{ fontFamily:bodyFont, fontSize:"8.5pt", color:"#333", marginBottom:"0.1in" }}><div style={{ fontWeight:600, color:"#111" }}>{ed.degree}</div><div style={{ color:gold, fontWeight:500 }}>{ed.institution}</div>{ed.date&&<div style={{ color:"#777" }}>{ed.date}</div>}{ed.notes&&<div style={{ fontStyle:"italic", color:"#777", fontSize:"7.5pt" }}>{ed.notes}</div>}</div>)}</>}
          {data.memberships?.length>0&&<><div style={{ fontFamily:bodyFont, fontSize:"7.5pt", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.2em", color:gold, marginBottom:"0.07in", marginTop:"0.18in", paddingTop:"0.15in", borderTop:`1px solid ${h2r(accent,0.12)}` }}>Memberships</div>{data.memberships.map((m,i)=><div key={i} style={{ fontFamily:bodyFont, fontSize:"8pt", color:"#444", marginBottom:"0.05in", lineHeight:1.45 }}>{m}</div>)}</>}
          {data.awards?.length>0&&<><div style={{ fontFamily:bodyFont, fontSize:"7.5pt", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.2em", color:gold, marginBottom:"0.07in", marginTop:"0.18in", paddingTop:"0.15in", borderTop:`1px solid ${h2r(accent,0.12)}` }}>Awards</div>{data.awards.map((a,i)=><div key={i} style={{ fontFamily:bodyFont, fontSize:"8pt", color:"#444", marginBottom:"0.05in", lineHeight:1.45 }}>{a}</div>)}</>}
        </div>
        <div style={{ flex:1 }}>
          {data.summary&&<div style={{ fontFamily:bodyFont, fontSize:"10pt", color:"#444", lineHeight:1.7, marginBottom:"0.2in", fontStyle:"italic", borderLeft:`2px solid ${gold}`, paddingLeft:"0.15in" }}>{data.summary}</div>}
          {data.experience?.length>0&&<><SecTitle accent={accent} gold={gold} bodyFont={bodyFont} style={{ marginTop:0 }}>Professional Experience</SecTitle>{data.experience.map((exp,i)=><ExpBlock key={i} exp={exp} accent={accent} bodyFont={bodyFont} i={i} total={data.experience.length}/>)}</>}
          {data.transactions?.length>0&&<><SecTitle accent={accent} gold={gold} bodyFont={bodyFont}>Selected Transactions &amp; Matters</SecTitle>{data.transactions.map((t,i)=><div key={i} style={{ marginBottom:"0.09in", paddingLeft:"0.12in", borderLeft:`2px solid ${h2r(gold,0.5)}` }}><div style={{ fontFamily:bodyFont, fontSize:"9.5pt", fontWeight:700, color:"#111" }}>{t.name}</div>{t.role&&<div style={{ fontFamily:bodyFont, fontSize:"9pt", color:"#666", fontStyle:"italic" }}>{t.role}</div>}</div>)}</>}
          {data.publications?.length>0&&<><SecTitle accent={accent} gold={gold} bodyFont={bodyFont}>Publications &amp; Speaking</SecTitle>{data.publications.map((p,i)=><div key={i} style={{ fontFamily:bodyFont, fontSize:"9.5pt", color:"#333", marginBottom:"0.07in" }}><span style={{ fontStyle:"italic" }}>"{p.title}"</span>{p.publication&&<span>, <span style={{ color:gold }}>{p.publication}</span></span>}{p.date&&<span style={{ color:"#777" }}> ({p.date})</span>}</div>)}</>}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   LAYOUT: COMPLIANCE (ATS-safe single column)
   ============================================================ */
function LayoutCompliance({ data, accent, nameFont, bodyFont }) {
  const ci = [data.contact?.email,data.contact?.phone,data.contact?.location,data.contact?.linkedin].filter(Boolean);
  const SH = ({children}) => <div style={{ fontFamily:bodyFont, fontSize:"8.5pt", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.18em", color:accent, borderBottom:`1px solid ${h2r(accent,0.22)}`, paddingBottom:"0.04in", marginTop:"0.18in", marginBottom:"0.08in" }}>{children}</div>;
  return (
    <div style={{ width:"8.5in", background:"#fff", fontFamily:bodyFont, boxSizing:"border-box", boxShadow:"0 12px 40px -10px rgba(0,0,0,0.1)", padding:"0.65in 0.85in 0.7in" }}>
      <div style={{ borderBottom:`2px solid ${accent}`, paddingBottom:"0.16in", marginBottom:"0.2in" }}>
        <h1 style={{ fontFamily:nameFont, fontSize:"24pt", fontWeight:700, color:accent, margin:0, lineHeight:1.1 }}>{data.name||"Your Name"}</h1>
        {ci.length>0&&<div style={{ fontFamily:bodyFont, fontSize:"8.5pt", color:"#666", marginTop:"0.09in" }}>{ci.join("  ·  ")}</div>}
      </div>
      {data.summary&&<><SH>Summary</SH><div style={{ fontFamily:bodyFont, fontSize:"10pt", color:"#333", lineHeight:1.7, marginBottom:"0.1in" }}>{data.summary}</div></>}
      {data.admissions?.length>0&&<><SH>Admissions &amp; Qualifications</SH>{data.admissions.map((a,i)=><div key={i} style={{ display:"flex", justifyContent:"space-between", fontFamily:bodyFont, fontSize:"9.5pt", color:"#333", marginBottom:"0.05in" }}><span><span style={{ fontWeight:600 }}>{a.qualification}</span>{a.authority&&` — ${a.authority}`}</span><span style={{ color:"#777", flexShrink:0 }}>{a.date}</span></div>)}</>}
      {data.education?.length>0&&<><SH>Education</SH>{data.education.map((ed,i)=><div key={i} style={{ marginBottom:"0.1in" }}><div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline" }}><div style={{ fontFamily:bodyFont, fontWeight:700, fontSize:"10.5pt", color:"#111" }}>{ed.degree}{ed.institution&&<span style={{ fontWeight:400 }}>, {ed.institution}</span>}</div><div style={{ fontFamily:bodyFont, fontSize:"9pt", color:"#666", flexShrink:0 }}>{ed.date}</div></div>{ed.notes&&<div style={{ fontFamily:bodyFont, fontSize:"9pt", color:"#666", fontStyle:"italic" }}>{ed.notes}</div>}</div>)}</>}
      {data.experience?.length>0&&<><SH>Experience</SH>{data.experience.map((exp,i)=><ExpBlock key={i} exp={exp} accent={accent} bodyFont={bodyFont} i={i} total={data.experience.length}/>)}</>}
      {data.transactions?.length>0&&<><SH>Selected Transactions &amp; Matters</SH>{data.transactions.map((t,i)=><div key={i} style={{ marginBottom:"0.08in" }}><div style={{ fontFamily:bodyFont, fontSize:"9.5pt", fontWeight:700, color:"#111" }}>{t.name}</div>{t.role&&<div style={{ fontFamily:bodyFont, fontSize:"9pt", color:"#666", fontStyle:"italic" }}>{t.role}</div>}</div>)}</>}
      {data.practiceAreas?.length>0&&<><SH>Practice Areas / Specialisations</SH><div style={{ fontFamily:bodyFont, fontSize:"9.5pt", color:"#333" }}>{data.practiceAreas.join("  ·  ")}</div></>}
      {data.publications?.length>0&&<><SH>Publications</SH>{data.publications.map((p,i)=><div key={i} style={{ fontFamily:bodyFont, fontSize:"9.5pt", color:"#333", marginBottom:"0.07in" }}><span style={{ fontStyle:"italic" }}>"{p.title}"</span>{p.publication&&`, ${p.publication}`}{p.date&&<span style={{ color:"#777" }}> ({p.date})</span>}</div>)}</>}
      {data.memberships?.length>0&&<><SH>Professional Memberships</SH>{data.memberships.map((m,i)=><div key={i} style={{ fontFamily:bodyFont, fontSize:"9.5pt", color:"#333", marginBottom:"0.04in" }}>{m}</div>)}</>}
      {data.awards?.length>0&&<><SH>Awards &amp; Recognition</SH>{data.awards.map((a,i)=><div key={i} style={{ fontFamily:bodyFont, fontSize:"9.5pt", color:"#333", marginBottom:"0.04in" }}>{a}</div>)}</>}
    </div>
  );
}

/* ── Router ── */
function ResumePreview({ templateId, data, accent }) {
  const tpl = TEMPLATES.find(t=>t.id===templateId)||TEMPLATES[0];
  const props = { data, accent:accent||tpl.accent, accent2:tpl.accent2, nameFont:tpl.nameFont, bodyFont:tpl.bodyFont };
  switch(tpl.layout) {
    case "chambers":   return <LayoutChambers {...props}/>;
    case "meridian":   return <LayoutMeridian {...props}/>;
    case "counsel":    return <LayoutCounsel {...props}/>;
    case "analyst":    return <LayoutAnalyst {...props}/>;
    case "partner":    return <LayoutPartner {...props}/>;
    case "compliance": return <LayoutCompliance {...props}/>;
    default:           return <LayoutChambers {...props}/>;
  }
}

/* ============================================================
   EXPORT
   ============================================================ */
function exportPDF(el, name) {
  if(!el)return;
  const printCSS = `
    @page { size: letter; margin: 0; }
    @page :first { margin: 0; }
    @page :left { margin: 0; }
    @page :right { margin: 0; }
    html, body { margin: 0; padding: 0; background: white; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    * { box-sizing: border-box; }
    h1, h2, h3 { page-break-after: avoid; break-after: avoid; }
    li { page-break-inside: avoid; break-inside: avoid; orphans: 3; widows: 3; }
    ul { page-break-inside: avoid; break-inside: avoid; }
    div { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  `;
  const html=`<!DOCTYPE html><html><head><meta charset="utf-8"><title>${(name||"Resume").replace(/[<>&"']/g,"")}</title><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Serif:ital,wght@0,300;0,400;0,600;0,700;1,400&family=IBM+Plex+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Inter:wght@400;500;600;700&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap"><style>${printCSS}</style></head><body>${el.innerHTML}<script>(function(){if(document.fonts&&document.fonts.ready){document.fonts.ready.then(function(){setTimeout(function(){window.focus();window.print();},300);})}else{setTimeout(function(){window.focus();window.print();},900);}})()</script></body></html>`;
  const w=window.open("","_blank","width=900,height=1100");
  if(!w){alert("Please allow pop-ups to print.");return;}
  w.document.open();w.document.write(html);w.document.close();
}

function exportWord(data, accent) {
  const ac=hexToRtf(accent);
  const fn=((data.name||"resume").replace(/[^a-z0-9]+/gi,"_").toLowerCase())+"_resume.rtf";
  const out=[];
  // \keepn = keep with next paragraph (stops section titles orphaning)
  // \keep  = keep paragraph together (stops entries splitting mid-entry)
  out.push(`{\\rtf1\\ansi\\ansicpg1252\\deff0\\nouicompat{\\fonttbl{\\f0\\froman\\fcharset0 Garamond;}{\\f1\\fswiss\\fcharset0 Arial;}}{\\colortbl;\\red17\\green17\\blue17;\\red80\\green80\\blue80;\\red${ac.r}\\green${ac.g}\\blue${ac.b};}\\paperw12240\\paperh15840\\margl1080\\margr1080\\margt1080\\margb1080\\f0\\fs22\\cf1`);
  if(data.name) out.push(`{\\pard\\qc\\sb0\\sa80\\fs44\\b\\cf3 ${esc(data.name)}\\b0\\par}`);
  const ci=[data.contact?.email,data.contact?.phone,data.contact?.location,data.contact?.linkedin].filter(Boolean);
  if(ci.length) out.push(`{\\pard\\qc\\sb0\\sa240\\fs19\\cf2 ${esc(ci.join("  ·  "))}\\par}`);
  out.push(`{\\pard\\qc\\sb0\\sa240\\brdrb\\brdrs\\brdrw20\\brdrcf3\\par}`);
  if(data.summary) out.push(`{\\pard\\ql\\sb0\\sa200\\fs21\\i\\cf2\\keep ${esc(data.summary)}\\i0\\par}`);
  // \keepn on section headers keeps them with the first entry below
  const sh=t=>{ out.push(`{\\pard\\ql\\sb200\\sa60\\fs19\\b\\cf3\\keepn ${esc(t.toUpperCase())}\\b0\\par}`); out.push(`{\\pard\\ql\\sb0\\sa100\\brdrb\\brdrs\\brdrw10\\brdrcf3\\keepn\\par}`); };
  if(data.admissions?.length){sh("Admissions & Qualifications");data.admissions.forEach(a=>{out.push(`{\\pard\\ql\\sb60\\sa30\\fs22\\keep\\tx9000\\tqr\\tx9000 {\\b ${esc(a.qualification)}\\b0}${a.authority?` \\u8212? ${esc(a.authority)}`:""} \\tab ${esc(a.date||"")}\\par}`);})}
  if(data.education?.length){sh("Education");data.education.forEach(ed=>{out.push(`{\\pard\\ql\\sb80\\sa20\\fs22\\b\\keep ${esc(ed.degree)}\\b0\\par}`);out.push(`{\\pard\\ql\\sa20\\fs21\\cf3\\keep ${esc(ed.institution)}${ed.location?`, ${esc(ed.location)}`:""} ${esc(ed.date||"")}\\par}`);if(ed.notes)out.push(`{\\pard\\ql\\sa40\\fs20\\i\\cf2\\keep ${esc(ed.notes)}\\i0\\par}`);out.push(`{\\pard\\sb60\\par}`);})}
  if(data.experience?.length){sh("Professional Experience");data.experience.forEach(exp=>{out.push(`{\\pard\\ql\\sb80\\sa20\\fs22\\keep\\keepn\\tx9000\\tqr\\tx9000 {\\b ${esc(exp.title)}\\b0}${exp.firm?`, ${esc(exp.firm)}`:""}${exp.location?` (${esc(exp.location)})`:""} \\tab ${esc([exp.start,exp.end].filter(Boolean).join(" \\u8212? "))}\\par}`);(exp.bullets||[]).forEach(b=>out.push(`{\\pard\\fi-280\\li360\\sa20\\fs22\\keep \\u8226? \\tab ${esc(b)}\\par}`));out.push(`{\\pard\\sb60\\par}`);})}
  if(data.transactions?.length){sh("Selected Transactions & Matters");data.transactions.forEach(t=>{out.push(`{\\pard\\ql\\sb60\\sa20\\fs22\\b\\keep ${esc(t.name)}\\b0\\par}`);if(t.role)out.push(`{\\pard\\ql\\sa40\\fs21\\i\\cf2\\keep ${esc(t.role)}\\i0\\par}`);})}
  if(data.practiceAreas?.length) out.push(`{\\pard\\ql\\sb200\\sa60\\fs19\\b\\cf3\\keepn PRACTICE AREAS\\b0\\par}{\\pard\\ql\\sa100\\brdrb\\brdrs\\brdrw10\\brdrcf3\\par}{\\pard\\ql\\sa120\\fs22\\cf1\\keep ${esc(data.practiceAreas.join("  ·  "))}\\par}`);
  if(data.publications?.length){sh("Publications");data.publications.forEach(p=>{out.push(`{\\pard\\ql\\sb60\\sa30\\fs22\\keep\\i "${esc(p.title)}"\\i0${p.publication?`, ${esc(p.publication)}`:""}${p.date?` (${esc(p.date)})`:""} \\par}`);})}
  if(data.memberships?.length||data.awards?.length){sh("Memberships & Awards");[...(data.memberships||[]),...(data.awards||[])].forEach(m=>out.push(`{\\pard\\fi-280\\li360\\sa20\\fs22\\keep \\u8226? \\tab ${esc(m)}\\par}`));}
  out.push("}");
  dlBlob(new Blob([out.join("\n")],{type:"application/rtf"}),fn);
}

/* ============================================================
   COVER LETTER PREVIEW — matches each VaultCV template
   ============================================================ */
function CoverLetterPreview({ templateId, cl, accent }) {
  const tpl   = TEMPLATES.find(t=>t.id===templateId)||TEMPLATES[0];
  const ac    = accent||tpl.accent;
  const gold  = tpl.accent2||"#B8963E";
  const nf    = tpl.nameFont;
  const bf    = tpl.bodyFont;
  const layout = tpl.layout;

  const empty = !cl.senderName && !cl.company && !cl.opening;
  if(empty) return (
    <div style={{ width:"8.5in", minHeight:"11in", background:"#FEFDFB", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 12px 40px -10px rgba(0,0,0,0.2)", boxSizing:"border-box" }}>
      <div style={{ textAlign:"center", color:"#bbb", fontFamily:PLEX_SANS, fontSize:"11pt" }}>
        <div style={{ fontSize:"24pt", marginBottom:"0.15in" }}>✉</div>Fill in the form to preview your cover letter
      </div>
    </div>
  );

  const contactStr = [cl.senderEmail, cl.senderPhone, cl.senderLocation, cl.senderLinkedin].filter(Boolean).join("  ·  ");
  const salutation = `Dear ${cl.recipientName||"Hiring Manager"},`;
  const paragraphs = [cl.opening, cl.body1, cl.body2, cl.body3].filter(Boolean);
  const closing    = cl.closing||"Thank you for your time and consideration.";

  // Shared name sign-off — always shows full name after Sincerely
  const SignOff = ({ darkBg=false, accentColor=ac }) => (
    <div>
      <div style={{ fontFamily:bf, fontSize:"10.5pt", color:darkBg?"rgba(255,255,255,0.88)":"#1c1c1c", marginTop:"0.06in" }}>{closing}</div>
      <div style={{ fontFamily:bf, fontSize:"10.5pt", color:darkBg?"rgba(255,255,255,0.88)":"#1c1c1c", marginTop:"0.3in" }}>Sincerely,</div>
      <div style={{ fontFamily:nf, fontSize:"13pt", fontWeight:600, color:darkBg?"#fff":accentColor, marginTop:"0.28in", letterSpacing:"0.01em" }}>{cl.senderName||""}</div>
      {cl.senderTitle&&<div style={{ fontFamily:bf, fontSize:"9pt", color:darkBg?"rgba(255,255,255,0.6)":"#666", marginTop:"0.04in", fontStyle:"italic" }}>{cl.senderTitle}</div>}
    </div>
  );

  const BodyContent = ({ pad="0.4in 0.85in 0.7in", darkBg=false, accentColor=ac }) => {
    const tc = darkBg?"rgba(255,255,255,0.9)":"#1c1c1c";
    const sc = darkBg?"rgba(255,255,255,0.58)":"#555";
    const hc = darkBg?"rgba(255,255,255,0.38)":"#999";
    return (
      <div style={{ padding:pad, boxSizing:"border-box" }}>
        {cl.date&&<div style={{ fontFamily:bf, fontSize:"9.5pt", color:sc, marginBottom:"0.2in" }}>{cl.date}</div>}
        {(cl.recipientName||cl.recipientTitle||cl.company)&&(
          <div style={{ fontFamily:bf, fontSize:"9.5pt", color:tc, lineHeight:1.7, marginBottom:"0.28in" }}>
            {cl.recipientName&&<div style={{ fontWeight:600 }}>{cl.recipientName}</div>}
            {cl.recipientTitle&&<div style={{ color:sc }}>{cl.recipientTitle}</div>}
            {cl.company&&<div style={{ color:sc }}>{cl.company}</div>}
            {cl.companyAddress&&<div style={{ color:hc }}>{cl.companyAddress}</div>}
          </div>
        )}
        <div style={{ fontFamily:bf, fontSize:"10.5pt", color:tc, marginBottom:"0.2in" }}>{salutation}</div>
        {paragraphs.map((p,i)=><p key={i} style={{ fontFamily:bf, fontSize:"10.5pt", color:tc, lineHeight:1.78, margin:"0 0 0.17in 0" }}>{p}</p>)}
        <SignOff darkBg={darkBg} accentColor={accentColor}/>
      </div>
    );
  };

  /* ── chambers ── */
  if(layout==="chambers") return (
    <div style={{ width:"8.5in", background:"#FEFDFB", fontFamily:bf, boxSizing:"border-box", boxShadow:"0 12px 40px -10px rgba(0,0,0,0.2)" }}>
      <div style={{ padding:"0.55in 0.85in 0.28in", boxSizing:"border-box", textAlign:"center" }}>
        <h1 style={{ fontFamily:nf, fontSize:"28pt", fontWeight:400, color:ac, margin:0, lineHeight:1.1, letterSpacing:"0.04em" }}>{cl.senderName||"Your Name"}</h1>
        {cl.senderTitle&&<div style={{ fontFamily:bf, fontSize:"10pt", color:"#666", marginTop:"0.05in", fontStyle:"italic" }}>{cl.senderTitle}</div>}
        {contactStr&&<div style={{ fontFamily:bf, fontSize:"8.5pt", color:"#777", marginTop:"0.09in" }}>{contactStr}</div>}
        <div style={{ margin:"0.16in auto 0.05in", display:"flex", flexDirection:"column", alignItems:"center", gap:"3px" }}>
          <div style={{ width:"2.5in", height:"2px", background:ac }}/>
          <div style={{ width:"2.5in", height:"1px", background:gold }}/>
        </div>
      </div>
      <BodyContent pad="0.2in 0.85in 0.7in"/>
    </div>
  );

  /* ── meridian ── */
  if(layout==="meridian") return (
    <div style={{ width:"8.5in", background:"#FAFAFA", fontFamily:bf, boxSizing:"border-box", boxShadow:"0 12px 40px -10px rgba(0,0,0,0.22)" }}>
      <div style={{ background:ac, padding:"0.42in 0.7in 0.35in", boxSizing:"border-box", position:"relative" }}>
        <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"3px", background:gold }}/>
        <h1 style={{ fontFamily:nf, fontSize:"26pt", fontWeight:700, color:"#fff", margin:0, lineHeight:1.1 }}>{cl.senderName||"Your Name"}</h1>
        {cl.senderTitle&&<div style={{ fontFamily:bf, fontSize:"9.5pt", color:"rgba(255,255,255,0.72)", marginTop:"0.05in", fontStyle:"italic" }}>{cl.senderTitle}</div>}
        {contactStr&&<div style={{ fontFamily:bf, fontSize:"8.5pt", color:"rgba(255,255,255,0.6)", marginTop:"0.09in" }}>{contactStr}</div>}
      </div>
      <BodyContent pad="0.4in 0.7in 0.7in"/>
    </div>
  );

  /* ── counsel ── */
  if(layout==="counsel") return (
    <div style={{ width:"8.5in", background:"#F9F8F5", fontFamily:bf, boxSizing:"border-box", display:"flex", boxShadow:"0 12px 40px -10px rgba(0,0,0,0.18)" }}>
      <div style={{ width:"0.14in", background:ac, flexShrink:0 }}/>
      <div style={{ flex:1, padding:"0.55in 0.65in 0.7in 0.5in", boxSizing:"border-box" }}>
        <div style={{ paddingBottom:"0.18in", marginBottom:"0.25in", borderBottom:`1.5px solid ${h2r(ac,0.15)}` }}>
          <h1 style={{ fontFamily:nf, fontSize:"28pt", fontWeight:300, color:ac, margin:0, lineHeight:1.1 }}>{cl.senderName||"Your Name"}</h1>
          {cl.senderTitle&&<div style={{ fontFamily:bf, fontSize:"10pt", color:"#666", marginTop:"0.05in", fontStyle:"italic" }}>{cl.senderTitle}</div>}
          {contactStr&&<div style={{ fontFamily:bf, fontSize:"8.5pt", color:"#777", marginTop:"0.07in" }}>{contactStr}</div>}
        </div>
        <BodyContent pad="0"/>
      </div>
    </div>
  );

  /* ── analyst ── */
  if(layout==="analyst") return (
    <div style={{ width:"8.5in", background:"#FFFFFF", fontFamily:bf, boxSizing:"border-box", boxShadow:"0 12px 40px -10px rgba(0,0,0,0.15)" }}>
      <div style={{ background:ac, padding:"0.42in 0.75in 0.35in", boxSizing:"border-box" }}>
        <h1 style={{ fontFamily:nf, fontSize:"26pt", fontWeight:700, color:"#fff", margin:0, lineHeight:1.1 }}>{cl.senderName||"Your Name"}</h1>
        {cl.senderTitle&&<div style={{ fontFamily:bf, fontSize:"9.5pt", color:"rgba(255,255,255,0.72)", marginTop:"0.05in", fontStyle:"italic" }}>{cl.senderTitle}</div>}
        {contactStr&&<div style={{ fontFamily:bf, fontSize:"8.5pt", color:"rgba(255,255,255,0.6)", marginTop:"0.09in" }}>{contactStr}</div>}
      </div>
      <BodyContent pad="0.4in 0.75in 0.7in"/>
    </div>
  );

  /* ── partner ── */
  if(layout==="partner") return (
    <div style={{ width:"8.5in", background:"#F8F6F2", fontFamily:bf, boxSizing:"border-box", boxShadow:"0 12px 40px -10px rgba(0,0,0,0.25)" }}>
      <div style={{ background:ac, padding:"0.48in 0.75in 0.38in", boxSizing:"border-box", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"2px", background:gold }}/>
        <div style={{ position:"absolute", top:0, right:0, width:"4in", height:"100%", background:"rgba(255,255,255,0.02)", clipPath:"polygon(40% 0, 100% 0, 100% 100%, 0% 100%)" }}/>
        <div style={{ position:"relative" }}>
          <h1 style={{ fontFamily:nf, fontSize:"28pt", fontWeight:400, color:gold, margin:0, lineHeight:1.1, letterSpacing:"0.04em" }}>{cl.senderName||"Your Name"}</h1>
          {cl.senderTitle&&<div style={{ fontFamily:bf, fontSize:"9.5pt", color:"rgba(255,255,255,0.65)", marginTop:"0.05in", fontStyle:"italic" }}>{cl.senderTitle}</div>}
          {contactStr&&<div style={{ fontFamily:bf, fontSize:"8.5pt", color:"rgba(255,255,255,0.5)", marginTop:"0.09in" }}>{contactStr}</div>}
        </div>
      </div>
      <BodyContent pad="0.42in 0.75in 0.7in" accentColor={gold}/>
    </div>
  );

  /* ── compliance (fallback) ── */
  return (
    <div style={{ width:"8.5in", background:"#fff", fontFamily:bf, boxSizing:"border-box", boxShadow:"0 12px 40px -10px rgba(0,0,0,0.1)", padding:"0.65in 0.85in 0.7in" }}>
      <div style={{ borderBottom:`2px solid ${ac}`, paddingBottom:"0.16in", marginBottom:"0.3in" }}>
        <h1 style={{ fontFamily:nf, fontSize:"22pt", fontWeight:700, color:ac, margin:0, lineHeight:1.1 }}>{cl.senderName||"Your Name"}</h1>
        {cl.senderTitle&&<div style={{ fontFamily:bf, fontSize:"10pt", color:"#555", marginTop:"0.04in", fontStyle:"italic" }}>{cl.senderTitle}</div>}
        {contactStr&&<div style={{ fontFamily:bf, fontSize:"8.5pt", color:"#666", marginTop:"0.07in" }}>{contactStr}</div>}
      </div>
      <BodyContent pad="0"/>
    </div>
  );
}

/* ============================================================
   COVER LETTER EXPORTS
   ============================================================ */
function exportCLPDF(el, name) {
  if(!el)return;
  const printCSS = `
    @page { size: letter; margin: 0; }
    html, body { margin: 0; padding: 0; background: white; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    * { box-sizing: border-box; }
    p { orphans: 3; widows: 3; page-break-inside: avoid; break-inside: avoid; }
    div { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  `;
  const html=`<!DOCTYPE html><html><head><meta charset="utf-8"><title>${(name||"Cover Letter").replace(/[<>&"']/g,"")}</title><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Serif:ital,wght@0,300;0,400;0,600;0,700;1,400&family=IBM+Plex+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Inter:wght@400;500;600;700&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap"><style>${printCSS}</style></head><body>${el.innerHTML}<script>(function(){if(document.fonts&&document.fonts.ready){document.fonts.ready.then(function(){setTimeout(function(){window.focus();window.print();},300);})}else{setTimeout(function(){window.focus();window.print();},900);}})()</script></body></html>`;
  const w=window.open("","_blank","width=900,height=1100");
  if(!w){alert("Please allow pop-ups to print.");return;}
  w.document.open();w.document.write(html);w.document.close();
}

function exportCLWord(cl, accent) {
  const ac=hexToRtf(accent);
  const fn=((cl.senderName||"cover-letter").replace(/[^a-z0-9]+/gi,"_").toLowerCase())+"_cover_letter.rtf";
  const out=[];
  out.push(`{\\rtf1\\ansi\\ansicpg1252\\deff0\\nouicompat{\\fonttbl{\\f0\\froman\\fcharset0 Garamond;}{\\f1\\fswiss\\fcharset0 Arial;}}{\\colortbl;\\red17\\green17\\blue17;\\red80\\green80\\blue80;\\red${ac.r}\\green${ac.g}\\blue${ac.b};}\\paperw12240\\paperh15840\\margl1152\\margr1152\\margt1152\\margb1152\\f0\\fs22\\cf1`);
  if(cl.senderName) out.push(`{\\pard\\ql\\sb0\\sa60\\fs40\\b\\cf3 ${esc(cl.senderName)}\\b0\\par}`);
  if(cl.senderTitle) out.push(`{\\pard\\ql\\sb0\\sa40\\fs22\\i\\cf2 ${esc(cl.senderTitle)}\\i0\\par}`);
  const ci=[cl.senderEmail,cl.senderPhone,cl.senderLocation,cl.senderLinkedin].filter(Boolean);
  if(ci.length) out.push(`{\\pard\\ql\\sb0\\sa240\\fs19\\cf2 ${esc(ci.join("  ·  "))}\\par}`);
  out.push(`{\\pard\\ql\\sb0\\sa240\\brdrb\\brdrs\\brdrw15\\brdrcf3\\par}`);
  if(cl.date) out.push(`{\\pard\\ql\\sb0\\sa120\\fs20\\cf2 ${esc(cl.date)}\\par}`);
  if(cl.recipientName||cl.recipientTitle||cl.company){
    out.push(`{\\pard\\ql\\sb120\\sa0\\fs21\\cf1`);
    if(cl.recipientName) out.push(`{\\b ${esc(cl.recipientName)}\\b0}\\line `);
    if(cl.recipientTitle) out.push(`${esc(cl.recipientTitle)}\\line `);
    if(cl.company) out.push(`${esc(cl.company)}\\line `);
    if(cl.companyAddress) out.push(`{\\cf2 ${esc(cl.companyAddress)}}`);
    out.push(`\\par}`);
  }
  out.push(`{\\pard\\ql\\sb240\\sa120\\fs22\\cf1 ${esc(`Dear ${cl.recipientName||"Hiring Manager"},`)}\\par}`);
  [cl.opening,cl.body1,cl.body2,cl.body3].filter(Boolean).forEach(p=>{
    out.push(`{\\pard\\ql\\sb0\\sa180\\fs22\\cf1\\keep ${esc(p)}\\par}`);
  });
  if(cl.closing) out.push(`{\\pard\\ql\\sb60\\sa120\\fs22\\cf1 ${esc(cl.closing)}\\par}`);
  out.push(`{\\pard\\ql\\sb200\\sa60\\fs22\\cf1 Sincerely,\\par}`);
  out.push(`{\\pard\\ql\\sb240\\sa0\\fs26\\b\\cf3 ${esc(cl.senderName||"")}\\b0\\par}`);
  if(cl.senderTitle) out.push(`{\\pard\\ql\\sb40\\sa0\\fs20\\i\\cf2 ${esc(cl.senderTitle)}\\i0\\par}`);
  out.push("}");
  dlBlob(new Blob([out.join("\n")],{type:"application/rtf"}),fn);
}

/* ============================================================
   COVER LETTER FORM
   ============================================================ */
function CoverLetterForm({ cl, setCl, onAutoFill }) {
  const set=(k,v)=>setCl(p=>({...p,[k]:v}));
  return (
    <div className="space-y-0">
      <Accordion title="CL — Your Details">
        <button onClick={onAutoFill} className="w-full flex items-center justify-center gap-2 py-2 mb-1 text-xs font-semibold transition-all" style={{ background:"#F5F0E8", border:"1px solid #C8B98A", color:"#8B6914" }}>
          <Zap className="w-3.5 h-3.5"/>Auto-fill from resume
        </button>
        <div><label className={lc}>Full name</label><input className={fc} value={cl.senderName} onChange={e=>set("senderName",e.target.value)} placeholder="Victoria Chen"/></div>
        <div><label className={lc}>Your title / position</label><input className={fc} value={cl.senderTitle} onChange={e=>set("senderTitle",e.target.value)} placeholder="Senior Associate — Mergers & Acquisitions"/></div>
        <div className="grid grid-cols-2 gap-2">
          <div><label className={lc}>Email</label><input className={fc} value={cl.senderEmail} onChange={e=>set("senderEmail",e.target.value)} placeholder="v.chen@firm.com"/></div>
          <div><label className={lc}>Phone</label><input className={fc} value={cl.senderPhone} onChange={e=>set("senderPhone",e.target.value)} placeholder="+61 2 0000 0000"/></div>
          <div><label className={lc}>Location</label><input className={fc} value={cl.senderLocation} onChange={e=>set("senderLocation",e.target.value)} placeholder="Sydney, NSW"/></div>
          <div><label className={lc}>LinkedIn</label><input className={fc} value={cl.senderLinkedin} onChange={e=>set("senderLinkedin",e.target.value)} placeholder="linkedin.com/in/you"/></div>
        </div>
      </Accordion>
      <Accordion title="CL — Recipient & Firm">
        <div><label className={lc}>Date</label><input className={fc} value={cl.date} onChange={e=>set("date",e.target.value)} placeholder="June 15, 2026"/></div>
        <div className="grid grid-cols-2 gap-2">
          <div><label className={lc}>Recipient name</label><input className={fc} value={cl.recipientName} onChange={e=>set("recipientName",e.target.value)} placeholder="James Morrison"/></div>
          <div><label className={lc}>Their title</label><input className={fc} value={cl.recipientTitle} onChange={e=>set("recipientTitle",e.target.value)} placeholder="Partner — M&A"/></div>
        </div>
        <div><label className={lc}>Firm / Organisation</label><input className={fc} value={cl.company} onChange={e=>set("company",e.target.value)} placeholder="Herbert Smith Freehills"/></div>
        <div><label className={lc}>Address <span className="normal-case font-normal text-stone-300">(optional)</span></label><input className={fc} value={cl.companyAddress} onChange={e=>set("companyAddress",e.target.value)} placeholder="ANZ Tower, 161 Castlereagh St, Sydney NSW 2000"/></div>
      </Accordion>
      <Accordion title="CL — Letter Body">
        <p className="text-[11px] text-stone-400 -mt-1 leading-relaxed">Write each paragraph separately — the preview assembles them in order.</p>
        <div><label className={lc}>Opening paragraph</label><textarea className={fc} rows={4} value={cl.opening} onChange={e=>set("opening",e.target.value)} placeholder="Why this firm, why now — open with impact."/></div>
        <div><label className={lc}>Body paragraph 1</label><textarea className={fc} rows={4} value={cl.body1} onChange={e=>set("body1",e.target.value)} placeholder="Your strongest experience or transaction."/></div>
        <div><label className={lc}>Body paragraph 2 <span className="normal-case font-normal text-stone-300">(optional)</span></label><textarea className={fc} rows={4} value={cl.body2} onChange={e=>set("body2",e.target.value)} placeholder="Why this firm specifically."/></div>
        <div><label className={lc}>Body paragraph 3 <span className="normal-case font-normal text-stone-300">(optional)</span></label><textarea className={fc} rows={3} value={cl.body3} onChange={e=>set("body3",e.target.value)} placeholder="Call to action."/></div>
        <div><label className={lc}>Closing sentence</label><input className={fc} value={cl.closing} onChange={e=>set("closing",e.target.value)} placeholder="Thank you for your time and consideration."/></div>
      </Accordion>
    </div>
  );
}

/* ============================================================
   FORM COMPONENTS
   ============================================================ */
const fc = "w-full px-2.5 py-1.5 text-sm border border-stone-300 bg-stone-50 focus:outline-none focus:border-navy-600 focus:ring-1 focus:ring-blue-900/20 transition-all";
const lc = "block text-[11px] font-semibold uppercase tracking-widest text-stone-500 mb-1";

function Accordion({ title, badge, children, defaultOpen=true }) {
  const [open,setOpen]=useState(defaultOpen);
  return (
    <div className="border-b border-stone-200 last:border-b-0">
      <button onClick={()=>setOpen(!open)} className="w-full flex items-center justify-between py-3 text-left group">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-stone-800 group-hover:text-stone-900 tracking-wide">{title}</span>
          {badge!=null&&<span className="text-[10px] bg-stone-200 text-stone-600 font-bold px-1.5 py-0.5">{badge}</span>}
        </div>
        {open?<ChevronUp className="w-4 h-4 text-stone-400"/>:<ChevronDown className="w-4 h-4 text-stone-400"/>}
      </button>
      {open&&<div className="pb-4 space-y-3">{children}</div>}
    </div>
  );
}

function TagInput({ label, items, onChange, placeholder }) {
  const [val,setVal]=useState("");
  const add=()=>{const t=val.trim();if(t&&!items.includes(t)){onChange([...items,t]);setVal("");}};
  return (
    <div>
      <label className={lc}>{label}</label>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {items.map((item,i)=>(
          <span key={i} className="inline-flex items-center gap-1 text-xs bg-stone-100 text-stone-700 border border-stone-300 px-2 py-0.5 font-medium">
            {item}<button onClick={()=>onChange(items.filter((_,j)=>j!==i))} className="text-stone-400 hover:text-red-500 transition-colors"><X className="w-3 h-3"/></button>
          </span>
        ))}
      </div>
      <div className="flex gap-1.5">
        <input className={fc} value={val} onChange={e=>setVal(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"||e.key===","){e.preventDefault();add();}}} placeholder={placeholder||"Type and press Enter"}/>
        <button onClick={add} className="px-3 bg-stone-800 hover:bg-stone-700 text-white text-xs font-semibold transition-colors">Add</button>
      </div>
    </div>
  );
}

function BulletInput({ label, items, onChange, placeholder }) {
  const upd=(i,v)=>onChange(items.map((x,j)=>j===i?v:x));
  const rm=(i)=>onChange(items.filter((_,j)=>j!==i));
  return (
    <div>
      {label&&<label className={lc}>{label}</label>}
      <div className="space-y-1.5">
        {items.map((item,i)=>(
          <div key={i} className="flex gap-1.5">
            <input className={fc} value={item} onChange={e=>upd(i,e.target.value)} placeholder={placeholder||"Add a point"}/>
            <button onClick={()=>rm(i)} className="px-2 text-stone-400 hover:text-red-500 hover:bg-red-50 transition-colors"><X className="w-4 h-4"/></button>
          </div>
        ))}
        <button onClick={()=>onChange([...items,""])} className="text-xs text-stone-500 hover:text-stone-800 flex items-center gap-1 px-2 py-1 hover:bg-stone-100 transition-colors font-medium"><Plus className="w-3 h-3"/>Add point</button>
      </div>
    </div>
  );
}

/* ============================================================
   RESUME FORM
   ============================================================ */
function ResumeForm({ data, setData }) {
  const set=(path,val)=>setData(prev=>{
    const next=JSON.parse(JSON.stringify(prev));
    const parts=path.split("."); let cur=next;
    for(let i=0;i<parts.length-1;i++) cur=cur[parts[i]];
    cur[parts[parts.length-1]]=val;
    return next;
  });
  const updAdm=(i,k,v)=>setData(p=>({...p,admissions:p.admissions.map((e,j)=>j===i?{...e,[k]:v}:e)}));
  const updEdu=(i,k,v)=>setData(p=>({...p,education:p.education.map((e,j)=>j===i?{...e,[k]:v}:e)}));
  const updExp=(i,k,v)=>setData(p=>({...p,experience:p.experience.map((e,j)=>j===i?{...e,[k]:v}:e)}));
  const updTxn=(i,k,v)=>setData(p=>({...p,transactions:p.transactions.map((e,j)=>j===i?{...e,[k]:v}:e)}));
  const updPub=(i,k,v)=>setData(p=>({...p,publications:p.publications.map((e,j)=>j===i?{...e,[k]:v}:e)}));

  return (
    <div className="space-y-0">
      <Accordion title="Personal Info">
        <div><label className={lc}>Full name</label><input className={fc} value={data.name} onChange={e=>set("name",e.target.value)} placeholder="Victoria Chen"/></div>
        <div className="grid grid-cols-2 gap-2">
          <div><label className={lc}>Email</label><input className={fc} value={data.contact.email} onChange={e=>set("contact.email",e.target.value)} placeholder="v.chen@firm.com"/></div>
          <div><label className={lc}>Phone</label><input className={fc} value={data.contact.phone} onChange={e=>set("contact.phone",e.target.value)} placeholder="+61 2 0000 0000"/></div>
          <div><label className={lc}>Location</label><input className={fc} value={data.contact.location} onChange={e=>set("contact.location",e.target.value)} placeholder="Sydney, NSW"/></div>
          <div><label className={lc}>LinkedIn</label><input className={fc} value={data.contact.linkedin} onChange={e=>set("contact.linkedin",e.target.value)} placeholder="linkedin.com/in/you"/></div>
        </div>
        <div><label className={lc}>Professional summary</label><textarea className={fc} rows={3} value={data.summary} onChange={e=>set("summary",e.target.value)} placeholder="Brief overview of your practice and expertise..."/></div>
      </Accordion>

      <Accordion title="Admissions & Qualifications" badge={data.admissions.length}>
        <p className="text-[11px] text-stone-400 -mt-1 leading-relaxed">Include bar admissions, solicitor admissions, CFA, CPA, ACCA, FINSIA etc.</p>
        {data.admissions.map((a,i)=>(
          <div key={i} className="bg-stone-50 border border-stone-200 p-3 space-y-2">
            <div className="flex justify-between items-center"><span className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest">Entry {i+1}</span><button onClick={()=>setData(p=>({...p,admissions:p.admissions.filter((_,j)=>j!==i)}))} className="text-stone-300 hover:text-red-500 transition-colors"><X className="w-4 h-4"/></button></div>
            <div><label className={lc}>Qualification</label><input className={fc} value={a.qualification} onChange={e=>updAdm(i,"qualification",e.target.value)} placeholder="Admitted as a Solicitor"/></div>
            <div className="grid grid-cols-2 gap-2">
              <div><label className={lc}>Authority / Body</label><input className={fc} value={a.authority} onChange={e=>updAdm(i,"authority",e.target.value)} placeholder="Supreme Court of NSW"/></div>
              <div><label className={lc}>Year</label><input className={fc} value={a.date} onChange={e=>updAdm(i,"date",e.target.value)} placeholder="2018"/></div>
            </div>
          </div>
        ))}
        <button onClick={()=>setData(p=>({...p,admissions:[...p.admissions,{qualification:"",authority:"",date:""}]}))} className="w-full py-2 border border-dashed border-stone-300 text-stone-500 hover:bg-stone-50 hover:border-stone-500 text-sm font-medium flex items-center justify-center gap-1.5 transition-all"><Plus className="w-4 h-4"/>Add admission</button>
      </Accordion>

      <Accordion title="Education" badge={data.education.length}>
        {data.education.map((ed,i)=>(
          <div key={i} className="bg-stone-50 border border-stone-200 p-3 space-y-2">
            <div className="flex justify-between items-center"><span className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest">Entry {i+1}</span><button onClick={()=>setData(p=>({...p,education:p.education.filter((_,j)=>j!==i)}))} className="text-stone-300 hover:text-red-500 transition-colors"><X className="w-4 h-4"/></button></div>
            <div><label className={lc}>Degree</label><input className={fc} value={ed.degree} onChange={e=>updEdu(i,"degree",e.target.value)} placeholder="Juris Doctor (First Class Honours)"/></div>
            <div className="grid grid-cols-2 gap-2">
              <div><label className={lc}>Institution</label><input className={fc} value={ed.institution} onChange={e=>updEdu(i,"institution",e.target.value)} placeholder="University of Sydney"/></div>
              <div><label className={lc}>Year</label><input className={fc} value={ed.date} onChange={e=>updEdu(i,"date",e.target.value)} placeholder="2017"/></div>
            </div>
            <div><label className={lc}>Location</label><input className={fc} value={ed.location} onChange={e=>updEdu(i,"location",e.target.value)} placeholder="Sydney, NSW"/></div>
            <div><label className={lc}>Honours / Notes <span className="normal-case font-normal text-stone-300">(optional)</span></label><input className={fc} value={ed.notes} onChange={e=>updEdu(i,"notes",e.target.value)} placeholder="First Class Honours, University Medal..."/></div>
          </div>
        ))}
        <button onClick={()=>setData(p=>({...p,education:[...p.education,{degree:"",institution:"",location:"",date:"",notes:""}]}))} className="w-full py-2 border border-dashed border-stone-300 text-stone-500 hover:bg-stone-50 hover:border-stone-500 text-sm font-medium flex items-center justify-center gap-1.5 transition-all"><Plus className="w-4 h-4"/>Add education</button>
      </Accordion>

      <Accordion title="Experience" badge={data.experience.length}>
        {data.experience.map((exp,i)=>(
          <div key={i} className="bg-stone-50 border border-stone-200 p-3 space-y-2">
            <div className="flex justify-between items-center"><span className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest">Role {i+1}</span><button onClick={()=>setData(p=>({...p,experience:p.experience.filter((_,j)=>j!==i)}))} className="text-stone-300 hover:text-red-500 transition-colors"><X className="w-4 h-4"/></button></div>
            <div><label className={lc}>Title / Position</label><input className={fc} value={exp.title} onChange={e=>updExp(i,"title",e.target.value)} placeholder="Senior Associate — Mergers & Acquisitions"/></div>
            <div className="grid grid-cols-2 gap-2">
              <div><label className={lc}>Firm / Organisation</label><input className={fc} value={exp.firm} onChange={e=>updExp(i,"firm",e.target.value)} placeholder="Clayton Utz"/></div>
              <div><label className={lc}>Location</label><input className={fc} value={exp.location} onChange={e=>updExp(i,"location",e.target.value)} placeholder="Sydney, NSW"/></div>
              <div><label className={lc}>Start</label><input className={fc} value={exp.start} onChange={e=>updExp(i,"start",e.target.value)} placeholder="Jan 2022"/></div>
              <div><label className={lc}>End</label><input className={fc} value={exp.end} onChange={e=>updExp(i,"end",e.target.value)} placeholder="Present"/></div>
            </div>
            <BulletInput items={exp.bullets||[]} onChange={v=>updExp(i,"bullets",v)} placeholder="Key responsibility or achievement"/>
          </div>
        ))}
        <button onClick={()=>setData(p=>({...p,experience:[...p.experience,{title:"",firm:"",location:"",start:"",end:"",bullets:[]}]}))} className="w-full py-2 border border-dashed border-stone-300 text-stone-500 hover:bg-stone-50 hover:border-stone-500 text-sm font-medium flex items-center justify-center gap-1.5 transition-all"><Plus className="w-4 h-4"/>Add role</button>
      </Accordion>

      <Accordion title="Transactions & Matters" badge={data.transactions.length} defaultOpen={false}>
        <p className="text-[11px] text-stone-400 -mt-1 leading-relaxed">List notable deals, cases, or matters that demonstrate your expertise.</p>
        {data.transactions.map((t,i)=>(
          <div key={i} className="bg-stone-50 border border-stone-200 p-3 space-y-2">
            <div className="flex justify-between items-center"><span className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest">Matter {i+1}</span><button onClick={()=>setData(p=>({...p,transactions:p.transactions.filter((_,j)=>j!==i)}))} className="text-stone-300 hover:text-red-500 transition-colors"><X className="w-4 h-4"/></button></div>
            <div><label className={lc}>Transaction / Matter</label><input className={fc} value={t.name} onChange={e=>updTxn(i,"name",e.target.value)} placeholder="$2.4B acquisition of listed infrastructure company"/></div>
            <div><label className={lc}>Your role <span className="normal-case font-normal text-stone-300">(optional)</span></label><textarea className={fc} rows={2} value={t.role} onChange={e=>updTxn(i,"role",e.target.value)} placeholder="Lead associate — acted for acquirer..."/></div>
          </div>
        ))}
        <button onClick={()=>setData(p=>({...p,transactions:[...p.transactions,{name:"",role:""}]}))} className="w-full py-2 border border-dashed border-stone-300 text-stone-500 hover:bg-stone-50 hover:border-stone-500 text-sm font-medium flex items-center justify-center gap-1.5 transition-all"><Plus className="w-4 h-4"/>Add transaction</button>
      </Accordion>

      <Accordion title="Practice Areas / Specialisations" defaultOpen={false}>
        <TagInput label="Areas (press Enter to add)" items={data.practiceAreas} onChange={v=>set("practiceAreas",v)} placeholder="e.g. Mergers & Acquisitions"/>
      </Accordion>

      <Accordion title="Publications & Speaking" badge={data.publications.length} defaultOpen={false}>
        {data.publications.map((p,i)=>(
          <div key={i} className="bg-stone-50 border border-stone-200 p-3 space-y-2">
            <div className="flex justify-between items-center"><span className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest">Item {i+1}</span><button onClick={()=>setData(pr=>({...pr,publications:pr.publications.filter((_,j)=>j!==i)}))} className="text-stone-300 hover:text-red-500 transition-colors"><X className="w-4 h-4"/></button></div>
            <div><label className={lc}>Title</label><input className={fc} value={p.title} onChange={e=>updPub(i,"title",e.target.value)} placeholder="ESG Considerations in Australian M&A"/></div>
            <div className="grid grid-cols-2 gap-2">
              <div><label className={lc}>Publication / Venue</label><input className={fc} value={p.publication} onChange={e=>updPub(i,"publication",e.target.value)} placeholder="Australian Law Journal"/></div>
              <div><label className={lc}>Year</label><input className={fc} value={p.date} onChange={e=>updPub(i,"date",e.target.value)} placeholder="2024"/></div>
            </div>
          </div>
        ))}
        <button onClick={()=>setData(p=>({...p,publications:[...p.publications,{title:"",publication:"",date:""}]}))} className="w-full py-2 border border-dashed border-stone-300 text-stone-500 hover:bg-stone-50 hover:border-stone-500 text-sm font-medium flex items-center justify-center gap-1.5 transition-all"><Plus className="w-4 h-4"/>Add publication</button>
      </Accordion>

      <Accordion title="Professional Memberships" defaultOpen={false}>
        <BulletInput items={data.memberships} onChange={v=>set("memberships",v)} placeholder="Law Society of NSW — Member"/>
      </Accordion>

      <Accordion title="Awards & Recognition" defaultOpen={false}>
        <BulletInput items={data.awards} onChange={v=>set("awards",v)} placeholder="Doyle's Guide — Leading Lawyer (2024)"/>
      </Accordion>
    </div>
  );
}

/* ============================================================
   TEMPLATE CARD
   ============================================================ */
function TemplateCard({ tpl, selected, onClick }) {
  return (
    <button onClick={onClick} className={`text-left p-3 border transition-all ${selected?"border-stone-800 bg-stone-900 shadow-lg":"border-stone-200 bg-white hover:border-stone-400 hover:shadow-sm"}`}>
      <div className="flex items-center gap-2 mb-1.5">
        <div className="flex gap-1">
          {tpl.swatch.map((c,i)=><div key={i} className="w-4 h-4 border border-white/20 shadow-sm" style={{ background:c }}/>)}
        </div>
        <span className={`text-sm font-bold tracking-wide ${selected?"text-white":"text-stone-800"}`}>{tpl.label}</span>
        {selected&&<Check className="w-3.5 h-3.5 text-stone-300 ml-auto"/>}
      </div>
      <p className={`text-[11px] leading-snug ${selected?"text-stone-400":"text-stone-500"}`}>{tpl.blurb}</p>
    </button>
  );
}

/* ============================================================
   MAIN APP
   ============================================================ */
export default function VaultCV() {
  const [unlocked, setUnlocked] = useState(false);
  const [pw, setPw] = useState("");
  const [pwErr, setPwErr] = useState(false);
  const [data, setData] = useState(SAMPLE);
  const [cl, setCl] = useState(SAMPLE_CL);
  const [tplId, setTplId] = useState("chambers");
  const [accentOverride, setAccentOverride] = useState(null);
  const [rightPanel, setRightPanel] = useState("resume");
  const [scale, setScale] = useState(0.75);
  const [clScale, setClScale] = useState(0.75);
  const [exporting, setExporting] = useState(null);
  const wrapRef    = useRef(null);
  const clWrapRef  = useRef(null);
  const previewRef = useRef(null);
  const clPrevRef  = useRef(null);
  const printRef   = useRef(null);
  const clPrintRef = useRef(null);

  const tpl = TEMPLATES.find(t=>t.id===tplId)||TEMPLATES[0];
  const effectiveAccent = accentOverride||tpl.accent;

  useEffect(()=>{
    const fit=()=>{
      if(wrapRef.current){ const w=wrapRef.current.clientWidth; setScale(Math.max(0.3,Math.min(1,(w-32)/(8.5*96)))); }
      if(clWrapRef.current){ const w=clWrapRef.current.clientWidth; setClScale(Math.max(0.3,Math.min(1,(w-32)/(8.5*96)))); }
    };
    fit(); window.addEventListener("resize",fit); return()=>window.removeEventListener("resize",fit);
  },[unlocked, rightPanel]);

  const handleUnlock=()=>{ if(pw==="VaultCV2026"){setUnlocked(true);setPwErr(false);}else{setPwErr(true);setPw("");} };

  const handleAutoFill=()=>setCl(p=>({...p,
    senderName:     data.name||p.senderName,
    senderEmail:    data.contact?.email||p.senderEmail,
    senderPhone:    data.contact?.phone||p.senderPhone,
    senderLocation: data.contact?.location||p.senderLocation,
    senderLinkedin: data.contact?.linkedin||p.senderLinkedin,
    senderTitle:    data.experience?.[0]?.title||p.senderTitle,
  }));

  const handlePDF    = ()=>{ setExporting("pdf");    try{exportPDF(printRef.current,data.name);}catch(e){alert("Export failed.");}finally{setTimeout(()=>setExporting(null),500);} };
  const handleWord   = ()=>{ setExporting("word");   try{exportWord(data,effectiveAccent);}catch(e){alert("Export failed.");}finally{setTimeout(()=>setExporting(null),400);} };
  const handleCLPDF  = ()=>{ setExporting("clpdf");  try{exportCLPDF(clPrintRef.current,cl.senderName);}catch(e){alert("Export failed.");}finally{setTimeout(()=>setExporting(null),500);} };
  const handleCLWord = ()=>{ setExporting("clword"); try{exportCLWord(cl,effectiveAccent);}catch(e){alert("Export failed.");}finally{setTimeout(()=>setExporting(null),400);} };

  // Shared template + accent picker used by both tabs
  const TemplatePicker = () => (
    <div className="px-4 pt-4 pb-3" style={{ background:"#fff", borderBottom:"1px solid #DDD9D0" }}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-semibold tracking-widest" style={{ color:"#999", fontFamily:"'IBM Plex Sans',sans-serif" }}>TEMPLATE</span>
        <div className="flex items-center gap-2">
          <span className="text-[10px]" style={{ color:"#999", fontFamily:"'IBM Plex Sans',sans-serif" }}>Accent</span>
          <label className="relative w-6 h-6 overflow-hidden border border-stone-300 cursor-pointer" style={{ background:effectiveAccent }}>
            <input type="color" value={effectiveAccent} onChange={e=>setAccentOverride(e.target.value)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"/>
          </label>
          <div className="flex gap-1">
            {ACCENT_PRESETS.map(c=>{
              const active=effectiveAccent.toLowerCase()===c.toLowerCase();
              return <button key={c} onClick={()=>setAccentOverride(c)} title={c} className="w-4 h-4 border transition-transform hover:scale-110" style={{ background:c, borderColor:active?"#0D1B2A":"#ddd", outline:active?"1px solid #0D1B2A":"none", outlineOffset:"1px" }}/>;
            })}
          </div>
          {accentOverride&&<button onClick={()=>setAccentOverride(null)} className="text-[10px] underline" style={{ color:"#B8963E", fontFamily:"'IBM Plex Sans',sans-serif" }}>Reset</button>}
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {TEMPLATES.map(t=><TemplateCard key={t.id} tpl={t} selected={tplId===t.id} onClick={()=>{setTplId(t.id);setAccentOverride(null);}}/>)}
      </div>
    </div>
  );

  /* ── PASSWORD GATE ── */
  if(!unlocked) return (
    <div className="min-h-screen w-full flex items-center justify-center" style={{ background:"#0D1B2A" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Serif:ital,wght@0,300;0,400;0,600;1,400&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap'); *, *::before, *::after{box-sizing:border-box;margin:0;padding:0;}`}</style>
      <div className="w-full max-w-sm mx-auto px-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 mb-5" style={{ background:"linear-gradient(135deg,#B8963E,#8B6914)", boxShadow:"0 8px 24px rgba(184,150,62,0.3)" }}>
            <Scale className="w-6 h-6 text-white"/>
          </div>
          <h1 className="text-3xl text-white mb-1" style={{ fontFamily:"'IBM Plex Serif',serif", fontWeight:300, letterSpacing:"0.04em" }}>VaultCV</h1>
          <p className="text-sm" style={{ color:"rgba(255,255,255,0.45)", fontFamily:"'IBM Plex Sans',sans-serif" }}>Legal &amp; Finance Resume + Cover Letter</p>
        </div>
        <div className="overflow-hidden" style={{ border:"1px solid rgba(255,255,255,0.08)", background:"rgba(255,255,255,0.04)" }}>
          <div className="px-5 py-4" style={{ borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
            <input type="password" value={pw} onChange={e=>{setPw(e.target.value);setPwErr(false);}} onKeyDown={e=>e.key==="Enter"&&handleUnlock()} autoFocus placeholder="Enter password"
              style={{ width:"100%", padding:"8px 12px", fontSize:"14px", background:"rgba(255,255,255,0.06)", border:`1px solid ${pwErr?"#e74c3c":"rgba(255,255,255,0.12)"}`, color:"#fff", outline:"none", fontFamily:"'IBM Plex Sans',sans-serif" }}/>
            {pwErr&&<p style={{ fontSize:"12px", color:"#e74c3c", marginTop:"8px", fontFamily:"'IBM Plex Sans',sans-serif" }}>Incorrect password — please try again.</p>}
          </div>
          <div className="px-5 py-3 flex justify-end" style={{ background:"rgba(255,255,255,0.02)" }}>
            <button onClick={handleUnlock} style={{ padding:"8px 20px", background:"linear-gradient(135deg,#B8963E,#8B6914)", color:"#fff", border:"none", fontSize:"13px", fontWeight:600, cursor:"pointer", fontFamily:"'IBM Plex Sans',sans-serif", letterSpacing:"0.04em" }}>UNLOCK</button>
          </div>
        </div>
      </div>
    </div>
  );

  /* ── MAIN EDITOR ── */
  return (
    <div className="min-h-screen w-full" style={{ background:"#F0EDE5" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Serif:ital,wght@0,300;0,400;0,600;0,700;1,400&family=IBM+Plex+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Inter:wght@400;500;600;700&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap'); *, *::before, *::after{box-sizing:border-box;} .vs::-webkit-scrollbar{width:5px;} .vs::-webkit-scrollbar-track{background:transparent;} .vs::-webkit-scrollbar-thumb{background:rgba(13,27,42,0.15);} .po{position:absolute;left:-99999px;top:0;width:8.5in;pointer-events:none;}`}</style>

      {/* Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-4 md:px-6 py-3" style={{ background:"#0D1B2A", borderBottom:"1px solid rgba(184,150,62,0.3)" }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center" style={{ background:"linear-gradient(135deg,#B8963E,#8B6914)" }}>
            <Scale className="w-4 h-4 text-white"/>
          </div>
          <div>
            <div className="text-sm font-semibold text-white" style={{ fontFamily:"'IBM Plex Serif',serif", fontWeight:400, letterSpacing:"0.06em" }}>VaultCV</div>
            <div className="text-[10px] tracking-widest" style={{ color:"rgba(184,150,62,0.8)", fontFamily:"'IBM Plex Sans',sans-serif" }}>LEGAL &amp; FINANCE · BUNDLE</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={()=>{setData(SAMPLE);setCl(SAMPLE_CL);setTplId("chambers");setAccentOverride(null);}}
            className="text-xs flex items-center gap-1.5 px-3 py-1.5 transition-colors" style={{ color:"rgba(255,255,255,0.5)", fontFamily:"'IBM Plex Sans',sans-serif" }}>
            <RotateCcw className="w-3.5 h-3.5"/>Sample
          </button>
          <button onClick={()=>{setData(EMPTY);setCl(EMPTY_CL);}}
            className="text-xs flex items-center gap-1.5 px-3 py-1.5 transition-colors" style={{ color:"rgba(255,255,255,0.5)", border:"1px solid rgba(255,255,255,0.1)", fontFamily:"'IBM Plex Sans',sans-serif" }}>
            <X className="w-3 h-3"/>Clear
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)]" style={{ minHeight:"calc(100vh - 49px)" }}>

        {/* LEFT — resume + cover letter form */}
        <aside className="bg-white vs" style={{ borderRight:"1px solid #DDD9D0", height:"calc(100vh - 49px)", overflowY:"auto" }}>
          <div className="p-5">
            <h2 className="font-semibold mb-1 tracking-wide" style={{ fontFamily:"'IBM Plex Serif',serif", fontSize:"16px", color:"#0D1B2A", fontWeight:400 }}>Resume</h2>
            <p className="text-xs mb-5 leading-relaxed" style={{ color:"#888", fontFamily:"'IBM Plex Sans',sans-serif" }}>Fill in your details — the preview updates live.</p>
            <ResumeForm data={data} setData={setData}/>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="flex-1 h-px" style={{ background:"linear-gradient(to right, transparent, #C8B98A)" }}/>
              <div className="flex items-center gap-1.5 px-3 py-1" style={{ background:"#F5F0E8", border:"1px solid #C8B98A" }}>
                <FileEdit className="w-3 h-3" style={{ color:"#8B6914" }}/>
                <span className="text-[11px] font-semibold tracking-widest" style={{ color:"#8B6914", fontFamily:"'IBM Plex Sans',sans-serif" }}>COVER LETTER</span>
              </div>
              <div className="flex-1 h-px" style={{ background:"linear-gradient(to left, transparent, #C8B98A)" }}/>
            </div>
            <p className="text-xs mb-4 leading-relaxed" style={{ color:"#888", fontFamily:"'IBM Plex Sans',sans-serif" }}>Your cover letter automatically matches the active template and accent colour.</p>
            <CoverLetterForm cl={cl} setCl={setCl} onAutoFill={handleAutoFill}/>
          </div>
        </aside>

        {/* RIGHT — tabs + preview */}
        <main className="flex flex-col overflow-hidden" style={{ height:"calc(100vh - 49px)" }}>

          {/* Tab bar */}
          <div className="flex items-end gap-0" style={{ background:"#0D1B2A", borderBottom:"1px solid rgba(184,150,62,0.25)", paddingTop:"0" }}>
            <button onClick={()=>setRightPanel("resume")} className="px-5 py-2.5 text-xs font-semibold tracking-widest transition-all" style={{ fontFamily:"'IBM Plex Sans',sans-serif", borderBottom: rightPanel==="resume"?"2px solid #B8963E":"2px solid transparent", color: rightPanel==="resume"?"#B8963E":"rgba(255,255,255,0.4)" }}>RESUME</button>
            <button onClick={()=>setRightPanel("coverletter")} className="px-5 py-2.5 text-xs font-semibold tracking-widest transition-all flex items-center gap-1.5" style={{ fontFamily:"'IBM Plex Sans',sans-serif", borderBottom: rightPanel==="coverletter"?"2px solid #B8963E":"2px solid transparent", color: rightPanel==="coverletter"?"#B8963E":"rgba(255,255,255,0.4)" }}>
              <FileEdit className="w-3 h-3"/>COVER LETTER
            </button>
          </div>

          {/* ── RESUME TAB ── */}
          {rightPanel==="resume"&&<>
            <TemplatePicker/>
            <div ref={wrapRef} className="flex-1 overflow-auto vs p-4 md:p-8" style={{ background:"#E8E4DA" }}>
              <div style={{ width:`${8.5*scale}in`, margin:"0 auto", paddingBottom:"2rem" }}>
                <div style={{ transform:`scale(${scale})`, transformOrigin:"top left", width:"8.5in" }}>
                  <div ref={previewRef}><ResumePreview templateId={tplId} data={data} accent={effectiveAccent}/></div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between px-4 py-3" style={{ background:"#0D1B2A", borderTop:"1px solid rgba(184,150,62,0.25)" }}>
              <div>
                <div className="text-[10px] tracking-widest" style={{ color:"rgba(255,255,255,0.3)", fontFamily:"'IBM Plex Sans',sans-serif" }}>TEMPLATE</div>
                <div className="text-sm" style={{ color:"#B8963E", fontFamily:"'IBM Plex Serif',serif", fontWeight:400, letterSpacing:"0.04em" }}>{tpl.label}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={handleWord} disabled={exporting!==null} className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold disabled:opacity-40 tracking-widest" style={{ border:"1px solid rgba(255,255,255,0.2)", color:"rgba(255,255,255,0.8)", background:"transparent", fontFamily:"'IBM Plex Sans',sans-serif" }}>
                  {exporting==="word"?<Loader2 className="w-4 h-4 animate-spin"/>:<FileText className="w-4 h-4"/>}WORD
                </button>
                <button onClick={handlePDF} disabled={exporting!==null} className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold disabled:opacity-40 tracking-widest" style={{ background:"linear-gradient(135deg,#B8963E,#8B6914)", color:"#fff", border:"none", fontFamily:"'IBM Plex Sans',sans-serif", boxShadow:"0 4px 12px rgba(184,150,62,0.3)" }}>
                  {exporting==="pdf"?<Loader2 className="w-4 h-4 animate-spin"/>:<Download className="w-4 h-4"/>}DOWNLOAD PDF
                </button>
              </div>
            </div>
          </>}

          {/* ── COVER LETTER TAB ── */}
          {rightPanel==="coverletter"&&<>
            <TemplatePicker/>
            <div ref={clWrapRef} className="flex-1 overflow-auto vs p-4 md:p-8" style={{ background:"#E8E4DA" }}>
              <div style={{ width:`${8.5*clScale}in`, margin:"0 auto", paddingBottom:"2rem" }}>
                <div style={{ transform:`scale(${clScale})`, transformOrigin:"top left", width:"8.5in" }}>
                  <div ref={clPrevRef}><CoverLetterPreview templateId={tplId} cl={cl} accent={effectiveAccent}/></div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between px-4 py-3" style={{ background:"#0D1B2A", borderTop:"1px solid rgba(184,150,62,0.25)" }}>
              <div>
                <div className="text-[10px] tracking-widest" style={{ color:"rgba(255,255,255,0.3)", fontFamily:"'IBM Plex Sans',sans-serif" }}>MATCHING</div>
                <div className="text-sm" style={{ color:"#B8963E", fontFamily:"'IBM Plex Serif',serif", fontWeight:400, letterSpacing:"0.04em" }}>{tpl.label} · Cover Letter</div>
              </div>
              <div className="flex gap-2">
                <button onClick={handleCLWord} disabled={exporting!==null} className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold disabled:opacity-40 tracking-widest" style={{ border:"1px solid rgba(255,255,255,0.2)", color:"rgba(255,255,255,0.8)", background:"transparent", fontFamily:"'IBM Plex Sans',sans-serif" }}>
                  {exporting==="clword"?<Loader2 className="w-4 h-4 animate-spin"/>:<FileText className="w-4 h-4"/>}WORD
                </button>
                <button onClick={handleCLPDF} disabled={exporting!==null} className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold disabled:opacity-40 tracking-widest" style={{ background:"linear-gradient(135deg,#B8963E,#8B6914)", color:"#fff", border:"none", fontFamily:"'IBM Plex Sans',sans-serif", boxShadow:"0 4px 12px rgba(184,150,62,0.3)" }}>
                  {exporting==="clpdf"?<Loader2 className="w-4 h-4 animate-spin"/>:<Download className="w-4 h-4"/>}DOWNLOAD PDF
                </button>
              </div>
            </div>
          </>}

        </main>
      </div>

      {/* Off-screen print areas */}
      <div ref={printRef} className="po" aria-hidden="true">
        <ResumePreview templateId={tplId} data={data} accent={effectiveAccent}/>
      </div>
      <div ref={clPrintRef} className="po" aria-hidden="true">
        <CoverLetterPreview templateId={tplId} cl={cl} accent={effectiveAccent}/>
      </div>
    </div>
  );
}
