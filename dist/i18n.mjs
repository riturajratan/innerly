export function resolveLocale({url='',saved='',languages=[]}={}){let explicit='';try{explicit=new URL(url,'https://innerly.example').searchParams.get('lang')||''}catch{}const supported=value=>['en','hi'].includes(value);if(supported(explicit))return explicit;if(supported(saved))return saved;for(const language of languages){const base=String(language).toLowerCase().split('-')[0];if(supported(base))return base}return 'en'}
export let locale='en';
export function setLocale(value){locale=value==='hi'?'hi':'en'}
const pairs=`Skip to content|मुख्य भाग पर जाएँ
Explore|खोजें
My reports|मेरी रिपोर्ट
Innerly home|Innerly होम
Main navigation|मुख्य नेविगेशन
Text size|अक्षरों का आकार
Comfortable text size|सामान्य अक्षर
Larger text size|बड़े अक्षर
Language|भाषा
About this test and your privacy|टेस्ट और गोपनीयता के बारे में
A little reflection. A little more you.|खुद को जानने का एक छोटा कदम।
About & privacy|जानकारी और गोपनीयता
Personality Test|व्यक्तित्व टेस्ट
A little closer to yourself.|खुद को थोड़ा और जानें।
SELF-DISCOVERY, AT YOUR PACE|खुद को जानें, अपनी गति से
Discover how you think, connect, and respond to everyday life.|जानें कि आप कैसे सोचते हैं, लोगों से जुड़ते हैं और रोज़मर्रा की बातों पर प्रतिक्रिया देते हैं।
45 questions|45 सवाल
8–12 minutes|8–12 मिनट
Start test|टेस्ट शुरू करें
Continue test|टेस्ट जारी रखें
Start again|फिर से शुरू करें
Get your personality graphs and report. Free for now.|अपने व्यक्तित्व के ग्राफ़ और रिपोर्ट देखें। अभी मुफ़्त।
For self-reflection. Not a clinical assessment.|खुद को समझने के लिए। यह क्लिनिकल जाँच नहीं है।
Understand yourself|खुद को समझें
Notice your everyday preferences.|अपनी रोज़मर्रा की पसंद पहचानें।
Connect with others|दूसरों से जुड़ें
See how you communicate and cooperate.|समझें कि आप कैसे बात करते और सहयोग करते हैं।
Find your next step|अगला कदम खोजें
Turn your insights into small actions.|अपनी समझ को छोटे कामों में बदलें।
Your pace. No right or wrong answers.|आपकी अपनी गति। कोई सही या गलत जवाब नहीं।
Question|सवाल
of 45|/ 45
Save & take a break|सेव करें और विराम लें
Assessment completed|टेस्ट की प्रगति
Questions|सवाल
Last question →|आखिरी सवाल →
Go to results →|रिपोर्ट देखें →
Select to move on, or use the arrows.|जवाब चुनने पर अगला सवाल आएगा। तीर से भी आगे-पीछे जा सकते हैं।
Choosing an answer moves to the next question automatically. You can also use number keys 1 to 5. Use Previous and Next to browse without changing your answer.|जवाब चुनते ही अगला सवाल आता है। 1 से 5 कीबोर्ड बटन भी इस्तेमाल कर सकते हैं। जवाब बदले बिना पिछले और अगले सवाल देखने के लिए तीर इस्तेमाल करें।
Your usual response|आपकी सामान्य प्रतिक्रिया
How much you agree|आप कितना सहमत हैं
Previous|पिछला
Next|अगला
See results|रिपोर्ट देखें
Progress saved.|प्रगति सेव हो गई है।
Browser storage is unavailable. Keep this tab open to keep your answers.|ब्राउज़र में सेव नहीं हो पा रहा है। जवाब सुरक्षित रखने के लिए यह टैब खुला रखें।
Start|शुरुआत
Settle in|सहज हों
Explore|खोजें
Reflect|मनन करें
Discover|जानें
A quiet moment, just for you.|यह शांत पल आपके लिए है।
One small answer at a time.|एक बार में एक छोटा जवाब।
Notice what feels natural to you.|ध्यान दें कि आपको क्या सहज लगता है।
Different sides, one whole you.|अलग-अलग पहलू, आपका पूरा व्यक्तित्व।
Your reflection is ready to unfold.|अब अपनी रिपोर्ट जानें।
Pause gentle motion|हल्की गति रोकें
Resume gentle motion|हल्की गति चलाएँ
Motion paused for your reduced-motion preference|आपकी पसंद के अनुसार गति बंद है
Your personality|आपका व्यक्तित्व
Your five dimensions|आपके पाँच पहलू
Preferences, not grades. Neither end is better.|ये आपकी पसंद हैं, अंक नहीं। कोई भी छोर बेहतर नहीं है।
Want to understand more?|और गहराई से जानना चाहेंगे?
Full report · Free for now|पूरी रिपोर्ट · अभी मुफ़्त
View full report|पूरी रिपोर्ट देखें
Go to full report|पूरी रिपोर्ट पर जाएँ
Go to full report →|पूरी रिपोर्ट पर जाएँ →
Download summary card|सारांश कार्ड डाउनलोड करें
My saved reports|मेरी सेव की हुई रिपोर्ट
Back to home|होम पर लौटें
For self-reflection. This questionnaire has not been clinically validated.|खुद को समझने के लिए। इस प्रश्नावली का क्लिनिकल सत्यापन नहीं हुआ है।
A balanced mix of preferences|पसंद का संतुलित मेल
Your answers sit near the middle across these five dimensions. Your preferences may depend on the situation and the people around you.|इन पाँच पहलुओं में आपके जवाब बीच के करीब हैं। आपकी पसंद परिस्थिति और आसपास के लोगों पर निर्भर हो सकती है।
Explore your personality.|अपने व्यक्तित्व को समझें।
Tap a graph or category. Find a small step that suits you.|ग्राफ़ या श्रेणी चुनें और अपने लिए एक छोटा कदम खोजें।
Your profile map|आपके व्यक्तित्व का नक्शा
Tap a point or use the category buttons below.|किसी बिंदु या नीचे दिए श्रेणी बटन को चुनें।
A larger shape is not a better personality.|बड़ा आकार बेहतर व्यक्तित्व का संकेत नहीं है।
Your preference balance|आपकी पसंद का संतुलन
Tap any row to understand that category.|उस श्रेणी को समझने के लिए उसकी पंक्ति चुनें।
See it another way|अलग तरीके से देखें
Choose a graph type|ग्राफ़ का प्रकार चुनें
Bar chart|बार चार्ट
Pie chart|पाई चार्ट
Line graph|लाइन ग्राफ़
What can I try?|मैं क्या आज़मा सकता हूँ?
Choose a personality category|व्यक्तित्व की श्रेणी चुनें
What it means|इसका मतलब
Your strength|आपकी खूबी
Try today|आज आज़माएँ
Added to your plan ✓|आपकी योजना में जुड़ गया ✓
Add to my plan +|मेरी योजना में जोड़ें +
One thing to watch for|एक बात का ध्यान रखें
My simple action plan|मेरी आसान कार्य-योजना
steps tried|कदम आज़माए
Small steps, your way.|छोटे कदम, अपने तरीके से।
Try an activity, then tick it here. No streaks or deadlines.|गतिविधि आज़माएँ, फिर यहाँ निशान लगाएँ। कोई समय-सीमा नहीं है।
Choose a category above and add one small activity to begin.|शुरुआत के लिए ऊपर की श्रेणी से एक छोटी गतिविधि जोड़ें।
This chart tracks activities you mark as tried, not personality improvement.|यह चार्ट आपके आज़माए काम दिखाता है, व्यक्तित्व में सुधार नहीं मापता।
Remove|हटाएँ
See all five categories together|पाँचों श्रेणियाँ एक साथ देखें
How your scores work|स्कोर कैसे बनते हैं
Each category uses nine equally weighted answers, scored from 0 to 4. Opposite-worded items are reversed. Each total is divided by 36 and shown from 0 to 100.|हर श्रेणी में बराबर महत्व के नौ जवाब हैं, जिनके अंक 0 से 4 होते हैं। उलटे कथन वाले सवालों के अंक उलटे किए जाते हैं। कुल को 36 से भाग देकर 0 से 100 के पैमाने पर दिखाया जाता है।
Below 40 leans left, 40–60 suggests a mix, and above 60 leans right. These are illustrative bands, not validated cutoffs. Scores are preferences, not grades or population percentiles.|40 से नीचे बाएँ छोर की पसंद, 40–60 मिला-जुला रुझान और 60 से ऊपर दाएँ छोर की पसंद दिखती है। ये समझाने के लिए बनाए स्तर हैं, सत्यापित सीमाएँ नहीं। स्कोर पसंद दिखाते हैं, आपकी योग्यता या आबादी में स्थान नहीं।
This original self-reflection questionnaire has not been clinically validated.|खुद को समझने की इस मौलिक प्रश्नावली का क्लिनिकल सत्यापन नहीं हुआ है।
Save full report as PDF ↓|पूरी रिपोर्ट PDF में सेव करें ↓
Choose “Save as PDF” in your browser’s print window.|ब्राउज़र की प्रिंट विंडो में “Save as PDF” चुनें।
Each bar is a separate 0–100 preference score. Tap a bar for its suggestion.|हर बार अलग श्रेणी की पसंद का 0–100 स्कोर है। सुझाव देखने के लिए बार चुनें।
Personality category bar chart|व्यक्तित्व श्रेणियों का बार चार्ट
How your five categories group by preference. These slices count categories, not parts of your personality.|देखें कि पसंद के अनुसार पाँच श्रेणियाँ कैसे बँटती हैं। टुकड़े श्रेणियाँ गिनते हैं, व्यक्तित्व के हिस्से नहीं।
Preference grouping pie chart|पसंद के समूहों का पाई चार्ट
Leaning left|बाएँ की ओर
A mix|मिला-जुला
Leaning right|दाएँ की ओर
Choose category|श्रेणी चुनें
Your first saved score is shown as one point. A line appears after another completed assessment.|आपका पहला सेव स्कोर एक बिंदु है। एक और टेस्ट पूरा करने पर लाइन दिखेगी।
Saved assessments|सेव किए टेस्ट
See exact dates and scores|तारीखें और स्कोर देखें
Assessment date|टेस्ट की तारीख
Score|स्कोर
YOUR PERSONAL SPACE|आपकी अपनी जगह
Your saved reports.|आपकी सेव की हुई रिपोर्ट।
Saved on this browser. Return whenever you like.|इस ब्राउज़र में सेव हैं। जब चाहें वापस आएँ।
45-QUESTION PERSONALITY REFLECTION|व्यक्तित्व को समझने के 45 सवाल
View report|रिपोर्ट देखें
Your first discovery is waiting.|खुद को जानने की शुरुआत करें।
Complete the assessment to see your personality graphs and report here.|यहाँ अपने ग्राफ़ और रिपोर्ट देखने के लिए टेस्ट पूरा करें।
Continue assessment|टेस्ट जारी रखें
Start assessment|टेस्ट शुरू करें
Close dialog|बंद करें
Jump to a question|किसी सवाल पर जाएँ
✓ Answered   ·   Unmarked questions still need an answer.|✓ जवाब दिया   ·   बिना निशान वाले सवालों के जवाब बाकी हैं।
Keep reviewing|सवाल देखते रहें
Answer remaining questions →|बाकी सवालों के जवाब दें →
A few answers are still missing.|कुछ सवालों के जवाब बाकी हैं।
Keep this tab open|यह टैब खुला रखें
This browser could not save your progress. Your answers are still here, but closing or refreshing the tab may lose them.|इस ब्राउज़र में प्रगति सेव नहीं हुई। जवाब अभी यहाँ हैं, लेकिन टैब बंद या रिफ्रेश करने पर खो सकते हैं।
Start a fresh assessment?|नया टेस्ट शुरू करें?
Keep my place|मेरी प्रगति रखें
Your place is saved. Come back whenever you are ready.|आपकी प्रगति सेव है। जब तैयार हों, वापस आएँ।
Added to your plan. Try it whenever you like.|आपकी योजना में जुड़ गया। जब चाहें आज़माएँ।
Larger text is on.|बड़े अक्षर चालू हैं।
Comfortable text is on.|सामान्य अक्षर चालू हैं।
Your summary card is downloaded. Share it only if you want to.|सारांश कार्ड डाउनलोड हो गया। चाहें तो साझा करें।
A mirror, not a label.|खुद को समझें, कोई ठप्पा नहीं।
Innerly is a name inspired by your inner world: your thoughts, feelings, and preferences.|Innerly नाम आपके अंदर की दुनिया से प्रेरित है: आपके विचार, भावनाएँ और पसंद।
This is an original, unvalidated self-reflection questionnaire. It does not diagnose a condition or measure your worth, abilities, or suitability.|यह खुद को समझने की मौलिक, असत्यापित प्रश्नावली है। यह किसी स्थिति का निदान या आपकी योग्यता, मूल्य या उपयुक्तता का आकलन नहीं करती।
Your short summary and full report are free for now. No payment details are collected.|सारांश और पूरी रिपोर्ट अभी मुफ़्त हैं। भुगतान की जानकारी नहीं ली जाती।
Clear my saved data|मेरा सेव डेटा मिटाएँ
Clear data on this device?|इस डिवाइस का डेटा मिटाएँ?
This removes your unfinished answers, completed reports, and earlier reflections from this browser. Download any report you want to keep first.|इससे इस ब्राउज़र के अधूरे जवाब, पूरी रिपोर्ट और पुराने टेस्ट हट जाएँगे। जो रिपोर्ट रखनी हो, पहले डाउनलोड कर लें।
Keep my data|मेरा डेटा रखें
Clear my data|मेरा डेटा मिटाएँ
Your saved answers and reports have been cleared.|आपके सेव जवाब और रिपोर्ट मिटा दिए गए हैं।
Preparing your report|आपकी रिपोर्ट तैयार हो रही है
Your answers, brought together.|आपके जवाबों से आपकी समझ।
We’re bringing your five dimensions into focus.|हम आपके पाँच पहलुओं को एक साथ दिखा रहे हैं।
Your report is ready.|आपकी रिपोर्ट तैयार है।
Continue →|आगे बढ़ें →
Keep your discovery close.|अपनी रिपोर्ट साथ रखें।
Your report is saved in this browser. You can also open an email draft with your summary.|आपकी रिपोर्ट इस ब्राउज़र में सेव है। सारांश के साथ ईमेल ड्राफ्ट भी खोल सकते हैं।
Your email address|आपका ईमेल पता
Open email draft →|ईमेल ड्राफ्ट खोलें →
Skip for now →|अभी छोड़ें →
This opens your email app. Review and send the message there. Innerly does not send or collect your email.|इससे आपका ईमेल ऐप खुलेगा। वहीं संदेश देखकर भेजें। Innerly आपका ईमेल भेजता या इकट्ठा नहीं करता।
Return here to view your report.|रिपोर्ट देखने के लिए यहाँ लौटें।
View my report →|मेरी रिपोर्ट देखें →
Your full report, at a glance|पूरी रिपोर्ट में क्या है
Five dimensions, explained simply|पाँच पहलू, आसान शब्दों में
Interactive maps and charts|इंटरैक्टिव नक्शे और चार्ट
Small steps for everyday life|रोज़मर्रा के लिए छोटे कदम
No payment needed. Your full report is free for now.|भुगतान की ज़रूरत नहीं। पूरी रिपोर्ट अभी मुफ़्त है।
Save or email summary|सारांश सेव या ईमेल करें
A small step for today|आज के लिए एक छोटा कदम
Assessment answers, unfinished progress, reports, language, motion and text-size preferences are stored in this browser. No account is needed. There is no server collection of your responses. Downloading a card does not post it anywhere. The optional email draft opens your own email app; you decide whether to send it.|जवाब, अधूरी प्रगति, रिपोर्ट, भाषा, गति और अक्षरों की पसंद इस ब्राउज़र में सेव हैं। खाते की ज़रूरत नहीं। जवाब सर्वर पर इकट्ठे नहीं किए जाते। कार्ड डाउनलोड करने से कहीं पोस्ट नहीं होता। वैकल्पिक ईमेल ड्राफ्ट आपके ईमेल ऐप में खुलता है; भेजना आप तय करते हैं।`;
const extra=`YOUR PERSONALITY EXPLORER|आपके व्यक्तित्व की खोज
A clearer picture of you.|खुद को और साफ़ समझें।
Choose a category. Explore a graph. Take one small step.|श्रेणी चुनें। ग्राफ़ समझें। एक छोटा कदम उठाएँ।
Profile map|व्यक्तित्व का नक्शा
Tap a point to explore a different dimension.|किसी दूसरे पहलू को जानने के लिए उसका बिंदु चुनें।
See all scores as a table|सभी स्कोर तालिका में देखें
Category|श्रेणी
Your preference|आपकी पसंद
Explore your graphs|अपने ग्राफ़ समझें
Your category insight|आपकी चुनी श्रेणी की समझ
Earliest shown|दिखाया गया पहला स्कोर
Latest shown|दिखाया गया नया स्कोर
Change in points|अंकों का बदलाव
One small thought at a time.|एक बार में एक छोटी सोच।
Find your gentle rhythm.|अपनी सहज गति पाएँ।
Let curiosity lead the way.|जिज्ञासा को आगे बढ़ने दें।
Notice your own patterns.|अपने तौर-तरीके पहचानें।
Your reflections are ready.|आपकी रिपोर्ट तैयार है।
Your reflection journey|खुद को जानने की यात्रा
A quiet progress companion|प्रगति का शांत साथी
A seed. No questions answered yet.|एक बीज। अभी कोई जवाब नहीं दिया।
Seed|बीज
Sprout|अंकुर
Taking root|जड़ें जम रही हैं
Budding|कली बन रही है
In bloom|फूल खिल गया
Leans left|बाएँ की ओर
A mix of both|दोनों का मेल
Leans right|दाएँ की ओर
Calculate five dimensions|पाँच पहलुओं के स्कोर बनाएँ
Prepare your graphs|ग्राफ़ तैयार करें
Save your report|रिपोर्ट सेव करें
Report ready. Browser storage is unavailable; save a PDF before leaving.|रिपोर्ट तैयार है। ब्राउज़र में सेव नहीं हो पा रहा; जाने से पहले PDF सेव कर लें।
What you will discover|आप क्या जानेंगे
A peaceful path through hills toward a growing tree|पहाड़ियों के बीच एक पेड़ तक जाता शांत रास्ता
Interactive personality map. Select a category point to explore it.|व्यक्तित्व का इंटरैक्टिव नक्शा। जानने के लिए श्रेणी का बिंदु चुनें।
Open your results|अपनी रिपोर्ट खोलें
Your earlier reflections|आपके पुराने टेस्ट
These are from the previous short assessments and use a different scoring method.|ये पहले के छोटे टेस्ट हैं और इनकी स्कोर विधि अलग है।
View reflection|पुराना टेस्ट देखें
Close reflection|बंद करें
Your earlier reflection|आपका पुराना टेस्ट
Your inner pattern|आपके अंदर के तौर-तरीके
Your communication|आपकी बातचीत
Your emotional world|आपकी भावनाओं की दुनिया
Self-awareness|खुद की समझ
Flexibility|लचीलापन
Intentional action|सोच-समझकर कदम
Direct expression|सीधी बात
Perspective-taking|दूसरे का नज़रिया समझना
Healthy boundaries|स्वस्थ सीमाएँ
Emotional awareness|भावनाओं की समझ
Self-compassion|अपने प्रति करुणा
Regulation|भावनाएँ सँभालना
This original exercise was not clinically validated. Its scores are not comparable with the new personality assessment.|इस मौलिक अभ्यास का क्लिनिकल सत्यापन नहीं हुआ है। इसके स्कोर की तुलना नए व्यक्तित्व टेस्ट से नहीं कर सकते।
This browser could not clear saved data. Please use your browser’s storage settings.|ब्राउज़र डेटा मिटा नहीं पाया। ब्राउज़र की स्टोरेज सेटिंग इस्तेमाल करें।`;
const dictionary=Object.fromEntries((pairs+'\n'+extra).split('\n').map(line=>{const index=line.indexOf('|');return [line.slice(0,index),line.slice(index+1)]}));
const patterns=[
 [/^(.+): (\d+) of 5 \((\d+)%\)$/, (name,n,p)=>`${t(name)}: 5 में ${n} (${p}%)`],
 [/^(.+): (\d+) out of 100$/, (date,n)=>`${date}: 100 में ${n}`],
 [/^(.+) · Previous 12-question exercise$/,date=>`${date} · पहले का 12 सवालों वाला अभ्यास`],
 [/^(\d+) of 45 answered\. Continue where you left off\.$/,n=>`${n} / 45 जवाब दिए। जहाँ छोड़ा था, वहीं से जारी रखें।`],
 [/^(\d+) of 45 answered\. Your answers stay saved\.$/,n=>`${n} / 45 जवाब दिए। आपके जवाब सेव रहेंगे।`],
 [/^Your journey · (.+)$/,name=>`आपकी यात्रा · ${t(name)}`],
 [/^(.+) · Based on your 45 answers$/,date=>`${date} · आपके 45 जवाबों पर आधारित`],
 [/^Your latest (\d+) saved assessments, oldest to newest\. A change is not automatically an improvement\.$/,n=>`आपके पिछले ${n} सेव टेस्ट, पुराने से नए क्रम में। बदलाव का मतलब ज़रूरी नहीं कि सुधार हो।`],
 [/^(\d+) of 5 · (\d+)%$/,(n,p)=>`${n} / 5 · ${p}%`],
 [/^(\d+) of (\d+) steps tried\.$/,(n,total)=>`${total} में से ${n} कदम आज़माए।`],
 [/^(\d+) of (\d+) selected activities tried$/,(n,total)=>`चुनी ${total} गतिविधियों में से ${n} आज़माईं`],
 [/^— (\d+) categor(?:y|ies)$/,n=>`— ${n} श्रेणियाँ`],
 [/^This will replace the (\d+) answers in your unfinished assessment\. Your completed reports will stay saved\.$/,n=>`इससे अधूरे टेस्ट के ${n} जवाब बदल जाएँगे। पूरी रिपोर्ट सेव रहेंगी।`],
 [/^(\d+) of 45 questions still needs? an answer before we can create your report\.$/,n=>`रिपोर्ट बनाने से पहले ${n} / 45 सवालों के जवाब देने बाकी हैं।`],
 [/^Question (\d+), (unanswered|answered)(, current question)?$/,(n,status,current)=>`सवाल ${n}, ${status==='answered'?'जवाब दिया':'जवाब बाकी'}${current?', मौजूदा सवाल':''}`],
 [/^Go to question (\d+)$/,n=>`सवाल ${n} पर जाएँ`],
 [/^Opens after (\d+) answers$/,n=>`${n} जवाबों के बाद खुलेगा`],
 [/^Explore (.+), (\d+) out of 100$/,(name,n)=>`${name} जानें, 100 में से ${n}`],
 [/^(.+) scores across (\d+) saved assessments$/,(name,n)=>`${n} सेव टेस्ट में ${name} के स्कोर`],
 [/^Remove (.+) activity from my plan$/,name=>`मेरी योजना से ${name} की गतिविधि हटाएँ`],
 [/^(.+), (current chapter|revisit this chapter|ahead on your journey)$/,(name,status)=>`${t(name)}, ${status==='current chapter'?'मौजूदा चरण':status==='revisit this chapter'?'इस चरण पर लौटें':'आगे का चरण'}`],
 [/^(.+): (\d+) out of 100\. Lower scores lean toward (.+), higher scores toward (.+)\.$/,(name,n,low,high)=>`${name}: 100 में ${n}। कम स्कोर ${low} और अधिक स्कोर ${high} की पसंद दिखाता है।`],
 [/^Progress plant: (.+)\. (\d+) of 45 questions answered\.$/,(name,n)=>`प्रगति का पौधा: ${t(name)}। 45 में ${n} जवाब दिए।`],
 [/^(.+): (\d+) of 5 categories, (\d+) percent$/,(name,n,p)=>`${t(name)}: 5 में ${n} श्रेणियाँ, ${p} प्रतिशत`]
];
export function t(value){if(locale!=='hi')return value;const source=String(value),text=source.trim();let translated=dictionary[text];if(!translated){for(const [pattern,replace] of patterns){const match=text.match(pattern);if(match){translated=replace(...match.slice(1));break}}}return translated?source.replace(text,translated):source}
// Translate text and accessible labels in place, preserving mounted controls and focus.
// A per-node source cache also allows changing language without reloading the page.
export function installPageTranslation(root=document.body){const cache=new WeakMap();let observer;
 function translate(){observer?.disconnect();const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let node;while((node=walker.nextNode())){if(node.parentElement?.closest('script,style,[data-no-translate]'))continue;const prior=cache.get(node),source=prior&&node.data===prior.last?prior.source:node.data,last=t(source);if(node.data!==last)node.data=last;cache.set(node,{source,last})}for(const element of root.querySelectorAll('[aria-label],[title],[placeholder]')){let records=cache.get(element)||{};for(const attr of ['aria-label','title','placeholder'])if(element.hasAttribute(attr)){const value=element.getAttribute(attr),prior=records[attr],source=prior&&value===prior.last?prior.source:value,last=t(source);if(last!==value)element.setAttribute(attr,last);records[attr]={source,last}}cache.set(element,records)}observer?.observe(root,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['aria-label','title','placeholder']})}
 observer=new MutationObserver(translate);translate();return translate;
}
