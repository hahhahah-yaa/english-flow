import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const output = path.join(root, "data", "daily-content.json");
fs.mkdirSync(path.dirname(output), { recursive: true });

const today = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Europe/Rome", year: "numeric", month: "2-digit", day: "2-digit"
}).format(new Date());

const hash = (value) => [...value].reduce((n, c) => (n * 31 + c.charCodeAt(0)) >>> 0, 7);
const pick = (items, seed, offset = 0) => items[(seed + offset) % items.length];
const shuffle = (items, seed) => items.map((v, i) => ({v, k: hash(seed + ":" + i + ":" + v)})).sort((a,b)=>a.k-b.k).map(x=>x.v);
const seed = hash(today);

const vocabulary = [
  ["to clarify","to make an idea or statement easier to understand","Could you clarify the main point before we continue?","clarify a point / meaning / requirement"],
  ["coherent","clear, logical and well connected","The report presents a coherent argument from beginning to end.","coherent argument / structure / explanation"],
  ["to convey","to communicate an idea, feeling or message","The colour contrast helps convey a sense of urgency.","convey a message / meaning / emotion"],
  ["ambiguous","having more than one possible meaning or not being clear","The headline is ambiguous, so readers may interpret it differently.","ambiguous wording / message / instruction"],
  ["to anticipate","to expect something and prepare for it","The team anticipated delays and adjusted the schedule.","anticipate a problem / change / demand"],
  ["assumption","something believed to be true without proof","The research challenged our assumption about the audience.","make / question / challenge an assumption"],
  ["to allocate","to give something to a particular person, purpose or task","We allocated more time to testing the prototype.","allocate time / resources / a budget"],
  ["conventional","following ideas or methods that are widely accepted","The studio chose an unconventional format for the campaign.","conventional approach / design / method"],
  ["to derive","to get or develop something from a source","The visual identity derives from the building's original pattern.","derive from / derive meaning from"],
  ["to diminish","to become or make something smaller or less important","The extra details diminished the impact of the main image.","diminish the impact / value / importance"],
  ["feasible","possible and practical to do","The proposal is creative, but it may not be feasible within the budget.","feasible option / solution / plan"],
  ["to imply","to suggest something without saying it directly","Her response implied that the deadline could change.","imply that / strongly imply"],
  ["to interpret","to explain or understand the meaning of something","Different audiences may interpret the symbol in different ways.","interpret data / a message / a result"],
  ["to justify","to give a good reason for a choice or action","The designer used research to justify the final decision.","justify a decision / choice / cost"],
  ["notion","an idea, belief or understanding of something","The project challenges the notion of a perfect city.","notion of / common notion / basic notion"],
  ["to perceive","to notice or understand something in a particular way","Users perceived the new interface as easier to navigate.","perceive a difference / risk / message"],
  ["to preserve","to keep something in its original or good condition","The redesign preserves the brand's most recognisable feature.","preserve a tradition / quality / feature"],
  ["to retain","to keep or continue to have something","Examples help learners retain new vocabulary.","retain information / control / customers"],
  ["to reveal","to make something known or visible","The interviews revealed a gap between expectation and experience.","reveal a result / detail / problem"],
  ["to shift","to change position, direction or focus","The discussion shifted from appearance to accessibility.","shift focus / responsibility / perspective"],
  ["accurate","correct and free from mistakes","Check that the measurements are accurate before printing.","accurate information / description / measurement"],
  ["to alter","to change something, usually slightly","We altered the layout to make the text easier to read.","alter a design / plan / appearance"],
  ["capacity","the ability or space to do, contain or produce something","The course has the capacity to support different learning styles.","capacity to do / storage capacity"],
  ["to emphasise","to give special importance or attention to something","The final paragraph emphasises the need for further research.","emphasise a point / difference / importance"],
  ["to estimate","to make an approximate judgement about a number, size or value","We estimate that the project will take two weeks.","estimate the cost / time / value"],
  ["to occur","to happen, especially as an event or thought","The same problem occurred during the second test.","occur frequently / occur to someone"],
  ["to pursue","to continue trying to achieve something over time","She decided to pursue a career in illustration.","pursue a goal / career / interest"],
  ["to strengthen","to make something stronger or more effective","A specific example can strengthen your argument.","strengthen a relationship / argument / skill"],
  ["nuance","a small difference in meaning, feeling or tone","The two expressions are similar, but their nuance is different.","subtle nuance / shade of meaning"],
  ["to respond to","to say or do something as an answer or reaction","The company responded to customer feedback with a clearer guide.","respond to feedback / a question / a change"]
];

const grammarTemplates = [
  {q:"By the time the meeting started, Maya _____ the report.",choices:["has finished","had finished","was finish"],answer:1,why:"Use the past perfect for an action completed before another past event."},
  {q:"If I _____ more time, I would take an advanced writing course.",choices:["have","had","would have"],answer:1,why:"The second conditional uses if + past simple, followed by would + base verb."},
  {q:"The final design _____ by the client tomorrow.",choices:["will approve","will be approved","will have approving"],answer:1,why:"The future passive is will be + past participle."},
  {q:"The tutor recommended _____ the paragraph aloud.",choices:["to read","reading","read"],answer:1,why:"Recommend is commonly followed by a gerund when no object is used."},
  {q:"I wish I _____ more carefully before sending that email.",choices:["checked","had checked","would check"],answer:1,why:"Wish + past perfect expresses regret about a past action."},
  {q:"The team has worked on this project _____ March.",choices:["for","since","during"],answer:1,why:"Use since with the starting point of a period."},
  {q:"The new website _____ at the moment.",choices:["is being tested","is testing","has tested"],answer:0,why:"Present continuous passive: am/is/are being + past participle."},
  {q:"Despite _____ several problems, the team met the deadline.",choices:["face","facing","to face"],answer:1,why:"Despite is followed by a noun or gerund, not a finite clause."},
  {q:"She asked me where I _____ the reference image.",choices:["had found","did I find","have I found"],answer:0,why:"Reported questions use statement word order; the past perfect can show an earlier action."},
  {q:"If they had tested the prototype, they _____ the problem earlier.",choices:["would notice","would have noticed","noticed"],answer:1,why:"The third conditional uses if + past perfect and would have + past participle."},
  {q:"This is the illustrator _____ work inspired the campaign.",choices:["who","whose","which"],answer:1,why:"Whose expresses possession in a relative clause."},
  {q:"You _____ have printed all those copies; the meeting was cancelled.",choices:["needn't","mustn't","couldn't"],answer:0,why:"Needn't have + past participle means the action happened but was unnecessary."},
  {q:"Not only _____ the brief, but she also presented a new concept.",choices:["she understood","did she understand","she did understand"],answer:1,why:"When not only begins the clause, use subject–auxiliary inversion."},
  {q:"The more carefully you edit, _____ your writing becomes.",choices:["the clearer","clearer","the clearest"],answer:0,why:"Use the + comparative in both parts of the correlative comparative structure."},
  {q:"I am not used to _____ in front of a large audience.",choices:["speak","speaking","spoke"],answer:1,why:"Be used to is followed by a noun or gerund because to is a preposition here."},
  {q:"The instructions were _____ complicated for a beginner to follow.",choices:["too","enough","such"],answer:0,why:"Too + adjective + to-infinitive expresses more than is manageable."},
  {q:"The designer, _____ portfolio we reviewed, has joined the studio.",choices:["who","whose","which"],answer:1,why:"Whose links the person to something they possess or are associated with."},
  {q:"The lights are off and the door is locked. They _____ left already.",choices:["must have","should","would"],answer:0,why:"Must have + past participle expresses a strong deduction about the past."},
  {q:"You will not improve _____ you practise regularly.",choices:["unless","although","despite"],answer:0,why:"Unless means if not and introduces a condition."},
  {q:"It was _____ useful explanation that everyone understood the rule.",choices:["so","such a","too"],answer:1,why:"Such a + adjective + singular countable noun is the correct structure."}
];

const readingOpenings = [
  "A successful project rarely depends on one clever idea. It develops through observation, testing and decisions that respond to real needs.",
  "Digital tools make information easy to collect, but having access to information does not automatically lead to understanding.",
  "Public spaces are often judged by how they look, although their real value depends on how people use them every day.",
  "Creative constraints can feel restrictive at first. Yet a clear limit may help a team focus on the choices that matter most.",
  "Feedback can improve a piece of work, but only when comments are specific enough to guide the next decision."
];
const readingDetails = [
  "For this reason, teams should examine the context before choosing a solution. A method that works for one audience may create difficulties for another.",
  "Small tests can reveal problems that are difficult to notice from inside the project. They also give people a chance to explain what they actually need.",
  "The process takes time, and the first result is not always successful. However, careful revision often produces a clearer and more useful outcome.",
  "It is important to distinguish between an assumption and evidence. An assumption may be a useful starting point, but it should not replace observation.",
  "A practical solution does not have to be the most complicated one. It needs to solve the right problem and remain understandable to the people who use it."
];
const readingEndings = [
  "In the end, quality is not simply a matter of appearance; it is the result of thoughtful choices and continuous evaluation.",
  "The strongest approach is therefore flexible: it keeps a clear purpose while remaining open to new evidence.",
  "This suggests that progress comes not from collecting more material, but from using what we learn in a meaningful way."
];

const selectedWords = Array.from({length:10},(_,i)=>vocabulary[(seed + i*7) % vocabulary.length]);
const vocabQuestions = selectedWords.map((item,i)=>{
  const distractors = shuffle(vocabulary.filter(x=>x[0]!==item[0]).map(x=>x[0]),seed+i).slice(0,3);
  const choices = shuffle([item[0],...distractors],seed+i*11);
  return {id:"v"+i,word:item[0],meaning:item[1],sentence:item[2],collocation:item[3],choices,answer:choices.indexOf(item[0]),why:"The definition and sentence point to this expression. Notice the collocation as well."};
});
const grammarQuestions = Array.from({length:10},(_,i)=>{
  const item = grammarTemplates[(seed + i*3) % grammarTemplates.length];
  const choices = shuffle(item.choices,seed+i*13);
  const correctText = item.choices[item.answer];
  return {id:"g"+i,q:item.q,choices,answer:choices.indexOf(correctText),why:item.why};
});
const reading = {
  title: ["Designing with evidence","The value of a clear process","Learning beyond the screen","Small changes, lasting effects","Making feedback useful"][seed%5],
  level: "B1–B2",
  text: pick(readingOpenings,seed) + " " + pick(readingDetails,seed,1) + " " + pick(readingDetails,seed,3) + " " + pick(readingEndings,seed,2),
  questions: [
    {q:"What is the main idea of the passage?",choices:["A thoughtful process matters more than a single quick idea.","The most complex solution is always the best.","Research should happen only after a project is finished."],answer:0,why:"The passage focuses on context, evidence, testing and thoughtful decisions."},
    {q:"Why are small tests useful?",choices:["They remove the need for research.","They can reveal problems and real user needs.","They guarantee that the first idea will succeed."],answer:1,why:"The text explains that testing reveals issues that may be hard to notice otherwise."},
    {q:"What does the writer suggest about assumptions?",choices:["They should replace observation.","They are always incorrect.","They can be a starting point, but should be checked against evidence."],answer:2,why:"The passage explicitly distinguishes assumptions from evidence."},
    {q:"Which statement best matches the conclusion?",choices:["Progress depends on using information meaningfully.","Progress means collecting as much material as possible.","Appearance is the only measure of quality."],answer:0,why:"The final sentence emphasises meaningful application rather than collecting."}
  ]
};

let store = { version: 1, packs: [] };
if (fs.existsSync(output)) {
  try { store = JSON.parse(fs.readFileSync(output,"utf8")); } catch { /* rebuild a clean store */ }
}
if (!Array.isArray(store.packs)) store.packs = [];
if (store.packs.some(pack => pack.date === today)) {
  console.log("A daily pack already exists for " + today + "; nothing to do.");
  process.exit(0);
}
store.packs.push({date:today, vocabulary:vocabQuestions, grammar:grammarQuestions, reading});
store.packs = store.packs.slice(-90);
store.updatedAt = new Date().toISOString();
fs.writeFileSync(output, JSON.stringify(store,null,2) + "\n");
console.log("Generated " + today + ": " + vocabQuestions.length + " vocabulary questions, " + grammarQuestions.length + " grammar questions and one reading passage.");
