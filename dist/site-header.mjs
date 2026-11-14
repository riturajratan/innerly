document.querySelector('[data-site-large]')?.addEventListener('click',event=>{
 const large=document.body.classList.toggle('mh-large');
 event.currentTarget.setAttribute('aria-pressed',String(large));
});
