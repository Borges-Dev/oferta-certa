import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Search, MapPin, Store, ShoppingCart, BarChart3, Tag, Plus, Trash2, Star, Clock, Bell, Users, Trophy, ScanBarcode, Heart, Menu, LogOut, ShieldCheck, Check, X, Save, Database, UserPlus } from 'lucide-react';
import './styles.css';
import { supabase } from "./lib/supabase";

const supabaseEnabled = true;

const adminLogin = { login: 'admin@ofertacerta', password: 'admin0901', role: 'admin', name: 'Administrador' };
const userLogin = { login: 'teste', password: 'teste', role: 'user', name: 'Usuário Teste' };

const colors = ['from-blue-600 to-sky-500', 'from-emerald-500 to-lime-500', 'from-red-500 to-orange-500', 'from-purple-500 to-fuchsia-500', 'from-yellow-400 to-orange-500'];

const seedMarkets = [
  { id: 'extra', name: 'Extra', color: colors[2], branches: [{ id: 'extra-centro', name: 'Extra Centro', city: 'Juiz de Fora', region: 'Centro' }, { id: 'extra-sao-pedro', name: 'Extra São Pedro', city: 'Juiz de Fora', region: 'São Pedro' }] },
  { id: 'carrefour', name: 'Carrefour', color: colors[0], branches: [{ id: 'carrefour-centro', name: 'Carrefour Centro', city: 'Juiz de Fora', region: 'Centro' }, { id: 'carrefour-independencia', name: 'Carrefour Independência', city: 'Juiz de Fora', region: 'Independência' }] },
  { id: 'bahamas', name: 'Bahamas Supermercado', color: colors[1], branches: [{ id: 'bahamas-centro', name: 'Bahamas Centro', city: 'Juiz de Fora', region: 'Centro' }, { id: 'bahamas-cascatinha', name: 'Bahamas Cascatinha', city: 'Juiz de Fora', region: 'Cascatinha' }] },
  { id: 'pais-filhos', name: 'Pais e Filhos', color: colors[3], branches: [{ id: 'pais-filhos-centro', name: 'Pais e Filhos Centro', city: 'Juiz de Fora', region: 'Centro' }, { id: 'pais-filhos-bairu', name: 'Pais e Filhos Bairu', city: 'Juiz de Fora', region: 'Bairu' }] },
];

const seedProducts = [
  { id: 'arroz-5kg', name: 'Arroz Tipo 1 5kg', brand: 'Tio João', category: 'Mercearia', unit: '5kg', barcode: '789100000001', image: '🍚' },
  { id: 'feijao-1kg', name: 'Feijão Carioca 1kg', brand: 'Camil', category: 'Mercearia', unit: '1kg', barcode: '789100000002', image: '🫘' },
  { id: 'leite-1l', name: 'Leite Integral 1L', brand: 'Itambé', category: 'Laticínios', unit: '1L', barcode: '789100000003', image: '🥛' },
  { id: 'acucar-5kg', name: 'Açúcar Cristal 5kg', brand: 'União', category: 'Mercearia', unit: '5kg', barcode: '789100000004', image: '🧂' },
  { id: 'cafe-500g', name: 'Café Tradicional 500g', brand: 'Pilão', category: 'Bebidas', unit: '500g', barcode: '789100000005', image: '☕' },
  { id: 'oleo-900ml', name: 'Óleo de Soja 900ml', brand: 'Liza', category: 'Mercearia', unit: '900ml', barcode: '789100000006', image: '🛢️' },
  { id: 'detergente-500ml', name: 'Detergente Neutro 500ml', brand: 'Ypê', category: 'Limpeza', unit: '500ml', barcode: '789100000007', image: '🧴' },
  { id: 'sabao-po-1kg', name: 'Sabão em Pó 1kg', brand: 'Omo', category: 'Limpeza', unit: '1kg', barcode: '789100000008', image: '🫧' },
];

const seedOffers = [
  { id: 1, productId: 'arroz-5kg', marketId: 'extra', branchId: 'extra-centro', price: 24.9, oldPrice: 29.9, validUntil: '2026-05-18' },
  { id: 2, productId: 'arroz-5kg', marketId: 'carrefour', branchId: 'carrefour-centro', price: 23.49, oldPrice: 28.9, validUntil: '2026-05-17' },
  { id: 3, productId: 'arroz-5kg', marketId: 'bahamas', branchId: 'bahamas-centro', price: 25.99, oldPrice: 30.5, validUntil: '2026-05-20' },
  { id: 4, productId: 'arroz-5kg', marketId: 'pais-filhos', branchId: 'pais-filhos-centro', price: 22.99, oldPrice: 27.99, validUntil: '2026-05-16' },
  { id: 5, productId: 'feijao-1kg', marketId: 'extra', branchId: 'extra-sao-pedro', price: 7.49, oldPrice: 9.99, validUntil: '2026-05-19' },
  { id: 6, productId: 'feijao-1kg', marketId: 'bahamas', branchId: 'bahamas-centro', price: 6.99, oldPrice: 8.99, validUntil: '2026-05-18' },
  { id: 7, productId: 'leite-1l', marketId: 'carrefour', branchId: 'carrefour-centro', price: 4.19, oldPrice: 5.19, validUntil: '2026-05-15' },
  { id: 8, productId: 'cafe-500g', marketId: 'bahamas', branchId: 'bahamas-centro', price: 18.49, oldPrice: 23.9, validUntil: '2026-05-19' },
  { id: 9, productId: 'oleo-900ml', marketId: 'carrefour', branchId: 'carrefour-independencia', price: 5.69, oldPrice: 7.29, validUntil: '2026-05-16' },
];

const seedCommunity = [
  { id: 1, user: 'Carlos', market: 'Bahamas Centro', product: 'Coca-Cola 2L', price: 8.99, likes: 24, image: '🥤', status: 'pending' },
  { id: 2, user: 'Fernanda', market: 'Carrefour Centro', product: 'Picanha Kg', price: 39.99, likes: 41, image: '🥩', status: 'approved' },
];

function money(value) { return Number(value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }); }
function parsePrice(value) { return Number(String(value || '').replace('R$', '').replace(/\./g, '').replace(',', '.').trim()) || 0; }
function slug(value) { return String(value || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''); }
function uid(prefix) { return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 9999)}`; }

async function loadSupabaseData() {
  if (!supabase) return null;
  const [marketsRes, branchesRes, productsRes, offersRes] = await Promise.all([
    supabase.from('markets').select('*'),
    supabase.from('branches').select('*'),
    supabase.from('products').select('*'),
    supabase.from('offers').select('*'),
  ]);
if (marketsRes.error) throw new Error("Erro markets: " + marketsRes.error.message);
if (branchesRes.error) throw new Error("Erro branches: " + branchesRes.error.message);
if (productsRes.error) throw new Error("Erro products: " + productsRes.error.message);
if (offersRes.error) throw new Error("Erro offers: " + offersRes.error.message);  const branches = branchesRes.data || [];
  const markets = (marketsRes.data || []).map((m, index) => ({ id: String(m.id), name: m.name, color: m.color || colors[index % colors.length], branches: branches.filter((b) => String(b.market_id) === String(m.id)).map((b) => ({ id: String(b.id), name: b.name, city: b.city || 'Juiz de Fora', region: b.region || 'Centro' })) }));
  const products = (productsRes.data || []).map((p) => ({ id: String(p.id), name: p.name, brand: p.brand || '', category: p.category || 'Geral', unit: p.unit || '', barcode: p.barcode || '', image: p.image || '🛒' }));
  const offers = (offersRes.data || []).map((o) => ({ id: o.id, productId: String(o.product_id), marketId: String(o.market_id), branchId: String(o.branch_id), price: Number(o.price), oldPrice: Number(o.old_price || o.price), validUntil: o.valid_until || new Date().toISOString().slice(0, 10) }));
  return { markets, products, offers };
}

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([adminLogin, userLogin]);
  if (!currentUser) return <LoginScreen users={users} onLogin={setCurrentUser} />;
  return <MainApp currentUser={currentUser} users={users} setUsers={setUsers} onLogout={() => setCurrentUser(null)} />;
}

function LoginScreen({ users, onLogin }) {
  const [login, setLogin] = useState('admin@ofertacerta');
  const [password, setPassword] = useState('admin0901');
  const [error, setError] = useState('');
  function handleLogin(e) {
    e.preventDefault();
    const user = users.find((u) => u.login.toLowerCase() === login.toLowerCase().trim() && u.password === password);
    if (!user) return setError('Usuário ou senha inválidos.');
    setError(''); onLogin(user);
  }
  return <div className="loginPage"><div className="loginCard"><div className="logoBox">🛒</div><h1>Oferta <span>Certa</span></h1><p>Entre para comparar ofertas, montar listas e administrar o app.</p><form onSubmit={handleLogin}><TextInput label="Usuário" value={login} onChange={setLogin} placeholder="Digite seu usuário" /><TextInput label="Senha" value={password} onChange={setPassword} placeholder="Digite sua senha" type="password" />{error && <div className="error">{error}</div>}<button className="primary full">Entrar no aplicativo</button></form><div className="hint"><b>Acessos de teste:</b><br />Admin: admin@ofertacerta / admin0901<br />Usuário: teste / teste</div></div></div>;
}

function MainApp({ currentUser, users, setUsers, onLogout }) {
  const [markets, setMarkets] = useState(seedMarkets);
  const [products, setProducts] = useState(seedProducts);
  const [offers, setOffers] = useState(seedOffers);
  const [communityOffers, setCommunityOffers] = useState(seedCommunity);
  const [screen, setScreen] = useState('ofertas');
  const [query, setQuery] = useState('');
  const [region, setRegion] = useState('Todos');
  const [market, setMarket] = useState('Todos');
  const [category, setCategory] = useState('Todos');
  const [selectedProductId, setSelectedProductId] = useState(seedProducts[0].id);
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState(['arroz-5kg', 'cafe-500g']);
  const [alerts, setAlerts] = useState(['Café Pilão abaixo de R$18']);
  const [barcode, setBarcode] = useState('');
  const [dataMode, setDataMode] = useState(supabaseEnabled ? 'supabase' : 'local');
  const [loading, setLoading] = useState(false);
  const [dbMessage, setDbMessage] = useState('');

  useEffect(() => { if (supabaseEnabled) refreshFromSupabase(); }, []);

  async function refreshFromSupabase() {
    setLoading(true); setDbMessage('');
    try {
      const data = await loadSupabaseData();
      if (data && data.markets.length && data.products.length) {
        setMarkets(data.markets); setProducts(data.products); setOffers(data.offers); setSelectedProductId(data.products[0].id); setDataMode('supabase'); setDbMessage('Dados reais carregados do Supabase.');
      } else setDbMessage('Supabase conectado, mas as tabelas estão vazias. Use o painel admin para cadastrar dados.');
    } catch (err) { setDataMode('local'); setDbMessage(err.message); }
    setLoading(false);
  }

  const helpers = useMemo(() => ({
    getMarket: (id) => markets.find((m) => String(m.id) === String(id)),
    getBranch: (id) => markets.flatMap((m) => m.branches).find((b) => String(b.id) === String(id)),
    getProduct: (id) => products.find((p) => String(p.id) === String(id)),
  }), [markets, products]);

  const enrichedOffers = useMemo(() => offers.map((o) => ({ ...o, product: helpers.getProduct(o.productId), market: helpers.getMarket(o.marketId), branch: helpers.getBranch(o.branchId) })).filter((o) => o.product && o.market && o.branch), [offers, helpers]);
  const regions = useMemo(() => ['Todos', ...new Set(markets.flatMap((m) => m.branches.map((b) => b.region)))], [markets]);
  const categories = useMemo(() => ['Todos', ...new Set(products.map((p) => p.category))], [products]);
  const filteredOffers = useMemo(() => {
    const text = query.toLowerCase().trim();
    return enrichedOffers.filter((o) => (!text || `${o.product.name} ${o.product.brand} ${o.market.name}`.toLowerCase().includes(text)) && (region === 'Todos' || o.branch.region === region) && (market === 'Todos' || String(o.market.id) === String(market)) && (category === 'Todos' || o.product.category === category)).sort((a, b) => a.price - b.price);
  }, [enrichedOffers, query, region, market, category]);
  const bestOffersByProduct = useMemo(() => { const map = new Map(); enrichedOffers.forEach((o) => { const c = map.get(o.productId); if (!c || o.price < c.price) map.set(o.productId, o); }); return [...map.values()]; }, [enrichedOffers]);
  const comparisonOffers = useMemo(() => enrichedOffers.filter((o) => String(o.productId) === String(selectedProductId)).sort((a, b) => a.price - b.price), [enrichedOffers, selectedProductId]);
  const cartSimulation = useMemo(() => {
    const selectedIds = cart.length ? cart : products.slice(0, 5).map((p) => p.id);
    return markets.map((m) => { const total = selectedIds.reduce((sum, pid) => { const best = enrichedOffers.filter((o) => String(o.marketId) === String(m.id) && String(o.productId) === String(pid)).sort((a, b) => a.price - b.price)[0]; return sum + (best ? best.price : 0); }, 0); const found = selectedIds.filter((pid) => enrichedOffers.some((o) => String(o.marketId) === String(m.id) && String(o.productId) === String(pid))).length; return { market: m, total, found, totalItems: selectedIds.length }; }).sort((a, b) => a.total - b.total);
  }, [cart, markets, products, enrichedOffers]);
  const selectedProduct = helpers.getProduct(selectedProductId) || products[0];
  const scannedProduct = products.find((p) => p.barcode === barcode.trim());

  function addToCart(id) { setCart((c) => c.includes(id) ? c : [...c, id]); }
  function removeFromCart(id) { setCart((c) => c.filter((x) => x !== id)); }
  function toggleFavorite(id) { setFavorites((c) => c.includes(id) ? c.filter((x) => x !== id) : [...c, id]); }
  function addAlert(product) { const text = `${product.name} em promoção`; setAlerts((a) => a.includes(text) ? a : [...a, text]); }

  async function createOffer(newOffer) {
    const price = parsePrice(newOffer.price); const oldPrice = parsePrice(newOffer.oldPrice) || price * 1.15;
    if (dataMode === 'supabase' && supabase) {
      const { data, error } = await supabase.from('offers').insert({ product_id: newOffer.productId, market_id: newOffer.marketId, branch_id: newOffer.branchId, price, old_price: oldPrice, valid_until: newOffer.validUntil }).select().single();
      if (error) throw error;
      setOffers((c) => [...c, { id: data.id, productId: String(data.product_id), marketId: String(data.market_id), branchId: String(data.branch_id), price: Number(data.price), oldPrice: Number(data.old_price), validUntil: data.valid_until }]);
    } else setOffers((c) => [...c, { id: Date.now(), productId: newOffer.productId, marketId: newOffer.marketId, branchId: newOffer.branchId, price, oldPrice, validUntil: newOffer.validUntil }]);
  }

  async function deleteOffer(id) {
    if (dataMode === 'supabase' && supabase) await supabase.from('offers').delete().eq('id', id);
    setOffers((c) => c.filter((o) => o.id !== id));
  }

  return <div className="app"><main><TopHeader currentUser={currentUser} alerts={alerts.length} onLogout={onLogout} dbMessage={dbMessage} dataMode={dataMode} loading={loading} refresh={refreshFromSupabase} /><Hero markets={markets} offers={offers} cart={cart} setScreen={setScreen} /><Navigation screen={screen} setScreen={setScreen} isAdmin={currentUser.role === 'admin'} /><SavingsBanner setScreen={setScreen} />
    {screen === 'ofertas' && <section className="layout"><Filters query={query} setQuery={setQuery} region={region} setRegion={setRegion} market={market} setMarket={setMarket} category={category} setCategory={setCategory} markets={markets} regions={regions} categories={categories} /><div><SectionTitle title="Ofertas em destaque" subtitle="Ordenadas pelo menor preço." pill={`${filteredOffers.length} ofertas`} /><div className="offerGrid">{filteredOffers.map((offer) => <OfferCard key={offer.id} offer={offer} isBest={bestOffersByProduct.some((b) => b.id === offer.id)} isFavorite={favorites.includes(offer.productId)} onFavorite={() => toggleFavorite(offer.productId)} onAdd={() => addToCart(offer.productId)} onCompare={() => { setSelectedProductId(offer.productId); setScreen('comparar'); }} />)}</div></div></section>}
    {screen === 'comparar' && <CompareScreen selectedProduct={selectedProduct} products={products} setSelectedProductId={setSelectedProductId} selectedProductId={selectedProductId} comparisonOffers={comparisonOffers} addToCart={addToCart} helpers={helpers} />}
    {screen === 'lista' && <ListScreen products={products} cart={cart} addToCart={addToCart} removeFromCart={removeFromCart} bestOffersByProduct={bestOffersByProduct} cartSimulation={cartSimulation} />}
    {screen === 'favoritos' && <FavoritesScreen favorites={favorites} products={products} bestOffersByProduct={bestOffersByProduct} toggleFavorite={toggleFavorite} addAlert={addAlert} alerts={alerts} setAlerts={setAlerts} />}
    {screen === 'comunidade' && <CommunityScreen communityOffers={communityOffers} setCommunityOffers={setCommunityOffers} barcode={barcode} setBarcode={setBarcode} scannedProduct={scannedProduct} bestOffersByProduct={bestOffersByProduct} setSelectedProductId={setSelectedProductId} setScreen={setScreen} />}
    {screen === 'ranking' && <RankingScreen markets={markets} cartSimulation={cartSimulation} />}
    {screen === 'admin' && currentUser.role === 'admin' && <AdminPanel markets={markets} setMarkets={setMarkets} products={products} setProducts={setProducts} offers={offers} setOffers={setOffers} users={users} setUsers={setUsers} communityOffers={communityOffers} setCommunityOffers={setCommunityOffers} createOffer={createOffer} deleteOffer={deleteOffer} dataMode={dataMode} />}
  </main><BottomNav screen={screen} setScreen={setScreen} alerts={alerts.length} isAdmin={currentUser.role === 'admin'} /></div>;
}

function TopHeader({ currentUser, alerts, onLogout, dbMessage, dataMode, loading, refresh }) { return <><div className="top"><div><div className="location"><MapPin size={18} /> Juiz de Fora - MG</div><small>Logado como {currentUser.name} • {currentUser.role === 'admin' ? 'Administrador' : 'Usuário'} • {dataMode === 'supabase' ? 'Supabase' : 'Local'}</small></div><div className="topActions"><button className="circle" onClick={refresh} disabled={loading}><Database size={20} /></button><div className="circle notify"><Bell size={20} />{alerts > 0 && <span>{alerts}</span>}</div><button className="circle" onClick={onLogout}><LogOut size={20} /></button></div></div>{dbMessage && <div className="dbMsg">{dbMessage}</div>}</>; }
function Hero({ markets, offers, cart, setScreen }) { return <section className="hero"><div className="heroTop"><div><div className="chip"><MapPin size={16}/> Juiz de Fora - MG</div><div className="brand"><div>🛒</div><h1>Oferta <span>Certa</span></h1></div><p>Compare preços, economize mais e faça compras inteligentes em vários mercados da sua região.</p></div><button className="dark" onClick={() => setScreen('comunidade')}><ScanBarcode size={18}/> Scanner</button></div><div className="features"><Feature icon="⚖️" title="Comparação automática"/><Feature icon="📍" title="Filiais por região"/><Feature icon="📋" title="Lista inteligente"/></div><div className="metrics"><Metric icon={<Store/>} label="Mercados" value={markets.length}/><Metric icon={<MapPin/>} label="Filiais" value={markets.flatMap((m)=>m.branches).length}/><Metric icon={<Tag/>} label="Ofertas" value={offers.length}/><Metric icon={<ShoppingCart/>} label="Na lista" value={cart.length}/></div></section>; }
function Feature({ icon, title }) { return <div className="feature"><span>{icon}</span><b>{title}</b></div>; }
function Metric({ icon, label, value }) { return <div className="metric"><div>{icon}</div><strong>{value}</strong><span>{label}</span></div>; }
function Navigation({ screen, setScreen, isAdmin }) { const items=[['ofertas','Ofertas',<Search/>],['comparar','Comparar',<BarChart3/>],['lista','Lista',<ShoppingCart/>],['favoritos','Favoritos',<Heart/>],['comunidade','Comunidade',<Users/>],['ranking','Ranking',<Trophy/>],...(isAdmin?[['admin','Admin',<ShieldCheck/>]]:[])]; return <nav className="navCards">{items.map(([id,label,icon])=><button key={id} onClick={()=>setScreen(id)} className={screen===id?'active':''}><span>{icon}</span><b>{label}</b></button>)}</nav>; }
function BottomNav({ screen,setScreen,alerts,isAdmin }) { const items=[['ofertas','Início',<Store/>],['comparar','Ofertas',<Tag/>],['lista','Lista',<Menu/>],['comunidade','Scanner',<ScanBarcode/>,true],['favoritos','Alertas',<Bell/>], [isAdmin?'admin':'ranking', isAdmin?'Admin':'Menu', <Menu/>]]; return <div className="bottomNav">{items.map(([id,label,icon,center])=><button key={id} onClick={()=>setScreen(id)} className={`${screen===id?'active':''} ${center?'center':''}`}><span>{icon}{label==='Alertas'&&alerts>0&&<i/>}</span><small>{label}</small></button>)}</div>; }
function SavingsBanner({ setScreen }) { return <section className="savings"><span>💰</span><div><h2>Economize ainda mais!</h2><p>Monte sua lista e descubra em qual mercado sua compra inteira sai mais barata.</p></div><button className="primary" onClick={()=>setScreen('lista')}>Criar lista inteligente ›</button></section>; }
function SectionTitle({ title, subtitle, pill }) { return <div className="sectionTitle"><div><h2>{title}</h2><p>{subtitle}</p></div><span>{pill}</span></div>; }
function Filters({ query,setQuery,region,setRegion,market,setMarket,category,setCategory,markets,regions,categories }) { return <aside className="card filters"><h2>⚙️ Filtros</h2><TextInput label="Buscar produto" value={query} onChange={setQuery} placeholder="Arroz, café, leite..."/><Select label="Região" value={region} onChange={setRegion} options={regions}/><Select label="Mercado" value={market} onChange={setMarket} options={['Todos',...markets.map(m=>m.id)]} display={(v)=>v==='Todos'?'Todos':markets.find(m=>String(m.id)===String(v))?.name}/><Select label="Categoria" value={category} onChange={setCategory} options={categories}/></aside>; }
function OfferCard({ offer,isBest,isFavorite,onFavorite,onAdd,onCompare }) { const discount=Math.round(((offer.oldPrice-offer.price)/offer.oldPrice)*100); return <article className="offer"><div className={`bar ${offer.market.color}`}/><div className="offerBody"><div className="offerHead"><div className="prodIcon">{offer.product.image}</div><div><small>{offer.market.name}</small><h3>{offer.product.name}</h3><p>{offer.product.brand} • {offer.product.unit}</p></div><button className={isFavorite?'heart on':'heart'} onClick={onFavorite}><Heart size={18} fill={isFavorite?'currentColor':'none'}/></button></div><div className="priceBox"><div><del>{money(offer.oldPrice)}</del><strong>{money(offer.price)}</strong></div><div>{isBest&&<em>Menor</em>}<span>↓ {discount}%</span></div></div><p className="meta"><MapPin size={15}/> {offer.branch.name} • {offer.branch.region}</p><p className="meta"><Clock size={15}/> válido até {new Date(offer.validUntil).toLocaleDateString('pt-BR')}</p><div className="buttons"><button onClick={onCompare}>Comparar</button><button className="primary" onClick={onAdd}>Adicionar</button></div></div></article>; }
function CompareScreen({ selectedProduct,products,setSelectedProductId,selectedProductId,comparisonOffers,addToCart,helpers }) { return <section className="layout two"><div className="card"><h2>Comparar produto</h2><Select label="Produto" value={selectedProductId} onChange={setSelectedProductId} options={products.map(p=>p.id)} display={(v)=>products.find(p=>String(p.id)===String(v))?.name}/><div className="best"><small>Melhor oferta atual</small><strong>{comparisonOffers[0]?money(comparisonOffers[0].price):'-'}</strong><p>{comparisonOffers[0]?.market.name}</p></div></div><div className="card"><h2>{selectedProduct?.name}</h2><p>{selectedProduct?.brand} • {selectedProduct?.barcode}</p><button className="primary" onClick={()=>addToCart(selectedProductId)}>Adicionar à lista</button><div className="rows">{comparisonOffers.map((o,i)=><div className="row" key={o.id}><div><b>{i===0&&'⭐ '}{o.market.name}</b><p>{o.branch.name}</p></div><strong>{money(o.price)}</strong></div>)}</div></div></section>; }
function ListScreen({ products,cart,addToCart,removeFromCart,bestOffersByProduct,cartSimulation }) { return <section className="layout two"><div className="card"><h2>Lista inteligente</h2><div className="productList">{products.map(p=>{const selected=cart.includes(p.id); const best=bestOffersByProduct.find(o=>String(o.productId)===String(p.id)); return <div className="productItem" key={p.id}><span>{p.image}</span><div><b>{p.name}</b><p>{p.brand} • melhor: {best?money(best.price):'sem oferta'}</p></div><button onClick={()=>selected?removeFromCart(p.id):addToCart(p.id)}>{selected?<Trash2/>:<Plus/>}</button></div>})}</div></div><div className="card"><h2>Compra mais barata</h2>{cartSimulation.map((item,i)=><div className="row" key={item.market.id}><div><b>{i===0?'⭐ ':''}{item.market.name}</b><p>{item.found}/{item.totalItems} produtos</p></div><strong>{money(item.total)}</strong></div>)}</div></section>; }
function FavoritesScreen({ favorites,products,bestOffersByProduct,toggleFavorite,addAlert,alerts,setAlerts }) { return <div className="card"><h2>Favoritos e alertas</h2><div className="alertTags">{alerts.map((a,i)=><button key={i} onClick={()=>setAlerts(c=>c.filter((_,x)=>x!==i))}>{a} ×</button>)}</div><div className="offerGrid">{favorites.map(id=>{const p=products.find(x=>String(x.id)===String(id)); if(!p)return null; const best=bestOffersByProduct.find(o=>String(o.productId)===String(id)); return <div className="favorite" key={id}><span>{p.image}</span><h3>{p.name}</h3><p>{p.brand}</p><strong>{best?money(best.price):'-'}</strong><button className="primary" onClick={()=>addAlert(p)}>Criar alerta</button><button onClick={()=>toggleFavorite(id)}>Remover</button></div>})}</div></div>; }
function CommunityScreen({ communityOffers,setCommunityOffers,barcode,setBarcode,scannedProduct,bestOffersByProduct,setSelectedProductId,setScreen }) { const [post,setPost]=useState({product:'',market:'',price:''}); function submit(e){e.preventDefault(); if(!post.product||!post.market||!post.price)return; setCommunityOffers(c=>[{id:Date.now(),user:'Você',market:post.market,product:post.product,price:parsePrice(post.price),likes:0,image:'🛒',status:'pending'},...c]); setPost({product:'',market:'',price:''});} const best=scannedProduct&&bestOffersByProduct.find(o=>String(o.productId)===String(scannedProduct.id)); return <section className="layout two"><div className="card"><h2>Comunidade</h2><form className="communityForm" onSubmit={submit}><TextInput label="Produto" value={post.product} onChange={v=>setPost({...post,product:v})}/><TextInput label="Mercado" value={post.market} onChange={v=>setPost({...post,market:v})}/><TextInput label="Preço" value={post.price} onChange={v=>setPost({...post,price:v})}/><button className="primary">Enviar</button></form>{communityOffers.filter(x=>x.status!=='rejected').map(item=><div className="community" key={item.id}><span>{item.image}</span><div><b>{item.product}</b><p>{item.market} • {money(item.price)} • {item.status}</p></div><button onClick={()=>setCommunityOffers(c=>c.map(x=>x.id===item.id?{...x,likes:x.likes+1}:x))}>👍 {item.likes}</button></div>)}</div><div className="card scanner"><h2>Scanner</h2><ScanBarcode size={56}/><input value={barcode} onChange={e=>setBarcode(e.target.value)} placeholder="789100000001"/>{scannedProduct?<div className="scanResult"><span>{scannedProduct.image}</span><b>{scannedProduct.name}</b><p>Melhor preço: {best?money(best.price):'sem oferta'}</p><button className="primary" onClick={()=>{setSelectedProductId(scannedProduct.id);setScreen('comparar')}}>Comparar</button></div>:barcode&&<p className="errorText">Produto não encontrado</p>}</div></section>; }
function RankingScreen({ markets,cartSimulation }) { return <section className="layout two"><div className="card"><h2>Ranking de mercados</h2>{markets.map((m,i)=><div className="row" key={m.id}><div><b>#{i+1} {m.name}</b><p>Economia média {Math.max(72,92-i*5)}%</p></div><strong>⭐ {(4.8-i*.15).toFixed(1)}</strong></div>)}</div><div className="card"><h2>Cesta básica regional</h2>{cartSimulation.map(item=><div className="row" key={item.market.id}><b>{item.market.name}</b><strong>{money(item.total+120)}</strong></div>)}</div></section>; }
function AdminPanel({ markets,setMarkets,products,setProducts,offers,users,setUsers,communityOffers,setCommunityOffers,createOffer,deleteOffer,dataMode }) { const [view,setView]=useState('dashboard'); const [msg,setMsg]=useState(''); const [newOffer,setNewOffer]=useState({productId:products[0]?.id||'',marketId:markets[0]?.id||'',branchId:markets[0]?.branches[0]?.id||'',price:'',oldPrice:'',validUntil:'2026-05-30'}); const [newMarket,setNewMarket]=useState({name:'',branch:'',region:''}); const [newUser,setNewUser]=useState({name:'',login:'',password:'',role:'user'}); const selectedMarket=markets.find(m=>String(m.id)===String(newOffer.marketId))||markets[0]; const branches=selectedMarket?.branches||[]; async function saveOffer(e){e.preventDefault(); try{await createOffer(newOffer); setMsg('Oferta cadastrada.'); setNewOffer({...newOffer,price:'',oldPrice:''});}catch(err){setMsg(err.message)}} function saveMarket(e){e.preventDefault(); if(!newMarket.name||!newMarket.branch)return; const id=slug(newMarket.name)||uid('market'); setMarkets(c=>[...c,{id,name:newMarket.name,color:colors[c.length%colors.length],branches:[{id:`${id}-${slug(newMarket.branch)}`,name:newMarket.branch,city:'Juiz de Fora',region:newMarket.region||'Centro'}]}]); setNewMarket({name:'',branch:'',region:''});} function saveUser(e){e.preventDefault(); if(!newUser.name||!newUser.login||!newUser.password)return; setUsers(c=>[...c,{...newUser,id:Date.now()}]); setNewUser({name:'',login:'',password:'',role:'user'});} return <section className="layout two"><div className="card"><div className="adminHead"><h2>Painel Administrativo</h2><button onClick={()=>setView('dashboard')}>Dashboard</button></div><p>Modo: {dataMode==='supabase'?'Supabase real':'Local de teste'}</p>{msg&&<div className="hint">{msg}</div>}<div className="adminMetrics"><Metric icon={<Store/>} label="Mercados" value={markets.length}/><Metric icon={<Tag/>} label="Ofertas" value={offers.length}/><Metric icon={<Users/>} label="Usuários" value={users.length}/><Metric icon={<Bell/>} label="Pendentes" value={communityOffers.filter(x=>x.status==='pending').length}/></div>{view==='dashboard'&&<div className="adminActions"><AdminAction icon={<Plus/>} title="Cadastrar nova oferta" text="Salvar promoção real." onClick={()=>setView('oferta')}/><AdminAction icon={<Store/>} title="Gerenciar mercados" text="Cadastrar mercados locais." onClick={()=>setView('mercados')}/><AdminAction icon={<UserPlus/>} title="Gerenciar usuários" text="Criar acessos de teste." onClick={()=>setView('usuarios')}/><AdminAction icon={<Check/>} title="Validar comunidade" text="Aprovar ou recusar ofertas." onClick={()=>setView('validar')}/></div>}{view==='oferta'&&<form onSubmit={saveOffer} className="formGrid"><Select label="Produto" value={newOffer.productId} onChange={v=>setNewOffer({...newOffer,productId:v})} options={products.map(p=>p.id)} display={v=>products.find(p=>String(p.id)===String(v))?.name}/><Select label="Mercado" value={newOffer.marketId} onChange={v=>{const m=markets.find(x=>String(x.id)===String(v));setNewOffer({...newOffer,marketId:v,branchId:m?.branches[0]?.id||''})}} options={markets.map(m=>m.id)} display={v=>markets.find(m=>String(m.id)===String(v))?.name}/><Select label="Filial" value={newOffer.branchId} onChange={v=>setNewOffer({...newOffer,branchId:v})} options={branches.map(b=>b.id)} display={v=>branches.find(b=>String(b.id)===String(v))?.name}/><TextInput label="Preço" value={newOffer.price} onChange={v=>setNewOffer({...newOffer,price:v})}/><TextInput label="Preço anterior" value={newOffer.oldPrice} onChange={v=>setNewOffer({...newOffer,oldPrice:v})}/><TextInput label="Validade" value={newOffer.validUntil} onChange={v=>setNewOffer({...newOffer,validUntil:v})}/><button className="primary">Salvar oferta</button></form>}{view==='mercados'&&<form onSubmit={saveMarket} className="formGrid"><TextInput label="Mercado" value={newMarket.name} onChange={v=>setNewMarket({...newMarket,name:v})}/><TextInput label="Filial" value={newMarket.branch} onChange={v=>setNewMarket({...newMarket,branch:v})}/><TextInput label="Região" value={newMarket.region} onChange={v=>setNewMarket({...newMarket,region:v})}/><button className="primary">Adicionar mercado</button></form>}{view==='usuarios'&&<form onSubmit={saveUser} className="formGrid"><TextInput label="Nome" value={newUser.name} onChange={v=>setNewUser({...newUser,name:v})}/><TextInput label="Usuário" value={newUser.login} onChange={v=>setNewUser({...newUser,login:v})}/><TextInput label="Senha" value={newUser.password} onChange={v=>setNewUser({...newUser,password:v})}/><Select label="Perfil" value={newUser.role} onChange={v=>setNewUser({...newUser,role:v})} options={['user','admin']} display={v=>v==='admin'?'Administrador':'Usuário'}/><button className="primary">Criar usuário</button></form>}{view==='validar'&&communityOffers.map(item=><div className="row" key={item.id}><div><b>{item.product}</b><p>{item.market} • {item.status}</p></div><div><button onClick={()=>setCommunityOffers(c=>c.map(x=>x.id===item.id?{...x,status:'approved'}:x))}><Check/></button><button onClick={()=>setCommunityOffers(c=>c.map(x=>x.id===item.id?{...x,status:'rejected'}:x))}><X/></button></div></div>)}</div><div className="card"><h2>Ofertas cadastradas</h2><div className="rows scroll">{offers.slice().reverse().map(o=>{const p=products.find(x=>String(x.id)===String(o.productId)); const m=markets.find(x=>String(x.id)===String(o.marketId)); return <div className="row" key={o.id}><div><b>{p?.name}</b><p>{m?.name} • {money(o.price)}</p></div><button onClick={()=>deleteOffer(o.id)}><Trash2/></button></div>})}</div></div></section>; }
function AdminAction({ icon,title,text,onClick }) { return <button className="adminAction" onClick={onClick}><span>{icon}</span><b>{title}</b><p>{text}</p></button>; }
function TextInput({ label,value,onChange,placeholder,type='text' }) { return <label className="input"><span>{label}</span><input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}/></label>; }
function Select({ label,value,onChange,options,display }) { return <label className="input"><span>{label}</span><select value={value} onChange={e=>onChange(e.target.value)}>{options.map(o=><option key={o} value={o}>{display?display(o):o}</option>)}</select></label>; }

createRoot(document.getElementById('root')).render(<App />);
