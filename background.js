importScripts('model.js');
let queue=Promise.resolve();
chrome.runtime.onMessage.addListener((msg,sender,reply)=>{
 if(!['feedback','reset'].includes(msg.type)) return;
 queue=queue.then(async()=>{
  if(msg.type==='reset'){await chrome.storage.local.set({examples:[]});return;}
  if(typeof msg.text!=='string'||![-1,0,1].includes(msg.label)) throw Error('Invalid feedback');
  const tokens=FocusModel.tokens(msg.text); if(!tokens.length)return;
  const key=tokens.slice().sort().join('|');
  let {examples=[]}=await chrome.storage.local.get('examples');
  examples=examples.filter(x=>x.key!==key);
  if(msg.label)examples.push({key,tokens,label:msg.label});
  await chrome.storage.local.set({examples:examples.slice(-300)});
 }).then(()=>reply({ok:true})).catch(()=>reply({ok:false}));
 return true;
});