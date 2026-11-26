window.addEventListener('beforeprint',()=>document.querySelectorAll('details').forEach(detail=>detail.open=true));
document.querySelector('[data-save-pdf]').addEventListener('click',async()=>{
 await document.fonts?.ready;
 window.print();
});
document.querySelector('[data-close-preview]').addEventListener('click',()=>{
 if(window.parent!==window)window.parent.postMessage({type:'innerly-close-export'},new URL(import.meta.url).origin);
 else window.close();
});
