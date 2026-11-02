/* Pure arithmetic helpers. Assumptions are displayed beside each tool. */
globalThis.KBPlanningMath = {
  rebalance(holdings, targets, addition, floor) {
    const effective = holdings.map((v,i)=>v+(i===holdings.length-1?addition:0));
    const total = effective.reduce((s,v)=>s+v,0);
    if (Math.abs(targets.reduce((s,v)=>s+v,0)-100)>0.000001) throw Error('目标比例合计必须为 100%。');
    if (!(total>0)) throw Error('先填写持仓，或载入教学示例。');
    const desired = targets.map(v=>total*v/100);
    if (desired.at(-1)+1e-8<floor) throw Error('目标现金低于组合最低现金：请调整目标或现金下限，当前不生成回目标差额。');
    return {total,effective,desired,weights:effective.map(v=>100*v/total),deltas:desired.map((v,i)=>v-effective[i])};
  },
  stress(holdings,shocks,addition) {
    const effective=holdings.map((v,i)=>v+(i===holdings.length-1?addition:0));
    const before=effective.reduce((s,v)=>s+v,0);
    const afterValues=effective.map((v,i)=>v*(1+shocks[i]/100));
    const after=afterValues.reduce((s,v)=>s+v,0);
    return {before,after,afterValues,change:after-before,returnPct:before?100*(after/before-1):0};
  },
  future(principal,contribution,years,rate,inflation,goal) {
    const r=rate/100, i=inflation/100;
    const factor=Math.pow(1+r,years);
    const nominal=principal*factor+contribution*(Math.abs(r)<1e-12?years:(factor-1)/r);
    const real=nominal/Math.pow(1+i,years);
    return {nominal,real,nominalGoal:goal*Math.pow(1+i,years),realGap:real-goal};
  },
  position(budget,loss,cap) {
    if (!(loss>0)) throw Error('压力损失必须大于 0%。');
    const weight=Math.min(100,cap,budget/loss*100);
    return {weight,assumedLoss:weight*loss/100,totalLoss:weight};
  }
};
(() => {
  const root=document.getElementById('planning'); if(!root)return;
  const $=id=>root.querySelector('#'+id);
  const M=globalThis.KBPlanningMath;
  const labels=['北美权益','台股 / 日韩权益','港股通机会权益','东南亚权益','短久期高质量债（非保证现金）','中长久期高质量债','黄金','REITs（待研究）','组合现金'];
  const shocks={recession:[-35,-35,-35,-35,1,10,5,-30,0],inflation:[-25,-25,-25,-25,-1,-18,5,-20,0],liquidity:[-40,-40,-40,-40,-2,-12,-10,-35,0]};
  const fmt=n=>Number(n).toLocaleString('zh-CN',{maximumFractionDigits:2});
  const money=n=>fmt(n)+' '+($('plan-currency').value.trim()||'记账单位');
  const signed=n=>(n>0?'+':'')+fmt(n);
  const num=(id,min=0,max=Number.MAX_SAFE_INTEGER,integer=false)=>{
    const el=$(id),v=Number(el.value);
    if(el.value.trim()===''||!Number.isFinite(v)||v<min||v>max||(integer&&!Number.isInteger(v)))throw Error('请检查“'+(el.getAttribute('aria-label')||el.closest('label')?.childNodes[0]?.textContent?.trim()||id)+'”的输入范围。');
    return v;
  };
  const setResult=(id,fn)=>{try{$(id).classList.remove('error');$(id).textContent=fn();}catch(e){$(id).classList.add('error');$(id).textContent=e.message;}};
  const values=()=>({h:labels.map((_,i)=>num('holding-'+i)),t:labels.map((_,i)=>num('target-'+i,0,100)),add:num('plan-add'),floor:num('plan-floor'),band:num('plan-band',0,100)});
  $('allocation-rows').innerHTML=labels.map((s,i)=>`<tr><th scope="row">${s}</th><td><input type="number" id="holding-${i}" aria-label="${s}当前市值" min="0" step="any" value="0"></td><td><input type="number" id="target-${i}" aria-label="${s}目标比例" min="0" max="100" step="any" value="0"></td><td id="weight-${i}">—</td><td id="deviation-${i}">—</td><td id="delta-${i}">—</td></tr>`).join('');
  $('stress-rows').innerHTML=labels.map((s,i)=>`<tr><th scope="row">${s}</th><td><input type="number" id="shock-${i}" aria-label="${s}冲击百分比" min="-100" max="100" step="any" value="${shocks.recession[i]}" ${i===8?'readonly':''}></td><td id="stressed-${i}">—</td><td id="change-${i}">—</td></tr>`).join('');
  function allocation(){
    labels.forEach((_,i)=>{for(const p of ['weight','deviation','delta'])$(p+'-'+i).textContent='—';});
    setResult('allocation-result',()=>{
      const {h,t,add,floor,band}=values(); const total=h.reduce((s,v)=>s+v,0)+add;
      const sum=t.reduce((s,v)=>s+v,0);
      if(total>0)h.forEach((v,i)=>{$('weight-'+i).textContent=fmt((v+(i===8?add:0))/total*100)+'%';});
      const p=M.rebalance(h,t,add,floor);
      let breaches=0;
      p.weights.forEach((w,i)=>{const d=w-t[i];if(Math.abs(d)>=band&&Math.abs(d)>1e-8)breaches++;$('deviation-'+i).textContent=signed(d);$('delta-'+i).textContent=signed(p.deltas[i]);});
      const under=p.effective[8]<floor?' 当前现金已低于下限，优先复核资金安全。':'';
      return `组合含新增资金合计 ${money(p.total)}；目标合计 ${fmt(sum)}%。\n达到复核偏离带的资产：${breaches} 项。可动用机会现金 ${money(Math.max(0,p.effective[8]-floor))}。${under}\n表中差额为完全回目标的算术对照；可先用新增资金补低配项，不自动执行交易。`;
    });
  }
  function stress(){
    labels.forEach((_,i)=>{$('stressed-'+i).textContent='—';$('change-'+i).textContent='—';});
    setResult('stress-result',()=>{
      const {h,t,add,floor}=values();const s=labels.map((_,i)=>num('shock-'+i,-100,100));
      const batches=num('crisis-batches',1,20,true); const p=M.stress(h,s,add);
      if(!(p.before>0))throw Error('先到“仓位与再平衡”填写持仓，或载入教学示例。');
      p.afterValues.forEach((v,i)=>{$('stressed-'+i).textContent=money(v);$('change-'+i).textContent=signed(v-h[i]-(i===8?add:0));});
      const available=Math.max(0,p.afterValues[8]-floor);
      const eq=p.afterValues.slice(0,4).reduce((a,b)=>a+b,0);
      const valid=Math.abs(t.reduce((a,b)=>a+b,0)-100)<1e-6;
      let action='目标未合计为 100%，暂不计算权益回目标额度。';
      if(valid){const gap=Math.max(0,p.after*t.slice(0,4).reduce((a,b)=>a+b,0)/100-eq);const amount=Math.min(available,gap);action=`冲击后权益回目标缺口 ${money(gap)}；同时受现金底线约束的算术额度 ${money(amount)}，均分 ${batches} 批约为每批 ${money(amount/batches)}。`;
        if(p.after*t[8]/100+1e-8<floor)action+=' 注意：全组合回目标会违反现金底线，需先修订目标；这里的权益额度不构成可执行的完整调仓方案。';}
      return `冲击前 ${money(p.before)} → 冲击后 ${money(p.after)}；金额变化 ${money(p.change)}（${signed(p.returnPct)}%）。\n名义现金 ${money(p.afterValues[8])}，扣除组合最低现金后可用 ${money(available)}。\n${action}\n未达现金底线时停止动用；基本面、收入与交易通道仍需另外复核。`;
    });
  }
  function stock(){setResult('stock-result',()=>{const p=M.position(num('stock-budget',0,100),num('stock-loss',0.01,100),num('stock-cap',0,100));return `压力损失假设与单股硬上限共同约束下，算术仓位不超过组合 ${fmt(p.weight)}%。\n按输入的压力损失计算，组合损失为 ${fmt(p.assumedLoss)}%；若该股全损，组合损失为 ${fmt(p.totalLoss)}%。其他资产的同时损失尚未计入，仍需检查总权益与行业上限。`;});}
  function legacy(){
    $('legacy-scenarios').textContent='';
    setResult('legacy-result',()=>{
      const p=num('legacy-p'),c=num('legacy-c'),n=num('legacy-n',1,60,true),r=num('legacy-r',-50,30),i=num('legacy-i',-10,30),g=num('legacy-g');
      const a=M.future(p,c,n,r,i,g);
      $('legacy-scenarios').innerHTML=[r-2,r,r+2].map(rate=>{const v=M.future(p,c,n,rate,i,g);return `<tr><td>${fmt(rate)}%</td><td>${fmt(v.nominal)}</td><td>${fmt(v.real)}</td><td>${signed(v.realGap)}</td></tr>`;}).join('');
      return `在上述恒定假设下，${n} 年后名义金额 ${fmt(a.nominal)}，折回今天购买力约 ${fmt(a.real)}。\n目标对应未来名义金额 ${fmt(a.nominalGoal)}；相对今天购买力目标的差额 ${signed(a.realGap)}。\n金额单位沿用你的输入；年度投入为固定名义金额、年末投入，未随通胀增加。`;
    });
  }
  const fields=[['sources','事实与来源（公告、报告日期、链接）'],['model','客户、盈利模式与竞争优势'],['finance','财务质量、现金、债务与异常'],['valuation','压力 / 基准 / 乐观估值假设'],['unknown','未知、反方证据与论点失效条件'],['portfolio','组合重叠、仓位约束与复核计划']];
  const checks=['理解生意与替代品','财务与附注已核查','估值假设能解释','反方证据已记录','行业与地区重叠已核查','现金与仓位上限已核查'];
  $('research-fields').innerHTML=fields.map(([id,s])=>`<label>${s}<textarea id="research-${id}" placeholder="事实、假设与未知分开写"></textarea></label>`).join('');
  $('research-checks').innerHTML=checks.map((s,i)=>`<label><input id="research-check-${i}" type="checkbox">${s}</label>`).join('');
  function research(){const n=checks.filter((_,i)=>$('research-check-'+i).checked).length;$('research-status').textContent=`自查完成 ${n}/${checks.length} 项。勾选不代表证据已被独立核实，未填写的研究内容仍待补。`;}
  function show(name,focus=false){root.querySelectorAll('[data-plan]').forEach(b=>{const on=b.dataset.plan===name;b.setAttribute('aria-selected',String(on));b.tabIndex=on?0:-1;});root.querySelectorAll('[role=tabpanel]').forEach(p=>p.hidden=p.id!=='pp-'+name);if(focus)$('pt-'+name).focus();}
  root.addEventListener('keydown',e=>{const b=e.target.closest('[data-plan]');if(!b)return;const buttons=[...root.querySelectorAll('[data-plan]')];let i=buttons.indexOf(b);if(e.key==='ArrowRight')i=(i+1)%buttons.length;else if(e.key==='ArrowLeft')i=(i+buttons.length-1)%buttons.length;else if(e.key==='Home')i=0;else if(e.key==='End')i=buttons.length-1;else return;e.preventDefault();show(buttons[i].dataset.plan,true);});
  root.addEventListener('click',e=>{
    const b=e.target.closest('button');if(!b)return;
    if(b.dataset.plan)show(b.dataset.plan);
    if(b.dataset.gotoPlan)show(b.dataset.gotoPlan,true);
    if(b.id==='plan-example'){const sample=[35,15,5,0,20,5,5,0,15];sample.forEach((v,i)=>{$('holding-'+i).value=v*10000;$('target-'+i).value=v;});$('plan-add').value=0;$('plan-floor').value=100000;$('plan-band').value=5;allocation();stress();}
    if(b.id==='plan-clear'){labels.forEach((_,i)=>{$('holding-'+i).value=0;$('target-'+i).value=0;});$('plan-add').value=0;$('plan-floor').value=0;allocation();stress();}
    if(b.id==='research-download'){
      const record={type:'学习研究卡',schemaVersion:1,name:$('research-name').value,date:$('research-date').value,nextReview:$('research-review').value,notes:Object.fromEntries(fields.map(([id])=>[id,$('research-'+id).value])),checks:Object.fromEntries(checks.map((s,i)=>[s,$('research-check-'+i).checked]))};
      const url=URL.createObjectURL(new Blob([JSON.stringify(record,null,2)],{type:'application/json;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='investment-research-card.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
    }
  });
  root.addEventListener('change',e=>{if(e.target.id==='stress-scenario'){shocks[e.target.value].forEach((v,i)=>$('shock-'+i).value=v);stress();}});
  root.addEventListener('input',e=>{
    const id=e.target.id;
    if(id.startsWith('holding-')||id.startsWith('target-')||id.startsWith('plan-')){allocation();stress();}
    if(id.startsWith('shock-')||id==='crisis-batches')stress();
    if(id.startsWith('stock-'))stock();
    if(id.startsWith('legacy-'))legacy();
    if(id.startsWith('research-check-'))research();
    if(id==='library-search')filterLibrary();
  });
  function filterLibrary(){const q=$('library-search').value.trim().toLocaleLowerCase();let count=0;const docs=[...$('library-docs').querySelectorAll('.library-doc')];docs.forEach(d=>{d.hidden=q!==''&&!d.textContent.toLocaleLowerCase().includes(q);if(!d.hidden)count++;});$('library-count').textContent=`显示 ${count} / ${docs.length} 份文档；展开可阅读全文。`;}
  show('framework');allocation();stress();stock();legacy();research();filterLibrary();
})();
