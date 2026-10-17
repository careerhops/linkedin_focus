(() => {
let settings={...FocusModel.defaults},examples=[],timer;
const records=new Map();
const selector='[componentkey^="update-card-"], .feed-shared-update-v2, .occludable-update, [data-urn^="urn:li:activity:"], [data-id^="urn:li:activity:"], [data-view-name="feed-full-update"], [data-view-name="feed-update"], main article, main [role="article"]';
const textSelector='[data-testid="expandable-text-box"], .update-components-text, .feed-shared-update-v2__description, .feed-shared-text';
chrome.runtime.onMessage.addListener((msg,sender,reply)=>{if(msg.type==='focus-status'){scan();reply({active:true,enabled:settings.enabled,feed:feed(),posts:records.size,candidates:document.querySelectorAll(selector).length});}});
function feed(){return location.pathname==='/feed'||location.pathname.startsWith('/feed/');}
function postText(el){const body=el.querySelector(textSelector);if(body)return body.textContent.trim().slice(0,12000);const clone=el.cloneNode(true);clone.querySelectorAll('.lf-bar,button,.social-details-comments').forEach(n=>n.remove());return clone.textContent.trim().slice(0,12000);}
function cleanup(el,r){el.removeAttribute('data-focus-collapsed');r.bar.remove();records.delete(el);}
function render(el,r){const result=FocusModel.score(r.text,settings,examples);const hide=settings.mode==='hide'&&result.hide&&!r.revealed;
 el.setAttribute('data-focus-collapsed',hide?'yes':'no');
 const label=(hide?'Hidden · ':result.hide?'Would hide · ':'Focus · ')+result.reason;
 if(r.label.textContent!==label)r.label.textContent=label;
 r.show.hidden=!result.hide||settings.mode!=='hide';r.show.textContent=r.revealed?'Collapse again':'Show post';
}
function add(el,text){const bar=document.createElement('div');bar.className='lf-bar';const label=document.createElement('span');bar.append(label);
 const r={bar,label,text,revealed:false};
 function button(name,fn){const b=document.createElement('button');b.type='button';b.textContent=name;b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();fn();});bar.append(b);return b;}
 async function learn(label){const response=await chrome.runtime.sendMessage({type:'feedback',text:r.text,label});if(!response?.ok)r.label.textContent='Could not save. Reload this page and try again.';else {r.revealed=false;const data=await chrome.storage.local.get('examples');examples=data.examples||[];scan();}}
 button('More like this',()=>learn(1));button('Less like this',()=>learn(-1));button('Undo feedback',()=>learn(0));
 r.show=button('Show post',()=>{r.revealed=!r.revealed;render(el,r);});
 el.prepend(bar);records.set(el,r);render(el,r);
}
function candidates(){
 const known=[...document.querySelectorAll(selector)];
 if(known.length)return known;
 // Fallback for newer markup: locate the smallest card around a social-action row.
 // Require Like, Comment and Repost/Share controls; never select main or body.
 const found=new Set();
 for(const b of document.querySelectorAll('main button, main [role="button"]')){
  const label=(b.getAttribute('aria-label')||b.textContent||'').trim();
  if(!/^(like|react)(\b|$)/i.test(label))continue;
  let parent=b.parentElement;
  for(let i=0;parent&&i<9;i++,parent=parent.parentElement){
   if(parent.matches('main,body,[role="main"]'))break;
   const controls=[...parent.querySelectorAll('button,[role="button"]')].filter(x=>!x.closest('.lf-bar'));
   const labels=controls.map(x=>(x.getAttribute('aria-label')||x.textContent||'').trim());
   if(controls.length>30)break;
   if(labels.some(x=>/^comment\b/i.test(x))&&labels.some(x=>/^(repost|share)\b/i.test(x))&&postText(parent).length>100){found.add(parent);break;}
  }
 }
 return [...found].filter(el=>![...found].some(other=>other!==el&&el.contains(other)));
}
function scan(){
 for(const [el,r]of records)if(!el.isConnected||!settings.enabled||!feed())cleanup(el,r);
 if(!settings.enabled||!feed())return;
 for(const el of candidates()){
  if(el.parentElement?.closest(selector)||el.closest('aside'))continue;
  const text=postText(el);if(text.length<25)continue;
  let r=records.get(el);if(r&&r.text!==text){r.text=text;r.revealed=false;}if(r){if(!el.contains(r.bar))el.prepend(r.bar);render(el,r);}else add(el,text);
 }
}
function schedule(){clearTimeout(timer);timer=setTimeout(scan,180);}
chrome.storage.onChanged.addListener((changes,area)=>{if(area!=='local')return;if(changes.settings)settings={...FocusModel.defaults,...changes.settings.newValue};if(changes.examples)examples=changes.examples.newValue||[];schedule();});
chrome.storage.local.get(['settings','examples']).then(data=>{settings={...FocusModel.defaults,...data.settings};examples=data.examples||[];scan();new MutationObserver(changes=>{if(changes.some(c=>!c.target.closest?.('.lf-bar')))schedule();}).observe(document.body,{childList:true,subtree:true,characterData:true});});
setInterval(()=>{if(!feed()&&records.size)scan();},1000);
})();