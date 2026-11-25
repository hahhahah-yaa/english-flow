"use client";

import { useState } from "react";

const topics = [
  { icon: "✳", name: "Grammar", detail: "Clear rules, one step at a time", level: "A1–C2", color: "mint" },
  { icon: "Aa", name: "Vocabulary", detail: "Words you can actually use", level: "Daily words", color: "peach" },
  { icon: "↗", name: "Reading", detail: "Short texts with guided practice", level: "All levels", color: "lavender" },
  { icon: "◎", name: "Exam practice", detail: "Prepare with confidence", level: "IELTS · Cambridge", color: "yellow" },
];

const tasks = [
  { time: "05 min", title: "Present simple vs. present continuous", type: "Grammar", done: false },
  { time: "05 min", title: "Learn 5 useful everyday words", type: "Vocabulary", done: false },
  { time: "10 min", title: "Read a short story", type: "Reading", done: false },
];

export default function Home() {
  const [active, setActive] = useState("Home");
  const [completed, setCompleted] = useState<number[]>([]);
  const [showQuiz, setShowQuiz] = useState(false);
  const [answer, setAnswer] = useState("");
  const [checked, setChecked] = useState(false);
  const nav = ["Home", "Learn", "Practice", "Vocabulary", "My progress"];
  const progress = Math.round((completed.length / tasks.length) * 100);

  return (
    <main className="shell">
      <aside className="sidebar">
        <a className="brand" href="#"><span className="brand-mark">e</span><span>english<span className="brand-light">flow</span></span></a>
        <p className="side-label">YOUR SPACE</p>
        <nav className="nav">
          {nav.map((item, i) => <button key={item} className={active === item ? "nav-item active" : "nav-item"} onClick={() => setActive(item)}><span className="nav-icon">{["⌂","▤","✎","Aa","◷"][i]}</span>{item}{item === "My progress" && <span className="nav-dot" />}</button>)}
        </nav>
        <div className="sidebar-bottom">
          <div className="streak"><span className="streak-icon">✦</span><div><strong>Keep your flow</strong><small>A little every day adds up.</small></div></div>
          <div className="profile"><div className="avatar">H</div><div><strong>My learning space</strong><small>Beginner · A2–B1</small></div><span className="more">···</span></div>
        </div>
      </aside>

      <section className="content">
        <header className="topbar"><div className="breadcrumb">My space <span>/</span> <strong>{active}</strong></div><div className="top-actions"><button className="icon-button" aria-label="Notifications">♧</button><button className="help-button">Need a hand? <span>↗</span></button></div></header>
        <div className="page">
          <section className="welcome">
            <div><p className="eyebrow">TUESDAY, NOVEMBER 25</p><h1>A little English,<br/><em>a lot of progress.</em></h1><p className="welcome-copy">Your space to learn, practise and find your own flow.<br/>No rush — just one step at a time.</p><button className="primary-button" onClick={() => document.getElementById("daily")?.scrollIntoView({behavior:"smooth"})}>Continue learning <span>→</span></button></div>
            <div className="welcome-art" aria-label="Decorative illustration"><div className="sun"></div><div className="art-card"><span className="art-word">hello!</span><span className="art-sub">YOUR DAILY<br/>DOSE OF ENGLISH</span><span className="art-spark">✳</span></div><span className="art-leaf leaf-one">〰</span><span className="art-leaf leaf-two">✦</span></div>
          </section>

          <section className="stats"><div className="stat"><span className="stat-icon mint-icon">✳</span><div><strong>{completed.length}<small> / 3</small></strong><span>Tasks completed</span></div></div><div className="stat"><span className="stat-icon peach-icon">♨</span><div><strong>0 <small>days</small></strong><span>Learning streak</span></div></div><div className="stat progress-stat"><div className="stat-head"><span>Today’s progress</span><strong>{progress}%</strong></div><div className="progress-track"><span style={{width: progress + "%"}} /></div><small>Every minute counts.</small></div></section>

          <section className="section" id="daily"><div className="section-heading"><div><p className="eyebrow">YOUR DAILY PLAN</p><h2>Small steps, <em>big things.</em></h2></div><span className="date-pill">~ 20 min today</span></div>
            <div className="task-list">{tasks.map((task,i)=><article className={completed.includes(i)?"task completed":"task"} key={task.title}><button className="task-check" aria-label="Mark task complete" onClick={()=>setCompleted(old=>old.includes(i)?old.filter(x=>x!==i):[...old,i])}>{completed.includes(i)?"✓":""}</button><div className="task-info"><span className="task-type">{task.type}</span><h3>{task.title}</h3><span className="task-time">◷ {task.time}</span></div><button className="task-arrow" onClick={()=>{setActive(task.type); if(i===0){setShowQuiz(true);setChecked(false);setAnswer("");} }}>{completed.includes(i)?"Done":"Start"} <span>→</span></button></article>)}</div>
          </section>

          {showQuiz && <section className="quiz-card"><button className="quiz-close" onClick={()=>setShowQuiz(false)}>×</button><p className="eyebrow">QUICK GRAMMAR CHECK</p><h2>Choose the correct sentence.</h2><p className="quiz-question">“I usually _____ coffee, but today I _____ tea.”</p><div className="answers">{["drink / am drinking","am drinking / drink","drinks / drinking"].map(opt=><button key={opt} className={answer===opt?"answer selected":"answer"} onClick={()=>{setAnswer(opt);setChecked(false)}}>{opt}</button>)}</div>{checked&&<p className={answer==="drink / am drinking"?"feedback correct":"feedback"}>{answer==="drink / am drinking"?"That’s right! Use present simple for habits and present continuous for what is happening today.":"Not quite. Think about a usual habit and something happening today."}</p>}<button className="primary-button" disabled={!answer} onClick={()=>setChecked(true)}>Check answer <span>→</span></button></section>}

          <section className="section explore"><div className="section-heading"><div><p className="eyebrow">FIND YOUR NEXT STEP</p><h2>What would you like <em>to learn?</em></h2></div><button className="text-link" onClick={()=>setActive("Learn")}>Explore all <span>→</span></button></div><div className="topic-grid">{topics.map(t=><button className={"topic-card "+t.color} key={t.name} onClick={()=>setActive(t.name)}><span className="topic-top"><span className="topic-icon">{t.icon}</span><span className="topic-level">{t.level}</span></span><span className="topic-name">{t.name}</span><span className="topic-detail">{t.detail}</span><span className="topic-link">Explore <span>↗</span></span></button>)}</div></section>
          <footer><span>Made for your learning journey.</span><span>English Flow <b>✳</b></span></footer>
        </div>
      </section>
    </main>
  );
}