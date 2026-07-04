export interface Product {
  id: number; name: string; price: number; category: string;
  image: string; description: string; rating: number;
}

export const products: Product[] = [
  { id: 1, name: "Camiseta Tech Pro", price: 89.90, category: "Vestuário",
    image: "👕", description: "Camiseta 100% algodão com estampa minimalista tech.", rating: 4.5 },
  { id: 2, name: "Mouse Sem Fio MX", price: 199.90, category: "Periféricos",
    image: "🖱️", description: "Mouse ergonômico com 6 botões e bateria de 3 meses.", rating: 4.8 },
  { id: 3, name: "Teclado Mecânico RGB", price: 349.90, category: "Periféricos",
    image: "⌨️", description: "Switch Blue, iluminação RGB por tecla e construção em alumínio.", rating: 4.7 },
  { id: 4, name: "Fone BT Noise Cancel", price: 449.90, category: "Áudio",
    image: "🎧", description: "Cancelamento ativo de ruído, 40h de bateria e som Hi-Res.", rating: 4.9 },
  { id: 5, name: "Monitor 27" 4K", price: 2499.90, category: "Monitores",
    image: "🖥️", description: "Painel IPS, HDR400, 99% sRGB e USB-C com 65W.", rating: 4.6 },
  { id: 6, name: "Webcam HD 1080p", price: 159.90, category: "Periféricos",
    image: "📷", description: "1080p 30fps, foco automático e microfone integrado.", rating: 4.3 },
  { id: 7, name: "Suporte Notebook Ajustável", price: 129.90, category: "Acessórios",
    image: "💻", description: "Alumínio, ajuste de altura e ventilação para melhor ergonomia.", rating: 4.4 },
  { id: 8, name: "Mochila Tech 30L", price: 259.90, category: "Acessórios",
    image: "🎒", description: "Compartimento para notebook 15.6", USB externo e anti-furto.", rating: 4.6 },
  { id: 9, name: "Smartwatch Esportivo", price: 899.90, category: "Wearables",
    image: "⌚", description: "GPS, monitor cardíaco, 50+ modalidades e 14 dias de bateria.", rating: 4.5 },
  { id: 10, name: "Carregador USB-C 65W", price: 89.90, category: "Acessórios",
    image: "🔌", description: "GaN, 2 portas USB-C, compatível com notebook e smartphone.", rating: 4.7 },
]

export const categories = [...new Set(products.map(p => p.category))]
