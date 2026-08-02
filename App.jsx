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

function Home({ setView, addToCart, wishlist, toggleWishlist, query, categories }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    api.products(query ? { q: query } : {})
      .then(setProducts)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <div>
      <div style={{ background: C.black }}>
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="og-sans og-tracked text-xs mb-4" style={{ color: C.gold }}>ELEVATE YOUR EVERYDAY</div>
            <h1 className="og-serif" style={{ fontSize: 48, lineHeight: 1.05, color: C.white, fontWeight: 700 }}>Curated goods,<br /><span style={{ color: C.gold }}>gilded</span> in quality.</h1>
            <div className="mt-8"><GoldButton onClick={() => setView({ name: "category", id: "all" })} icon={ArrowRight}>Shop Now</GoldButton></div>
          </div>
          <div className="hidden md:flex justify-center">
            <div className="rounded-full flex items-center justify-center" style={{ width: 260, height: 260, border: `1px solid ${C.gold}` }}>
              <span className="og-serif" style={{ color: C.gold, fontSize: 80, fontWeight: 700 }}>OG</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-3 md:grid-cols-6 gap-3">
        {categories.map((c) => (
          <button key={c.id} onClick={() => setView({ name: "category", id: c.id })} className="flex flex-col items-center gap-2 py-5" style={{ border: `1px solid ${C.line}` }}>
            <span className="og-sans text-xs font-medium" style={{ color: C.black }}>{c.name}</span>
          </button>
        ))}
      </div>

      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center gap-3 px-5 py-3 mb-8" style={{ background: C.off, border: `1px solid ${C.line}` }}>
          <Sparkles size={16} color={C.gold} />
          <span className="og-sans text-xs" style={{ color: C.textMuted }}>Live data from your Oscar Gold Store API — every product below is coming straight from the database.</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-16">
        <SectionTitle eyebrow="This Week" title={query ? `Results for "${query}"` : "Featured Products"} />
        {loading && <Loading />}
        {error && <ErrorBox message={`Couldn't load products: ${error}. Is the backend running?`} />}
        {!loading && !error && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {products.map((p) => <ProductCard key={p.id} product={p} setView={setView} addToCart={addToCart} wishlist={wishlist} toggleWishlist={toggleWishlist} />)}
            {products.length === 0 && <div className="col-span-4 og-sans text-sm text-center py-10" style={{ color: C.textMuted }}>No products found. Run `npm run seed` in the backend if the catalog is empty.</div>}
          </div>
        )}
      </div>
    </div>
  );
}

function CategoryPage({ id, setView, addToCart, wishlist, toggleWishlist, categories }) {
  const [activeCat, setActiveCat] = useState(id);
  const [priceMax, setPriceMax] = useState(500);
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState("relevance");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => setActiveCat(id), [id]);

  useEffect(() => {
    setLoading(true);
    api.products({
      category: activeCat === "all" ? undefined : activeCat,
      maxPrice: priceMax,
      minRating: minRating || undefined,
      sort: sort === "relevance" ? undefined : sort,
    }).then(setProducts).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }, [activeCat, priceMax, minRating, sort]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center gap-1 og-sans text-xs mb-6" style={{ color: C.textMuted }}>
        <button onClick={() => setView({ name: "home" })}>Home</button><ChevronRight size={12} />
        <span style={{ color: C.black }}>{activeCat === "all" ? "All Products" : categories.find((c) => c.id === activeCat)?.name}</span>
      </div>
      <div className="grid md:grid-cols-4 gap-8">
        <div className="md:col-span-1 space-y-6">
          <div>
            <div className="og-sans text-xs font-semibold mb-2" style={{ color: C.black }}>CATEGORY</div>
            <div className="flex flex-wrap gap-2">
              <Pill active={activeCat === "all"} onClick={() => setActiveCat("all")}>All</Pill>
              {categories.map((c) => <Pill key={c.id} active={activeCat === c.id} onClick={() => setActiveCat(c.id)}>{c.name}</Pill>)}
            </div>
          </div>
          <div>
            <div className="og-sans text-xs font-semibold mb-2" style={{ color: C.black }}>MAX PRICE: ${priceMax}</div>
            <input type="range" min={20} max={500} value={priceMax} onChange={(e) => setPriceMax(+e.target.value)} className="w-full" style={{ accentColor: C.gold }} />
          </div>
          <div>
            <div className="og-sans text-xs font-semibold mb-2" style={{ color: C.black }}>MIN RATING</div>
            <div className="flex gap-2">{[0, 4, 4.5].map((r) => <Pill key={r} active={minRating === r} onClick={() => setMinRating(r)}>{r === 0 ? "Any" : `${r}+`}</Pill>)}</div>
          </div>
        </div>
        <div className="md:col-span-3">
          <div className="flex items-center justify-between mb-5">
            <span className="og-sans text-xs" style={{ color: C.textMuted }}>{products.length} results</span>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="og-sans text-xs px-2 py-1.5" style={{ border: `1px solid ${C.line}` }}>
              <option value="relevance">Sort: Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
          {loading && <Loading />}
          {error && <ErrorBox message={error} />}
          {!loading && !error && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
              {products.map((p) => <ProductCard key={p.id} product={p} setView={setView} addToCart={addToCart} wishlist={wishlist} toggleWishlist={toggleWishlist} />)}
              {products.length === 0 && <div className="og-sans text-sm text-center py-16 col-span-3" style={{ color: C.textMuted }}>No products match these filters.</div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ProductDetail({ id, setView, addToCart, wishlist, toggleWishlist, user }) {
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [color, setColor] = useState(null);
  const [size, setSize] = useState(null);
  const [qty, setQty] = useState(1);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([api.product(id), api.reviews(id)])
      .then(([p, r]) => { setProduct(p); setReviews(r); setColor(p.variants.find((v) => v.color)?.color || null); setSize(p.variants.find((v) => v.size)?.size || null); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loading />;
  if (error || !product) return <ErrorBox message={error || "Product not found"} />;

  const colors = [...new Set(product.variants.map((v) => v.color).filter(Boolean))];
  const sizes = [...new Set(product.variants.map((v) => v.size).filter(Boolean))];
  const variant = product.variants.find((v) => (!colors.length || v.color === color) && (!sizes.length || v.size === size)) || product.variants[0];

  const submitReview = async () => {
    if (!user) return setView({ name: "login" });
    setSubmittingReview(true);
    try {
      await api.addReview(id, { rating: reviewRating, text: reviewText });
      setReviews(await api.reviews(id));
      setReviewText("");
    } catch (e) { alert(e.message); }
    setSubmittingReview(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center gap-1 og-sans text-xs mb-6" style={{ color: C.textMuted }}>
        <button onClick={() => setView({ name: "home" })}>Home</button><ChevronRight size={12} /> <span style={{ color: C.black }}>{product.name}</span>
      </div>
      <div className="grid md:grid-cols-2 gap-10">
        <ProductImage product={product} className="w-full h-80 md:h-96" iconSize={70} />
        <div>
          <div className="og-sans text-xs og-tracked" style={{ color: C.gold }}>{product.brand}</div>
          <h1 className="og-serif" style={{ fontSize: 32, fontWeight: 700, color: C.black }}>{product.name}</h1>
          <div className="flex items-center gap-2 mt-2">
            <Stars rating={product.rating} />
            <span className="og-sans text-xs" style={{ color: C.textMuted }}>{product.rating ? `${product.rating} · ${product.reviewCount} reviews` : "No reviews yet"}</span>
          </div>
          <div className="mt-4"><span className="og-serif font-bold" style={{ fontSize: 30, color: C.black }}>{cents(product.price_cents)}</span></div>
          <p className="og-sans text-sm mt-4 leading-relaxed" style={{ color: C.textMuted }}>{product.description}</p>

          {colors.length > 0 && <div className="mt-6"><div className="og-sans text-xs font-semibold mb-2" style={{ color: C.black }}>COLOUR</div><div className="flex gap-2">{colors.map((c) => <Pill key={c} active={color === c} onClick={() => setColor(c)}>{c}</Pill>)}</div></div>}
          {sizes.length > 0 && <div className="mt-4"><div className="og-sans text-xs font-semibold mb-2" style={{ color: C.black }}>SIZE</div><div className="flex gap-2 flex-wrap">{sizes.map((s) => <Pill key={s} active={size === s} onClick={() => setSize(s)}>{s}</Pill>)}</div></div>}

          <div className="og-sans text-xs mt-4 flex items-center gap-1.5" style={{ color: variant?.stock > 10 ? "#3B7A3B" : C.gold }}>
            <Check size={13} /> {variant?.stock > 0 ? `${variant.stock} in stock` : "Out of stock"} — sold by {product.seller_name}
          </div>

          <div className="flex items-center gap-4 mt-6">
            <div className="flex items-center" style={{ border: `1px solid ${C.line}` }}>
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-3"><Minus size={14} /></button>
              <span className="og-sans w-8 text-center text-sm">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="p-3"><Plus size={14} /></button>
            </div>
            <GoldButton icon={ShoppingCart} onClick={() => addToCart(product, variant, qty)} disabled={!variant || variant.stock === 0}>Add to Cart</GoldButton>
            <button onClick={() => toggleWishlist(product.id)} className="p-3" style=
