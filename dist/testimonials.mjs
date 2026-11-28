const owner={
 name:'Rituraj',
 message:'I really liked how Know Your Mind helps you understand what you’re feeling. It feels good to see your thoughts reflected clearly and understand why you feel the way you do.',
 photoUrl:'/assets/rituraj-profile.png',
 owner:true,
};

function portrait(item){
 if(item.photoUrl)return item.photoUrl;
 // This portrait was separately supplied for Sanjay's approved testimonial.
 const message=item.message.trim().replace(/\s+/g,' ');
 if(item.name.trim().toLowerCase()==='sanjay'&&
    message.startsWith('What I like most about Know Your Mind')&&
    message.includes('discover practical ways to improve'))return '/assets/sanjay-profile.png';
 return '';
}

export async function mountTestimonials(root,language='en'){
 const slot=root.querySelector('[data-home-testimonials]');
 if(!slot)return;
 let approved=[];
 try{
  const response=await fetch('/api/testimonials',{cache:'no-store'});
  const data=response.ok?await response.json():{};
  if(Array.isArray(data.testimonials))approved=data.testimonials.filter(item=>typeof item?.name==='string'&&typeof item?.message==='string');
 }catch{}
 if(!slot.isConnected)return;
 const testimonials=[owner,...approved].slice(0,3);
 const section=document.createElement('section');
 section.className='kym-testimonials';
 const heading=document.createElement('h2');
 heading.id='home-testimonials-title';
 heading.textContent=language==='hi'?'लोग क्या कहते हैं':'What people say';
 section.setAttribute('aria-labelledby',heading.id);
 const grid=document.createElement('div');
 grid.className='kym-testimonial-grid';
 grid.classList.toggle('is-single',testimonials.length===1);
 for(const item of testimonials){
  const card=document.createElement('figure');
  card.className='kym-testimonial-card';
  const quote=document.createElement('blockquote');
  quote.textContent=item.message;
  const caption=document.createElement('figcaption');
  const avatar=document.createElement('span');
  avatar.className='kym-testimonial-avatar';
  avatar.setAttribute('aria-hidden','true');
  const fallback=()=>{avatar.textContent=item.name.trim().split(/\s+/).slice(0,2).map(part=>part.charAt(0)).join('').toUpperCase();};
  const photo=portrait(item);
  if(photo){
   const image=document.createElement('img');
   image.src=photo;
   image.alt='';
   image.width=64;
   image.height=64;
   image.loading='lazy';
   image.decoding='async';
   image.addEventListener('error',fallback,{once:true});
   avatar.append(image);
  }else fallback();
  const byline=document.createElement('span');
  byline.textContent=item.name;
  if(item.owner){
   const role=document.createElement('small');
   role.textContent=language==='hi'?'साइट के निर्माता':'Site creator';
   byline.append(role);
  }
  caption.append(avatar,byline);
  card.append(caption,quote);
  grid.append(card);
 }
 section.append(heading,grid);
 slot.replaceChildren(section);
}
