/* Self-contained, deterministic teaching activities. No prices or return forecasts. */
(() => {
 const definitions={
 route:{nodes:[['认识工具','先认识自己持有的是什么。'],['建立判断','把概念转成证据与反证。'],['约束行动','让仓位和现金服从目标。'],['形成总结','把自己的结论记录并复核。']],type:'path',title:'选择一条路线，看看它为什么要这样学'},
 money:{nodes:[['收入与支出','先确认日常结余。'],['应急与近期支出','资金用途不能被行情改变。'],['长期资金','承受波动需要时间与余地。']],type:'sort-money',title:'给三笔钱找到合适的位置'},
 assets:{nodes:[['持有工具','ETF 是包装形式。'],['底层资产','股票与债券决定主要风险。'],['真实风险','名称不能替代持仓检查。']],type:'sort-assets',title:'拆开产品包装，识别真正的资产'},
 returns:{nodes:[['期初本金','收益率总是相对一个基数。'],['第一年变化','第二年在新基数上计算。'],['最终金额','名义回报之外，还要考虑通胀与费用。']],type:'returns',title:'涨跌相抵吗？亲手改变两个年度的涨跌幅'},
 risk:{nodes:[['原值 100','先确定损失相对的高点。'],['承受下跌','损失之后的本金变少。'],['恢复原值','回本需要更大的上涨百分比。']],type:'risk',title:'回本爬坡：下跌越深，坡度越陡'},
 currency:{nodes:[['原币资产回报','资产本身先涨跌。'],['汇率变化','一单位外币可换多少本币？'],['本币总回报','两层变化相乘，不是简单相加。']],type:'currency',title:'资产涨了，为什么换回本币还可能亏？'},
 market:{nodes:[['每日报价','报价是可选择的交易条件。'],['企业价值','先检查生意是否变化。'],['自己的决定','不必跟随每个价格波动。']],type:'market',title:'市场先生喊价：价格改变时，价值一定改变吗？'},
 margin:{nodes:[['价值假设','估值可能出错。'],['压力价值','先把估值向下修正。'],['当前价格','比较压力情景下还剩多少缓冲。']],type:'margin',title:'安全边际不是护身符：让估值也接受压力测试'},
 circle:{nodes:[['我的判断','先把观点写具体。'],['证据','找到可以独立核实的事实。'],['反证条件','什么发生时我会认错？']],type:'circle',title:'研究侦探：哪条信息真正帮你画出能力圈？'},
 compound:{nodes:[['本金','损失和费用都会影响后续基数。'],['重复积累','每期收益继续参与计算。'],['长期差距','小费率也会积累差异。']],type:'compound',title:'两条成长轨道：每年一点费用会留下多少差距？'},
 correlation:{nodes:[['增长冲击','不同资产可能反应不同。'],['通胀冲击','股票和长债也可能一起跌。'],['流动性冲击','短期被迫出售会改变关系。']],type:'correlation',title:'切换经济天气，看看“分散”为什么不等于“不亏”'},
 'business-model':{nodes:[['客户付钱','收入来自真实需求。'],['交付与获客成本','营业额不能直接归股东。'],['保留利润','还需考虑其他费用与资本占用。']],type:'business',title:'经营一家小店：销量很大，就一定赚钱？'},
 statements:{nodes:[['利润表','赊销可以有利润但没收到现金。'],['资产负债表','应收、设备和负债都有去处。'],['现金流','分清经营、投资和融资现金。']],type:'statements',title:'做一笔交易，三张表会怎样一起变化？'},
 valuation:{nodes:[['未来现金','增长需要能够实现且得到支持。'],['折现要求','要求越高，现值通常越低。'],['价值区间','假设的小变化可能明显改变结果。']],type:'valuation',title:'估值温度计：提高增长、降低折现率，数字会多敏感？'},
 'fund-research':{nodes:[['基金 A','看持仓而非名字。'],['基金 B','不同名称也可能持有相同股票。'],['共同暴露','重合部分没有带来新的分散。']],type:'overlap',title:'持仓透视镜：两只 ETF 是否重复买了同样的公司？'},
 layers:{nodes:[['家庭应急','在可投资组合外单列。'],['长期核心','按照长期目标承担风险。'],['机会现金','有底线、有用途、不重复统计。']],type:'sort-layers',title:'资金分层：危机来了，哪笔钱能动？'},
 global:{nodes:[['不同地区','先看到地理上的分布。'],['共同产业','多个市场可能共享科技需求。'],['共同冲击','同一因子可以同时影响多个地区。']],type:'global',title:'全球地图背后：地区多，真的分散了吗？'},
 bonds:{nodes:[['利率变化','收益率上升时，旧债价格通常承压。'],['久期','修正久期越大，敏感度通常越高。'],['可变现金额','可以卖出不等于原价卖出。']],type:'bonds',title:'债券跷跷板：改动利率和久期，观察价格敏感度'},
 rebalance:{nodes:[['原定比例','先确定目标。'],['市场涨跌','实际比例开始漂移。'],['再平衡','恢复预算，而非预测拐点。']],type:'rebalance',title:'把偏离的组合拉回目标，需要挪动多少钱？'},
 macro:{nodes:[['观察价格','商品上涨是一个现象。'],['提出多种解释','需求、供给或持仓都可能有关。'],['补证据','先核查，再考虑调整。']],type:'macro',title:'宏观推理：商品价格上涨，下一步该做什么？'},
 crisis:{nodes:[['现金总额','不是每一元都能用于机会。'],['保留底线','家庭安全优先。'],['受限机会额度','同时考虑目标缺口和可用现金。']],type:'crisis',title:'危机弹药箱：想加仓多少，与能加仓多少不同'},
 'research-card':{nodes:[['损失预算','先定义组合可承担的金额影响。'],['个股压力损失','假设错了会影响上限。'],['仓位约束','还要受总权益、行业和单股上限约束。']],type:'position',title:'仓位天平：压力假设改变，上限如何变化？'},
 quiz:{nodes:[['直觉回答','先作答，再看解释。'],['检查条件','把隐含前提找出来。'],['修正理解','不要只记一句金句。']],type:'quiz',title:'三个情景挑战：识别看似合理的错误'},
 'long-term':{nodes:[['今天投入','本金与后续投入分开。'],['二三十年积累','恒定回报只是教学假设。'],['实际购买力','名义数字还需扣除通胀影响。']],type:'legacy',title:'时间胶囊：未来一百万元还等于今天一百万元吗？'},
 handover:{nodes:[['知道有哪些资产','清单不放密码。'],['有合法接管路径','权属、授权和继承效果需核实。'],['家人理解管理规则','知道用途、底线和联系路径。']],type:'handover',title:'接管演练：哪些缺口会让家人卡住？'},
 'family-guide':{nodes:[['目标日期','不同日期的钱分别管理。'],['金额弹性','刚性学费与可推迟赠予不同。'],['匹配安排','期限与币种都需要连接用途。']],type:'sort-family',title:'目标配对：不同用途的钱，能承受同样波动吗？'},
 'my-framework':{nodes:[['长期目标','先有锚。'],['组合纪律','再平衡有预定条件。'],['现金底线','机会不突破生活保障。'],['跨代安排','资金有使用日期和接管安排。']],type:'framework',title:'搭建自己的体系：点击检查每根支柱是否有规则'},
 'my-notes':{nodes:[['事实','可以指向材料与日期。'],['判断','由事实推导，可能错。'],['个人规则','还需写适用范围和复核条件。']],type:'reflection',title:'把一句模糊的感想，变成可复核的笔记'},
 library:{nodes:[['原始材料','区分原件与主题补充。'],['来源与日期','同一结论可能有不同证据强度。'],['自己的解读','不要冒充作者原话。']],type:'sources',title:'证据分拣：什么可以标成“原文”？'}
 };
 const math={
 returns:(a,b)=>(1+a/100)*(1+b/100)*100,
 recovery:d=>100*d/(100-d),
 fx:(r,f)=>100*((1+r/100)*(1+f/100)-1),
 margin:(v,p,e)=>({stress:v*(1-e/100),discount:100*(1-p/(v*(1-e/100)))}),
 bond:(d,y)=>-d*y,
 perpetuity:(cash,r,g)=>r>g?cash/(r/100-g/100):null,
 overlap:(a,b)=>a.reduce((s,v,i)=>s+Math.min(v,b[i]),0),
 crisis:(cash,floor,gap)=>Math.min(Math.max(0,cash-floor),Math.max(0,gap))
 };
 globalThis.KBLabMath=math;
 const $=id=>document.getElementById(id), f=n=>Number(n).toLocaleString('zh-CN',{maximumFractionDigits:2}),esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 let model={},lessonId='',sortIndex=0,answers={},scenario='growth';
 const slider=(id,label,min,max,value,step=1)=>`<label class="lab-control">${label}<output id="out-${id}">${value}</output><input id="lab-${id}" data-param="${id}" type="range" min="${min}" max="${max}" step="${step}" value="${value}"></label>`;
 const bars=items=>`<div class="lab-bars">${items.map(([label,val,max=100])=>`<div class="lab-bar-row"><span>${esc(label)}</span><div class="lab-track"><i style="width:${Math.min(100,Math.abs(val)/max*100)}%;background:${val<0?'#b65a4b':'#39775c'}"></i></div><b>${f(val)}</b></div>`).join('')}</div>`;
 const sorting={
 'sort-money':{categories:['近期与应急','长期投资'],cards:[['半年后要付的学费',0,'使用日期明确，先满足支付与币种要求。'],['收入中断时的生活费',0,'这是应急任务，不是危机加仓资金。'],['长期不用且能承受波动的结余',1,'先排除近期用途，再评估风险与目标。']]},
 'sort-assets':{categories:['权益风险','债券风险','支付与现金用途'],cards:[['持有股票的宽基 ETF',0,'ETF 是工具，底层仍主要是股票。'],['长期国债 ETF',1,'国债信用较高也不代表没有久期风险。'],['可随时使用的本币活期资金',2,'承担支付任务，仍要核对机构与币种。'],['上市 REITs',0,'此题按不动产权益与市场风险归类，不能因分配高就当债券。']]},
 'sort-layers':{categories:['不能动用','可以在规则内评估'],cards:[['家庭应急金',0,'先保障生活，不能拿来抄底。'],['已承诺的近期学费',0,'用途有刚性，不与机会资金混用。'],['超过现金下限的机会资金',1,'还需检查权益缺口、论点和交易条件。']]},
 'sort-family':{categories:['优先支付匹配','可以研究长期增长'],cards:[['明年确定要用的学费',0,'期限短且用途刚性，优先考虑可用金额与币种。'],['二十五年后可灵活调整的赠予',1,'期限与弹性较大，但仍不保证回报。'],['下个月到期的家庭负债',0,'不能让偿债依赖风险资产恰好上涨。']]}
 };
 const questionSets={
 circle:[{q:'你认为企业能保持盈利，哪项最有助于验证能力圈？',options:['我用了它的产品很多年','朋友和博主都看好','核对客户留存与现金，并写出竞争优势失效条件'],answer:2,why:'熟悉和认同不等于能解释盈利。可核实证据与失效条件才能暴露未知。'}],
 macro:[{q:'商品期货上涨 10%，能否据此把权益大幅加仓？',options:['能，肯定是经济复苏','不能先下结论，应区分供给、需求和交易因素','不能，肯定是危机'],answer:1,why:'一个价格现象对应多种原因。观察、解释、交叉核查与风险预算之间不能省略步骤。'}],
 quiz:[{q:'股价从高点下跌一半，是否一定更便宜？',options:['是，打了五折','不一定，盈利与价值也可能下降'],answer:1,why:'相对价值的价格才有意义。低于历史价不是安全边际。'},{q:'两只不同国家 ETF 是否一定足够分散？',options:['是，国家不同','不一定，可能共享科技、出口与美元因素'],answer:1,why:'地区是一个维度，底层公司与共同风险也要穿透。'},{q:'长期债券能够交易，能否视为等额机会现金？',options:['能，随时卖出即可','不能，利率和流动性可能改变出售价格'],answer:1,why:'流动性与价格稳定是两个条件。'}],
 reflection:[{q:'哪条笔记更容易复核？',options:['债券很安全，适合长期拿','我假设该债券能用于机会资金，仍待核查久期、信用、币种与到账安排'],answer:1,why:'第二条区分了假设、未知与核查动作；没有把资产类别直接等同于安全。'}],
 sources:[{q:'没有书籍原件，只按公开材料补充了财报主题，应怎样标注？',options:['原书核心摘要','公开资料与主题整理，原件仍未入库'],answer:1,why:'知识主题补齐不等于取得或读过原书。来源层级必须保留。'}]
 };
 function renderActivity(){
 const d=definitions[lessonId],type=d.type;let html='';
 if(sorting[type]){const game=sorting[type],card=game.cards[sortIndex];html=`<p class="lab-step">第 ${sortIndex+1} / ${game.cards.length} 张 · 点击分类</p><div class="lab-question-card">${esc(card[0])}</div><div class="lab-options">${game.categories.map((s,i)=>`<button data-sort="${i}">${esc(s)}</button>`).join('')}</div><div id="lab-feedback" role="status"></div><button data-next-card>下一张 ↻</button>`;}
 else if(questionSets[type]){html=questionSets[type].map((q,i)=>`<fieldset class="lab-question"><legend>${esc(q.q)}</legend><div class="lab-options">${q.options.map((s,j)=>`<button data-answer="${i}:${j}" ${answers[i]!==undefined?'disabled':''} class="${answers[i]!==undefined&&j===q.answer?'lab-correct':''}">${esc(s)}</button>`).join('')}</div>${answers[i]!==undefined?`<p class="lab-feedback ${answers[i]===q.answer?'good':'revise'}">${answers[i]===q.answer?'理解正确':'再想一步'}：${esc(q.why)}</p>`:''}</fieldset>`).join('')+'<button data-retry>重新挑战</button>';}
 else if(type==='path'){html='<div class="lab-options">'+[['money','我是新手：先分清资金用途'],['rebalance','我已有持仓：先检查组合'],['my-notes','我想写笔记：直接进入编辑']].map(([id,s])=>`<button data-go-lesson="${id}">${s}</button>`).join('')+'</div><p>路径可以自由选择；不熟悉的概念可以随时回到基础章节。</p>';}
 else if(type==='handover'||type==='framework'){const items=type==='handover'?['有不含密码的资产清单','核实权属与合法接管安排','家人理解用途与管理纪律']:['明确长期目标与用钱日期','写清目标仓位和偏离带','明确现金底线和停止条件','记录跨代用途与接管安排'];html='<div class="lab-check-puzzle">'+items.map((s,i)=>`<label><input type="checkbox" data-pillar="${i}" ${model['p'+i]?'checked':''}>${s}</label>`).join('')+'</div><div id="lab-sim-output" aria-live="polite"></div>';}
 else if(type==='statements'){html='<p>教学公司：初始现金 100、无负债、权益 100。先作出交易，再观察报表如何连接。忽略税、折旧与其他成本。</p><div class="lab-options"><button data-transaction="credit">赊销服务 30（成本 0）</button><button data-transaction="collect">收回应收款 30</button><button data-transaction="equipment">现金买设备 20</button><button data-transaction="loan">借款到账 40</button><button data-transaction="reset">重置公司</button></div><div id="lab-sim-output" aria-live="polite"></div>';}
 else if(type==='overlap'){html='<p>两只虚构 ETF，各有四项持仓。点击同一公司，看到两只基金都持有的部分。</p><div class="lab-options">'+['科技甲','科技乙','消费丙','其他'].map((s,i)=>`<button data-company="${i}" aria-pressed="${model.company===i}">${s}</button>`).join('')+'</div>'+slider('blend','基金 A 在两基金组合中的比例 %',0,100,model.blend??50)+'<div id="lab-sim-output" aria-live="polite"></div>';model.blend??=50;}
 else if(type==='correlation'||type==='global'){html='<div class="lab-options">'+[['growth','增长下行'],['inflation','通胀上行'],['liquidity','流动性紧缩']].map(([id,s])=>`<button data-weather="${id}" aria-pressed="${scenario===id}">${s}</button>`).join('')+'</div><div id="lab-sim-output" aria-live="polite"></div>';}
 else {
 const specs={returns:[['a','第一年涨跌 %',-60,100,20],['b','第二年涨跌 %',-60,100,-20]],risk:[['loss','从高点下跌 %',0,90,50]],currency:[['r','资产原币回报 %',-50,50,10],['fx','外币兑本币变化 %',-50,50,-15]],market:[['price','每日报价（假设价值 100）',20,180,70]],margin:[['value','初始价值假设',50,200,100],['price','当前价格',10,200,70],['error','估值向下修正 %',0,60,20]],compound:[['years','持有年数',1,40,25],['fee','每年费用 %',0,3,1,0.1]],business:[['units','销量',10,100,50],['price','每件售价',1,20,10],['cost','每件交付成本',0,20,7]],valuation:[['cash','下一期 FCFF（单位一致）',1,30,10],['r','折现率 %',3,15,8,0.5],['g','永续增长 %',0,6,3,0.5]],bonds:[['duration','修正久期',0,15,7,0.5],['yield','收益率变化（百分点）',-3,3,1,0.1]],rebalance:[['equity','权益当前市值',0,100,70]],crisis:[['cash','现有现金（万元）',0,50,15],['floor','必须保留的现金（万元）',0,50,10],['gap','权益目标缺口（万元）',0,50,8]],position:[['budget','给这一个股的组合损失预算 %',0,5,1,0.1],['loss','该股压力损失假设 %',10,100,50]],legacy:[['years','年数',5,40,25],['inflation','通胀假设 %',0,8,2,0.5]]};
 html=(specs[type]||[]).map(([id,label,min,max,value,step])=>{model[id]??=value;return slider(id,label,min,max,model[id],step);}).join('')+'<div id="lab-sim-output" aria-live="polite"></div>';
 }
 $('lab-activity').innerHTML=html;update();
 }
 function update(){const out=$('lab-sim-output');if(!out)return;const t=definitions[lessonId].type,m=model;let content='';
 if(t==='returns'){const end=math.returns(m.a,m.b);content=bars([['初始',100,220],['第一年后',100+m.a,220],['第二年后',end,220]])+`<p>100 → ${f(100+m.a)} → <b>${f(end)}</b>。总回报 ${f(end-100)}%，不是把两个百分比直接相加。</p>`;}
 if(t==='risk'){const remaining=100-m.loss;content=bars([['原值',100,100],['剩余',remaining,100]])+`<p>剩下 ${f(remaining)}，还差 ${f(m.loss)} 才回到 100。相对剩余本金需要上涨 <b>${f(math.recovery(m.loss))}%</b>。恢复不是保证。</p>`;}
 if(t==='currency'){content=bars([['原币回报 %',m.r,60],['汇率回报 %',m.fx,60],['本币回报 %',math.fx(m.r,m.fx),60]])+'<p>计算为 (1 + 原币回报) × (1 + 外币兑本币变化) − 1；不含税费与对冲。</p>';}
 if(t==='market'){content=bars([['价值假设',100,180],['今天报价',m.price,180]])+`<p>${m.price<100?'价格低于假设价值，但先复核价值是否还成立。':'价格已达到或超过假设价值；无需因为报价上涨就行动。'}价值 100 只是教学固定值，不是真实估值。</p>`;}
 if(t==='margin'){const v=math.margin(m.value,m.price,m.error);content=bars([['初始价值',m.value,200],['压力价值',v.stress,200],['当前价格',m.price,200]])+`<p>压力价值 ${f(v.stress)}；相对压力价值的折价 <b>${f(v.discount)}%</b>。${v.discount<0?'压力情景下价格反而高于价值假设。':'有折价仍不代表估值正确或应当买入。'}</p>`;}
 if(t==='compound'){const a=100*Math.pow(1.06,m.years),b=100*Math.pow(1+(6-m.fee)/100,m.years);content=bars([['不扣费用',a,a],['扣费用后',b,a]])+`<p>本金 100、固定毛回报 6% 的教学模型，${m.years} 年后差 ${f(a-b)}。费用按收益率减费用简化；不含真实波动与税。</p>`;}
 if(t==='business'){const revenue=m.units*m.price,cost=m.units*m.cost+100,profit=revenue-cost;content=bars([['收入',revenue,2100],['成本含固定 100',cost,2100],['简化利润',profit,2100]])+`<p>利润 = 销量 ×（售价 − 单件成本）− 固定成本 100 = <b>${f(profit)}</b>。${m.price<m.cost?'单件贡献为负，卖更多反而亏更多。':'还需核对获客、资本占用等实际成本。'}</p>`;}
 if(t==='valuation'){const value=math.perpetuity(m.cash,m.r,m.g);content=value===null?'<p class="lab-feedback revise">折现率必须高于永续增长率。不能在这个模型下生成有效价值。</p>':bars([['稳态企业经营价值',value,Math.max(value,400)]])+`<p>下一期 FCFF /（WACC − 永续增长）= <b>${f(value)}</b>。假设从下一期起永远稳定增长；不是完整估值，尚未扣净债务等项目得到股权价值。</p>`;}
 if(t==='bonds'){const change=math.bond(m.duration,m.yield);content=bars([['原市值',100,150],['近似变动',change,50],['近似新市值',100+change,150]])+`<p>小幅变化近似：−修正久期 × 收益率变动 = <b>${f(change)}%</b>。越大幅的利率变化越需要考虑凸性；未计票息、信用与汇率。</p>`;}
 if(t==='rebalance'){const total=m.equity+30,target=total*0.6,delta=target-m.equity;content=bars([['当前权益',m.equity,130],['当前防守资产',30,130],['目标权益金额',target,130]])+`<p>教学目标：权益 60%、防守资产 40%；当前权益 ${f(m.equity/total*100)}%。完全回目标需${delta>=0?'增加':'减少'}权益 ${f(Math.abs(delta))}，防守资产作相反调整。忽略税费与交易限制。</p>`;}
 if(t==='crisis'){const amount=math.crisis(m.cash,m.floor,m.gap);content=bars([['现金总额',m.cash,50],['必须保留',m.floor,50],['权益目标缺口',m.gap,50],['可评估额度',amount,50]])+`<p>额度 = min(超出底线的现金，目标缺口) = <b>${f(amount)} 万元</b>。${m.cash<m.floor?'现金已低于底线，先停止动用。':'仍须核对收入、基本面与可交易性。'}家庭应急金在组合外。</p>`;}
 if(t==='position'){const cap=Math.min(100,m.budget/m.loss*100);content=bars([['算术仓位上限 %',cap,50],['按假设的组合损失 %',cap*m.loss/100,5],['若全损的组合损失 %',cap,50]])+`<p>预算 / 压力损失 = ${f(cap)}% 仓位。若实际全损，组合损失 ${f(cap)}%；还需受单股、行业与权益预算限制。这不是最大损失保证。</p>`;}
 if(t==='legacy'){const nominal=100*Math.pow(1.04,m.years),real=nominal/Math.pow(1+m.inflation/100,m.years);content=bars([['初始购买力',100,Math.max(100,nominal)],['未来名义金额',nominal,Math.max(100,nominal)],['折回今天购买力',real,Math.max(100,nominal)]])+`<p>初始 100，无后续投入，固定名义回报假设 4%。${m.years} 年后名义 ${f(nominal)}，今天购买力约 <b>${f(real)}</b>。未计税费与波动，不是预测。</p>`;}
 if(t==='overlap'){const a=[50,30,20,0],b=[40,20,0,40],names=['科技甲','科技乙','消费丙','其他'],i=m.company??0;content=`<div class="lab-fund-pair"><div><b>虚构 ETF A</b>${bars(names.map((s,i)=>[s+' %',a[i],100]))}</div><div><b>虚构 ETF B</b>${bars(names.map((s,i)=>[s+' %',b[i],100]))}</div></div><p>持仓重合度 Σ min(Aᵢ,Bᵢ) = <b>${math.overlap(a,b)}%</b>。当前组合中“${names[i]}”占 ${f(a[i]*m.blend/100+b[i]*(1-m.blend/100))}%。这是四个互斥示意类别，不是两只真实 ETF；相同因子的隐藏重叠仍需另查。</p>`;}
 if(t==='correlation'||t==='global'){const sets={growth:[-25,8,3],inflation:[-20,-15,5],liquidity:[-35,-10,-8]},s=sets[scenario];content=t==='global'?bars([['美股科技因子',s[0],40],['台股科技因子',s[0]*1.1,40],['日韩科技因子',s[0]*0.9,40]])+'<p>这三条人为设定的冲击共同受同一科技需求影响：地理分散没有消除共同因子。不是市场预测或完整地区指数回报。</p>':bars([['股票冲击 %',s[0],40],['长债冲击 %',s[1],40],['黄金冲击 %',s[2],40]])+`<p>假设股票 60%、长债 30%、黄金 10%，一次性组合变化 <b>${f(.6*s[0]+.3*s[1]+.1*s[2])}%</b>。切换情景会改变对冲表现；这不是统计相关性估计。</p>`;}
 if(t==='statements'){const cash=m.cash??100,ar=m.ar??0,eqp=m.eqp??0,debt=m.debt??0,profit=m.profit??0;content=bars([['现金',cash,200],['应收款',ar,200],['设备',eqp,200],['负债',debt,200],['累计利润',profit,200]])+`<p>资产 ${cash+ar+eqp} = 负债 ${debt} + 权益 ${100+profit}。经营现金流 ${m.cfo??0}，投资现金流 ${m.cfi??0}，融资现金流 ${m.cff??0}。</p><p>${esc(m.message||'先点击一笔交易。赊销例子是零成本服务，避免漏计存货成本。')}</p>`;}
 if(t==='handover'||t==='framework'){const count=Object.keys(m).filter(k=>k.startsWith('p')&&m[k]).length,total=t==='handover'?3:4;content=`<div class="lab-bridge">${Array.from({length:total},(_,i)=>`<div class="${m['p'+i]?'ready':''}">${m['p'+i]?'已自查':'待核查'}<span>支柱 ${i+1}</span></div>`).join('')}</div><p>${count}/${total} 项自查完成。${count<total?'缺少的环节仍可能使执行或接管卡住。':'勾选不是法律安排或证据已完成的证明；把实际资料与待办写进笔记。'}</p>`;}
 out.innerHTML=content;
 }
 function mount(id){lessonId=id;model={};sortIndex=0;answers={};scenario='growth';const d=definitions[id];if(!d)throw Error('Missing interactive activity: '+id);
 $('lesson-lab').innerHTML=`<div class="lab-eyebrow">本主题的参数试验</div><h2>${esc(d.title)}</h2><div id="lab-activity"></div><button id="lab-record">把当前结果记入本节笔记 ↓</button><p class="lab-assumption">教学示意 · 不是实时行情或买卖建议。模型边界与出处见正文。</p>`;renderActivity();
 }
 document.addEventListener('click',e=>{const b=e.target.closest('#lesson-lab button');if(!b)return;
 if(b.dataset.node!==undefined){const i=+b.dataset.node;$('lab-node-detail').textContent=definitions[lessonId].nodes[i][1];$('lesson-lab').querySelectorAll('[data-node]').forEach(n=>n.setAttribute('aria-pressed',String(n===b)));}
 if(b.dataset.goLesson)location.hash='lesson='+b.dataset.goLesson;
 if(b.dataset.sort!==undefined){const c=sorting[definitions[lessonId].type].cards[sortIndex],ok=+b.dataset.sort===c[1];$('lab-feedback').className='lab-feedback '+(ok?'good':'revise');$('lab-feedback').textContent=(ok?'分类正确：':'再想一下：')+c[2];}
 if(b.hasAttribute('data-next-card')){sortIndex=(sortIndex+1)%sorting[definitions[lessonId].type].cards.length;renderActivity();}
 if(b.dataset.answer){const[i,j]=b.dataset.answer.split(':').map(Number);answers[i]=j;renderActivity();}
 if(b.hasAttribute('data-retry')){answers={};renderActivity();}
 if(b.dataset.weather){scenario=b.dataset.weather;renderActivity();}
 if(b.dataset.company!==undefined){model.company=+b.dataset.company;renderActivity();}
 if(b.dataset.transaction){const action=b.dataset.transaction;model.cash??=100;model.ar??=0;model.eqp??=0;model.debt??=0;model.profit??=0;model.cfo??=0;model.cfi??=0;model.cff??=0;
 if(action==='reset')model={};
 if(action==='credit'){model.ar+=30;model.profit+=30;model.message='赊销服务：利润 +30、应收 +30，现金未变。';}
 if(action==='collect'){if(model.ar>=30){model.ar-=30;model.cash+=30;model.cfo+=30;model.message='收回应收：现金 +30、应收 −30，不重复确认收入。';}else model.message='应收款不足 30，先完成赊销。';}
 if(action==='equipment'){if(model.cash>=20){model.cash-=20;model.eqp+=20;model.cfi-=20;model.message='买设备：现金 −20、设备 +20，简化例中当下不直接扣利润。';}else model.message='现金不足，不能执行这笔购买。';}
 if(action==='loan'){model.cash+=40;model.debt+=40;model.cff+=40;model.message='借款：现金 +40、负债 +40，不是经营利润。';}update();
 }
 });
 document.addEventListener('input',e=>{if(!e.target.closest('#lesson-lab'))return;const p=e.target.dataset.param;if(p){model[p]=+e.target.value;$('out-'+p).textContent=e.target.value;update();}});
 document.addEventListener('change',e=>{if(e.target.dataset.pillar!==undefined){model['p'+e.target.dataset.pillar]=e.target.checked;update();}});
 globalThis.KBLearningLab={mount,definitions};
})();
