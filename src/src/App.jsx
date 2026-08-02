import React, { useState, useEffect, useCallback } from "react";
import {
  Search, ShoppingCart, Heart, User, Star, ChevronRight, Plus, Minus, Check,
  Package, TrendingUp, Users, ShieldCheck, Truck, CreditCard, Smartphone,
  Building2, Store, Settings, AlertTriangle, Trash2, MessageCircle, ArrowRight,
  Sparkles, LogOut, Loader2,
} from "lucide-react";
import { api, setToken } from "./api";

const C = {
  black: "#0A0A0A", charcoal: "#161513", white: "#FFFFFF", off: "#FAF8F3",
  line: "#E8E1D0", gold: "#C9A227", goldLight: "#E4C56B", goldDeep: "#8A6B14",
  textMuted: "#8B8578",
};
const cents = (c) => `$${(c / 100).toFixed(2)}`;

function GoldButton({ children, onClick, full, outline, small, icon: Icon, disabled, type = "button" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`og-sans inline-flex items-center justify-center gap-2 font-semibold ${full ? "w-full" : ""} ${small ? "px-4 py-2 text-xs" : "px-6 py-3 text-sm"}`}
      style={{
        background: outline ? "transparent" : disabled ? "#D9CFA8" : `linear-gradient(135deg, ${C.goldLight}, ${C.gold} 60%, ${C.goldDeep})`,
        color: outline ? C.gold : C.black,
        border: `1px solid ${C.gold}`,
        opacity: disabled ? 0.6 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      {Icon && <Icon size={small ? 14 : 16} />}
      {children}
    </button>
  );
}
function Pill({ children, active, onClick }) {
  return (
    <button onClick={onClick} className="og-sans px-3 py-1.5 text-xs font-medium whitespace-nowrap"
      style={{ borderRadius: 999, border: `1px solid ${active ? C.gold : C.line}`, background: active ? C.black : "transparent", color: active ? C.goldLight : C.textMuted }}>
      {children}
    </button>
  );
}
function Stars({ rating, size = 13 }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => <Star key={i} size={size} fill={i <= Math.round(rating || 0) ? C.gold : "none"} color={C.gold} strokeWidth={1.5} />)}
    </div>
  );
}
function Logo({ size = 40, onClick }) {
  return (
    <button onClick={onClick} className="flex items-center gap-2.5">
      <div className="flex items-center justify-center rounded-full" style={{ width: size, height: size, border: `1.5px solid ${C.gold}`, background: C.black }}>
        <span className="og-serif" style={{ color: C.gold, fontSize: size * 0.5, fontWeight: 700 }}>OG</span>
      </div>
      <div className="leading-tight text-left">
        <div className="og-serif" style={{ fontSize: size * 0.42, color: C.black, fontWeight: 700 }}>Oscar <span style={{ color: C.gold }}>Gold</span></div>
        <div className="og-sans og-tracked" style={{ fontSize: size * 0.14, color: C.textMuted }}>STORE</div>
      </div>
    </button>
  );
}
function ProductImage({ product, className, iconSize = 40 }) {
  const img = product.images?.[0];
  if (img) return <img src={img} alt={product.name} className={`object-cover ${className}`} />;
  const initials = (product.name || "?").split(" ").slice(0, 2).map((w) => w[0]).join("");
  return (
    <div className={`flex items-center justify-center ${className}`} style={{ background: `linear-gradient(150deg, ${C.charcoal}, ${C.black})` }}>
      <span className="og-serif" style={{ color: C.gold, opacity: 0.35, fontSize: iconSize, fontWeight: 700 }}>{initials}</span>
    </div>
  );
}
function SectionTitle({ eyebrow, title, right }) {
  return (
    <div className="flex items-end justify-between mb-5">
      <div>
        {eyebrow && <div className="og-sans og-tracked text-[11px] mb-1" style={{ color: C.gold }}>{eyebrow}</div>}
        <h2 className="og-serif" style={{ fontSize: 30, fontWeight: 700, color: C.black }}>{title}</h2>
      </div>
      {right}
    </div>
  );
}
function Loading({ label = "Loading..." }) {
  return <div className="flex items-center gap-2 og-sans text-sm py-16 justify-center" style={{ color: C.textMuted }}><Loader2 size={16} className="animate-spin" />{label}</div>;
}
function ErrorBox({ message }) {
  return <div className="og-sans text-sm py-6 px-4 text-center" style={{ color: "#B23A3A", background: "#FBEAEA", border: "1px solid #F0C6C6" }}>{message}</div>;
}

function TopBar({ setView, cartCount, user, logout, query, setQuery, categories }) {
  return (
    <div style={{ background: C.white, borderBottom: `1px solid ${C.line}` }}>
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
        <Logo size={38} onClick={() => setView({ name: "home" })} />
        <div className="hidden md:flex flex-1 items-center gap-2 mx-6">
          <div className="flex-1 flex items-center gap-2 px-4 py-2" style={{ border: `1px solid ${C.line}`, background: C.off }}>
            <Search size={16} color={C.textMuted} />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products, brands..." className="og-sans flex-1 bg-transparent outline-none text-sm" />
          </div>
        </div>
        <div className="flex items-center gap-4 ml-auto">
          {user ? (
            <>
              {user.role === "seller" && <button onClick={() => setView({ name: "seller" })} title="Seller dashboard"><Store size={19} color={C.black} /></button>}
              {user.role === "admin" && <button onClick={() => setView({ name: "admin" })} title="Admin dashboard"><Settings size={19} color={C.black} /></button>}
              <button onClick={() => setView({ name: "account" })} title="Account"><User size={20} color={C.black} /></button>
              <button onClick={() => setView({ name: "wishlist" })} title="Wishlist"><Heart size={20} color={C.black} /></button>
              <button onClick={() => setView({ name: "cart" })} className="relative" title="Cart">
                <ShoppingCart size={20} color={C.black} />
                {cartCount > 0 && <span className="og-sans absolute -top-2 -right-2 flex items-center justify-center text-[10px] font-bold rounded-full" style={{ width: 16, height: 16, background: C.gold, color: C.black }}>{cartCount}</span>}
              </button>
              <button onClick={logout} title="Log out"><LogOut size={18} color={C.textMuted} /></button>
            </>
          ) : (
            <GoldButton small onClick={() => setView({ name: "login" })}>Log In</GoldButton>
          )}
        </div>
      </div>
      <div className="hidden md:block" style={{ background: C.black }}>
        <div className="max-w-6xl mx-auto px-4 flex items-center gap-6 py-2.5 og-scrollbar overflow-x-auto">
          {categories.map((c) => (
            <button key={c.id} onClick={() => setView({ name: "category", id: c.id })} className="og-sans text-xs whitespace-nowrap" style={{ color: C.goldLight }}>{c.name}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product, setView, addToCart, wishlist, toggleWishlist }) {
  const isWished = wishlist.includes(product.id);
  return (
    <div style={{ border: `1px solid ${C.line}` }}>
      <button onClick={() => setView({ name: "product", id: product.id })} className="w-full block relative">
        <ProductImage product={product} className="w-full h-40 md:h-48" />
        <span onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }} className="absolute top-2 right-2 p-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.9)" }}>
          <Heart size={14} fill={isWished ? C.gold : "none"} color={C.gold} />
        </span>
      </button>
      <div className="p-3">
        <div className="og-sans text-[10px] og-tracked" style={{ color: C.textMuted }}>{product.brand}</div>
        <button onClick={() => setView({ name: "product", id: product.id })} className="og-serif text-left block" style={{ fontSize: 16, fontWeight: 600, color: C.black }}>{product.name}</button>
        <div className="flex items-center gap-1.5 mt-1">
          <Stars rating={product.rating} size={11} />
          <span className="og-sans text-[10px]" style={{ color: C.textMuted }}>{product.rating ? `(${product.reviewCount})` : "No reviews yet"}</span>
        </div>
        <div className="mt-2"><span className="og-serif font-bold" style={{ color: C.black, fontSize: 18 }}>{cents(product.price_cents)}</span></div>
        <button onClick={() => addToCart(product)} className="og-sans mt-3 w-full py-2 text-xs font-semibold flex items-center justify-center gap-1.5" style={{ background: C.black, color: C.goldLight }}>
          <ShoppingCart size={13} /> Add to Cart
        </button>
      </div>
    </div>
  );
}
