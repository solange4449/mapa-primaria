'use strict';
const data = window.MAPA;
const pantalla = document.getElementById('pantalla');
const marco = document.getElementById('marco');
const scrollMapa = document.getElementById('scroll-mapa');
const dialog = document.getElementById('visor');
let actual = 1;
let origenTutorias = 1;
let indice = 0;
let ampliado = false;
let ultimoFoco;
const e = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const recorte = m => { const c=m.crop || {l:0,t:0,r:0,b:0};return `position:absolute;left:${c.l}%;top:${c.t}%;width:${100-c.l-c.r}%;height:${100-c.t-c.b}%;`; };
const caja = x => `left:${x.x}px;top:${x.y}px;width:${x.w}px;height:${x.h}px;`;

function ajustar() {
  const espacio = window.innerHeight - document.querySelector('.controles').getBoundingClientRect().height;
  const fit = Math.min(scrollMapa.clientWidth/data.width, Math.max(120,espacio)/data.height);
  const escala = ampliado ? Math.max(fit,1200/data.width) : fit;
  marco.style.width = `${data.width*escala}px`;
  marco.style.height = `${data.height*escala}px`;
  pantalla.style.transform = `scale(${escala})`;
  document.getElementById('ampliar').textContent=ampliado?'Ajustar a pantalla':'Ampliar mapa';
  document.getElementById('ampliar').setAttribute('aria-pressed',String(ampliado));
}

function rotulo(item) {
  const texto = e(item.text);
  const detalle = item.detail ? `<small class="detalle-item">${e(item.detail)}</small>` : '';
  if (item.photos?.length) return `<button class="acceso-evidencia" data-galeria="${e(item.photos.join('|'))}" data-titulo="${texto}"><span>${texto}${detalle}</span><span class="icono-evidencia" aria-hidden="true">▷</span></button>`;
  if (!item.target) return `<span>${texto}${detalle}</span>`;
  const icono = `<span class="icono-evidencia" aria-hidden="true">▷</span>`;
  const contenido = `<span>${texto}${detalle}</span>${icono}`;
  return item.target
    ? `<a class="acceso-evidencia" href="#pantalla/${item.target}">${contenido}</a>`
    : `<button class="acceso-evidencia" data-evidencia="${texto}">${contenido}</button>`;
}

function lista(items, ordenada = false) {
  if (!items.length) return '';
  const etiqueta = ordenada ? 'ol' : 'ul';
  return `<${etiqueta}>${items.map(item => `<li>${rotulo(item)}${item.children ? lista(item.children) : ''}</li>`).join('')}</${etiqueta}>`;
}

const botonMapa=(text,target,x)=>`<a class="boton-mapa" style="left:${x}px" href="#pantalla/${target}"><svg viewBox="0 0 250 90" preserveAspectRatio="none" aria-hidden="true"><path d="M4 8 Q120 0 244 8 L248 84 Q128 78 3 86 Z" fill="#ffdf62" stroke="#2a2b39" stroke-width="3"/></svg><span>${text}</span></a>`;

function mapaProyectos(slide) {
  const grupos=slide.columns.flat();
  const grupo=t=>grupos.find(g=>g.title===t);
  const formacion=grupo('Formación situada');
  const proyectos=formacion.items[0];
  const alfabetizacion=proyectos.children[0];
  const convivencia=proyectos.children[1];
  const pastoral=grupo('Definición institucional').items[0];
  const jornada=grupo('Jornada Escuela, Familia y Comunidad');
  const acompanamiento=grupo('Acompañamiento en expedición pedagógica');
  const evaluaciones=grupo('Evaluaciones');
  const nodo=(item,x,y,w,h,clase='')=>`<div class="nodo-proyecto ${clase} ${item.detail ? 'nodo-con-detalle' : ''}" style="${caja({x,y,w,h})}">${rotulo(item)}</div>`;
  const titulo=(text,x,y,w,h)=>nodo({text},x,y,w,h,'nodo-titulo');
  const flecha=d=>`<path d="${d}"/>`;

  return `<div class="mapa-proyectos">
    <img class="logo-mapa" src="assets/image6.png" alt="Instituto Parroquial Santo Cristo">
    <h1>Proyectos y actividades<br>de 2026</h1>
    <nav aria-label="Navegación del recorrido">${botonMapa('VOLVER',slide.previous,1350)}${botonMapa('SIGUIENTE',slide.next,1620)}</nav>
    <svg class="conexiones-proyectos" viewBox="0 0 1920 1080" aria-hidden="true"><defs><marker id="punta-proyectos" viewBox="0 0 14 12" refX="12" refY="6" markerWidth="14" markerHeight="12" orient="auto-start-reverse"><path d="M1 1 L12 6 L1 11" fill="none" stroke="#2a2b39" stroke-width="2"/></marker></defs>
      ${['M370 280 Q405 265 435 280','M665 280 Q710 218 755 225','M665 280 Q712 350 755 355','M1115 225 Q1170 195 1225 210','M1115 225 Q1170 255 1225 270','M1115 355 Q1170 330 1225 340','M1115 355 Q1170 390 1225 400','M370 550 Q405 535 435 550','M675 550 Q730 480 775 470','M675 550 Q730 535 775 535','M675 550 L775 600','M675 550 Q725 650 775 665','M675 550 Q730 710 775 730','M1060 835 Q1130 795 1190 800','M1060 835 Q1130 875 1190 875','M1060 995 Q1130 960 1190 955','M1060 995 Q1130 1025 1190 1020'].map(flecha).join('')}
    </svg>
    ${titulo(formacion.title,60,235,310,90)}
    ${titulo(proyectos.text,435,235,230,90)}
    ${nodo(alfabetizacion,755,185,360,85)}
    ${nodo(alfabetizacion.children[0],1225,180,585,60)}
    ${nodo(alfabetizacion.children[1],1225,245,585,55)}
    ${nodo(convivencia,755,315,360,80)}
    ${nodo(convivencia.children[0],1225,315,585,55)}
    ${nodo(convivencia.children[1],1225,380,585,55)}
    ${titulo('Definición institucional',60,505,310,90)}
    ${titulo(pastoral.text,435,505,240,90)}
    ${pastoral.children.map((item,i)=>nodo(item,775,445+i*65,1035,55)).join('')}
    ${titulo('Articulación con Nivel Inicial',60,770,440,90)}
    ${nodo({text:jornada.title,photos:jornada.photos},60,925,440,100)}
    ${titulo(acompanamiento.title,600,785,460,100)}
    ${acompanamiento.items.map((item,i)=>nodo(item,1190,770+i*75,620,60)).join('')}
    ${titulo(evaluaciones.title,600,950,460,90)}
    ${evaluaciones.items.map((item,i)=>nodo({...item, detail:[item.detail,...(item.children||[]).map(c=>c.text+' · '+c.detail)].filter(Boolean).join(' · ')},1190,925+i*65,620,60)).join('')}
  </div>`;
}

function pantallaDeContenido(slide) {
  if (slide.columns) return mapaProyectos(slide);
  return `<div class="mapa-proyectos mapa-comunidad">
    <img class="logo-mapa" src="assets/image6.png" alt="Instituto Parroquial Santo Cristo">
    <h1>Actividades con y para<br>la comunidad</h1>
    <nav aria-label="Navegación del recorrido">${botonMapa('VOLVER',slide.previous,1350)}${botonMapa('SIGUIENTE',slide.next,1620)}</nav>
    <ol class="actividades-comunidad">${slide.activities.map((item,i)=>`<li class="actividad-comunidad"><span class="numero-actividad" aria-hidden="true">${i+1}</span>${rotulo(item)}</li>`).join('')}</ol>
  </div>`;
}

function mostrar(numero, enfocar=true) {
  if(!data.slides.some(s=>s.id===numero)) numero=1;
  if(dialog.open) dialog.close();
  pantalla.querySelectorAll('video').forEach(v=>v.pause());
  if(numero===7 && (actual===1 || actual===2)) origenTutorias=actual;
  actual=numero;
  indice=data.slides.findIndex(s=>s.id===actual);
  const slide=data.slides[indice];
  document.title=`${slide.title} · Santo Cristo`;
  pantalla.setAttribute('aria-label',`Pantalla ${actual}. ${slide.title}`);
  pantalla.classList.toggle('sin-fondo-original', Boolean(slide.background));
  pantalla.innerHTML=slide.background
    ? `<p class="institucion marca-alternativa">Instituto Parroquial<br><strong>Santo Cristo</strong></p><img class="fondo" src="${e(slide.background)}" alt="">`+
    `<svg class="flechas" viewBox="0 0 1920 1080" aria-hidden="true">${(slide.arrows||[]).map(a=>`<path d="${e(a.path)}" fill="none" stroke="${e(a.color)}" stroke-width="${a.width}" stroke-linecap="round" stroke-linejoin="round"/>`).join('')}</svg>`+
    slide.links.map(l=>`<a class="vinculo-grafico" style="${caja(l)}" href="#pantalla/${slide.id===7 ? origenTutorias : l.target}" aria-label="${e(l.label)}">${l.y > 150 ? '<span class="icono-alternativo" aria-hidden="true">▷</span>' : ''}</a>`).join('')+
    slide.media.map(m=>m.kind==='video'?`<div class="media${m.id.startsWith('video-patronal-') ? ' media-patronal' : ''}" style="${caja(m)}"><video controls playsinline preload="metadata" poster="${e(m.poster)}" aria-label="${e(m.alt)}">${m.webm ? `<source src="${e(m.webm)}" type="video/webm">` : ''}<source src="${e(m.src)}" type="video/mp4">Tu navegador no puede reproducir este video. <a href="${e(m.src)}">Descargar video</a></video><div class="acciones-video"><button type="button" data-reproducir>▶ Reproducir video</button><a href="${e(m.webm || m.src)}" target="_blank" rel="noopener">Abrir aparte ↗</a><span class="estado-video" role="status"></span></div></div>`:`<button class="media photo" style="${caja(m)}" data-foto="${e(m.src)}" data-titulo="${e(m.alt)}" aria-label="Ampliar ${e(m.alt)}"><img src="${e(m.src)}" alt="${e(m.alt)}" style="${recorte(m)}${m.fit === 'contain' ? 'object-fit:contain;' : ''}"></button>`).join('')+
    slide.texts.map(t=>{
      const target=slide.id===7 && t.navigation ? origenTutorias : t.target;
      const pending=t.pending;
      const parrafos=t.paragraphs.map(p=>{
        const individual=p.target;
        const pendiente=p.pending;
        const style=`font-family:'${e(p.font)}',sans-serif;font-size:${p.size}px;--tamano-alternativo:${p.size * .76}px;line-height:${p.line}px;text-align:${p.align==='ctr'?'center':p.align==='r'?'right':'left'};color:${p.color};padding-left:${p.margin}px;`;
        const contenido=`${p.bullet ? `<span class="bullet">${e(p.bullet)} </span>` : ''}${e(p.text)}`;
        const inner=individual?`<a class="texto-link" href="#pantalla/${individual}">${contenido}</a>`:pendiente?`<button class="texto-link" data-pendiente="${e(p.text)}">${contenido}</button>`:contenido;
        return `<div class="parrafo" style="${style}">${inner}</div>`;
      }).join('');
      const style=caja(t);
      const clase=t.fallbackFrame ? 'bloque marco-alternativo' : 'bloque';
      if(target) return `<a class="${clase} ${t.id==='volver-inicio' ? 'boton-inicio-cierre' : ''} texto-link ${t.navigation?'original':''}" style="${style}" href="#pantalla/${target}">${parrafos}</a>`;
      if(t.photos?.length) return `<button class="${clase} texto-link" style="${style}" data-galeria="${e(t.photos.join('|'))}" data-titulo="${e(t.galleryTitle)}" aria-label="Ver fotos del reconocimiento de Escuela Precursora" title="Ver fotos del reconocimiento">${parrafos}<span class="indicador-galeria" aria-hidden="true">▷</span></button>`;
      if(t.evidenceTitle) return `<button class="${clase} texto-link" style="${style}" data-evidencia="${e(t.evidenceTitle)}">${parrafos}</button>`;
      if(pending)return `<button class="${clase} texto-link" style="${style}" data-pendiente="${e(t.paragraphs.map(p=>p.text).join(' '))}">${parrafos}</button>`;
      return `<div class="${clase}" style="${style}">${parrafos}</div>`;
    }).join('')
    : pantallaDeContenido(slide);
  if (slide.background) {
    const fondo = pantalla.querySelector('.fondo');
    const mostrarFondo = () => pantalla.classList.remove('sin-fondo-original');
    if (fondo.complete && fondo.naturalWidth) mostrarFondo();
    else fondo.addEventListener('load', mostrarFondo, {once: true});
  }
  const seccion = slide.section ?? ({1:'Mapa 2025', 2:'Mapa 2026', 4:'Cierre'})[actual] ?? 'Actividad';
  document.getElementById('posicion').textContent=`${indice + 1} / ${data.slides.length} · ${seccion}`;
  document.getElementById('anterior').disabled=indice===0;
  document.getElementById('siguiente').disabled=indice===data.slides.length - 1;
  scrollMapa.scrollTo(0,0);
  ajustar();
  if(enfocar)document.getElementById('mapa').focus({preventScroll:true});
}
function navegar(n){const hash=`#pantalla/${n}`;if(location.hash===hash)mostrar(n);else location.hash=hash;}
function ruta(){const numero=Number(location.hash.match(/^#pantalla\/(\d+)$/)?.[1] || 1);mostrar(numero);}
function abrirVisor(titulo,contenido,origen){
  ultimoFoco=origen;
  document.getElementById('visor-titulo').textContent=titulo;
  document.getElementById('visor-contenido').innerHTML=contenido;
  dialog.showModal();
}
// Delegación de eventos: también funciona después de cambiar de pantalla.
 pantalla.addEventListener('click',event=>{
  const reproducir=event.target.closest('[data-reproducir]');
  if(reproducir) {
    const medio=reproducir.closest('.media');
    const video=medio.querySelector('video');
    const estado=medio.querySelector('.estado-video');
    if(video.paused) {
      estado.textContent='Cargando video…';
      video.play().then(()=>{estado.textContent='';reproducir.textContent='Ⅱ Pausar video';}).catch(()=>{
        estado.textContent='No se pudo iniciar. Probá «Abrir aparte». ';
        reproducir.textContent='▶ Reintentar';
      });
    } else { video.pause();reproducir.textContent='▶ Reproducir video';estado.textContent=''; }
  }
  const galeria=event.target.closest('[data-galeria]');
  if(galeria) {
    const fotos=galeria.dataset.galeria.split('|');
    abrirVisor(galeria.dataset.titulo,`<div class="galeria-fotos">${fotos.map((src,i)=>`<figure><img src="${e(src)}" alt="${e(galeria.dataset.titulo)} · Foto ${i+1}"><figcaption>Foto ${i+1} de ${fotos.length}</figcaption></figure>`).join('')}</div>`,galeria);
  }
  const foto=event.target.closest('[data-foto]');
  if(foto)abrirVisor(foto.dataset.titulo,`<img class="foto-ampliada" src="${e(foto.dataset.foto)}" alt="${e(foto.dataset.titulo)}">`,foto);
  const pendiente=event.target.closest('[data-pendiente]');
  if(pendiente)abrirVisor(pendiente.dataset.pendiente,'<div class="aviso"><p>Este ítem está incluido en el mapa institucional.</p><p>La presentación original no contiene material adicional para este tema.</p></div>',pendiente);
  const evidencia=event.target.closest('[data-evidencia]');
  if(evidencia)abrirVisor(evidencia.dataset.evidencia,'<div class="aviso"><p>Material audiovisual pendiente de incorporar.</p></div>',evidencia);
 });
 pantalla.addEventListener('error', event => {
  // Un source puede fallar mientras el navegador prueba otro formato.
  if (event.target.tagName === 'SOURCE') return;
  const medio = event.target.closest('.media');
  if (!medio || medio.classList.contains('media-ausente')) return;
  const aviso = document.createElement('div');
  aviso.className = 'media media-ausente';
  aviso.style.cssText = medio.style.cssText;
  const video = medio.querySelector('video');
  const fuente = video?.querySelector('source[type="video/mp4"]');
  if (fuente) {
    aviso.innerHTML = `<span>No se pudo reproducir el video aquí.</span><a href="${e(fuente.getAttribute('src'))}" target="_blank" rel="noopener">Abrir o descargar video</a>`;
  } else aviso.textContent = 'Archivo multimedia no disponible';
  medio.replaceWith(aviso);
 }, true);
 function avanzar(pasos) {
  const slide = data.slides[indice + pasos];
  if (slide) navegar(slide.id);
 }
 document.getElementById('inicio').addEventListener('click',()=>navegar(1));
 document.getElementById('anterior').addEventListener('click',()=>avanzar(-1));
 document.getElementById('siguiente').addEventListener('click',()=>avanzar(1));
 document.getElementById('ampliar').addEventListener('click',()=>{ampliado=!ampliado;ajustar();});
 document.getElementById('completa').addEventListener('click',async()=>{
  try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{document.getElementById('completa').textContent='Usá F11 para ampliar';}
 });
 document.getElementById('cerrar').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});
 dialog.addEventListener('close',()=>{if(ultimoFoco?.isConnected)ultimoFoco.focus();});
 window.addEventListener('keydown',event=>{
  if(dialog.open || event.target.closest('video,button,input,a'))return;
  if(event.key==='ArrowRight'&&indice<data.slides.length - 1){event.preventDefault();avanzar(1);}
  if(event.key==='ArrowLeft'&&indice>0){event.preventDefault();avanzar(-1);}
 });
 window.addEventListener('hashchange',ruta);
 window.addEventListener('resize',ajustar);
 document.addEventListener('fullscreenchange',()=>{document.getElementById('completa').textContent=document.fullscreenElement?'Salir de pantalla completa':'Pantalla completa';ajustar();});
 ruta();
