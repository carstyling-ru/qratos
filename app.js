// The review is an illustration using fictional data; it does not process patient records.
function initReviewDemo() {
  const panel = document.querySelector('#demo-panel');
  const paper = document.querySelector('#demo-source');
  const cursor = panel.querySelector('.demo-cursor');
  const findings = [
    {badge:'ПРОТИВОРЕЧИЕ', title:'Даты исследования в документах не совпадают', description:'В дневнике наблюдения и выписном эпикризе указаны разные даты исследования. Необходимо сверить исходные записи.', evidence:[['Дневник наблюдения','Дата исследования: 12.05.2026','evidence-1'],['Выписной эпикриз','Исследование от 11.05.2026','evidence-2']]},
    {badge:'ВОПРОС ЭКСПЕРТУ', title:'Не найдена отметка о согласии', description:'Система не обнаружила отметку в записи. Эксперт проверяет документ и оценивает замечание.', evidence:[['Первичный осмотр','Согласие получено и приобщено к карте','evidence-3']]},
    {badge:'НЕПОЛНАЯ ЗАПИСЬ', title:'Не заполнен реквизит документа', description:'Для оценки требуется проверить исходную запись и состав переданных документов.', evidence:[['Дневник наблюдения','Запись требует уточнения','evidence-1']]}
  ];
  document.querySelector('#demo-documents').innerHTML = ['Первичный осмотр','Вкладыш к Приказу 803н','Протокол УЗИ','Осмотр заведующего отделением','Протокол врачебной комиссии','Оценка риска СГЯ','Шкала оценки ВТЭО','Эпикриз перед началом лечения','Дневник наблюдения','Предоперационный эпикриз','Мониторинг ответа яичников','Протокол пункции фолликулов (ТВП)','Осмотр после пункции','Эмбриологический протокол','Выписной эпикриз'].map(name=>`<div class="demo-document ${name==='Дневник наблюдения'?'active':''}"><svg aria-hidden="true"><use href="#i-document"/></svg><span><strong>${name}</strong></span></div>`).join('');
  paper.innerHTML = `<span class="paper-kicker">УЧЕБНЫЙ СЛУЧАЙ · ПРОГРАММА ЭКО</span><h3>Медицинская карта</h3><p class="paper-subtitle">Документы случая</p><div class="paper-rule"></div><h4>Первичный осмотр</h4><p>Проведён первичный осмотр. Документы программы подготовлены к проверке.</p><p class="demo-record" id="evidence-3">Согласие получено и приобщено к карте.</p><div class="paper-filler"><i></i><i></i><i></i><i></i></div><div class="paper-rule"></div><h4>Дневник наблюдения</h4><p>В карту внесены сведения о выполненном исследовании.</p><p class="demo-record" id="evidence-1">Дата исследования: 12.05.2026</p><p>Результаты приобщены к документации случая.</p><div class="paper-filler"><i></i><i></i><i></i><i></i></div><div class="paper-rule"></div><h4>Выписной эпикриз</h4><p>В ходе наблюдения выполнено исследование.</p><p class="demo-record" id="evidence-2">Исследование от 11.05.2026</p><p>Итоговая запись включена в пакет документов.</p><div class="paper-filler"><i></i><i></i><i></i></div>`;
  let index = 0, step = 0, visible = false;
  const timers = new Set();
  function schedule(fn, delay) { const id = setTimeout(() => { timers.delete(id); fn(); }, delay); timers.add(id); }
  function cancelTimers() { timers.forEach(clearTimeout); timers.clear(); }
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  function render() {
    const f=findings[index];
    document.querySelector('#finding-count').textContent=`${index+1} / ${findings.length}`;
    document.querySelector('#evidence-count').textContent=`1 / ${f.evidence.length}`;
    document.querySelector('#demo-finding').innerHTML=`<div class="finding-card"><div class="finding-status"><span class="status-tag purple">${f.badge}</span><span class="review-status">Ожидает решения</span></div><h3>${f.title}</h3><p>${f.description}</p><div class="evidence-heading">ДОКАЗАТЕЛЬСТВА · ПЕРЕХОД К ЗАПИСИ</div>${f.evidence.map((e,i)=>`<div class="evidence-item demo-evidence" data-index="${i}"><strong>${e[0]}</strong><span>${e[1]}</span></div>`).join('')}</div>`;
    panel.querySelector('.demo-other-findings').innerHTML=findings.map((f,i)=>i===index?'':`<div class="demo-other"><span>${f.badge}</span><strong>${f.title}</strong></div>`).join('');
    paper.querySelectorAll('.demo-record').forEach(el=>el.classList.remove('is-highlighted'));
    panel.querySelectorAll('.demo-control').forEach(el=>el.classList.remove('is-pressed'));
    paper.scrollTop=0;
  }
  function point(target, action) {
    if (!target) return;
    const a=panel.getBoundingClientRect(), b=target.getBoundingClientRect();
    cursor.style.left=`${b.left-a.left+Math.min(b.width*.65,100)}px`; cursor.style.top=`${b.top-a.top+b.height*.55}px`; cursor.classList.add('is-visible');
    schedule(()=>{if (!visible) return; target.classList.add('is-pressed'); action(); schedule(()=>target.classList.remove('is-pressed'),500);},850);
  }
  function evidence(i) {
    const f=findings[index], el=panel.querySelectorAll('.demo-evidence')[i];
    point(el,()=>{panel.querySelectorAll('.demo-evidence').forEach(n=>n.classList.remove('is-selected'));el.classList.add('is-selected');document.querySelector('#mobile-document-name').textContent=f.evidence[i][0];panel.querySelectorAll('.demo-document').forEach(doc=>doc.classList.toggle('active', doc.querySelector('strong').textContent === f.evidence[i][0]));const list=panel.querySelector('#demo-documents'), activeDoc=list.querySelector('.active');if(activeDoc) list.scrollTo({top:activeDoc.offsetTop-list.clientHeight/2+activeDoc.clientHeight/2,behavior:'smooth'});paper.querySelectorAll('.demo-record').forEach(n=>n.classList.remove('is-highlighted'));const target=document.getElementById(f.evidence[i][2]);target.classList.add('is-highlighted');paper.scrollTo({top:target.offsetTop-paper.clientHeight/2+target.clientHeight/2,behavior:'smooth'});document.querySelector('#evidence-count').textContent=`${i+1} / ${f.evidence.length}`;});
  }
  function cycle() {
    if (!visible || reduced.matches) return;
    if(step===0){index=0;render();evidence(0);}
    if(step===1)evidence(1);
    if(step===2)point(panel.querySelector('.demo-confirm'),()=>{panel.querySelector('.review-status').textContent='Подтверждено';panel.querySelector('.review-status').classList.add('is-confirmed');});
    if(step===3)point(panel.querySelector('.demo-next'),()=>{index=1;render();});
    if(step===4)evidence(0);
    if(step===5)point(panel.querySelector('.demo-reject'),()=>{panel.querySelector('.review-status').textContent='Отклонено';panel.querySelector('.review-status').classList.add('is-rejected');});
    step=(step+1)%6; schedule(cycle,step===0?4000:3300);
  }
  render();
  if (reduced.matches) {paper.querySelector('#evidence-1').classList.add('is-highlighted');return;}
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;cancelTimers();if(visible){cycle();}else{cursor.classList.remove('is-visible');}}, {threshold:.2}).observe(panel);
}

const menu = document.querySelector('.menu-toggle');
menu.addEventListener('click', () => {
  const expanded = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(expanded));
  menu.setAttribute('aria-label', expanded ? 'Закрыть меню' : 'Открыть меню');
  document.querySelector('.header').classList.toggle('menu-open', expanded);
});
function closeMenu() {menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Открыть меню');document.querySelector('.header').classList.remove('menu-open');}
document.querySelectorAll('#navigation a').forEach((link) => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', (event) => {if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {closeMenu();menu.focus();}});
document.querySelector('#year').textContent = new Date().getFullYear();
initReviewDemo();
