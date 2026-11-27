export async function mountTestimonials(root,language='en'){
 try{
  const response=await fetch('/api/testimonials',{cache:'no-store'});const data=response.ok?await response.json():{};
  if(!root.isConnected||root.querySelector('.kym-testimonials'))return;
  const testimonials=[{name:'Rituraj',message:'I really liked how Know Your Mind helps you understand what you’re feeling. It feels good to see your thoughts reflected clearly and understand why you feel the way you do.',photoUrl:'/assets/rituraj-profile.png'},...(Array.isArray(data.testimonials)?data.testimonials.map(item=>({...item,...(item.name.trim().toLowerCase()==='sanjay'?{photoUrl:'/assets/sanjay-profile.png'}:{})})):[])].slice(0,3);
  if(!testimonials.length)return;
  const section=document.createElement('section');section.className='kym-testimonials';section.setAttribute('aria-label',language==='hi'?'आपकी बातें':'What people say');
  const heading=document.createElement('h2');heading.textContent=language==='hi'?'लोग क्या कहते हैं':'What people say';
  const intro=document.createElement('p');intro.textContent=language==='hi'?'अनुमति के साथ साझा किए गए अनुभव':'A moment of reflection, shared with permission.';
  const grid=document.createElement('div');grid.className='kym-testimonial-grid';grid.classList.toggle('is-single',testimonials.length===1);
  for(const item of testimonials.slice(0,3)){
   const card=document.createElement('figure');card.className='kym-testimonial-card';
   const mark=document.createElement('span');mark.className='kym-quote-mark';mark.setAttribute('aria-hidden','true');mark.textContent='“';
   const quote=document.createElement('blockquote');quote.textContent=item.message;
   const name=document.createElement('figcaption');const initials=item.name.trim().split(/\s+/).slice(0,2).map(part=>part[0]).join('').toUpperCase();
   const avatar=document.createElement('span');avatar.className='kym-testimonial-avatar';avatar.setAttribute('aria-hidden','true');if(item.photoUrl){const image=document.createElement('img');image.src=item.photoUrl;image.alt='';image.loading='lazy';image.decoding='async';avatar.append(image);}else avatar.textContent=initials;
   const byline=document.createElement('span');byline.textContent=item.name;name.append(avatar,byline);card.append(mark,quote,name);grid.append(card);
  }
  section.append(heading,intro,grid);root.append(section);
 }catch{/* Keep the homepage usable if testimonials are unavailable. */}
}
