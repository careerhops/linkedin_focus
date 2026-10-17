(() => {
const defaults = {enabled:true, mode:'label', wanted:'AI, machine learning, research, governance, implementation', blocked:'', threshold:0.3};
const stop = new Set('this that with from have your they their about would could should there what when where which these those been into more like just very also will were them than then some only post linkedin comment share follow people today really much does dont cant want know make over because through after before being such here'.split(' '));
function tokens(text) { return [...new Set((text.toLowerCase().match(/[a-z][a-z0-9-]{2,}/g)||[]).filter(w=>!stop.has(w)))].slice(0,150); }
function phrases(s) {return s.toLowerCase().split(/[,\n]/).map(x=>x.trim()).filter(Boolean);}
function match(text, phrase) {const esc=phrase.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'); return new RegExp('(^|[^a-z0-9])'+esc+'($|[^a-z0-9])','i').test(text);}
function score(text,settings,examples) {
 const blocked=phrases(settings.blocked).find(x=>match(text,x));
 if(blocked) return {hide:true,reason:'Blocked phrase: '+blocked};
 const ts=new Set(tokens(text)); let pos=0,neg=0;
 for(const ex of examples) {const overlap=ex.tokens.filter(t=>ts.has(t)).length; const sim=overlap/Math.sqrt(Math.max(1,ts.size*ex.tokens.length)); if(ex.label>0)pos=Math.max(pos,sim);else neg=Math.max(neg,sim);}
 const wanted=phrases(settings.wanted).find(x=>match(text,x));
 const hide=neg>=settings.threshold && neg>pos+0.08;
 return {hide,reason:hide?'Similar to posts you marked less useful':pos>=settings.threshold?'Similar to posts you marked useful':wanted?'Matches interest: '+wanted:'Uncertain — kept visible'};
}
 globalThis.FocusModel={defaults,tokens,score};
})();