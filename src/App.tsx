import React, { useState, useEffect } from "react"
import { products, categories, Product } from "./data"
import "./styles.css"

interface CartItem extends Product { quantity: number }

function loadCart(): CartItem[] {
  try { return JSON.parse(localStorage.getItem("cart") || "[]") }
  catch { return [] }
}

export default function App() {
  const [cart, setCart] = useState<CartItem[]>(loadCart)
  const [page, setPage] = useState<"store" | "cart" | "checkout" | "confirmation">("store")
  const [filter, setFilter] = useState("")
  const [order, setOrder] = useState<{ name: string; email: string; total: number } | null>(null)

  useEffect(() => { localStorage.setItem("cart", JSON.stringify(cart)) }, [cart])

  const addToCart = (p: Product) => {
    setCart(prev => prev.find(i => i.id === p.id)
      ? prev.map(i => i.id === p.id ? { ...i, quantity: i.quantity + 1 } : i)
      : [...prev, { ...p, quantity: 1 }])
  }

  const updateQty = (id: number, q: number) => {
    if (q <= 0) return setCart(prev => prev.filter(i => i.id !== id))
    setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: q } : i))
  }

  const totalItems = cart.reduce((a, i) => a + i.quantity, 0)
  const totalPrice = cart.reduce((a, i) => a + i.price * i.quantity, 0)

  const filtered = products.filter(p =>
    !filter || p.category === filter
  )

  if (page === "cart" || page === "checkout") {
    return React.createElement(CartPage, {
      cart, updateQty, totalPrice,
      onBack: () => setPage("store"),
      onCheckout: cart.length > 0 ? () => setPage("checkout") : undefined,
      page
    })
  }

  if (page === "confirmation" && order) {
    return React.createElement(ConfirmationPage, {
      order, onBack: () => { setCart([]); setPage("store"); setOrder(null) }
    })
  }

  if (page === "checkout") {
    return React.createElement(CheckoutForm, {
      totalPrice, cart,
      onSubmit: (name, email) => {
        setOrder({ name, email, total: totalPrice })
        setPage("confirmation")
      },
      onBack: () => setPage("cart")
    })
  }

  return React.createElement("div", { className: "app" },
    React.createElement("header", { className: "header" },
      React.createElement("div", { className: "container header-inner" },
        React.createElement("h1", { className: "logo" }, "🛒 E-Commerce Pro"),
        React.createElement("button", {
          className: "cart-btn",
          onClick: () => setPage("cart")
        },
          React.createElement("i", { className: "fa-solid fa-cart-shopping" }),
          totalItems > 0 && React.createElement("span", { className: "cart-badge" }, totalItems)
        )
      )
    ),
    React.createElement("main", { className: "container" },
      React.createElement("div", { className: "filter-bar" },
        React.createElement("button", {
          className: `filter-btn ${!filter ? "active" : ""}`,
          onClick: () => setFilter("")
        }, "Todos"),
        categories.map(cat =>
          React.createElement("button", {
            key: cat, className: `filter-btn ${filter === cat ? "active" : ""}`,
            onClick: () => setFilter(cat)
          }, cat)
        )
      ),
      React.createElement("div", { className: "product-grid" },
        filtered.map(p => React.createElement(ProductCard, { key: p.id, product: p, onAdd: () => addToCart(p) }))
      )
    ),
    React.createElement("footer", { className: "footer" },
      React.createElement("p", null, "© 2026 E-Commerce Pro — Projeto de portfólio Kadu Dev. Checkout simulatório.")
    )
  )
}

function ProductCard({ product: p, onAdd }: { product: Product; onAdd: () => void }) {
  return React.createElement("div", { className: "product-card" },
    React.createElement("div", { className: "product-image" }, p.image),
    React.createElement("div", { className: "product-body" },
      React.createElement("span", { className: "product-category" }, p.category),
      React.createElement("h3", null, p.name),
      React.createElement("p", { className: "product-desc" }, p.description),
      React.createElement("div", { className: "product-footer" },
        React.createElement("span", { className: "product-price" },
          `R$ ${p.price.toFixed(2)}`
        ),
        React.createElement("button", { className: "add-btn", onClick: onAdd },
          React.createElement("i", { className: "fa-solid fa-plus" }), " Adicionar"
        )
      )
    )
  )
}

function CartPage({ cart, updateQty, totalPrice, onBack, onCheckout, page }: any) {
  return React.createElement("div", { className: "app" },
    React.createElement("header", { className: "header" },
      React.createElement("div", { className: "container header-inner" },
        React.createElement("h1", { className: "logo" }, "🛒 Carrinho"),
        React.createElement("button", { className: "back-btn", onClick: onBack },
          React.createElement("i", { className: "fa-solid fa-arrow-left" }), " Voltar"
        )
      )
    ),
    React.createElement("main", { className: "container cart-page" },
      cart.length === 0
        ? React.createElement("div", { className: "empty-cart" },
            React.createElement("i", { className: "fa-solid fa-cart-empty" }),
            React.createElement("h2", null, "Carrinho vazio"),
            React.createElement("p", null, "Adicione produtos para começar."),
            React.createElement("button", { className: "add-btn", onClick: onBack }, "Ver Produtos")
          )
        : React.createElement(React.Fragment, null,
            React.createElement("div", { className: "cart-items" },
              cart.map((item: any) =>
                React.createElement("div", { key: item.id, className: "cart-item" },
                  React.createElement("span", { className: "cart-item-image" }, item.image),
                  React.createElement("div", { className: "cart-item-info" },
                    React.createElement("h3", null, item.name),
                    React.createElement("p", null, `R$ ${item.price.toFixed(2)}`)
                  ),
                  React.createElement("div", { className: "cart-qty" },
                    React.createElement("button", { onClick: () => updateQty(item.id, item.quantity - 1) }, "-"),
                    React.createElement("span", null, item.quantity),
                    React.createElement("button", { onClick: () => updateQty(item.id, item.quantity + 1) }, "+")
                  ),
                  React.createElement("span", { className: "cart-item-total" },
                    `R$ ${(item.price * item.quantity).toFixed(2)}`
                  )
                )
              )
            ),
            React.createElement("div", { className: "cart-summary" },
              React.createElement("h3", null, `Total: R$ ${totalPrice.toFixed(2)}`),
              React.createElement("p", null, `${cart.reduce((a: number, i: any) => a + i.quantity, 0)} itens`),
              React.createElement("button", { className: "checkout-btn", onClick: onCheckout },
                "Ir para Checkout ", React.createElement("i", { className: "fa-solid fa-arrow-right" })
              )
            )
          )
    )
  )
}

function CheckoutForm({ totalPrice, cart, onSubmit, onBack }: any) {
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [step, setStep] = React.useState(1)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (step === 1) { setStep(2); return }
    onSubmit(name, email)
  }

  if (step === 1) {
    return React.createElement("div", { className: "app" },
      React.createElement("header", { className: "header" },
        React.createElement("div", { className: "container header-inner" },
          React.createElement("h1", { className: "logo" }, "📋 Checkout"),
          React.createElement("button", { className: "back-btn", onClick: onBack },
            React.createElement("i", { className: "fa-solid fa-arrow-left" }), " Voltar"
          )
        )
      ),
      React.createElement("main", { className: "container checkout-page" },
        React.createElement("div", { className: "checkout-steps" },
          React.createElement("div", { className: "step active" }, "1. Dados"),
          React.createElement("div", { className: "step" }, "2. Pagamento"),
          React.createElement("div", { className: "step" }, "3. Confirmação")
        ),
        React.createElement("form", { onSubmit: handleSubmit, className: "checkout-form" },
          React.createElement("label", null, "Nome completo *"),
          React.createElement("input", {
            required: true, value: name,
            onChange: (e: any) => setName(e.target.value),
            placeholder: "Seu nome"
          }),
          React.createElement("label", null, "E-mail *"),
          React.createElement("input", {
            type: "email", required: true, value: email,
            onChange: (e: any) => setEmail(e.target.value),
            placeholder: "seu@email.com"
          }),
          React.createElement("div", { className: "checkout-total" },
            React.createElement("span", null, `Total: R$ ${totalPrice.toFixed(2)}`),
            React.createElement("button", { type: "submit", className: "checkout-btn" }, "Continuar")
          )
        )
      )
    )
  }

  return React.createElement("div", { className: "app" },
    React.createElement("header", { className: "header" },
      React.createElement("div", { className: "container header-inner" },
        React.createElement("h1", { className: "logo" }, "💳 Pagamento"),
        React.createElement("button", { className: "back-btn", onClick: onBack },
          React.createElement("i", { className: "fa-solid fa-arrow-left" }), " Voltar"
        )
      )
    ),
    React.createElement("main", { className: "container checkout-page" },
      React.createElement("div", { className: "checkout-steps" },
        React.createElement("div", { className: "step done" }, "✓"),
        React.createElement("div", { className: "step active" }, "2. Pagamento"),
        React.createElement("div", { className: "step" }, "3. Confirmação")
      ),
      React.createElement("form", { onSubmit: handleSubmit, className: "checkout-form" },
        React.createElement("label", null, "Número do cartão *"),
        React.createElement("input", { required: true, placeholder: "1234 5678 9012 3456", maxLength: 19 }),
        React.createElement("div", { className: "form-row" },
          React.createElement("div", null,
            React.createElement("label", null, "Validade *"),
            React.createElement("input", { required: true, placeholder: "MM/AA", maxLength: 5 })
          ),
          React.createElement("div", null,
            React.createElement("label", null, "CVV *"),
            React.createElement("input", { required: true, placeholder: "123", maxLength: 4 })
          )
        ),
        React.createElement("div", { className: "checkout-summary" },
          React.createElement("p", null,
            React.createElement("strong", null, `${cart.length} itens`),
            ` — R$ ${totalPrice.toFixed(2)}`
          )
        ),
        React.createElement("div", { className: "checkout-total" },
          React.createElement("span", null, `Total: R$ ${totalPrice.toFixed(2)}`),
          React.createElement("button", { type: "submit", className: "checkout-btn" },
            React.createElement("i", { className: "fa-solid fa-lock" }), " Finalizar Pedido"
          )
        )
      )
    )
  )
}

function ConfirmationPage({ order, onBack }: any) {
  return React.createElement("div", { className: "app" },
    React.createElement("header", { className: "header" },
      React.createElement("div", { className: "container header-inner" },
        React.createElement("h1", { className: "logo" }, "✅ Pedido Confirmado"),
      )
    ),
    React.createElement("main", { className: "container confirmation-page" },
      React.createElement("div", { className: "confirmation-icon" }, "🎉"),
      React.createElement("h2", null, "Pedido realizado com sucesso!"),
      React.createElement("p", null, `Obrigado, ${order.name}!`),
      React.createElement("p", null, `Um e-mail de confirmação será enviado para ${order.email}.`),
      React.createElement("p", { className: "confirmation-total" },
        `Total: R$ ${order.total.toFixed(2)}`
      ),
      React.createElement("div", { className: "confirmation-meta" },
        React.createElement("p", null,
          React.createElement("i", { className: "fa-solid fa-barcode" }),
          " Pedido #", Math.random().toString(36).substr(2, 8).toUpperCase()
        ),
        React.createElement("p", null,
          React.createElement("i", { className: "fa-solid fa-clock" }),
          " Entrega estimada: 5-10 dias úteis"
        )
      ),
      React.createElement("button", { className: "add-btn", onClick: onBack },
        React.createElement("i", { className: "fa-solid fa-arrow-left" }), " Voltar às Compras"
      )
    )
  )
}
