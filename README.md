# SabinoShoes - Loja de Calçado

Uma loja online estática hospedada no GitHub Pages, com pagamentos via MB WAY e comunicação via WhatsApp.

## Características

- 🛒 Catálogo de produtos com 20 sapatos dummy
- 📱 Encomendas via WhatsApp
- 💳 Pagamentos MB WAY (manual, via merchant dashboard)
- 📦 Gestão de stock (edição direta no `products.json`)
- 🎨 Design responsivo
- 💰 100% Grátis (GitHub Pages)

## Configuração

### 1. Criar Repositório no GitHub

1. Vai a [github.com/new](https://github.com/new)
2. Nome: `SabinoShoes` (ou o que preferires)
3. **Público** (necessário para GitHub Pages gratuito)
4. Clica em **Create repository**

### 2. Fazer Upload dos Ficheiros

Fazer upload destes ficheiros para o repositório:
- `index.html`
- `style.css`
- `script.js`
- `products.json`
- `README.md`

### 3. Ativar GitHub Pages

1. No repositório, vai a **Settings** → **Pages** (barra lateral)
2. Em "Source", seleciona **Deploy from a branch**
3. Branch: **main**, pasta: **/ (root)**
4. Clica em **Save**

O teu site estará disponível em: `https://TEU_UTILIZADOR.github.io/SabinoShoes/`

### 4. Configurar WhatsApp

Edita o ficheiro `script.js` e altera a linha:
```javascript
const WHATSAPP_NUMBER = '351961234567';
```
Substitui pelo teu número do WhatsApp Business (com código do país, sem o +).

### 5. Gestão de Stock

Edita o ficheiro `products.json` para:
- Adicionar/remover produtos
- Atualizar stock (`"stock": 10`)
- Alterar preços
- Mudar imagens (URLs)

As alterações no GitHub atualizam o site automaticamente em ~1 minuto.

### 6. Processo de Venda

1. Cliente adiciona sapatos ao carrinho
2. Insere o seu número de telemóvel
3. Clica "Finalizar via WhatsApp"
4. Abre conversa no teu WhatsApp com os detalhes do pedido
5. Tu recebes o pedido e envias pedido de pagamento MB WAY para o número do cliente
6. Após pagamento, envias o sapato

## Estrutura de Ficheiros

```
SabinoShoes/
├── index.html      # Página principal
├── style.css       # Estilos
├── script.js       # Lógica da loja e WhatsApp
├── products.json   # Inventário de sapatos
└── README.md       # Este ficheiro
```

## Personalização

### Mudar Cores
Edita `style.css` e altera os valores hexadecimais (ex: `#1a1a1a` para a cor principal).

### Adicionar Produtos
No `products.json`, adiciona um novo objeto:
```json
{
  "id": "shoe-021",
  "name": "Nome do Sapato",
  "brand": "Marca",
  "category": "Sneakers",
  "price": 99.99,
  "stock": 10,
  "sizes": [38, 39, 40, 41, 42, 43],
  "colors": ["Preto", "Branco"],
  "description": "Descrição do sapato",
  "image": "https://url-da-imagem.com/imagem.jpg"
}
```

### Categorias Disponíveis
- Sneakers
- Running
- Boots
- Casual
- Formal
- Luxury
- Basketball
- Skateboarding
- Hiking

## Custos

- **GitHub Pages**: Grátis
- **WhatsApp Business**: Grátis
- **MB WAY**: Sem mensalidade (apenas taxa por transação ~0,15€)
- **Domínio personalizado** (opcional): ~10€/ano

## Notas

- O site é 100% estático (sem backend)
- O carrinho é guardado no navegador (localStorage)
- Pagamentos são geridos manualmente via dashboard MB WAY
- Não há chaves de API expostas no código

## Suporte

Para dúvidas sobre MB WAY: [developers.wallet.pt](https://developers.wallet.pt)
