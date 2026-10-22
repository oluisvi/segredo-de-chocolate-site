const WHATSAPP = "5512997925603";
const INSTAGRAM = "https://www.instagram.com/segredodechocolate/";
const categories = [
  { id: "docinhos", label: "Docinhos", note: "Pequenos detalhes que encantam." },
  { id: "salgados", label: "Salgados", note: "Sabor e qualidade em cada mordida." },
  { id: "tortas", label: "Tortas", note: "Feitas com muito carinho." },
  { id: "bolos", label: "Bolos por quilo", note: "Do seu jeito, para compartilhar." }
];
const products = [
  { id: "cento-docinhos", category: "docinhos", name: "Cento de docinhos", description: "Todos os sabores.", price: "R$ 180,00", unit: "cento", photo: "doces" },
  { id: "bombons-finos", category: "docinhos", name: "Bombons finos", description: "Uma seleção de bombons.", price: "R$ 300,00", unit: "cento", photo: "doces" },
  { id: "cake-pop", category: "docinhos", name: "Cake pop", description: "Delícia no palito.", price: "R$ 7,50", unit: "unidade", photo: "doces" },
  { id: "mini-bombom", category: "docinhos", name: "Mini bombom de morango ou uva", description: "Escolha o sabor ao conversar.", price: "R$ 7,50", unit: "unidade", photo: "doces" },
  { id: "cento-salgados", category: "salgados", name: "Cento de salgados", description: "Consulte os sabores disponíveis.", price: "R$ 150,00", unit: "cento", photo: "salgados" },
  { id: "torta-limao", category: "tortas", name: "Torta de limão com merengue", description: "Clássica, com cobertura de merengue.", price: "R$ 150,00", unit: "", photo: "tortas" },
  { id: "sonho-banoffee", category: "tortas", name: "Sonho de banoffee", description: "Consulte os detalhes pelo WhatsApp.", price: "R$ 200,00", unit: "", photo: "tortas" },
  { id: "torta-brigadeiro", category: "tortas", name: "Torta de brigadeiro trufado", description: "Chocolate em cada camada.", price: "R$ 250,00", unit: "", photo: "tortas" },
  { id: "torta-maracuja", category: "tortas", name: "Torta de maracujá com chocolate", description: "Doce e cítrica na medida.", price: "R$ 200,00", unit: "", photo: "tortas" },
  { id: "bolo-quilo", category: "bolos", name: "Bolos por quilo", description: "Pão de ló, calda especial e dois recheios.", price: "R$ 90,00", unit: "kg", photo: "cake" }
];
const fillings = ["Prestígio (coco e chocolate)", "Abacaxi com creme", "Ameixa com chocolate", "Doce de leite com ameixa", "Morango com chocolate", "Brigadeiro branco e preto", "Ninho com morango", "Chocolate", "Nozes com chocolate"];
let activeDesign = "editorial";
let activeCategory = "todos";
let searchTerm = "";
const interests = new Set();
let toastTimer;

const photoClass = (kind) => "photo photo--" + kind;
const photo = (kind, alt, extra) => '<div class="' + photoClass(kind) + ' ' + (extra || "product-photo") + '" role="img" aria-label="' + alt + '"></div>';
const unitLabel = (p) => p.unit ? " / " + p.unit : "";
const waHref = (message) => "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(message);
const generalMessage = "Olá! Vi o catálogo da Segredo de Chocolate e gostaria de tirar uma dúvida sobre encomendas.";
const productById = (id) => products.find((product) => product.id === id);
const grouped = (category) => products.filter((product) => product.category === category);
const addButton = (p) => '<button type="button" class="add-button" data-add="' + p.id + '" aria-pressed="' + interests.has(p.id) + '">' + (interests.has(p.id) ? "Incluído" : "Incluir na consulta") + '</button>';

function nav(theme) {
  const links = theme === "catalog"
    ? '<a href="#inicio">Início</a><a href="#catalog">Catálogo</a><a href="#contact">Contato</a>'
    : '<a href="#inicio">Início</a><a href="#docinhos">Docinhos</a><a href="#salgados">Salgados</a><a href="#tortas">Tortas</a><a href="#bolos">Bolos</a>';
  return '<header class="site-header header-' + theme + '"><a class="brand" href="#inicio" aria-label="Segredo de Chocolate, início"><span class="brand-small">Segredo de</span><span class="brand-large">Chocolate</span></a>' +
    '<nav class="main-nav" aria-label="Navegação principal">' + links + '</nav><a class="order-link" href="' + waHref(generalMessage) + '" target="_blank" rel="noopener noreferrer">Fazer encomenda <span aria-hidden="true">↗</span></a></header>';
}
function productCard(p) {
  return '<article class="product-card">' + photo(p.photo, p.name) + '<div class="product-content"><h4 class="product-name">' + p.name + '</h4><p class="product-description">' + p.description + '</p><p class="product-price">' + p.price + unitLabel(p) + '</p>' + addButton(p) + '</div></article>';
}
function menuItem(p) {
  return '<article class="menu-item"><h4 class="product-name">' + p.name + '</h4><p class="product-price">' + p.price + unitLabel(p) + '</p><p class="product-description">' + p.description + '</p>' + addButton(p) + '</article>';
}
function storeRow(p) {
  return '<section class="store-row" data-product="' + p.id + '">' + photo(p.photo, p.name) + '<div class="store-row-copy"><h3 class="product-name">' + p.name + '</h3><p class="product-description">' + p.description + '</p></div><div class="store-row-action"><p class="product-price">' + p.price + unitLabel(p) + '</p>' + addButton(p) + '</div></section>';
}
function footer(theme) {
  const suffix = theme === "menu" ? " menu" : theme === "catalog" ? " catalog" : "";
  return '<footer class="site-footer footer-' + theme + '" id="contact"><div><a class="brand footer-brand" href="#inicio"><span class="brand-small">Segredo de</span><span class="brand-large">Chocolate</span></a><p class="footer-copy' + suffix + '">Um café, um momento, um segredo.</p></div>' +
    '<div><h2 class="footer-heading">Fale com a gente</h2><ul class="footer-list' + suffix + '"><li><a href="' + waHref(generalMessage) + '" target="_blank" rel="noopener noreferrer">WhatsApp: (12) 99792-5603</a></li><li><a href="' + INSTAGRAM + '" target="_blank" rel="noopener noreferrer">Instagram: @segredodechocolate</a></li><li><a href="https://maps.google.com/?q=Rua+Canopus+622" target="_blank" rel="noopener noreferrer">Rua Canopus, 622 — São José</a></li></ul></div>' +
    '<div><h2 class="footer-heading">Encomendas</h2><p class="footer-copy' + suffix + '">Pedido mediante entrada de 50%. Aceita transferência, Pix e cartão de crédito.<br>Chave Pix informada no cardápio: (12) 988013592.</p></div></footer>' +
    '<div class="footer-bottom footer-bottom-' + theme + '">Consulte pelo WhatsApp disponibilidade, sabores e detalhes da sua encomenda.</div>' +
    '<a class="mobile-order" href="' + waHref(generalMessage) + '" target="_blank" rel="noopener noreferrer">Fazer encomenda pelo WhatsApp <span aria-hidden="true">↗</span></a>';
}
function editorialCategory(category) {
  const info = categories.find((item) => item.id === category);
  const extra = category === "bolos"
    ? '<div class="editorial-note"><div><h3>Escolha os recheios</h3><p>Bolos a R$ 90,00/kg, com massa de pão de ló, calda especial de leite de coco e leite condensado, e dois recheios. Confirme combinações e disponibilidade pelo WhatsApp.</p></div><div class="note-stamp">Dois<br>recheios<br>à escolha</div></div><ul class="filling-list">' + fillings.map((item) => '<li>' + item + '</li>').join("") + '</ul>'
    : "";
  return '<section class="editorial-category" id="' + category + '"><div class="category-title"><h3>' + info.label + '</h3><p>' + info.note + '</p></div><div class="product-grid">' + grouped(category).map(productCard).join("") + '</div>' + extra + '</section>';
}
function renderEditorial() {
  return '<div class="site-shell page-editorial">' + nav("editorial") + '<main id="inicio"><section class="hero-editorial"><div class="hero-copy"><p class="hero-overline">Cafeteria &amp; doceria · São José</p><h1>Um café,<br>um momento,<br><em>um segredo.</em></h1><p class="hero-lede">Doces momentos fazem a vida mais doce. Descubra as opções da casa e prepare sua próxima encomenda.</p><div class="hero-actions"><a class="button-primary" href="#catalog">Explorar catálogo <span aria-hidden="true">↓</span></a><a class="button-secondary" href="' + waHref(generalMessage) + '" target="_blank" rel="noopener noreferrer">Conversar no WhatsApp</a></div><p class="hero-caption">Pequenos detalhes que encantam — feitos com carinho.</p></div><div><div class="' + photoClass("cake") + ' hero-photo" role="img" aria-label="Bolo de chocolate em camadas"></div><p class="hero-photo-caption">Bolos por quilo · R$ 90,00/kg</p></div></section>' +
    '<nav class="category-ribbon" aria-label="Ir para uma categoria">' + categories.map((c) => '<a href="#' + c.id + '">' + c.label + '</a>').join("") + '</nav>' +
    '<section class="editorial-section editorial-catalog" id="catalog"><div class="section-heading"><div><p class="section-eyebrow">Feitos para compartilhar</p><h2>Escolha sua delícia</h2></div><p>Veja o cardápio e fale com a gente para confirmar os detalhes da encomenda.</p></div>' + categories.map((c) => editorialCategory(c.id)).join("") +
    '<div class="editorial-note"><div><h3>Vamos preparar sua encomenda?</h3><p>O pedido é confirmado pelo WhatsApp. O cardápio informa entrada de 50% do valor e pagamento por transferência, Pix ou cartão de crédito.</p></div><a class="button-primary" href="' + waHref(generalMessage) + '" target="_blank" rel="noopener noreferrer">Fazer minha encomenda <span aria-hidden="true">↗</span></a></div></section></main>' + footer("editorial") + '</div>';
}
function menuCategory(category) {
  const info = categories.find((item) => item.id === category);
  const extra = category === "bolos" ? '<div class="menu-fillings"><h3>Recheios para escolher</h3><ul class="filling-list">' + fillings.map((item) => '<li>' + item + '</li>').join("") + '</ul></div>' : "";
  return '<section class="menu-group" id="' + category + '"><div class="menu-group-heading"><h3>' + info.label + '</h3><span>' + info.note + '</span></div><div class="menu-list">' + grouped(category).map(menuItem).join("") + '</div>' + extra + '</section>';
}
function renderMenu() {
  return '<div class="site-shell page-menu">' + nav("menu") + '<main id="inicio"><section class="menu-cover"><div class="menu-cover-inner"><div><p class="hero-overline">Doces momentos fazem a vida mais doce</p><h1>Cardápio<br>da casa</h1><p>Doces, salgados e bolos feitos com carinho para adoçar seus melhores momentos.</p></div><div class="menu-cover-aside"><span>Especialidade</span><strong>Bolos por quilo<br>R$ 90,00/kg</strong><div class="' + photoClass("cake") + ' menu-photo" role="img" aria-label="Fatia de bolo de chocolate"></div></div></div></section>' +
    '<nav class="menu-category-nav" aria-label="Categorias do cardápio">' + categories.map((c) => '<a href="#' + c.id + '">' + c.label + '</a>').join("") + '</nav>' +
    '<div class="menu-board-wrap"><div class="menu-board-title"><h2>Nosso cardápio</h2><p>Consulte sabores e disponibilidade pelo WhatsApp</p></div><div class="menu-board">' + categories.map((c) => menuCategory(c.id)).join("") + '</div>' +
    '<div class="menu-fillings"><h3>Como encomendar um bolo</h3><p class="menu-help">Os bolos são feitos com pão de ló, calda especial de leite de coco e leite condensado, e dois recheios. O cardápio também orienta escolher uma massa; confirme as opções de massa e combinações pelo WhatsApp.</p></div></div>' +
    '<section class="menu-order-strip"><div><h3>Um doce momento começa aqui.</h3><p>Encomendas pelo WhatsApp (12) 99792-5603.</p></div><div><h3>Condições</h3><p>Entrada de 50% do valor. Transferência, Pix ou cartão de crédito.</p></div><a class="order-link" href="' + waHref(generalMessage) + '" target="_blank" rel="noopener noreferrer">Fazer encomenda <span aria-hidden="true">↗</span></a></section></main>' + footer("menu") + '</div>';
}
function filteredProducts() {
  return products.filter((p) => {
    const categoryMatch = activeCategory === "todos" || p.category === activeCategory;
    const text = (p.name + " " + p.description + " " + p.category).toLocaleLowerCase("pt-BR");
    return categoryMatch && text.includes(searchTerm.toLocaleLowerCase("pt-BR"));
  });
}
function interestItems() {
  const selected = Array.from(interests).map(productById).filter(Boolean);
  if (!selected.length) return '<li class="interest-empty">Sua lista está vazia. Inclua itens para enviar uma consulta.</li>';
  return selected.map((p) => '<li class="interest-item"><div><strong>' + p.name + '</strong><span>' + p.price + unitLabel(p) + '</span></div><button class="remove-interest" type="button" data-remove="' + p.id + '" aria-label="Remover ' + p.name + ' da lista">×</button></li>').join("");
}
function renderCatalog() {
  const filterButtons = '<button type="button" data-category="todos" class="' + (activeCategory === "todos" ? "is-active" : "") + '" aria-pressed="' + (activeCategory === "todos") + '">Todos os produtos</button>' + categories.map((c) => '<button type="button" data-category="' + c.id + '" class="' + (activeCategory === c.id ? "is-active" : "") + '" aria-pressed="' + (activeCategory === c.id) + '">' + c.label + '</button>').join("");
  const rows = filteredProducts().map(storeRow).join("");
  return '<div class="site-shell page-catalog">' + nav("catalog") + '<main id="inicio"><section class="catalog-intro"><p class="section-eyebrow">Cardápio da Segredo de Chocolate</p><h1>Escolha o que vai adoçar seu momento.</h1><p>Explore o catálogo e envie uma consulta pelo WhatsApp. Sabores, disponibilidade e detalhes são confirmados por lá.</p></section>' +
    '<div class="catalog-layout" id="catalog"><h2 class="visually-hidden">Explore o catálogo</h2><aside class="filter-rail" aria-label="Filtrar catálogo"><h3>Categorias</h3><div class="category-filter">' + filterButtons + '</div><p class="filter-note">Os preços refletem o cardápio recebido. Confirme os detalhes da encomenda diretamente com a equipe.</p></aside>' +
    '<section class="store-results" aria-label="Produtos"><h3 class="visually-hidden">Resultados do catálogo</h3><label class="search-field"><span aria-hidden="true">⌕</span><input type="search" id="product-search" placeholder="Buscar no catálogo" value="' + searchTerm.replace(/"/g, "&quot;") + '" aria-label="Buscar produtos"></label><p class="result-caption" id="result-caption" aria-live="polite">' + filteredProducts().length + ' opções no catálogo</p><div class="store-product-list" id="store-products">' + (rows || '<p class="interest-empty">Nenhum item encontrado.</p>') + '</div></section>' +
    '<aside class="order-panel" aria-label="Lista de interesse"><div class="order-panel-head"><h3>Minha consulta</h3><span class="selection-count" id="selection-count" aria-label="' + interests.size + ' itens na lista">' + interests.size + '</span></div><ul class="interest-list" id="interest-list">' + interestItems() + '</ul><a class="button-primary" id="send-interest" href="' + waHref(generalMessage) + '" target="_blank" rel="noopener noreferrer">Enviar consulta pelo WhatsApp <span aria-hidden="true">↗</span></a><p class="order-disclaimer">Esta lista organiza seus interesses. O pedido e os detalhes são confirmados pelo WhatsApp.</p></aside></div>' +
    '<section class="store-terms"><h2 class="visually-hidden">Informações de encomenda</h2><div class="term-block"><h3>Encomendas</h3><p>O cardápio informa entrada de 50% do valor do pedido.</p></div><div class="term-block"><h3>Pagamento</h3><p>Transferência, Pix e cartão de crédito.</p></div><div class="term-block"><h3>Bolos</h3><p>R$ 90,00/kg, com dois recheios. Consulte sabores e combinações.</p></div></section></main>' + footer("catalog") + '</div>';
}
function inquiryMessage() {
  const selected = Array.from(interests).map(productById).filter(Boolean);
  if (!selected.length) return generalMessage;
  return "Olá! Vim pelo catálogo da Segredo de Chocolate e gostaria de consultar estes itens:\n" +
    selected.map((p) => "• " + p.name + " — " + p.price + unitLabel(p)).join("\n") +
    "\n\nVocê pode confirmar disponibilidade, quantidades e detalhes da encomenda?";
}
function updateInterestPanel() {
  const list = document.getElementById("interest-list");
  const count = document.getElementById("selection-count");
  const send = document.getElementById("send-interest");
  if (list) list.innerHTML = interestItems();
  if (count) {
    count.textContent = String(interests.size);
    count.setAttribute("aria-label", interests.size + (interests.size === 1 ? " item na lista" : " itens na lista"));
  }
  if (send) send.href = waHref(inquiryMessage());
  document.querySelectorAll('a[href^="https://wa.me/"]').forEach((link) => { link.href = waHref(inquiryMessage()); });
  document.querySelectorAll("[data-add]").forEach((button) => {
    const selected = interests.has(button.dataset.add);
    button.setAttribute("aria-pressed", String(selected));
    button.textContent = selected ? "Incluído" : "Incluir na consulta";
  });
}
function updateCatalogRows() {
  const list = document.getElementById("store-products");
  const caption = document.getElementById("result-caption");
  if (!list) return;
  const visible = filteredProducts();
  list.innerHTML = visible.length ? visible.map(storeRow).join("") : '<p class="interest-empty">Nenhum item encontrado. Tente outra busca ou categoria.</p>';
  if (caption) caption.textContent = visible.length + (visible.length === 1 ? " opção no catálogo" : " opções no catálogo");
  updateInterestPanel();
}
function render() {
  const root = document.getElementById("site-content");
  const scrollY = window.scrollY;
  root.innerHTML = activeDesign === "editorial" ? renderEditorial() : activeDesign === "menu" ? renderMenu() : renderCatalog();
  document.body.dataset.design = activeDesign;
  const labels = { editorial: "Editorial", menu: "Menu da casa", catalog: "Catálogo" };
  document.querySelectorAll(".design-option").forEach((button) => {
    const selected = button.dataset.design === activeDesign;
    button.classList.toggle("is-active", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
  document.getElementById("design-status").textContent = "Design selecionado: " + labels[activeDesign];
  updateInterestPanel();
  window.requestAnimationFrame(() => window.scrollTo({ top: Math.min(scrollY, document.documentElement.scrollHeight), behavior: "instant" }));
}
function showToast(message) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2200);
}
document.querySelector(".design-selector").addEventListener("click", (event) => {
  const button = event.target.closest("[data-design]");
  if (!button) return;
  activeDesign = button.dataset.design;
  render();
});
document.addEventListener("click", (event) => {
  const add = event.target.closest("[data-add]");
  const remove = event.target.closest("[data-remove]");
  const category = event.target.closest("[data-category]");
  if (add) {
    const id = add.dataset.add;
    if (interests.has(id)) interests.delete(id); else interests.add(id);
    updateInterestPanel();
    showToast(interests.has(id) ? "Item incluído na sua consulta." : "Item removido da sua consulta.");
  }
  if (remove) {
    interests.delete(remove.dataset.remove);
    updateInterestPanel();
  }
  if (category) {
    activeCategory = category.dataset.category;
    document.querySelectorAll("[data-category]").forEach((button) => {
      const selected = button.dataset.category === activeCategory;
      button.classList.toggle("is-active", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    updateCatalogRows();
  }
});
document.addEventListener("input", (event) => {
  if (event.target.id !== "product-search") return;
  searchTerm = event.target.value.trim();
  updateCatalogRows();
});
render();
