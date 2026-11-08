const say=(l,en,hi)=>l==='hi'?hi:en;
export const relationshipSource='https://www.nhs.uk/every-mind-matters/lifes-challenges/maintaining-healthy-relationships-and-mental-wellbeing/';

// Fictional diary examples explain the report format, never the visitor's state.
export const feelingExamples={
 stress:{color:'#b39451',rows:[
  [5,'Work on your mind','काम का बोझ','In this example, work stayed on someone’s mind on five days.','इस उदाहरण में पाँच दिन काम का बोझ मन में रहा।'],
  [3,'Home responsibilities','घर की ज़िम्मेदारियाँ','Three days felt crowded with things to do at home.','तीन दिन घर के कामों से भरे हुए लगे।'],
  [2,'Time to unwind','आराम के पल','Two days included a little space to slow down.','दो दिन थोड़ा रुकने और आराम करने का समय मिला।']]},
 mood:{color:'#9580ad',rows:[
  [4,'Feeling low','मन उदास रहा','This fictional week includes four days of feeling low.','इस काल्पनिक सप्ताह में चार दिन मन उदास रहा।'],
  [3,'Hard to get going','शुरू करना मुश्किल लगा','Getting started felt difficult on three days.','तीन दिन काम शुरू करना मुश्किल लगा।'],
  [2,'Enjoying a moment','कोई पल अच्छा लगा','There were also two days with a moment of enjoyment.','दो दिन ऐसे भी रहे जब कोई पल अच्छा लगा।']]},
 worry:{color:'#638fac',rows:[
  [5,'Thoughts repeating','वही विचार लौटे','The same thoughts returned on five days in this example.','इस उदाहरण में पाँच दिन वही विचार लौटते रहे।'],
  [3,'Feeling on edge','बेचैनी महसूस हुई','Three days included a feeling of being on edge.','तीन दिन बेचैनी महसूस हुई।'],
  [2,'A quieter moment','कुछ शांत पल','Two days included a quieter moment. Both experiences can coexist.','दो दिन कुछ शांत पल भी थे। दोनों अनुभव साथ हो सकते हैं।']]},
 anger:{color:'#b78671',rows:[
  [3,'A tense conversation','बातचीत में तनाव','This person noticed tense conversations on three days.','इस व्यक्ति ने तीन दिन बातचीत में तनाव महसूस किया।'],
  [2,'Taking a pause','कुछ पल रुके','On two days, they paused before continuing a conversation.','दो दिन उन्होंने बातचीत जारी रखने से पहले कुछ पल लिए।'],
  [4,'Naming a feeling','एहसास को शब्द दिए','On four days, they found words for what they felt.','चार दिन वे अपने एहसास को शब्द दे पाए।']]},
 sleep:{color:'#829969',rows:[
  [4,'Trouble settling','सोने में मुश्किल','In this example, settling down was difficult on four nights.','इस उदाहरण में चार रात सोने में मुश्किल हुई।'],
  [3,'Waking tired','थकान के साथ जागे','Three mornings started with a feeling of tiredness.','तीन सुबह थकान के साथ शुरू हुईं।'],
  [2,'A restful night','आराम भरी नींद','Two nights felt restful. This is a diary example, not a sleep score.','दो रात आराम महसूस हुआ। यह diary का उदाहरण है, sleep score नहीं।']]},
 relationships:{color:'#ad8597',rows:[
  [4,'Keeping feelings inside','मन की बात रोकी','In this example, someone held back a feeling on four days.','इस उदाहरण में किसी ने चार दिन मन की बात रोकी।'],
  [2,'Feeling heard','किसी ने ध्यान से सुना','On two days, they felt listened to by someone close.','दो दिन उन्हें लगा कि किसी अपने ने ध्यान से सुना।'],
  [3,'Time to connect','साथ के कुछ पल','Three days included time together. This does not rate a partner or relationship.','तीन दिन साथ समय बिताया। इससे साथी या रिश्ते को कोई rating नहीं दी जाती।']]}
};

export function feelingIllustration(key){
 const c=feelingExamples[key]?.color||feelingExamples.stress.color;
 const person=`<circle cx="93" cy="72" r="20" fill="#dfba9c"/><path d="M71 71q1-30 25-27 21 3 19 31l-12-17-28 14" fill="#34575c"/><path d="M59 142q0-46 34-46t34 46" fill="${c}"/><path d="M74 110l-15 29m53-29 16 29" stroke="#dfba9c" stroke-width="11" stroke-linecap="round"/>`;
 const art={
 stress:`${person}<path d="M139 38h49v37h-29l-12 10V75h-8z" fill="#fff" stroke="${c}" stroke-width="2"/><path d="M150 48h27m-27 8h20m-20 8h24" stroke="${c}" stroke-width="2"/><rect x="141" y="108" width="33" height="37" rx="5" fill="#e3d6b4"/>`,
 mood:`${person}<circle cx="167" cy="61" r="22" fill="#ede4f3"/><path d="M151 65q16-15 32 0M157 48l-3-8m23 8 4-8" fill="none" stroke="${c}" stroke-width="2"/><path d="M160 145v-31m0 12q-22 0-17-19 20-2 17 19m0-1q20-5 18-22-21 1-18 22" fill="#b4c5a0" stroke="#81996c" stroke-width="2"/>`,
 worry:`${person}<path d="M142 50c-18-25 54-30 47-3-3 13-34 15-34 0s31-9 24 9-37 22-33 0" fill="none" stroke="${c}" stroke-width="3" stroke-linecap="round"/><path d="M154 123h32m-26 9h20" stroke="#b8cdd7" stroke-width="4" stroke-linecap="round"/>`,
 anger:`${person}<circle cx="169" cy="64" r="28" fill="#fff" stroke="#dfc2b3" stroke-width="2"/><path d="M162 51v26m14-26v26" stroke="${c}" stroke-width="7" stroke-linecap="round"/><path d="M149 119c9-11 13 11 23 0s14 11 23 0" fill="none" stroke="${c}" stroke-width="3"/>`,
 sleep:`<path d="M46 103h153v41H46z" fill="#b8c8a8"/><rect x="46" y="88" width="45" height="26" rx="10" fill="white"/><circle cx="73" cy="98" r="13" fill="#dfba9c"/><path d="M87 111q27-44 88-6l24 39H87" fill="${c}"/><path d="M172 28a24 24 0 1 0 24 29 22 22 0 0 1-24-29" fill="#e8cf8c"/><path d="M53 144v13m140-13v13" stroke="#697f72" stroke-width="4"/>`,
 relationships:`<circle cx="68" cy="72" r="19" fill="#dfba9c"/><circle cx="169" cy="72" r="19" fill="#b7876a"/><path d="M39 143q-2-48 29-48 29 0 29 48" fill="${c}"/><path d="M140 143q-2-48 29-48 29 0 29 48" fill="#82a6a3"/><path d="M87 112l22 16m41-16-22 16" stroke="#cba58b" stroke-width="10" stroke-linecap="round"/><path d="M100 32h39v28h-17l-11 10V60h-11z" fill="white" stroke="${c}" stroke-width="2"/><path d="M109 43h21m-21 7h15" stroke="${c}" stroke-width="2"/>`
 };
 return `<svg viewBox="0 0 240 170" class="mh-feeling-scene" aria-hidden="true"><ellipse cx="120" cy="85" rx="108" ry="73" fill="${c}" opacity=".09"/><path d="M29 145h183" stroke="#cbdad7" stroke-width="2" stroke-linecap="round"/>${art[key]||art.stress}</svg>`;
}

export function feelingReading(key,index,l='en'){
 const row=(feelingExamples[key]||feelingExamples.stress).rows[index];return row?.[l==='hi'?4:3]||'';
}
export function feelingVisual(key,l='en'){
 const example=feelingExamples[key]||feelingExamples.stress;
 return `<div class="mh-feeling-visual" style="--feeling:${example.color}"><div class="mh-feeling-visual-head">${feelingIllustration(key)}<div><p class="mh-kicker">${say(l,'AN EXAMPLE WEEK','एक सप्ताह का उदाहरण')}</p><h4>${say(l,'Small moments.<br>A clearer picture.','छोटे पल।<br>एक साफ़ तस्वीर।')}</h4></div></div><p class="mh-example-label">${say(l,'Fictional diary · Not your results','काल्पनिक diary · आपके नतीजे नहीं')}</p><div class="mh-feeling-bars" role="group" aria-label="${say(l,'Explore this fictional week','काल्पनिक सप्ताह देखें')}">${example.rows.map((r,i)=>`<button data-feeling-bar="${i}" data-feeling-key="${key}" aria-pressed="${i===0}" aria-controls="mh-feeling-reading"><span><span>${r[l==='hi'?2:1]}</span><b>${r[0]}<small> / 7 ${say(l,'days','दिन')}</small></b></span><span class="mh-feeling-track"><i style="width:${r[0]/7*100}%"></i></span></button>`).join('')}</div><p class="mh-feeling-reading" id="mh-feeling-reading" aria-live="polite">${feelingReading(key,0,l)}</p><span class="mh-feeling-hint">${say(l,'Tap a bar to explore · Days can overlap','Bar चुनकर देखें · एक दिन में कई अनुभव हो सकते हैं')}</span></div>`;
}
