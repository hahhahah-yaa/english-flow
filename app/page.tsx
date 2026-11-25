"use client";

import { useEffect, useMemo, useState } from "react";

type ModuleName = "Home" | "Grammar" | "Vocabulary" | "Reading" | "Listening" | "Writing" | "Speaking" | "Exam practice" | "My progress";
type Task = { id: string; title: string; module: ModuleName; minutes: number; brief: string };
type ReviewItem = { id:string; module:string; prompt:string; answer:string; explanation:string; due:string; interval:number; reps:number; misses:number };
const plan: Task[] = [
  { id:"grammar", title:"Grammar in context", module:"Grammar", minutes:25, brief:"Study the rule, notice it in examples, then complete focused practice." },
  { id:"vocab", title:"Vocabulary: learn and retrieve", module:"Vocabulary", minutes:20, brief:"Learn collocations and actively recall them without looking." },
  { id:"reading", title:"Reading for meaning", module:"Reading", minutes:25, brief:"Read an authentic-style text, infer meaning and answer comprehension questions." },
  { id:"listening", title:"Listening and note-taking", module:"Listening", minutes:20, brief:"Use the listening script as a first step; read aloud, summarize and shadow." },
  { id:"writing", title:"Writing output", module:"Writing", minutes:20, brief:"Write a short structured response and check it against the task goals." },
  { id:"speaking", title:"Speaking out loud", module:"Speaking", minutes:10, brief:"Speak without scripting first, then improve your answer." },
];
const words = [
  {word:"to tackle", meaning:"to make an effort to deal with a difficult problem", example:"We need to tackle the problem before it gets worse.", collocation:"tackle a problem / challenge", prompt:"What challenge are you trying to tackle this month?"},
  {word:"drawback", meaning:"a disadvantage or negative part of something", example:"One drawback of working remotely is feeling isolated.", collocation:"a major / potential drawback", prompt:"What is one drawback of studying online?"},
  {word:"to enhance", meaning:"to improve the quality, value or strength of something", example:"Reading regularly can enhance your vocabulary.", collocation:"enhance your skills / experience", prompt:"What could enhance your learning routine?"},
  {word:"whereas", meaning:"used to compare two things and show a difference", example:"I enjoy speaking, whereas my friend prefers writing.", collocation:"A, whereas B", prompt:"Compare two ways of learning using whereas."},
  {word:"to come up with", meaning:"to think of or produce an idea or solution", example:"The team came up with a creative solution.", collocation:"come up with an idea / solution", prompt:"Describe an idea you came up with recently."},
  {word:"reliable", meaning:"able to be trusted or depended on", example:"A reliable source gives accurate information.", collocation:"reliable source / person / information", prompt:"What makes a source reliable?"},
  {word:"to outweigh", meaning:"to be more important or valuable than something else", example:"The benefits outweigh the risks.", collocation:"benefits outweigh drawbacks", prompt:"Do the benefits of social media outweigh its drawbacks?"},
  {word:"insight", meaning:"a clear and deep understanding of something", example:"The article provides insight into young people's habits.", collocation:"gain / provide insight into", prompt:"What has recently given you insight into a topic?"},
  {word:"to address", meaning:"to deal with a problem or topic", example:"The campaign addresses a serious social issue.", collocation:"address a problem / concern", prompt:"What issue should your community address?"},
  {word:"considerable", meaning:"large or important enough to be noticed", example:"The project requires considerable time and effort.", collocation:"considerable impact / effort", prompt:"What requires considerable effort in your studies?"},
  {word:"to rely on", meaning:"to depend on someone or something", example:"Many students rely on digital tools.", collocation:"rely on evidence / support", prompt:"When is it useful to rely on technology?"},
  {word:"approach", meaning:"a way of dealing with a situation or problem", example:"We need a different approach to the task.", collocation:"a practical / creative approach", prompt:"Describe an approach that works for you."},
  {word:"to maintain", meaning:"to keep something at the same level or condition", example:"It is difficult to maintain motivation every day.", collocation:"maintain progress / standards", prompt:"How do you maintain a good habit?"},
  {word:"aware", meaning:"knowing or understanding that something exists", example:"People are becoming more aware of waste.", collocation:"aware of an issue", prompt:"What should people be more aware of?"},
  {word:"to achieve", meaning:"to succeed in doing or getting something", example:"Small steps help you achieve long-term goals.", collocation:"achieve a goal / result", prompt:"What goal would you like to achieve?"},
  {word:"issue", meaning:"an important subject or problem", example:"The article discusses an issue affecting young people.", collocation:"address / raise an issue", prompt:"Choose an issue and explain why it matters?"},
  {word:"effective", meaning:"successful in producing the intended result", example:"Short, focused sessions can be effective.", collocation:"an effective method / strategy", prompt:"What is an effective way to learn vocabulary?"},
  {word:"to contribute", meaning:"to give or add something to help achieve a result", example:"Everyone can contribute to a better solution.", collocation:"contribute to a discussion / project", prompt:"How can you contribute to a group project?"},
  {word:"likely", meaning:"probable or expected to happen", example:"Regular practice is likely to improve fluency.", collocation:"likely to happen / succeed", prompt:"What is likely to help you improve?"},
  {word:"to distinguish", meaning:"to recognise or show the difference between things", example:"It is important to distinguish facts from opinions.", collocation:"distinguish between A and B", prompt:"How do you distinguish a fact from an opinion?"},
  {word:"to broaden", meaning:"to make something wider or more varied", example:"Travel can broaden your understanding of other cultures.", collocation:"broaden your knowledge / horizons", prompt:"What could broaden your horizons?"},
  {word:"significant", meaning:"important or large enough to have an effect", example:"The change had a significant impact on the team.", collocation:"significant impact / difference", prompt:"What change has had a significant impact on you?"},
  {word:"to adapt", meaning:"to change your behaviour or approach to suit a new situation", example:"Students need to adapt to different learning methods.", collocation:"adapt to change / a situation", prompt:"When have you had to adapt to a new situation?"},
  {word:"increasingly", meaning:"more and more over time", example:"People are increasingly concerned about online privacy.", collocation:"increasingly important / common", prompt:"What is becoming increasingly important?"},
  {word:"to prevent", meaning:"to stop something from happening", example:"Planning ahead can prevent unnecessary stress.", collocation:"prevent a problem / accident", prompt:"What can prevent misunderstandings?"},
  {word:"beneficial", meaning:"having a helpful or positive effect", example:"Regular feedback is beneficial for language learners.", collocation:"beneficial to / for someone", prompt:"What habit is beneficial to your studies?"},
  {word:"to emerge", meaning:"to appear or become known", example:"Several new ideas emerged during the discussion.", collocation:"an idea / trend emerges", prompt:"What new trend has emerged recently?"},
  {word:"to reflect", meaning:"to think carefully about something", example:"Taking time to reflect can help you improve.", collocation:"reflect on an experience / decision", prompt:"What do you usually reflect on after a project?"},
  {word:"consequence", meaning:"a result of an action or situation", example:"Every design decision has a consequence.", collocation:"serious / unintended consequence", prompt:"What is one possible consequence of using AI?"},
  {word:"to establish", meaning:"to create or start something that is intended to last", example:"The team established a clear set of priorities.", collocation:"establish a routine / relationship", prompt:"What routine would you like to establish?"},
  {word:"eventually", meaning:"in the end, especially after some time", example:"After several attempts, she eventually found a solution.", collocation:"eventually succeed / realise", prompt:"What did you eventually learn after trying?"},
  {word:"to assess", meaning:"to judge or evaluate something", example:"Teachers assess progress throughout the course.", collocation:"assess the quality / risk", prompt:"How do you assess your own progress?"},
  {word:"flexible", meaning:"able to change or adapt easily", example:"A flexible schedule can make studying easier.", collocation:"flexible approach / working hours", prompt:"When is it important to be flexible?"},
  {word:"to encourage", meaning:"to give someone support or confidence to do something", example:"Good feedback encourages learners to keep going.", collocation:"encourage someone to do something", prompt:"What encourages you to keep learning?"},
  {word:"overall", meaning:"considering everything; in general", example:"Overall, the project was successful despite a few problems.", collocation:"overall effect / impression", prompt:"Give an overall impression of a recent experience."},
  {word:"to require", meaning:"to need something or make it necessary", example:"Improving fluency requires regular practice.", collocation:"require time / effort / attention", prompt:"What skill requires the most effort for you?"},
  {word:"pressure", meaning:"a feeling of stress caused by demands or expectations", example:"Working under pressure can affect decision-making.", collocation:"under pressure / put pressure on", prompt:"How do you work under pressure?"},
  {word:"to promote", meaning:"to encourage or support the development of something", example:"The campaign promotes more sustainable habits.", collocation:"promote awareness / creativity", prompt:"What could promote creativity at school?"},
  {word:"reasonable", meaning:"fair, sensible or not too extreme", example:"It is reasonable to ask for more time.", collocation:"reasonable expectation / price", prompt:"What is a reasonable daily study goal?"},
  {word:"to indicate", meaning:"to show or suggest that something is true", example:"The results indicate a clear improvement.", collocation:"indicate a trend / preference", prompt:"What might indicate that someone is improving?"},
];
const grammarQuestions = [
  {q:"By the time we arrived, the film _____.", choices:["already started","had already started","has already started"], answer:1, why:"Use past perfect for an event completed before another past event."},
  {q:"If I _____ more time, I would take up another language.", choices:["have","had","would have"], answer:1, why:"The second conditional uses if + past simple, would + base verb."},
  {q:"The new library _____ next year.", choices:["will open","will be opened","will have opening"], answer:1, why:"The passive is be + past participle. Here, will be opened."},
  {q:"She suggested _____ the meeting until Friday.", choices:["to postpone","postpone","postponing"], answer:2, why:"Suggest is followed by a gerund (-ing form) in this structure."},
  {q:"I wish I _____ so much time on my phone yesterday.", choices:["didn't spend","hadn't spent","wouldn't spend"], answer:1, why:"Wish + past perfect expresses regret about a past situation."},
  {q:"I have lived in Florence _____ 2024.", choices:["for","since","during"], answer:1, why:"Use since with the starting point of a period."},
  {q:"The report _____ by the team at the moment.", choices:["is being prepared","is preparing","has prepared"], answer:0, why:"Present continuous passive: am/is/are being + past participle."},
  {q:"Despite _____ tired, she finished the assignment.", choices:["feel","feeling","to feel"], answer:1, why:"Despite is followed by a noun or gerund."},
  {q:"He asked me where I _____.", choices:["live","did I live","lived"], answer:2, why:"Reported questions use statement word order."},
  {q:"If you had told me, I _____ you.", choices:["would help","would have helped","helped"], answer:1, why:"Third conditional: if + past perfect, would have + past participle."},
  {q:"This is the designer _____ work won the award.", choices:["whose","which","who"], answer:0, why:"Whose shows possession in a relative clause."},
  {q:"You _____ have bought milk; we already had some.", choices:["mustn't","needn't","couldn't"], answer:1, why:"Needn't have + past participle means the action was unnecessary."},
  {q:"Not only _____ late, but he also forgot the documents.", choices:["he was","was he","he is"], answer:1, why:"Fronted not only requires inversion."},
  {q:"The more you practise, _____ confident you become.", choices:["the more","more","the most"], answer:0, why:"Use the + comparative in both parts of this structure."},
  {q:"No sooner _____ the room than the phone rang.", choices:["I entered","had I entered","I had entered"], answer:1, why:"No sooner at the beginning requires inversion."},
];
const readingTexts = [
"Although cities are often associated with noise and congestion, many are investing in small green spaces. These areas may seem insignificant compared with large parks, yet research suggests that nearby nature can encourage people to walk, meet neighbours and take short breaks. However, creating a green space is not enough on its own. If it is poorly maintained or difficult to access, residents may not use it. The most successful projects tend to involve local communities from the beginning, allowing people to shape a place that reflects their needs.",
"Digital tools have made learning more accessible, but access alone does not guarantee progress. Learners often collect resources without using them actively. A more effective approach is to set a clear goal, practise retrieving information from memory and return to difficult material after a delay. Learning depends less on how much content we consume and more on what we can recall and apply.",
"Creative work is sometimes described as a sudden burst of inspiration. In reality, many designers rely on research, experimentation and repeated revisions. Constraints can be useful because they force people to make choices. Yet a brief that is too restrictive may prevent unexpected ideas from emerging. The challenge is to understand the limits of a project while remaining open to alternatives.",
"Remote work offers flexibility and can reduce commuting time. Nevertheless, it may also blur the boundary between professional and personal life. Some employees value the freedom to organise their day, whereas others miss spontaneous conversations with colleagues. A successful arrangement depends on clear expectations, suitable tools and the needs of the people involved."
];
const dayThemes = [
{title:"Urban life & wellbeing",prompt:"Do small green spaces make cities better places to live?",listening:"Notice the contrast introduced by however."},
{title:"Learning & technology",prompt:"Does technology help people learn effectively, or does it distract them?",listening:"Listen for the difference between collecting and retrieving information."},
{title:"Design & creativity",prompt:"Do creative ideas come from freedom or constraints?",listening:"Notice how the speaker develops a point using contrast."},
{title:"Work & society",prompt:"Is flexible work always better than working in an office?",listening:"Identify an advantage, a drawback and the conclusion."}
];
const makeDailyReading = (seed:number,themeIndex:number) => {
  const sets=[
    {
      opening:["Many cities are trying to improve everyday life by making public spaces greener and easier to reach.","Urban planners increasingly recognise that the quality of a neighbourhood affects how people feel and behave.","As cities become more crowded, small public spaces can play a surprisingly important role."],
      detail:["A pocket park may give residents a place to rest, meet neighbours or take a short walk.","Even a few trees and benches can offer a break from traffic and busy streets.","These places can encourage people to spend time outdoors without travelling far."],
      contrast:["However, simply creating a green space does not guarantee that people will use it.","Nevertheless, the benefits may be limited if the space is unsafe or poorly maintained.","Yet a design that looks attractive in photographs may not meet the needs of local residents."],
      action:["For this reason, communities should be involved in planning and looking after shared spaces.","Successful projects often combine thoughtful design with regular maintenance and public feedback.","Local authorities need to consider access, safety and the everyday habits of the people who live nearby."],
      ending:["The real value of a public space is measured by how well it becomes part of daily life.","A small project can make a difference when it responds to the people who use it.","Good urban design is not only about appearance; it is also about making ordinary routines better."]
    },
    {
      opening:["Digital technology has made learning materials easier to access than ever before.","Online learning offers flexibility, but it also asks learners to manage their attention carefully.","Many students use digital tools to study, yet having more resources does not always lead to better results."],
      detail:["A learner might watch a video, save an article and collect new words in an app.","Short quizzes and reminders can help people return to material they would otherwise forget.","Tools that provide immediate feedback can make it easier to notice gaps in understanding."],
      contrast:["However, collecting information can create the feeling of progress without real learning.","The main difficulty is that easy access may encourage people to switch between tasks too often.","Still, technology cannot replace the effort required to recall and apply information."],
      action:["A more useful routine combines focused practice with regular review and clear goals.","Learners can benefit by choosing one task, testing themselves and revisiting difficult points later.","It helps to turn notifications off and use digital tools for a specific purpose."],
      ending:["In the end, the learner's habits matter more than the number of apps they use.","Technology is most effective when it supports active thinking rather than passive consumption.","Progress comes from using resources deliberately, not simply having them available."]
    },
    {
      opening:["Creative people are often expected to produce original ideas immediately.","Design is sometimes presented as inspiration, although the process usually involves research and repeated decisions.","A creative project rarely begins with a perfect idea; it develops through testing and revision."],
      detail:["A clear brief helps a designer understand the audience, purpose and limits of a project.","Trying several rough options can reveal possibilities that were not obvious at first.","Feedback from other people may expose weaknesses that the creator has overlooked."],
      contrast:["However, too many restrictions can make it difficult to explore unexpected directions.","At the same time, complete freedom may leave a team unsure where to begin.","An idea that seems exciting at first may also prove difficult to communicate clearly."],
      action:["The challenge is to treat constraints as useful information rather than obstacles.","Designers can protect experimentation by testing alternatives before choosing a final solution.","A balanced process leaves room for curiosity while keeping the project's purpose in view."],
      ending:["Strong creative work often comes from the relationship between exploration and careful judgement.","Originality is not only about having a new idea, but also about developing it effectively.","A thoughtful process can turn an uncertain starting point into a clear and meaningful result."]
    },
    {
      opening:["Flexible working has changed how many people organise their professional lives.","Remote work is often praised for giving employees more control over their time.","For many workers, the possibility of working from home has become an important part of job choice."],
      detail:["Avoiding a daily commute can leave more time for family, exercise or personal projects.","Some teams use online tools to share updates and organise tasks across different locations.","A flexible schedule may help people work when they feel most focused."],
      contrast:["Nevertheless, working from home can make it harder to separate work from personal life.","Not everyone has a quiet room or reliable internet connection.","Without informal conversations, colleagues may also feel less connected to the team."],
      action:["Clear expectations and regular communication can reduce some of these difficulties.","Employers should consider the needs of different workers rather than applying one rule to everyone.","A useful arrangement gives people flexibility while maintaining boundaries and support."],
      ending:["The best working model depends on the task, the team and the individual.","Flexibility works well when it is supported by trust and practical organisation.","Instead of asking which arrangement is always better, organisations should ask what helps people do their work well."]
    }
  ];
  const s=sets[((themeIndex%sets.length)+sets.length)%sets.length];
  const multipliers=[1,2,4,5,7];
  const pick=(a:string[],offset:number)=>a[((seed*multipliers[offset]+offset*2)%a.length+a.length)%a.length];
  return [pick(s.opening,0),pick(s.detail,1),pick(s.contrast,2),pick(s.action,3),pick(s.ending,4)].join(" ");
};

const readingQuestions = [
  {q:"Which statement best describes the passage?", choices:["It argues that one simple solution works in every situation.","It considers a topic and explains why context and practical choices matter.","It lists facts without giving any explanation."], answer:1},
  {q:"What is the role of contrast words such as however or nevertheless?", choices:["They repeat the same idea.","They show a sequence of dates.","They introduce a different or limiting point."], answer:2},
  {q:"What should you do when a text contains an unfamiliar word?", choices:["Use the surrounding sentence and the overall idea to infer meaning.","Stop reading and translate every word immediately.","Assume the word has the same meaning as in your language."], answer:0},
];
const listeningScript = "Many people believe that productivity means doing more in less time. But constant activity can make it harder to think clearly. One useful strategy is to divide your work into focused sessions and take short breaks between them. During a break, avoid switching to another demanding task. Instead, stand up, get some water or look outside. The aim is not to work endlessly, but to protect your attention so that the time you spend working is more effective.";

const makeDailyGrammar = (seed:number) => {
  const pick=(list:string[],n:number)=>list[((n%list.length)+list.length)%list.length];
  const people=["Maya","Leo","Sofia","Daniel","Amira","Luca","Eva","Noah"];
  const subjects=["the presentation","the campaign","the new website","the exhibition","the report","the project"];
  const verbs=[["finish","finished"],["submit","submitted"],["prepare","prepared"],["design","designed"],["review","reviewed"],["publish","published"]];
  const places=["at the studio","in the library","at university","during the meeting","at the office"];
  const templates=[
    (n:number)=>{const p=pick(people,n),v=pick(verbs,n+2),sub=pick(subjects,n+3);return {q:`By the time ${p} arrived, the team _____ ${sub}.`,choices:[`has already ${v[1]}`,`had already ${v[1]}`,`${v[1]} already`],answer:1,why:"Past perfect describes an action completed before another past event."};},
    (n:number)=>{const p=pick(people,n+1),pl=pick(places,n+2);return {q:`If ${p} _____ more free time, they would volunteer ${pl}.`,choices:["have","had","would have"],answer:1,why:"Second conditional: if + past simple, would + base verb."};},
    (n:number)=>{const sub=pick(subjects,n+2);return {q:`${sub.charAt(0).toUpperCase()+sub.slice(1)} _____ by the team this week.`,choices:["is being prepared","is preparing","has prepare"],answer:0,why:"Present continuous passive: am/is/are being + past participle."};},
    (n:number)=>{const p=pick(people,n+3),v=pick(["postpone","reorganise","improve","reconsider","simplify"],n+1),gerund=v.endsWith("e")&&!v.endsWith("ee")?v.slice(0,-1)+"ing":v+"ing";return {q:`${p} suggested _____ the plan before the deadline.`,choices:[`to ${v}`,v,gerund],answer:2,why:"Suggest is followed by a gerund (-ing form) in this structure."};},
    (n:number)=>{const p=pick(people,n+4);return {q:`${p} has been interested in graphic design _____ three years.`,choices:["since","for","during"],answer:1,why:"Use for with a duration; use since with a starting point."};},
    (n:number)=>{return {q:`She asked him where he _____.`,choices:["lived","did he live","does he live"],answer:0,why:"Reported questions use statement word order, not question inversion."};},
    (n:number)=>{const p=pick(people,n+6);return {q:`Despite _____ tired, ${p} completed the task.`,choices:["feel","feeling","to feel"],answer:1,why:"Despite is followed by a noun phrase or gerund."};},
    (n:number)=>{const p=pick(people,n+7),v=pick(["call","help","invite","remind"],n+3);return {q:`If you had _____ me earlier, I would have ${v} you.`,choices:["tell","told","telling"],answer:1,why:"Third conditional: if + past perfect, would have + past participle."};},
    (n:number)=>{const p=pick(people,n+2);return {q:`This is the designer _____ portfolio impressed the client.`,choices:["who","whose","which"],answer:1,why:"Whose is the possessive relative pronoun."};},
    (n:number)=>{const v=pick(["work","practise","read","revise"],n+1);return {q:`The more you ${v}, _____ confident you become.`,choices:["more","the more","most"],answer:1,why:"The comparative correlative uses the + comparative in both clauses."};}
  ];
  const start=(seed*7)%templates.length;
  return Array.from({length:5},(_,i)=>templates[(start+i*3)%templates.length]((seed*13+i*5)%people.length));
};

const todayKey = () => new Date().toLocaleDateString("en-CA");
const dayNumber = () => Math.floor(new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate()).getTime()/86400000);
const speakText = (text:string) => { if(typeof window!=="undefined" && "speechSynthesis" in window){window.speechSynthesis.cancel();const utterance=new SpeechSynthesisUtterance(text);utterance.lang="en-GB";utterance.rate=0.88;window.speechSynthesis.speak(utterance);} };

export default function Home() {
  const [active,setActive]=useState<ModuleName>("Home");
  const [done,setDone]=useState<string[]>([]);
  const [answers,setAnswers]=useState<Record<string,number>>({});
  const [revealed,setRevealed]=useState<Record<string,boolean>>({});
  const [wordIndex,setWordIndex]=useState(0);
  const [grammarSeed,setGrammarSeed]=useState(dayNumber());
  const [readingSeed,setReadingSeed]=useState(dayNumber());
  const [knownWords,setKnownWords]=useState<string[]>([]);
  const [mistakes,setMistakes]=useState<string[]>([]);
  const [reviewItems,setReviewItems]=useState<ReviewItem[]>([]);
  const [writing,setWriting]=useState("");\n  const [writingReview,setWritingReview]=useState(false);
  const [speakingNotes,setSpeakingNotes]=useState("");
  const [streak,setStreak]=useState(0);
  const [loaded,setLoaded]=useState(false);
  const dayIndex=dayNumber()%dayThemes.length;
  const dailyTheme=dayThemes[dayIndex];
  const dailyReading=makeDailyReading(readingSeed,dayIndex);
  const dailyGrammar=makeDailyGrammar(grammarSeed);
  const wordStart=(dayNumber()*7)%words.length;
  const dailyWords=Array.from({length:8},(_,i)=>words[(wordStart+i)%words.length]);
  const totalMinutes=plan.reduce((sum,t)=>sum+t.minutes,0);
  const finished=done.length;
  const percent=Math.round(finished/plan.length*100);
  const vocabDone=knownWords.length>=words.length;

  useEffect(()=>{
    try{
      const raw=localStorage.getItem("english-flow-progress");
      if(raw){const saved=JSON.parse(raw); if(saved.date===todayKey()){setDone(saved.done||[]);setKnownWords(saved.knownWords||[]);setMistakes(saved.mistakes||[]);setStreak(saved.streak||0);setReviewItems(saved.reviewItems||[]);setWriting(saved.writing||"");setSpeakingNotes(saved.speakingNotes||"");} else {setDone([]);setKnownWords(saved.knownWords||[]);setMistakes(saved.mistakes||[]);setStreak(saved.streak||0);}}
    }catch{}
    setLoaded(true);
  },[]);
  useEffect(()=>{
    if(!loaded)return;
    try{localStorage.setItem("english-flow-progress",JSON.stringify({date:todayKey(),done,knownWords,mistakes,reviewItems,streak,writing,speakingNotes}));}catch{}
  },[loaded,done,knownWords,mistakes,reviewItems,streak,writing,speakingNotes]);
  const markDone=(id:string)=>setDone(old=>old.includes(id)?old:[...old,id]);
  const dateAfter=(days:number)=>{const d=new Date();d.setHours(12,0,0,0);d.setDate(d.getDate()+days);return d.toLocaleDateString("en-CA");};
  const addReview=(item:Omit<ReviewItem,"due"|"interval"|"reps"|"misses">)=>setReviewItems(old=>{
    const existing=old.find(x=>x.id===item.id);
    if(existing)return old.map(x=>x.id===item.id?{...x,due:todayKey(),misses:x.misses+1}:x);
    return [{...item,due:todayKey(),interval:0,reps:0,misses:1},...old];
  });
  const rateReview=(id:string,remembered:boolean)=>setReviewItems(old=>old.map(x=>{
    if(x.id!==id)return x;
    if(!remembered)return {...x,due:dateAfter(1),interval:1,reps:0,misses:x.misses+1};
    const intervals=[1,3,7,14,30];
    const next=intervals[Math.min(x.reps,intervals.length-1)];
    return {...x,due:dateAfter(next),interval:next,reps:x.reps+1};
  }));
  const dueReviews=reviewItems.filter(x=>x.due<=todayKey()).sort((a,b)=>a.due.localeCompare(b.due));

  const nav:ModuleName[]=["Home","Grammar","Vocabulary","Reading","Listening","Writing","Speaking","Exam practice","My progress"];
  const start=(moduleName:ModuleName)=>{setActive(moduleName);window.scrollTo({top:0,behavior:"smooth"});};
  const score=useMemo(()=>dailyGrammar.reduce((n,q,i)=>n+(answers["g"+i]===q.answer?1:0),0),[answers,dailyGrammar]);
  return <main className="shell">
    <aside className="sidebar"><a className="brand" href="#" onClick={e=>{e.preventDefault();start("Home")}}><span className="brand-mark">e</span><span>english<span className="brand-light">flow</span></span></a>
      <p className="side-label">YOUR STUDY SPACE</p><nav className="nav">{nav.map((item,i)=><button key={item} className={active===item?"nav-item active":"nav-item"} onClick={()=>start(item)}><span className="nav-icon">{["⌂","▤","Aa","↗","耳","✎","◉","◎","◷"][i]}</span>{item}</button>)}</nav>
      <div className="sidebar-bottom"><div className="streak"><span className="streak-icon">✦</span><div><strong>Deep study mode</strong><small>{totalMinutes} focused minutes a day</small></div></div><div className="profile"><div className="avatar">B1</div><div><strong>Learning level</strong><small>B1 → B2 → C1</small></div></div></div>
    </aside>
    <section className="content"><header className="topbar"><div className="breadcrumb">English Flow <span>/</span> <strong>{active}</strong></div><div className="top-actions"><span className="date-pill">Daily intensive · {totalMinutes} min</span></div></header>
    <div className="page">
    {active==="Home"&&<>
      <section className="welcome"><div><p className="eyebrow">YOUR B1 → C1 JOURNEY</p><h1>Go deeper.<br/><em>Express yourself.</em></h1><p className="welcome-copy">A focused daily routine to build accurate, confident and independent English.<br/>Study actively. Retrieve. Apply. Repeat.</p><p><b>Today’s theme:</b> {dailyTheme.title}</p><p className="task-time">{dailyTheme.prompt}</p><button className="primary-button" onClick={()=>start(plan.find(t=>!done.includes(t.id))?.module||"My progress")}>Start today's session <span>→</span></button></div><div className="welcome-art"><div className="sun"/><div className="art-card"><span className="art-word">B1 → C1</span><span className="art-sub">DAILY PRACTICE<br/>REAL PROGRESS</span><span className="art-spark">✳</span></div></div></section>
      <section className="stats"><div className="stat"><span className="stat-icon mint-icon">✳</span><div><strong>{finished}<small> / {plan.length}</small></strong><span>Daily blocks</span></div></div><div className="stat"><span className="stat-icon peach-icon">◷</span><div><strong>{done.reduce((n,id)=>n+(plan.find(t=>t.id===id)?.minutes||0),0)}<small> min</small></strong><span>Focused today</span></div></div><div className="stat progress-stat"><div className="stat-head"><span>Today's session</span><strong>{percent}%</strong></div><div className="progress-track"><span style={{width:percent+"%"}}/></div><small>Complete each block to finish your daily study.</small></div></section>
      <section className="section"><div className="section-heading"><div><p className="eyebrow">DAILY INTENSIVE PLAN</p><h2>Today's work, <em>step by step.</em></h2></div><span className="date-pill">~ {Math.floor(totalMinutes/60)}h {totalMinutes%60}m</span></div><div className="task-list">{plan.map(t=><article className={done.includes(t.id)?"task completed":"task"} key={t.id}><button className="task-check" onClick={()=>markDone(t.id)} aria-label="Complete task">{done.includes(t.id)?"✓":""}</button><div className="task-info"><span className="task-type">{t.module} · {t.minutes} min</span><h3>{t.title}</h3><span className="task-time">{t.brief}</span></div><button className="task-arrow" onClick={()=>start(t.module)}>{done.includes(t.id)?"Review":"Start"} <span>→</span></button></article>)}</div></section>
      <section className="section explore"><div className="section-heading"><div><p className="eyebrow">SKILLS</p><h2>Train every <em>side of English.</em></h2></div></div><div className="topic-grid">{nav.slice(1,8).map((name,i)=><button className={"topic-card "+["mint","peach","lavender","yellow"][i%4]} key={name} onClick={()=>start(name)}><span className="topic-top"><span className="topic-icon">{["✳","Aa","↗","耳","✎","◉","◎"][i]}</span><span className="topic-level">B1–C1</span></span><span className="topic-name">{name}</span><span className="topic-detail">Practice, feedback and active recall</span><span className="topic-link">Open module <span>↗</span></span></button>)}</div></section>
    </>}
    {active==="Grammar"&&<section className="section"><p className="eyebrow">GRAMMAR · B1/B2</p><h1>Grammar in context</h1><p className="welcome-copy">Fresh practice is generated locally from grammar patterns and changing contexts. Choose an answer, then read the explanation.</p><button className="answer" onClick={()=>{setGrammarSeed(s=>s+1);setAnswers(a=>Object.fromEntries(Object.entries(a).filter(([k])=>!k.startsWith("g"))));setRevealed(r=>Object.fromEntries(Object.entries(r).filter(([k])=>!k.startsWith("g"))));}}>Generate another set ↻</button><div className="task-list">{dailyGrammar.map((q,i)=><article className="task" key={i} style={{display:"block"}}><span className="task-type">GENERATED QUESTION {i+1} / {dailyGrammar.length}</span><h3 style={{fontSize:16}}>{q.q}</h3><div className="answers">{q.choices.map((choice,j)=><button key={j} className={answers["g"+i]===j?"answer selected":"answer"} onClick={()=>{setAnswers(a=>({...a,["g"+i]:j}));if(j!==q.answer){setMistakes(old=>old.includes("Grammar "+(i+1))?old:[...old,"Grammar "+(i+1)]);addReview({id:"g-"+dayNumber()+"-"+grammarSeed+"-"+i,module:"Grammar",prompt:q.q,answer:q.choices[q.answer],explanation:q.why});}else setMistakes(old=>old.filter(x=>x!=="Grammar "+(i+1)));}}>{choice}</button>)}</div><button className="text-link" onClick={()=>setRevealed(r=>({...r,["g"+i]:!r["g"+i]}))}>{revealed["g"+i]?"Hide explanation":"Check / explain"}</button>{revealed["g"+i]&&<p className={answers["g"+i]===q.answer?"feedback correct":"feedback"}>{answers["g"+i]===q.answer?"Correct. ":"Review: "}{q.why}</p>}</article>)}</div><p><b>Score:</b> {score}/{dailyGrammar.length} · explanations opened {dailyGrammar.filter((_,i)=>revealed["g"+i]).length}/{dailyGrammar.length}</p><button className="primary-button" onClick={()=>markDone("grammar")}>Complete grammar block →</button></section>}
    {active==="Vocabulary"&&<section className="section"><p className="eyebrow">VOCABULARY · B1/B2</p><h1>Words you can use</h1><p className="welcome-copy">Learn the meaning, collocation and example. Then create your own sentence before marking it known.</p><div className="quiz-card"><p className="task-type">WORD {wordIndex+1} / {dailyWords.length}</p><h2 style={{fontSize:32}}>{dailyWords[wordIndex].word}</h2><p>{dailyWords[wordIndex].meaning}</p><p><b>Common use:</b> {dailyWords[wordIndex].collocation}</p><blockquote>{dailyWords[wordIndex].example}</blockquote><button className="answer" onClick={()=>speakText(dailyWords[wordIndex].example)}>▶ Listen to example</button><p><b>Try it:</b> {dailyWords[wordIndex].prompt}</p><textarea value={writing} onChange={e=>setWriting(e.target.value)} placeholder="Write your own sentence or answer here…" rows={4} style={{width:"100%",padding:12,border:"1px solid #e3e9e2",borderRadius:10,font:"inherit"}}/><div className="answers"><button className="primary-button" onClick={()=>{setKnownWords(old=>old.includes(dailyWords[wordIndex].word)?old:[...old,dailyWords[wordIndex].word]);setWriting("");setWordIndex((wordIndex+1)%dailyWords.length)}}>I can use this word →</button><button className="answer" onClick={()=>setWordIndex((wordIndex+1)%dailyWords.length)}>Next / review later</button></div><p className="task-time">Words reviewed: {knownWords.length} · {knownWords.length}/{words.length}</p></div><button className="primary-button" onClick={()=>markDone("vocab")}>Complete vocabulary block →</button></section>}
    {active==="Reading"&&<section className="section"><p className="eyebrow">READING · B2</p><h1>{dailyTheme.title}</h1><p className="task-time">Read once for the main idea. Read again and underline linking words and unfamiliar phrases.</p><button className="answer" onClick={()=>{setReadingSeed(s=>s+1);setAnswers(a=>Object.fromEntries(Object.entries(a).filter(([k])=>!k.startsWith("r"))));setRevealed(r=>Object.fromEntries(Object.entries(r).filter(([k])=>!k.startsWith("r"))));}}>Generate another reading ↻</button><article className="quiz-card" style={{fontSize:16,lineHeight:1.9}}>{dailyReading}</article><div className="task-list">{readingQuestions.map((q,i)=><article className="task" key={i} style={{display:"block"}}><h3>{i+1}. {q.q}</h3><div className="answers">{q.choices.map((choice,j)=><button key={j} className={answers["r"+i]===j?"answer selected":"answer"} onClick={()=>{setAnswers(a=>({...a,["r"+i]:j}));if(j!==q.answer){setMistakes(old=>old.includes("Reading "+(i+1))?old:[...old,"Reading "+(i+1)]);addReview({id:"r-"+dayNumber()+"-"+readingSeed+"-"+i,module:"Reading",prompt:q.q,answer:q.choices[q.answer],explanation:"Read the passage again and locate the sentence that supports this answer."});}else setMistakes(old=>old.filter(x=>x!=="Reading "+(i+1)));}}>{choice}</button>)}</div><button className="text-link" onClick={()=>setRevealed(r=>({...r,["r"+i]:true}))}>Check answer</button>{revealed["r"+i]&&<p className={answers["r"+i]===q.answer?"feedback correct":"feedback"}>{answers["r"+i]===q.answer?"Correct.":"Not quite. "}Correct answer: {q.choices[q.answer]}</p>}</article>)}</div><button className="primary-button" onClick={()=>markDone("reading")}>Complete reading block →</button></section>}
    {active==="Listening"&&<section className="section"><p className="eyebrow">LISTENING · NOTE-TAKING</p><h1>Protect your attention</h1><p className="welcome-copy">Use the built-in English voice to listen, then cover the script and recall the key ideas.</p><div className="quiz-card"><p style={{lineHeight:1.9}}>{listeningScript}</p><button className="answer" onClick={()=>speakText(listeningScript)}>▶ Play audio</button> <button className="answer" onClick={()=>{if("speechSynthesis" in window)window.speechSynthesis.cancel()}}>■ Stop</button><p className="task-time">{dailyTheme.listening}</p><h3>Recall without looking</h3><p>Write three key ideas you remember, then compare with the text.</p><textarea value={writing} onChange={e=>setWriting(e.target.value)} rows={5} placeholder="1. …&#10;2. …&#10;3. …" style={{width:"100%",padding:12,border:"1px solid #e3e9e2",borderRadius:10,font:"inherit"}}/><button className="primary-button" onClick={()=>markDone("listening")}>Complete listening block →</button></div></section>}
    {active==="Writing"&&<section className="section"><p className="eyebrow">WRITING · B2</p><h1>Build a clear argument</h1><p className="welcome-copy">Write 180–220 words. Give a clear position, two developed reasons, an example and a short conclusion.</p><div className="quiz-card"><h3>Essay question</h3><p>Some people believe that university students should study only subjects that will help them find a job. Others think university should offer a wider education. Discuss both views and give your opinion.</p><textarea value={writing} onChange={e=>setWriting(e.target.value)} rows={14} placeholder="Write your essay here…" style={{width:"100%",padding:12,border:"1px solid #e3e9e2",borderRadius:10,font:"inherit",lineHeight:1.7}}/><p className="task-time">Word count: {writing.trim()?writing.trim().split(/\s+/).length:0} · Aim for 180–220 words</p><h3>Self-check before finishing</h3>{["I answered both parts of the question.","Each paragraph has one clear main idea.","I used linking phrases naturally.","I checked verb forms, articles and punctuation.","My conclusion follows from my arguments."].map(x=><label key={x} style={{display:"block",padding:"8px 0"}}><input type="checkbox"/> {x}</label>)}<button className="primary-button" onClick={()=>markDone("writing")}>Save and complete writing →</button></div></section>}
    {active==="Speaking"&&<section className="section"><p className="eyebrow">SPEAKING · FLUENCY</p><h1>Speak, then refine</h1><p className="welcome-copy">Speak for 90 seconds before writing notes. Record yourself on your phone if possible, then listen for pauses and repeated words.</p><div className="quiz-card"><h3>Speaking prompt</h3><p>Describe a time when you had to learn something difficult. You should say what you learned, why it was difficult, how you dealt with it, and what you learned about yourself.</p><p><b>Useful language:</b> at first · what I found challenging was… · I gradually realised… · looking back…</p><textarea value={speakingNotes} onChange={e=>setSpeakingNotes(e.target.value)} rows={6} placeholder="After speaking, note your key ideas and any words you struggled to find." style={{width:"100%",padding:12,border:"1px solid #e3e9e2",borderRadius:10,font:"inherit"}}/><button className="primary-button" onClick={()=>markDone("speaking")}>I spoke and reviewed →</button></div></section>}
    {active==="Exam practice"&&<section className="section"><p className="eyebrow">EXAM PRACTICE · B2</p><h1>Exam-style challenge</h1><p className="welcome-copy">Start with a short Use of English task. Read the whole sentence before choosing.</p><div className="quiz-card"><h3>Choose the best option</h3><p>Despite _____ exhausted, she managed to finish the report.</p><div className="answers">{["be","being","was"].map((x,i)=><button className={answers.exam===i?"answer selected":"answer"} key={x} onClick={()=>setAnswers(a=>({...a,exam:i}))}>{x}</button>)}</div><button className="text-link" onClick={()=>setRevealed(r=>({...r,exam:true}))}>Check answer</button>{revealed.exam&&<p className={answers.exam===1?"feedback correct":"feedback"}>Answer: being. Despite is followed by a noun or gerund, not a full clause.</p>}<hr/><h3>Writing / speaking extension</h3><p>Explain the difference between although and despite. Give one example of each.</p><textarea value={writing} onChange={e=>setWriting(e.target.value)} rows={4} placeholder="Explain the grammar in your own words…" style={{width:"100%",padding:12,border:"1px solid #e3e9e2",borderRadius:10,font:"inherit"}}/><button className="primary-button" onClick={()=>markDone("exam")}>Complete exam challenge →</button></div></section>}
    {active==="My progress"&&<section className="section"><p className="eyebrow">YOUR PROGRESS</p><h1>Consistency builds fluency.</h1><div className="quiz-card"><h2>{percent}%</h2><div className="progress-track"><span style={{width:percent+"%"}}/></div><p>{finished} of {plan.length} daily blocks completed · {done.reduce((n,id)=>n+(plan.find(t=>t.id===id)?.minutes||0),0)} focused minutes</p><p>Vocabulary reviewed: {knownWords.length}/{words.length} words</p><p>Grammar questions correct: {score}/{grammarQuestions.length}</p><h3>Spaced review</h3><p>Missed questions are saved on this device. Review due cards, reveal the answer, then rate how well you remembered it. Successful reviews are scheduled after 1, 3, 7, 14 and 30 days; difficult cards return tomorrow.</p><p><b>Due today:</b> {dueReviews.length} · <b>Saved:</b> {reviewItems.length}</p>{dueReviews.length===0?<p className="feedback correct">You're up to date. New mistakes will appear here for review.</p>:<div className="task-list">{dueReviews.map(item=><article className="task" key={item.id} style={{display:"block"}}><span className="task-type">{item.module} · {item.misses} {item.misses===1?"mistake":"mistakes"}</span><h3>{item.prompt}</h3><button className="text-link" onClick={()=>setRevealed(old=>({...old,["rv-"+item.id]:!old["rv-"+item.id]}))}>{revealed["rv-"+item.id]?"Hide answer":"Reveal answer"}</button>{revealed["rv-"+item.id]&&<p className="feedback correct"><b>{item.answer}</b><br/>{item.explanation}</p>}{revealed["rv-"+item.id]&&<div className="answers"><button className="answer" onClick={()=>rateReview(item.id,true)}>I remembered ✓</button><button className="answer" onClick={()=>rateReview(item.id,false)}>Still difficult ↻</button></div>}</article>)}</div>}<button className="answer" onClick={()=>{setDone([]);setAnswers({});setRevealed({});setKnownWords([]);setMistakes([]);setWritingReview(false)}}>Reset today's progress</button></div><h2>How to move from B1 to B2/C1</h2><p>At B1, focus on accuracy and building range. At B2, develop arguments, understand longer texts and use collocations naturally. C1 requires nuance, flexible language and sustained independent output. This platform is a daily practice tool; progress also needs feedback from real reading, listening and conversation.</p></section>}
    {active!=="Home"&&<button className="text-link" onClick={()=>start("Home")}>← Back to dashboard</button>}
    <footer><span>Study with intention. Review with honesty.</span><span>English Flow <b>✳</b></span></footer>
    </div></section>
  </main>;
}
