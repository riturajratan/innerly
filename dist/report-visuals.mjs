// Short, human-readable captions for the visual overview. Full interpretations
// stay in the detailed report and the matching question dialog.
const titles = [
 ['Emotional awareness','भावनाओं की समझ'],['Feelings & facts','भावना और तथ्य'],['Reaction confusion','प्रतिक्रिया समझने में उलझन'],['Past influences','पुराने अनुभव'],['Learning from conflict','बहस से सीखना'],['Checking assumptions','अनुमान जाँचना'],
 ['Thought loops','विचारों का दोहराव'],['Fresh perspectives','नया नज़रिया'],['Self-blame','खुद को दोष देना'],['Open-mindedness','खुली सोच'],['Worst-case thinking','बुरे नतीजे की सोच'],['Trying another way','दूसरा रास्ता'],
 ['Pausing before reacting','जवाब से पहले ठहराव'],['Reaction regret','प्रतिक्रिया का पछतावा'],['Making room for feelings','भावनाओं को जगह'],['Refocusing difficulty','फिर ध्यान लगाने में मुश्किल'],['Finding calm','शांति खोजना'],['Expressing feelings','भावनाएँ कहना'],
 ['Considering the impact','असर पर विचार'],['Rushed choices','जल्दबाज़ी के फैसले'],['Delayed decisions','टालते फैसले'],['Acting with uncertainty','अनिश्चितता में कदम'],['Difficulty changing course','रास्ता बदलने में मुश्किल'],['Following your values','अपनी प्राथमिकताएँ'],
 ['Understanding others','दूसरों को समझना'],['Defensive responses','तुरंत अपना बचाव'],['Expressing needs','ज़रूरत कहना'],['Assumed intentions','बिना पूछे मतलब मानना'],['Repairing hurt','ठेस के बाद सुधार'],['Setting boundaries','सीमाएँ तय करना'],
 ['Finding a next step','अगला कदम खोजना'],['Worry outside your control','काबू से बाहर की चिंता'],['Adapting to change','बदलाव में ढलना'],['Self-care difficulties','अपना खयाल रखने में मुश्किल'],['Asking for support','सहारा माँगना'],['Learning from setbacks','मुश्किल से सीखना']
];
const actions = [
 ['Name one feeling','एक भावना को नाम दें'],['Separate feelings from facts','भावना और तथ्य अलग करें'],['Notice a reaction trigger','प्रतिक्रिया की वजह पहचानें'],['Separate then from now','आज और अतीत अलग करें'],['Take one lesson from conflict','बहस से एक सीख लें'],['Check one assumption','एक अनुमान जाँचें'],
 ['Turn one thought into action','एक विचार से कदम चुनें'],['Try a second perspective','दूसरा नज़रिया आज़माएँ'],['Speak kindly to yourself','खुद से नरमी से बोलें'],['Revisit one opinion','एक राय पर फिर सोचें'],['Check facts behind a worry','चिंता के पीछे तथ्य देखें'],['Try a small plan B','छोटा दूसरा रास्ता आज़माएँ'],
 ['Pause before one reply','एक जवाब से पहले रुकें'],['Notice your early warning sign','अपनी बेचैनी का संकेत पहचानें'],['Name it before fixing it','सुलझाने से पहले भावना पहचानें'],['Restart with one familiar task','एक परिचित काम से लौटें'],['Repeat a calming action','एक शांत करने वाला काम करें'],['Start with “I feel…”','“मुझे लगता है…” से शुरू करें'],
 ['Consider one possible consequence','एक संभावित असर सोचें'],['Pause on a non-urgent choice','गैर-ज़रूरी जल्दबाज़ी में रुकें'],['Make one decision smaller','फैसले का छोटा हिस्सा चुनें'],['Take one manageable step','एक आसान कदम लें'],['Consider another option','एक दूसरा विकल्प सोचें'],['Name what matters to you','अपनी प्राथमिकता पहचानें'],
 ['Ask, then listen','पूछें, फिर सुनें'],['Reflect back what you heard','सुनी बात को दोहराएँ'],['Make one clear request','एक साफ़ अनुरोध करें'],['Ask before assuming','मान लेने से पहले पूछें'],['Acknowledge your part','अपनी भूमिका स्वीकारें'],['Practise a respectful no','सम्मान से मना करना आज़माएँ'],
 ['Break a problem into steps','समस्या को छोटे हिस्सों में बाँटें'],['Focus on what you can influence','जहाँ असर डाल सकें, वहाँ ध्यान दें'],['Adjust one changed plan','बदली योजना में थोड़ा ढलें'],['Make room for basic self-care','अपने खयाल के लिए जगह बनाएँ'],['Ask someone you trust','किसी भरोसेमंद से मदद माँगें'],['Keep one useful lesson','एक उपयोगी सीख साथ रखें']
];
const icons=['eye','compass','sun','orbit','chat','search','loop','branch','heart','branch','cloud','branch','pause','pause','wave','home','leaf','chat','target','pause','compass','steps','branch','compass','ear','ear','chat','search','heart','shield','steps','cloud','branch','heart','handshake','leaf'];
const benefits=[['Self-understanding','खुद की समझ'],['Mental flexibility','सोच में लचीलापन'],['Emotional steadiness','भावनाओं में ठहराव'],['Clearer decisions','फैसलों में स्पष्टता'],['Better communication','बेहतर बातचीत'],['Everyday resilience','मुश्किल से उबरना']];
export function visualInsight(item,language='en'){
 const n=language==='hi'?1:0;
 return {title:titles[item.index][n],action:actions[item.index][n],icon:icons[item.index],benefit:benefits[Math.floor(item.index/6)][n]};
}
