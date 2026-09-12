const state={players:[],lockedTeams:new Set(),selected:{Gio:[],Pietro:[],Gabri:[]},formation:'3-4-3'};
const mock=[
 ['Sommer','Inter','GK'],['Maignan','Milan','GK'],['Di Gregorio','Juventus','GK'],
 ['Bastoni','Inter','DEF'],['Dimarco','Inter','DEF'],['Bremer','Juventus','DEF'],['Tomori','Milan','DEF'],['Theo Hernandez','Milan','DEF'],['Buongiorno','Napoli','DEF'],
 ['Barella','Inter','MID'],['Calhanoglu','Inter','MID'],['Pulisic','Milan','MID'],['Reijnders','Milan','MID'],['Locatelli','Juventus','MID'],['McTominay','Napoli','MID'],
 ['Lautaro Martinez','Inter','FWD'],['Thuram','Inter','FWD'],['Leao','Milan','FWD'],['Vlahovic','Juventus','FWD'],['Lukaku','Napoli','FWD']
].map((x,i)=>({id:i+1,name:x[0],team:x[1],position:x[2],rating:0}));
state.players=mock;
function positions(){return state.formation.split('-').map(Number)}
function renderPitch(){const p=positions();const lines=[['GK',1],['DEF',p[0]],['MID',p[1]],['FWD',p[2]]];document.querySelector('#pitch').innerHTML=lines.map(([pos,n])=>`<div class="line">${Array.from({length:n},(_,i)=>`<div class="slot">${pos} ${i+1}<small>seleziona sotto</small></div>`).join('')}</div>`).join('')}
function renderPlayers(){const q=document.querySelector('#search').value.toLowerCase();const html=state.players.filter(p=>(p.name+' '+p.team).toLowerCase().includes(q)).map(p=>{const locked=state.lockedTeams.has(p.team);return `<div class="player ${locked?'locked':''}"><div><b>${p.name}</b><span class="muted"> · ${p.team} · ${p.position}</span>${locked?'<span class="lock">🔒</span>':''}</div><button ${locked?'disabled':''} onclick="pick(${p.id})">Scegli</button></div>`}).join('');document.querySelector('#players').innerHTML=html}
window.pick=id=>{const coach=document.querySelector('#coach').value; if(state.selected[coach].length>=18)return; if(!state.selected[coach].includes(id))state.selected[coach].push(id); renderSelection()};
function renderSelection(){const coach=document.querySelector('#coach').value;const names=state.selected[coach].map(id=>state.players.find(p=>p.id===id).name);document.querySelector('#saveMessage').textContent=names.length?`Selezionati ${names.length}/18: ${names.join(', ')}`:'Nessun giocatore selezionato';}
document.querySelector('#formationSelect').onchange=e=>{state.formation=e.target.value;renderPitch()};document.querySelector('#coach').onchange=renderSelection;document.querySelector('#search').oninput=renderPlayers;document.querySelector('#save').onclick=()=>document.querySelector('#saveMessage').textContent='Formazione salvata (modalità prototipo).';
document.querySelectorAll('.tab').forEach(b=>b.onclick=()=>{document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));document.querySelectorAll('.panel').forEach(x=>x.classList.remove('active'));b.classList.add('active');document.getElementById(b.dataset.tab).classList.add('active')});
function renderRanking(){document.querySelector('#rankingTable').innerHTML=[['Gio',0],['Pietro',0],['Gabri',0]].map((x,i)=>`<div class="rank"><b>${i+1}</b><span>${x[0]}</span><b>${x[1]} pt</b><span></span></div>`).join('');document.querySelector('#dayScores').innerHTML='<p class="muted">Nessuna giornata ancora calcolata.</p>'}
renderPitch();renderPlayers();renderSelection();renderRanking();
