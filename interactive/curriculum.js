(() => {
  const root=document.getElementById('curriculum');
  const config=JSON.parse(document.getElementById('course-data').textContent);
  const $=id=>document.getElementById(id), esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const key='football-investment-learning-v1';
  const noteFields=[['understanding','我的学习结论','结论 → 原因与证据 → 适用边界 → 反例 → 对自己的影响'],['hypotheses','我的待验证判断','判断日期、依据、反方证据、失效条件、复核日期'],['policy','我的投资政策','资金用途、目标比例、现金底线、偏离带、风险上限和禁止事项'],['review','我的错误与复盘','当时知道什么、后来发生什么、错误分类、修改的规则'],['next','我的下一步行动','要读的材料、要核实的问题、完成条件与时间']];
  const ids=new Set(config.lessons.map(l=>l.id));
  const aliases=config.aliases||{};
  const validIds=new Set([...ids,...Object.keys(aliases)]);
  let state={version:1,kind:'investment-learning-notes',completed:[],notes:{},lessonNotes:{},lastLesson:null};
  function validRecord(record){
    if(!record||record.version!==1||record.kind!=='investment-learning-notes'||!Array.isArray(record.completed)||!record.notes||typeof record.notes!=='object')throw Error('这不是本学习文档的有效备份。');
    const notes={};for(const [id]of noteFields){const text=record.notes[id]??'';if(typeof text!=='string'||text.length>20000)throw Error('总结格式不正确或单项超过 20,000 字符。');notes[id]=text;}
    const lessonNotes={};
    if(record.lessonNotes!==undefined){if(!record.lessonNotes||typeof record.lessonNotes!=='object'||Array.isArray(record.lessonNotes))throw Error('章节笔记格式不正确。');for(const id of validIds){const text=record.lessonNotes[id]??'';if(typeof text!=='string'||text.length>1000000)throw Error('章节笔记格式不正确或超过 1,000,000 字符。');if(text)lessonNotes[id]=text;}}
    for(const [oldId,target] of Object.entries(aliases)){if(lessonNotes[oldId]){lessonNotes[target]=[lessonNotes[target],`【原章节：${config.legacyTitles[oldId]||oldId}】\n${lessonNotes[oldId]}`].filter(Boolean).join('\n\n');delete lessonNotes[oldId];}}
    return {version:1,kind:'investment-learning-notes',lastLesson:ids.has(record.lastLesson)?record.lastLesson:null,completed:[...new Set(record.completed.filter(x=>validIds.has(x)))],notes,lessonNotes};
  }
  try{const saved=localStorage.getItem(key);if(saved)state=validRecord(JSON.parse(saved));}catch{$('course-storage-status').textContent='无法读取本地进度。你仍可阅读、编辑与导出备份。';}
  function persist(){try{localStorage.setItem(key,JSON.stringify(state));$('course-storage-status').textContent='';return true;}catch{$('course-storage-status').textContent='当前浏览器无法保存，请导出 JSON 备份。';return false;}}
  const lab=$('course-original-tools');
  for(const selector of ['.feature-nav','.flow','.workspace','.bottom-grid','details.src']){const node=document.querySelector('#guide > '+selector);if(node)lab.appendChild(node);}
  $('course-planning-tools').appendChild($('planning'));
  const treeKey='football-knowledge-tree-v1',treeOpen={};
  try{const saved=JSON.parse(localStorage.getItem(treeKey)||'{}');for(const l of config.lessons)treeOpen[l.id]=saved[l.id]===true;}catch{}
  const outlineMap=new Map(config.lessons.map(l=>{const template=document.createElement('template');template.innerHTML=l.html;return[l.id,[...template.content.querySelectorAll('h2,h3')].map((h,index)=>({text:h.textContent,level:h.tagName,index}))];}));
  function treePoints(points,lesson){
    const topics=points.filter(h=>h.level==='H2');
    if(!topics.length)return '<span class="course-tree-empty">本章为编辑与记录区</span>';
    return '<ul class="course-tree-level2">'+topics.map(h=>'<li class="course-tree-topic"><a class="course-tree-point major" href="#lesson='+lesson.id+(h.book?'&book='+h.book:h.target?'&section='+h.target:'&point='+h.index)+'" data-parent-lesson="'+lesson.id+'">'+esc(h.text)+'</a></li>').join('')+'</ul>';
  }
  $('course-toc').innerHTML=config.groups.map(g=>config.lessons.filter(l=>l.group===g.id).map(l=>{
    const points=l.id==='books'?(config.books||[]).map(b=>({text:b.title,level:'H2',book:b.id})):l.id==='daily'?[['导入与日期','daily-import-zone'],['按日查阅资料','daily-list-zone'],['预览与整理','daily-preview-zone'],['附件备份与恢复','daily-backup-zone']].map(([text,target])=>({text,target,level:'H2'})):outlineMap.get(l.id);
    return '<div class="course-chapter" data-group="'+g.id+'" data-tree-lesson="'+l.id+'"><div class="course-tree-row"><button class="course-tree-toggle" data-toggle-tree="'+l.id+'" aria-label="展开或收起'+esc(l.title)+'" aria-controls="tree-'+l.id+'" aria-expanded="false">▸</button><a href="#lesson='+l.id+'" class="course-toc-link" data-lesson="'+l.id+'" aria-controls="tree-'+l.id+'" aria-expanded="false"><span class="course-chapter-number">'+esc(g.number)+'</span><span>'+esc(l.title)+'<small>'+esc(g.description)+'</small></span><span class="course-check" aria-hidden="true"></span></a></div><nav id="tree-'+l.id+'" class="course-tree-points" aria-label="'+esc(l.title)+'知识点" hidden>'+treePoints(points,l)+'</nav></div>';
  }).join('')).join('');
  function setTree(id,open,remember=true){if(remember)treeOpen[id]=open;const node=$('tree-'+id);if(node)node.hidden=!open;root.querySelectorAll('[data-toggle-tree="'+id+'"],[data-lesson="'+id+'"]').forEach(b=>b.setAttribute('aria-expanded',String(open)));const toggle=root.querySelector('[data-toggle-tree="'+id+'"]');if(toggle)toggle.textContent=open?'▾':'▸';}
  function saveTree(){try{localStorage.setItem(treeKey,JSON.stringify(treeOpen));}catch{}}
  for(const l of config.lessons)setTree(l.id,!!treeOpen[l.id]);
  $('course-toc').addEventListener('click',e=>{const toggle=e.target.closest('[data-toggle-tree]'),chapter=e.target.closest('[data-lesson]');if(toggle){e.preventDefault();setTree(toggle.dataset.toggleTree,!treeOpen[toggle.dataset.toggleTree]);saveTree();}else if(chapter){e.preventDefault();const id=chapter.dataset.lesson;setTree(id,!treeOpen[id]);saveTree();if(current!==id)navigate(id);}});
  $('course-expand-all').onclick=()=>{for(const l of config.lessons)setTree(l.id,true);saveTree();};
  $('course-collapse-all').onclick=()=>{for(const l of config.lessons)setTree(l.id,false);saveTree();};
  $('course-note-fields').innerHTML=noteFields.map(([id,label,placeholder])=>`<label>${esc(label)}<textarea id="my-note-${id}" maxlength="20000" placeholder="${esc(placeholder)}"></textarea></label>`).join('');
  function fillNotes(){for(const[id]of noteFields)$('my-note-'+id).value=state.notes[id]||'';}
  fillNotes();
  function progress(){const count=state.completed.filter(id=>ids.has(id)).length;const total=config.lessons.length;$('course-progress-text').textContent=`已标记 ${count} / ${total} 节`;$('course-progress').max=total;$('course-progress').value=count;root.querySelectorAll('[data-lesson]').forEach(a=>{a.querySelector('.course-check').textContent=state.completed.includes(a.dataset.lesson)?'✓':'';});}
  let current='';
  function currentId(){const hash=location.hash.slice(1);if(!hash&&ids.has(state.lastLesson))return state.lastLesson;if(hash==='planning')return'money';const id=new URLSearchParams(hash).get('lesson');return ids.has(id)?id:(aliases[id]||'route');}
  function navigate(id){if(!ids.has(id))return;if(location.hash==='#lesson='+id)render(true);else location.hash='lesson='+id;}
  function render(focus=false){
    globalThis.KBBookReader?.unmount();
    globalThis.KBDaily?.unmount();
    current=currentId();state.lastLesson=current;persist();const lesson=config.lessons.find(l=>l.id===current),index=config.lessons.indexOf(lesson),group=config.groups.find(g=>g.id===lesson.group);
    $('course-breadcrumb').textContent=`${group.number} / ${group.title}`;
    $('course-title').textContent=lesson.title;$('course-goal').textContent=lesson.goal;
    $('course-position').textContent=`第 ${index+1} / ${config.lessons.length} 节`;
    $('course-reading').innerHTML=lesson.html+`<div class="course-source">整理来源：<a href="${esc(lesson.sourceLink)}">${esc(lesson.sourceTitle)}</a>。个人理解请记在“我的总结与复盘”。</div>`;
    $('course-done').checked=state.completed.includes(current);
    $('lesson-note-text').value=state.lessonNotes[current]||'';
    $('lesson-note-status').textContent=state.lessonNotes[current]?'已恢复本节笔记。继续输入会自动保存。':'在这里直接输入；每节笔记独立自动保存到当前浏览器。';
    const main=$('course-reading-details').parentNode;
    main.insertBefore($('course-reading-details'),$('lesson-lab'));
    main.insertBefore($('chapter-experiment-picker'),$('lesson-lab'));
    main.insertBefore($('course-advanced'),$('lesson-note-panel'));
    const personal=$('course-personal');personal.parentNode.insertBefore(personal,current==='my-notes'?$('course-reading-details'):$('course-advanced'));
    if(current==='books'){const reader=document.createElement('div');$('course-reading').insertBefore(reader,$('course-reading').querySelector('.course-source'));globalThis.KBBookReader.mount(reader,config.books||[],config.pdfAssets);}
    if(current==='daily'){const inbox=document.createElement('div');$('course-reading').insertBefore(inbox,$('course-reading').querySelector('.course-source'));globalThis.KBDaily.mount(inbox);}
    assignHeadingAnchors();renderNotesIndex();
    root.querySelectorAll('[data-lesson]').forEach(a=>{if(a.dataset.lesson===current)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
    $('course-original-tools').hidden=true;
    const tools=lesson.tools||[];
    $('course-planning-tools').hidden=!tools.length;$('course-personal').hidden=lesson.tool!=='personal';$('course-tools').hidden=!tools.length;$('course-advanced').hidden=!tools.length;$('course-advanced').open=tools.length>0;
    $('chapter-tool-picker').innerHTML=tools.map(t=>`<button data-chapter-tool="${t}" aria-pressed="false">${esc(toolLabels[t])}</button>`).join('');
    if(tools.length)activateTool(tools[0]);
    const experiments=lesson.experiences||[];
    $('chapter-experiment-picker').hidden=experiments.length===0;
    $('chapter-experiment-picker').innerHTML=experiments.map(id=>`<button data-chapter-experiment="${id}" aria-pressed="false">${esc(experimentLabels[id])}</button>`).join('');
    $('lesson-lab').hidden=!experiments.length;
    const oldId=new URLSearchParams(location.hash.slice(1)).get('lesson');
    const preferred={returns:'compound',compound:'compound',statements:'statements',valuation:'valuation',bonds:'bonds','fund-research':'fund-research',global:'fund-research'}[oldId];
    if(experiments.length)activateExperiment(experiments.includes(preferred)?preferred:experiments[0]);else $('lesson-lab').innerHTML='';
    $('course-prev').disabled=index===0;$('course-next').disabled=index===config.lessons.length-1;
    $('course-next-label').textContent=index+1<config.lessons.length?'下一节：'+config.lessons[index+1].title:'已到目录最后一节';
    $('course-sidebar').classList.remove('is-open');$('course-menu').setAttribute('aria-expanded','false');$('course-menu').textContent='展开目录';
    root.querySelectorAll('[data-parent-lesson]').forEach(a=>{if(a.getAttribute('href')===location.hash)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});
    document.title=lesson.title+' · 我的投资学习手册';progress();
    if(focus){window.scrollTo({top:0,behavior:'instant'});$('course-title').focus({preventScroll:true});}
    const section=new URLSearchParams(location.hash.slice(1)).get('section');if(current==='daily'&&['daily-import-zone','daily-list-zone','daily-preview-zone','daily-backup-zone'].includes(section))requestAnimationFrame(()=>$(section)?.scrollIntoView({block:'start'}));
    const requestedPoint=new URLSearchParams(location.hash.slice(1)).get('point');if(requestedPoint!==null&&/^\d+$/.test(requestedPoint)){const h=$('course-reading').querySelectorAll('h2,h3')[Number(requestedPoint)];requestAnimationFrame(()=>h?.scrollIntoView({block:'start'}));}
    const prefix=config.aliasSections?.[oldId];if(prefix&&oldId!==current)requestAnimationFrame(()=>{const h=[...$('course-reading').querySelectorAll('h2')].find(h=>h.textContent.startsWith(prefix));h?.scrollIntoView({block:'start'});});
  }
  const toolLabels={allocation:'持仓与再平衡',crisis:'危机压力测试',selection:'研究卡与仓位预算',legacy:'长期目标试算',library:'笔记与资料检索'};
  const experimentLabels={compound:'复利与费用',margin:'安全边际',statements:'财报联动',valuation:'估值敏感性','fund-research':'基金持仓重叠',bonds:'债券久期'};
  function activateExperiment(id){globalThis.KBLearningLab.mount(id);root.querySelectorAll('[data-chapter-experiment]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.chapterExperiment===id)));}
  function activateTool(id){$('pt-'+id).click();root.querySelectorAll('[data-chapter-tool]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.chapterTool===id)));}
  function assignHeadingAnchors(){
    [...$('course-reading').querySelectorAll('h2,h3')].forEach((h,i)=>{h.id=h.id||'chapter-point-'+i;});
  }
  root.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.chapterExperiment)activateExperiment(b.dataset.chapterExperiment);if(b.dataset.chapterTool)activateTool(b.dataset.chapterTool);if(b.dataset.subsection)$(b.dataset.subsection).scrollIntoView({behavior:'smooth',block:'start'});});
  $('course-menu').addEventListener('click',()=>{const on=$('course-sidebar').classList.toggle('is-open');$('course-menu').setAttribute('aria-expanded',String(on));$('course-menu').textContent=on?'收起目录':'展开目录';});
  $('course-search').addEventListener('input',()=>{const q=$('course-search').value.trim().toLocaleLowerCase();let visible=0;root.querySelectorAll('[data-tree-lesson]').forEach(d=>{const l=config.lessons.find(l=>l.id===d.dataset.treeLesson),g=config.groups.find(g=>g.id===l.group);const match=!q||((g.title+' '+l.title+' '+l.goal+' '+l.html).toLocaleLowerCase().includes(q))||(l.id==='books'&&(config.books||[]).some(b=>b.title.toLowerCase().includes(q)));d.hidden=!match;if(match)visible++;d.querySelectorAll('.course-tree-point').forEach(a=>a.hidden=false);if(q&&match)setTree(l.id,true,false);else if(!q)setTree(l.id,!!treeOpen[l.id]);});$('course-search-empty').hidden=visible>0;});
  $('course-done').addEventListener('change',()=>{state.completed=state.completed.filter(id=>id!==current);if($('course-done').checked)state.completed.push(current);persist();progress();});
  $('course-prev').addEventListener('click',()=>{const i=config.lessons.findIndex(l=>l.id===current);if(i>0)navigate(config.lessons[i-1].id);});
  $('course-next').addEventListener('click',()=>{const i=config.lessons.findIndex(l=>l.id===current);if(i<config.lessons.length-1)navigate(config.lessons[i+1].id);});
  function renderNotesIndex(){
    const entries=config.lessons.filter(l=>state.lessonNotes[l.id]);
    $('lesson-notes-index').innerHTML=entries.length?entries.map(l=>`<a href="#lesson=${l.id}">${esc(l.title)}<small>${esc(state.lessonNotes[l.id].slice(0,100))}</small></a>`).join(''):'<p>还没有章节笔记。任何章节都可以点击顶部“写本节笔记”直接记录。</p>';
  }
  function saveLesson(){const text=$('lesson-note-text').value;if(text)state.lessonNotes[current]=text;else delete state.lessonNotes[current];const ok=persist();$('lesson-note-status').textContent=ok?'已保存本节笔记到当前浏览器。':'浏览器保存失败，请导出备份。';renderNotesIndex();}
  $('lesson-note-text').addEventListener('input',saveLesson);
  $('lesson-note-save').addEventListener('click',saveLesson);
  $('lesson-note-jump').addEventListener('click',()=>{$('lesson-note-panel').scrollIntoView({behavior:'smooth',block:'start'});$('lesson-note-text').focus({preventScroll:true});});
  $('course-notes-home').addEventListener('click',()=>navigate('my-notes'));
  $('course-export-top').addEventListener('click',()=>$('course-export').click());
  $('course-save-top').addEventListener('click',()=>$('course-save').click());
  $('course-backup-top').addEventListener('click',()=>$('course-export').click());
  function download(text,name,type){const url=URL.createObjectURL(new Blob([text],{type})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
  $('lesson-note-export').addEventListener('click',()=>{const l=config.lessons.find(l=>l.id===current);download('# '+l.title+' · 我的笔记\n\n'+$('lesson-note-text').value+'\n','investment-note-'+current+'.md','text/markdown;charset=utf-8');});
  root.addEventListener('click',e=>{if(e.target.closest('#lab-record')){const text=($('lab-sim-output')||$('lab-feedback')||$('lab-activity').querySelector('.lab-feedback'))?.innerText;if(!text){$('lesson-note-status').textContent='先操作实验或作答，再记录结果。';return;}$('lesson-note-text').value=($('lesson-note-text').value+'\n\n【教学实验观察，待自己解释】\n'+text).trim().slice(0,1000000);saveLesson();$('lesson-note-panel').scrollIntoView({behavior:'smooth',block:'start'});}});
  function collect(){return Object.fromEntries(noteFields.map(([id])=>[id,$('my-note-'+id).value]));}
  $('course-note-fields').addEventListener('input',()=>{$('course-save-status').textContent='有尚未保存的修改；在本页切换章节会保留，刷新前请保存或导出。';});
  $('course-save').addEventListener('click',()=>{state.notes=collect();$('course-save-status').textContent=persist()?'已保存到当前浏览器。建议同时导出备份。':'未能保存到浏览器，请导出备份。';});
  $('course-export').addEventListener('click',()=>{const data={...state,notes:collect(),bookAnnotations:globalThis.KBBookReader.exportNotes(),exportedAt:new Date().toISOString()};const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json;charset=utf-8'});const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='my-investment-learning.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);$('course-save-status').textContent='已生成备份下载，包含当前填写内容、学习进度与书籍批注；当日资料附件请在该章单独备份。';});
  $('course-import').addEventListener('change',async e=>{const f=e.target.files[0];if(!f)return;try{if(f.size>32*1024*1024)throw Error('备份文件超过 32 MB。');const parsed=JSON.parse(await f.text());const next=validRecord(parsed);if(parsed.bookAnnotations)globalThis.KBBookReader.importNotes(parsed.bookAnnotations,config.books||[]);next.lessonNotes={...state.lessonNotes,...next.lessonNotes};state=next;fillNotes();$('lesson-note-text').value=state.lessonNotes[current]||'';renderNotesIndex();persist();progress();$('course-done').checked=state.completed.includes(current);$('course-save-status').textContent='已导入备份。';}catch(error){$('course-save-status').textContent='导入失败：'+error.message;}finally{e.target.value='';}});
  root.addEventListener('click',e=>{const b=e.target.closest('[data-goto-plan]');if(b?.dataset.gotoPlan==='allocation'){if(current==='rebalance')activateTool('allocation');else navigate('rebalance');}});
  window.addEventListener('hashchange',()=>render(true));render(false);
})();
