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
