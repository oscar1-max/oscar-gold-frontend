import React, { useState, useEffect, useCallback } from "react";
import {
  Search, ShoppingCart, Heart, User, Star, ChevronRight, Plus, Minus, check,
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
            <button onClick={() => toggleWishlist(product.id)} className="p-3" style={{ border: `1px solid ${C.line}` }}>
              <Heart size={18} fill={wishlist.includes(product.id) ? C.gold : "none"} color={C.gold} />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-8 pt-6" style={{ borderTop: `1px solid ${C.line}` }}>
            <div className="og-sans text-[11px] flex flex-col items-center text-center gap-1.5" style={{ color: C.textMuted }}><Truck size={18} color={C.gold} /> Fast delivery</div>
            <div className="og-sans text-[11px] flex flex-col items-center text-center gap-1.5" style={{ color: C.textMuted }}><ShieldCheck size={18} color={C.gold} /> Buyer protection</div>
            <div className="og-sans text-[11px] flex flex-col items-center text-center gap-1.5" style={{ color: C.textMuted }}><MessageCircle size={18} color={C.gold} /> Message seller</div>
          </div>
        </div>
      </div>

      <div className="mt-16 max-w-2xl">
        <SectionTitle title="Customer Reviews" />
        <div className="flex gap-2 items-center mb-6">
          <select value={reviewRating} onChange={(e) => setReviewRating(+e.target.value)} className="og-sans text-xs px-2 py-2" style={{ border: `1px solid ${C.line}` }}>
            {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} stars</option>)}
          </select>
          <input value={reviewText} onChange={(e) => setReviewText(e.target.value)} placeholder={user ? "Write a review..." : "Log in to write a review"} className="og-sans text-sm flex-1 px-3 py-2" style={{ border: `1px solid ${C.line}` }} />
          <GoldButton small onClick={submitReview} disabled={submittingReview}>Post</GoldButton>
        </div>
        <div className="space-y-5">
          {reviews.map((r) => (
            <div key={r.id} className="pb-5" style={{ borderBottom: `1px solid ${C.line}` }}>
              <div className="flex items-center justify-between"><span className="og-sans text-sm font-semibold" style={{ color: C.black }}>{r.buyer_name}</span><Stars rating={r.rating} size={12} /></div>
              {r.text && <p className="og-sans text-sm mt-1" style={{ color: C.textMuted }}>{r.text}</p>}
            </div>
          ))}
          {reviews.length === 0 && <div className="og-sans text-sm" style={{ color: C.textMuted }}>No reviews yet — be the first.</div>}
        </div>
      </div>
    </div>
  );
    }
function CartPage({ setView, user, refreshCartCount }) {
  const [cart, setCart] = useState({ items: [], savedForLater: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    api.getCart().then(setCart).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }, []);

  useEffect(() => { if (user) load(); }, [user, load]);

  if (!user) return <div className="max-w-6xl mx-auto px-4 py-16 text-center og-sans text-sm" style={{ color: C.textMuted }}>Log in to view your cart. <button onClick={() => setView({ name: "login" })} className="underline" style={{ color: C.gold }}>Log in</button></div>;
  if (loading) return <Loading />;
  if (error) return <ErrorBox message={error} />;

  const updateQty = async (itemId, quantity) => { await api.updateCartItem(itemId, { quantity }); load(); refreshCartCount(); };
  const removeItem = async (itemId) => { await api.removeCartItem(itemId); load(); refreshCartCount(); };
  const saveForLater = async (itemId) => { await api.updateCartItem(itemId, { savedForLater: true }); load(); refreshCartCount(); };
  const moveToCart = async (itemId) => { await api.updateCartItem(itemId, { savedForLater: false }); load(); refreshCartCount(); };

  const subtotal = cart.items.reduce((s, i) => s + i.price_cents * i.quantity, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <SectionTitle title="Your Cart" />
      {cart.items.length === 0 ? (
        <div className="og-sans text-sm py-16 text-center" style={{ color: C.textMuted }}>Your cart is empty. <button onClick={() => setView({ name: "home" })} className="underline" style={{ color: C.gold }}>Continue shopping</button></div>
      ) : (
        <div className="grid md:grid-cols-3 gap-10">
          <div className="md:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <div key={item.id} className="flex gap-4 p-3" style={{ border: `1px solid ${C.line}` }}>
                <ProductImage product={item} className="w-24 h-24 shrink-0" iconSize={22} />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="og-serif font-semibold" style={{ color: C.black, fontSize: 16 }}>{item.name}</div>
                      <div className="og-sans text-xs mt-0.5" style={{ color: C.textMuted }}>{item.color && `Colour: ${item.color}`} {item.size && ` · Size: ${item.size}`}</div>
                    </div>
                    <button onClick={() => removeItem(item.id)}><Trash2 size={15} color={C.textMuted} /></button>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center" style={{ border: `1px solid ${C.line}` }}>
                      <button onClick={() => updateQty(item.id, Math.max(1, item.quantity - 1))} className="p-1.5"><Minus size={12} /></button>
                      <span className="og-sans w-7 text-center text-xs">{item.quantity}</span>
                      <button onClick={() => updateQty(item.id, item.quantity + 1)} className="p-1.5"><Plus size={12} /></button>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={() => saveForLater(item.id)} className="og-sans text-[11px] underline" style={{ color: C.textMuted }}>Save for later</button>
                      <span className="og-serif font-bold" style={{ color: C.black }}>{cents(item.price_cents * item.quantity)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {cart.savedForLater.length > 0 && (
              <div className="pt-6">
                <div className="og-sans text-xs font-semibold mb-3" style={{ color: C.black }}>SAVED FOR LATER</div>
                {cart.savedForLater.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-3 mb-2" style={{ border: `1px solid ${C.line}` }}>
                    <ProductImage product={item} className="w-14 h-14 shrink-0" iconSize={14} />
                    <div className="flex-1 og-sans text-sm" style={{ color: C.black }}>{item.name}</div>
                    <button onClick={() => moveToCart(item.id)} className="og-sans text-[11px] underline" style={{ color: C.gold }}>Move to cart</button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="h-fit p-5" style={{ background: C.off, border: `1px solid ${C.line}` }}>
            <div className="og-sans text-sm flex justify-between mb-2" style={{ color: C.textMuted }}><span>Subtotal</span><span>{cents(subtotal)}</span></div>
            <div className="og-serif flex justify-between mt-4 pt-4 font-bold" style={{ borderTop: `1px solid ${C.line}`, color: C.black, fontSize: 20 }}><span>Total (before shipping)</span><span>{cents(subtotal)}</span></div>
            <GoldButton full onClick={() => setView({ name: "checkout" })} disabled={cart.items.length === 0}>Proceed to Checkout</GoldButton>
          </div>
        </div>
      )}
    </div>
  );
}

function CheckoutPage({ setView, refreshCartCount }) {
  const [form, setForm] = useState({ full_name: "", phone: "", line1: "", city: "", postal_code: "", country: "US" });
  const [shippingMethod, setShippingMethod] = useState("Standard");
  const [shippingCents, setShippingCents] = useState(699);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const placeOrder = async () => {
    setPlacing(true);
    setError(null);
    try {
      const res = await api.checkout({ address: form, shippingMethod, shippingCents, paymentMethod });
      if (paymentMethod === "card") {
        try {
          const intent = await api.createPaymentIntent(res.paymentId);
          setResult({ ...res, clientSecret: intent.clientSecret });
        } catch (e) {
          setResult({ ...res, stripeError: e.message });
        }
      } else {
        setResult(res);
      }
      refreshCartCount();
    } catch (e) { setError(e.message); }
    setPlacing(false);
  };

  if (result) {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <div className="mx-auto mb-5 flex items-center justify-center rounded-full" style={{ width: 60, height: 60, background: C.black }}><Check color={C.gold} size={26} /></div>
        <h2 className="og-serif" style={{ fontSize: 28, fontWeight: 700, color: C.black }}>Order Created</h2>
        <p className="og-sans text-sm mt-2" style={{ color: C.textMuted }}>Order #{result.order.id.slice(0, 8)} — status: {result.order.status}.</p>
        {paymentMethod === "card" && result.clientSecret && (
          <p className="og-sans text-xs mt-3" style={{ color: C.textMuted }}>A Stripe payment intent was created. To actually capture the card, add Stripe Elements to this page and confirm the intent client-side — see the backend README.</p>
        )}
        {result.stripeError && <ErrorBox message={`Order was created, but the payment intent failed: ${result.stripeError}. Check STRIPE_SECRET_KEY in the backend .env.`} />}
        {paymentMethod !== "card" && <p className="og-sans text-xs mt-3" style={{ color: C.textMuted }}>Payment is pending admin confirmation (bank/mobile payments are verified manually).</p>}
        <GoldButton style={{ marginTop: 24 }} onClick={() => setView({ name: "home" })}>Continue Shopping</GoldButton>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <SectionTitle title="Checkout" />
      {error && <div className="mb-4"><ErrorBox message={error} /></div>}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-3">
          <div className="og-sans text-xs font-semibold" style={{ color: C.black }}>DELIVERY ADDRESS</div>
          <input className="og-sans text-sm px-3 py-2.5 w-full" placeholder="Full name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} style={{ border: `1px solid ${C.line}` }} />
          <input className="og-sans text-sm px-3 py-2.5 w-full" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} style={{ border: `1px solid ${C.line}` }} />
          <input className="og-sans text-sm px-3 py-2.5 w-full" placeholder="Address" value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} style={{ border: `1px solid ${C.line}` }} />
          <div className="grid grid-cols-2 gap-3">
            <input className="og-sans text-sm px-3 py-2.5" placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} style={{ border: `1px solid ${C.line}` }} />
            <input className="og-sans text-sm px-3 py-2.5" placeholder="ZIP" value={form.postal_code} onChange={(e) => setForm({ ...form, postal_code: e.target.value })} style={{ border: `1px solid ${C.line}` }} />
          </div>

          <div className="og-sans text-xs font-semibold pt-4" style={{ color: C.black }}>SHIPPING</div>
          {[["Standard (3–5 days)", 699], ["Express (1–2 days)", 1499]].map(([label, price]) => (
            <label key={label} className="flex items-center justify-between p-3 cursor-pointer" style={{ border: `1px solid ${C.line}` }}>
              <span className="flex items-center gap-2 og-sans text-sm" style={{ color: C.black }}><input type="radio" checked={shippingMethod === label} onChange={() => { setShippingMethod(label); setShippingCents(price); }} style={{ accentColor: C.gold }} />{label}</span>
              <span className="og-sans text-sm" style={{ color: C.textMuted }}>{cents(price)}</span>
            </label>
          ))}

          <div className="og-sans text-xs font-semibold pt-4" style={{ color: C.black }}>PAYMENT</div>
          {[["card", "Credit / Debit Card", CreditCard], ["bank", "Bank Transfer", Building2], ["mobile", "Mobile Payment", Smartphone]].map(([id, label, Icon]) => (
            <label key={id} className="flex items-center gap-3 p-3 cursor-pointer" style={{ border: `1px solid ${paymentMethod === id ? C.gold : C.line}` }} onClick={() => setPaymentMethod(id)}>
              <input type="radio" checked={paymentMethod === id} readOnly style={{ accentColor: C.gold }} /><Icon size={16} color={C.gold} /><span className="og-sans text-sm" style={{ color: C.black }}>{label}</span>
            </label>
          ))}
          <div className="og-sans text-[11px] flex items-center gap-1.5 pt-1" style={{ color: C.textMuted }}><ShieldCheck size={13} color={C.gold} /> Card capture uses Stripe — configure your Stripe keys in the backend .env.</div>
          <GoldButton full disabled={placing} onClick={placeOrder}>{placing ? "Placing order..." : "Place Order"}</GoldButton>
        </div>
      </div>
    </div>
  );
                                     }                                                                 }
