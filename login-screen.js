/* Visual-only login-page controller: existing EmailCloud auth API and button handlers remain unchanged. */
(() => {
 'use strict';
 const login=document.getElementById('emailLogin');
 const email=document.getElementById('emailAddress');
 const pass=document.getElementById('emailPassword');
 const recovery=document.getElementById('emailRecovery');
 const status=document.getElementById('emailStatus');
 const eye=document.getElementById('ncPasswordVisibility');
 if(!login || !window.EmailCloud) return;
 // The login artwork covers the calendar until Supabase identifies a signed-in account.
 login.hidden=false;
 // Wait for v27's existing cloud initialization; do not trigger an extra network request.
 // The existing logout control becomes available only when Supabase has authenticated.
 Promise.resolve(window.Cloud?.ready).then(() => {
   const logout=document.getElementById('cloudLogout');
   if(logout && !logout.hidden && recovery.hidden) login.hidden=true;
 }).catch(() => { /* keep the login screen visible if cloud initialization fails */ });
 eye?.addEventListener('click',()=>{
   const showing=pass.type==='password';
   pass.type=showing?'text':'password';
   eye.setAttribute('aria-pressed',String(showing));
   eye.setAttribute('aria-label',showing?'ซ่อนรหัสผ่าน':'แสดงรหัสผ่าน');
 });
 [email,pass].forEach(input=>input?.addEventListener('keydown',event=>{
   if(event.key==='Enter'){
     event.preventDefault();
     document.getElementById('emailSignIn')?.click();
   }
 }));
 const initial=status?.textContent;
 const observer=new MutationObserver(()=>{
   status.classList.toggle('nc-visible',Boolean(status.textContent?.trim() && status.textContent!==initial));
 });
 if(status)observer.observe(status,{childList:true,characterData:true,subtree:true});
})();
