export async function mountTestimonials(root,language='en'){
 const anchor=root.firstChild;
 try{
  const response=await fetch('/api/testimonials',{cache:'no-store'});if(!response.ok)return;
  const {testimonials}=await response.json();if(!root.isConnected||root.firstChild!==anchor||!Array.isArray(testimonials)||!testimonials.length)return;
  const section=document.createElement('section');section.className='kym-testimonials';section.setAttribute('aria-label',language==='hi'?'आपकी बातें':'Your words');
  const heading=document.createElement('h2');heading.textContent=language==='hi'?'इस जगह के बारे में आपकी बातें।':'A little reflection. In your words.';
  const intro=document.createElement('p');intro.textContent=language==='hi'?'अनुमति के साथ साझा किए गए अनुभव।':'Experiences shared with permission.';
  const grid=document.createElement('div');grid.className='kym-testimonial-grid';
  for(const item of testimonials.slice(0,3)){const card=document.createElement('figure'),quote=document.createElement('blockquote'),name=document.createElement('figcaption');quote.textContent=item.message;name.textContent=item.name;card.append(quote,name);grid.append(card);}
  section.append(heading,intro,grid);root.append(section);
 }catch{/* Keep the homepage usable if testimonials are unavailable. */}
}
