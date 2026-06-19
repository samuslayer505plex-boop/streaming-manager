const SAMPLE_PRODUCTS = [
  {id:1,name:'Helado de vainilla',price:'$2.50',owner:'Heladeria Sol',img:'', paypalHostedButtonId:'TKQTDZDPBSM38'},
  {id:2,name:'Camiseta estampada',price:'$12.00',owner:'Tienda Luna',img:''},
  {id:3,name:'Auriculares Bluetooth',price:'$25.00',owner:'AudioPro',img:''},
  {id:4,name:'Café en grano 500g',price:'$8.50',owner:'Granos Feliz',img:''}
];

let currentProducts = SAMPLE_PRODUCTS.slice();

function render(list){
  currentProducts = list.slice();
  const container = document.getElementById('products');
  container.innerHTML='';
  list.forEach(p=>{
    const card = document.createElement('article');
    card.className='card';
    const imgHtml = (p.img && window.APP_CONFIG && window.APP_CONFIG.USE_IMAGES) ?
      `<img src="${p.img}" alt="${p.name}" style="width:100%;height:140px;object-fit:cover;border-radius:8px;margin-bottom:.75rem">` :
      `<div class="thumb">Imagen</div>`;
    // Añadir contenedor PayPal si el producto tiene hosted button id
    const paypalContainer = p.paypalHostedButtonId ? `<div id="paypal-container-${p.id}" class="paypal-container" style="margin-top:.75rem"></div>` : '';
    card.innerHTML = `\n      ${imgHtml}\n      <h3 class="title">${escapeHtml(p.name)}</h3>\n      <div class="price">${escapeHtml(p.price)}</div>\n      <div class="meta">Vendedor: ${escapeHtml(p.owner)}</div>\n      ${paypalContainer}\n    `;
    container.appendChild(card);
  });
  // Después de renderizar las tarjetas, intentar inicializar los HostedButtons de PayPal
  tryInitPayPalHostedButtons(list);
}

function escapeHtml(str){
  if(!str) return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function tryInitPayPalHostedButtons(list){
  if(!list || !list.length) return;
  list.forEach(p=>{
    if(!p.paypalHostedButtonId) return;
    const selector = `#paypal-container-${p.id}`;
    // Intenta renderizar inmediatamente si el SDK ya está cargado
    if(window.paypal && typeof window.paypal.HostedButtons === 'function'){
      try{ window.paypal.HostedButtons({ hostedButtonId: p.paypalHostedButtonId }).render(selector); }
      catch(e){ console.warn('Error render PayPal HostedButtons', e); }
      return;
    }
    // Si no está cargado, esperar hasta que el SDK aparezca (máx ~5s)
    let tries = 0;
    const iv = setInterval(()=>{
      if(window.paypal && typeof window.paypal.HostedButtons === 'function'){
        clearInterval(iv);
        try{ window.paypal.HostedButtons({ hostedButtonId: p.paypalHostedButtonId }).render(selector); }
        catch(e){ console.warn('Error render PayPal HostedButtons', e); }
      } else if(++tries > 20){
        clearInterval(iv);
        console.warn('PayPal SDK no cargado: no se pudo inicializar HostedButtons para', p.id);
      }
    }, 250);
  });
}

function filterByQuery(q){
  const term = q.toLowerCase().trim();
  if(!term) return currentProducts;
  return currentProducts.filter(p=>{
    return (p.name && p.name.toLowerCase().includes(term)) || (p.owner && p.owner.toLowerCase().includes(term));
  });
}

document.getElementById('search').addEventListener('input', (e)=>{
  const q = e.target.value;
  const filtered = (q.trim()==='') ? currentProducts : currentProducts.filter(p=> (p.name||'').toLowerCase().includes(q.toLowerCase()) || (p.owner||'').toLowerCase().includes(q.toLowerCase()));
  render(filtered);
});

async function loadFromApi(){
  const cfg = window.APP_CONFIG || {};
  const url = cfg.API_URL || '';
  const headers = {};
  if(cfg.TOKEN) headers['Authorization'] = `${cfg.AUTH_SCHEME||'m+'} ${cfg.TOKEN}`;
  if(!url){
    console.warn('No API_URL configured — usando datos de ejemplo');
    render(SAMPLE_PRODUCTS);
    return;
  }
  try{
    const res = await fetch(url, { headers });
    if(!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    let arr = null;
    if(Array.isArray(data)) arr = data;
    else if(data && Array.isArray(data.products)) arr = data.products;
    else throw new Error('Formato JSON inesperado');
    render(arr);
  }catch(err){
    console.warn('Error al obtener productos:', err);
    render(SAMPLE_PRODUCTS);
  }
}

// Inicializa
window.addEventListener('load', ()=>{
  loadFromApi();
});
