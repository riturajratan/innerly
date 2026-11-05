// User-supplied 36-item reflection. Grammar edited without changing the supplied themes.
// Exploratory scoring only: this questionnaire and its translations are not validated.
export const VERSION='personality-36-v1';
const profile=(title,meaning,strength,watch,step)=>({title,meaning,strength,watch,step});
const definitions=[
 ['Social style','Social','More reserved','More outward','#6f8d62',[
 profile('More reserved','You tend to prefer quieter settings or working independently. This does not measure social ability.','You may make room for reflection before joining in.','Others may not realize that you would like to contribute.','Share one thought in a conversation at your own pace.'),
 profile('A flexible social style','Your answers suggest a mix of quiet time and interaction, depending on the setting.','You can choose a social pace that suits the situation.','Check your energy before agreeing to another plan.','Before your next plan, decide whether you want company or quiet.'),
 profile('More outward','You tend to enjoy group interaction and talking with others. This does not measure popularity.','You may find it natural to start a conversation.','Leave time for quieter people to speak.','In your next conversation, pause before adding your next thought.')]],
 ['Information style','Information','Concrete details','Ideas and patterns','#9c8d62',[
 profile('Grounded in details','Your answers lean toward practical experience and concrete information.','Specific examples may help you turn an idea into action.','A focus on immediate details can leave the wider picture unexplored.','For one task, write down both a concrete fact and the bigger goal.'),
 profile('Details and possibilities','Your answers suggest a mix of concrete information and broader ideas.','You can look for both evidence and connections.','Notice which information a decision actually needs.','Compare one practical example with one possible future outcome.'),
 profile('Drawn to patterns','Your answers lean toward future possibilities, ideas, and overall patterns.','You may notice connections across different pieces of information.','Check that a possibility is supported by the details.','Choose one idea and identify a concrete fact that would help you test it.')]],
 ['Planning style','Planning','Room to improvise','Clear structure','#8b83a8',[
 profile('Room to improvise','You tend to leave room to adjust plans as you go.','You may adapt when circumstances change.','An open plan can make priorities unclear.','Give one important task a small, realistic time window.'),
 profile('Structure with flexibility','Your answers suggest a mix of preparation and flexibility.','You can use a plan as a guide rather than a fixed rule.','Make clear which parts of the plan are essential.','Write one priority and one thing you can leave flexible.'),
 profile('Prepared and organized','You tend to prefer preparation, checklists, and clear schedules.','You may bring clarity and follow-through to a shared task.','Unexpected changes can make a detailed plan harder to use.','Leave a little spare time in your next plan for something unexpected.')]],
 ['Decision priorities','Priorities','People and values','Logic and efficiency','#b17d6b',[
 profile('People and values first','You tend to consider feelings, personal values, and relationships when deciding. This is a preference, not a measure of empathy.','You may remember to consider the human impact of a decision.','Consider the practical constraints as well as how people feel.','For one decision, list both the people affected and one practical constraint.'),
 profile('Balancing people and logic','Your answers suggest that you consider both human impact and objective criteria.','You can make space for different reasons behind a decision.','Name the criteria clearly when they pull in different directions.','For a shared decision, name one fact and one personal value that matter.'),
 profile('Logic and efficiency first','You tend to prioritize objective analysis, practical solutions, and efficiency. This is not a measure of intelligence.','You may make the reasons behind a decision explicit.','A logical solution can still affect people in unexpected ways.','Before giving advice, ask how the decision will affect the people involved.')]],
 ['Decision pace','Pace','More deliberation','Quicker action','#6b9291',[
 profile('Time to deliberate','You tend to weigh options and prioritize a considered choice over a quick one.','You may notice a consequence that a rushed decision misses.','Deliberation can become delay when the stakes are small.','Give one low-stakes decision a reasonable time limit.'),
 profile('A situational pace','Your answers suggest that your decision speed varies with the situation.','You can adjust the time you spend to the decision at hand.','Decide which choices genuinely need more thought.','Before deciding, ask how much this choice matters and how reversible it is.'),
 profile('Ready to act','You tend to respond quickly and prefer action over extended deliberation.','You may get started readily when circumstances change.','Pause when a choice has important or lasting consequences.','Before one important decision, name two options and one consequence of each.')]]
];
export const traits=definitions.map(([name,short,low,high,color,profiles])=>({name,short,low,high,color,profiles,intro:`${low} — ${high}`}));
const item=(dim,text,reverse=false)=>({dim,text,reverse});
export const questions=[
 item(0,'In a social gathering, you feel more energized by interacting with a large group of people.'),
 item(1,'When faced with a problem, you prefer to rely on concrete facts and details.',true),
 item(3,'When making decisions, you prioritize objective criteria over the impact on relationships.'),
 item(2,'You enjoy making plans and prefer a structured schedule.'),
 item(0,'You like spending time with friends to recharge after a busy day.'),
 item(1,'You prefer practical, hands-on experiences to exploring theories and concepts.',true),
 item(3,'You focus on facts and constructive solutions rather than emotional aspects and their impact on relationships.'),
 item(2,'When starting a project, you prefer a detailed plan rather than figuring it out as you go.'),
 item(0,'When facing a challenge, you prefer working through it independently.',true),
 item(1,'In a conversation, you focus more on future possibilities and patterns.'),
 item(3,'When faced with a problem, you rely more on your heart and empathy than on your head and reason.',true),
 item(2,'You tend to work better under pressure and close to a deadline.',true),
 item(0,'In your free time, you prefer quieter activities at home.',true),
 item(2,'When planning a trip, you prefer a detailed itinerary and a clear schedule.'),
 item(3,'You base decisions on logical importance and efficiency rather than values and their impact on people.'),
 item(2,'At work, you prefer a clear, organized workspace to a more flexible environment.'),
 item(0,'You enjoy small talk and find it easy to engage in.'),
 item(1,'You base decisions on practical considerations and real-world implications.',true),
 item(3,'In a group decision, you favor personal values and harmony over the most logical and rational choice.',true),
 item(2,'When packing for a trip, you prefer to plan and make a checklist in advance.'),
 item(3,'When making decisions, you rely more on your own instincts and feelings.',true),
 item(1,'When working on a project, you focus on specific tasks rather than the overall vision and goals.',true),
 item(3,'When giving feedback, you focus on objective analysis rather than the person’s feelings and emotional response.'),
 item(2,'You dislike unexpected changes and prefer to stick to the original plan.'),
 item(1,'In a group discussion, you prefer facts and details to ideas and theories.',true),
 item(4,'When faced with a new opportunity, you prefer to consider the advantages and disadvantages rather than go with the flow.',true),
 item(4,'You are accustomed to responding quickly to unexpected events.'),
 item(4,'You prefer immediate action rather than deliberating over various options.'),
 item(2,'If you have an appointment, you tend to improvise rather than prepare meticulously beforehand.',true),
 item(4,'You are cautious and often hesitate for a long time before making a decision.',true),
 item(4,'For you, making the right choice is more important than making it quickly.',true),
 item(0,'At gatherings with friends, you are usually quiet and reserved.',true),
 item(0,'Overall, you are somewhat conservative and distant when communicating.',true),
 {...item(null,'Your friends say you are a very calm person.'),context:'calm'},
 {...item(null,'You are good at observing other people’s emotions and responding appropriately.'),context:'attunement'},
 {...item(null,'Sometimes you neglect your own feelings because you care too much about other people’s feelings.'),context:'boundaries'}
];
export const QUESTION_COUNT=questions.length;
export const agreement=['Strongly disagree','Disagree','Neither agree nor disagree','Agree','Strongly agree'];
export const categoryCounts=traits.map((_,i)=>questions.filter(q=>q.dim===i).length);
function requireAnswers(answers){if(!Array.isArray(answers)||answers.length!==QUESTION_COUNT||Array.from(answers).some(a=>!Number.isInteger(a)||a<0||a>4))throw new Error(`Please answer all ${QUESTION_COUNT} questions.`)}
export function scoreAnswers(answers){requireAnswers(answers);const sums=traits.map(()=>0);questions.forEach((q,i)=>{if(q.dim!==null)sums[q.dim]+=q.reverse?4-answers[i]:answers[i]});return sums.map((sum,i)=>Math.round(sum/(categoryCounts[i]*4)*100))}
export function contextAnswers(answers){requireAnswers(answers);return questions.flatMap((q,i)=>q.context?[{key:q.context,answer:answers[i]}]:[])}
export const band=score=>score<40?0:score>60?2:1;
export function profileFor(scores){if(!Array.isArray(scores)||scores.length!==traits.length||Array.from(scores).some(s=>!Number.isFinite(s)||s<0||s>100))throw new Error('Invalid profile.');const ranked=scores.map((s,i)=>({i,distance:Math.abs(s-50)})).sort((a,b)=>b.distance-a.distance||a.i-b.i),i=ranked[0].i;return ranked[0].distance<=10?{title:'A balanced mix of preferences',summary:'Your answers sit near the middle across these five dimensions. Your preferences may depend on the situation and the people around you.'}:{title:traits[i].profiles[band(scores[i])].title,summary:traits[i].profiles[band(scores[i])].meaning}}
export function validDraft(d){return !!d&&d.version===VERSION&&Array.isArray(d.answers)&&d.answers.length===QUESTION_COUNT&&Array.from(d.answers).every(a=>a===null||(Number.isInteger(a)&&a>=0&&a<=4))&&Number.isInteger(d.index)&&d.index>=0&&d.index<QUESTION_COUNT}
