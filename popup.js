const $=id=>document.getElementById(id);
async function load(){const {settings={},examples=[]}=await chrome.storage.local.get(['settings','examples']);const s={...FocusModel.defaults,...settings};for(const id of ['mode','wanted','blocked','threshold'])$(id).value=s[id];$('enabled').checked=s.enabled;$('status').textContent=examples.length+' feedback examples saved locally.';}
$('form').addEventListener('submit',async e=>{e.preventDefault();await chrome.storage.local.set({settings:{enabled:$('enabled').checked,mode:$('mode').value,wanted:$('wanted').value,blocked:$('blocked').value,threshold:Number($('threshold').value)}});$('status').textContent='Saved. Open or refresh LinkedIn’s home feed.';});
$('reset').addEventListener('click',async()=>{if(!confirm('Delete all learned feedback? Your keyword settings will remain.'))return;const r=await chrome.runtime.sendMessage({type:'reset'});if(r?.ok)await load();else $('status').textContent='Reset failed. Please retry.';});load();
async function check(){
 const box=$('connection');
 try{
  const [tab]=await chrome.tabs.query({active:true,currentWindow:true});
  const status=await chrome.tabs.sendMessage(tab.id,{type:'focus-status'});
  box.textContent=!status.feed?'Open linkedin.com/feed/ and check again.':!status.enabled?'Extension connected but disabled. Enable and save below.':status.posts?'Connected — '+status.posts+' posts detected. Look for the blue Focus toolbar.':'Connected, but no posts detected. Scroll until a post is visible, then check again. If still zero, send a screenshot of this status.';
 }catch{box.textContent='Not connected. Refresh your LinkedIn home-feed tab. If unchanged, open chrome://extensions, confirm LinkedIn Focus is enabled and allowed on LinkedIn, then refresh again.';}
}
$('check').addEventListener('click',check);check();
