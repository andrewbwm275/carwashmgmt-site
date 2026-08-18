/**
 * Site interactivity: nav, FAQ, forms, sticky CTA, chemistry cart, calculator
 */
(function () {
  "use strict";

  function ready(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }

  function $(sel, root) {
    return (root || document).querySelector(sel);
  }
  function $$(sel, root) {
    return [...(root || document).querySelectorAll(sel)];
  }

  /* ---------- Nav mega / dropdown ---------- */
  function initNav() {
    $$("[data-nav-mega], [data-nav-drop]").forEach((wrap) => {
      let timer = null;
      const open = () => {
        clearTimeout(timer);
        wrap.classList.add("is-open");
      };
      const close = () => {
        timer = setTimeout(() => wrap.classList.remove("is-open"), 120);
      };
      wrap.addEventListener("mouseenter", open);
      wrap.addEventListener("mouseleave", close);
      wrap.addEventListener("focusin", open);
      wrap.addEventListener("focusout", close);
    });
  }

  /* ---------- Mobile nav ---------- */
  function initMobile() {
    const panel = $("#cwm-mobile-nav");
    const openBtn = $("[data-mobile-toggle]");
    if (!panel || !openBtn) return;
    const open = () => {
      panel.hidden = false;
      panel.classList.add("is-open");
      document.body.style.overflow = "hidden";
    };
    const close = () => {
      panel.hidden = true;
      panel.classList.remove("is-open");
      document.body.style.overflow = "";
    };
    openBtn.addEventListener("click", open);
    panel.querySelector("[data-mobile-close]")?.addEventListener("click", close);
    $$("a", panel).forEach((a) => a.addEventListener("click", close));
  }

  /* ---------- Sticky CTA ---------- */
  function initSticky() {
    const el = $("[data-sticky-cta]");
    const footer = $(".cwm-footer");
    if (!el) return;
    const onScroll = () => {
      const footerInView =
        footer && footer.getBoundingClientRect().top < window.innerHeight - 24;
      if (window.scrollY > 480 && !footerInView) el.classList.add("is-visible");
      else el.classList.remove("is-visible");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- FAQ ---------- */
  function initFaq() {
    $$("[data-faq-btn]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const item = btn.closest("[data-faq-item]");
        const panel = item?.querySelector("[data-faq-panel]");
        if (!panel) return;
        const open = panel.hasAttribute("hidden");
        const list = item.parentElement;
        if (list) {
          $$("[data-faq-panel]", list).forEach((p) => p.setAttribute("hidden", ""));
          $$("[data-faq-btn] svg", list).forEach((s) => {
            s.style.transform = "rotate(0deg)";
          });
        }
        if (open) {
          panel.removeAttribute("hidden");
          const chev = btn.querySelector("svg");
          if (chev) chev.style.transform = "rotate(180deg)";
        }
      });
    });
  }

  /* ---------- Forms ---------- */
  function fieldValues(form) {
    const data = {};
    $$("input, textarea, select", form).forEach((el) => {
      const key = el.name || el.id;
      if (!key) return;
      if (el.type === "checkbox") {
        if (!data[key]) data[key] = [];
        if (el.checked) data[key].push(el.value || "on");
      } else {
        data[key] = el.value;
      }
    });
    return data;
  }

  async function postForm(form, endpoint) {
    const btn = form.querySelector('[type="submit"], button:not([type="button"])');
    const original = btn ? btn.innerHTML : "";
    if (btn) {
      btn.disabled = true;
      btn.textContent = "Sending…";
    }
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fieldValues(form)),
      });
      if (btn) btn.textContent = res.ok ? "Sent — thank you!" : "Something went wrong";
      if (res.ok) form.reset();
    } catch {
      if (btn) btn.textContent = "Network error";
    }
    setTimeout(() => {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = original;
      }
    }, 2500);
  }

  function initForms() {
    $$("form[data-form]").forEach((form) => {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const kind = form.getAttribute("data-form");
        const map = {
          guide: "/api/guide",
          newsletter: "/api/newsletter",
          contact: "/api/contact",
          testimonial: "/api/testimonial",
          calculator: "/api/calculator",
          quote: "/api/quote",
        };
        postForm(form, map[kind] || form.action || "/api/contact");
      });
    });
  }

  /* ---------- Chemistry cart ---------- */
  const CART_KEY = "cwm_quote_cart";

  function readCart() {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    } catch {
      return [];
    }
  }
  function writeCart(items) {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
    renderCart();
  }

  function money(n) {
    if (n == null || Number.isNaN(n)) return "Quote";
    return "$" + Number(n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function renderCart() {
    const items = readCart();
    const fab = $("#cwm-cart-fab");
    const list = $("#cwm-cart-items");
    const count = $("#cwm-cart-count");
    if (fab) {
      if (items.length) {
        fab.hidden = false;
        fab.textContent = `Quote Cart (${items.length})`;
      } else {
        fab.hidden = true;
      }
    }
    if (count) count.textContent = String(items.length);
    if (list) {
      if (!items.length) {
        list.innerHTML = '<p class="text-sm text-slate-500 p-4">Your quote cart is empty.</p>';
      } else {
        list.innerHTML = items
          .map(
            (it, i) => `
          <div class="flex gap-3 p-4 border-b border-slate-100" data-cart-i="${i}">
            <div class="flex-1">
              <div class="text-sm font-bold text-slate-900">${it.name}</div>
              <div class="text-xs text-slate-500">${it.size} · ${money(it.price)}</div>
            </div>
            <button type="button" class="text-xs text-red-500" data-cart-remove="${i}">Remove</button>
          </div>`
          )
          .join("");
      }
    }
  }

  function initChemistry() {
    if (document.body.getAttribute("data-page") !== "chemistry") return;

    // Filters
    $$("[data-chem-filter]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const cat = btn.getAttribute("data-chem-filter");
        $$("[data-chem-filter]").forEach((b) => {
          b.classList.remove("bg-[#0779ef]", "text-white", "border-[#0779ef]");
          b.classList.add("border-slate-200", "text-slate-600");
        });
        btn.classList.add("bg-[#0779ef]", "text-white", "border-[#0779ef]");
        btn.classList.remove("border-slate-200", "text-slate-600");
        $$("[data-product-card]").forEach((card) => {
          const c = card.getAttribute("data-category");
          card.style.display = cat === "all" || c === cat ? "" : "none";
        });
      });
    });

    // Size toggles
    $$("[data-product-card]").forEach((card) => {
      const priceEl = card.querySelector("[data-price]");
      const prices = JSON.parse(card.getAttribute("data-prices") || "{}");
      $$("[data-size]", card).forEach((btn) => {
        btn.addEventListener("click", () => {
          $$("[data-size]", card).forEach((b) => {
            b.classList.remove("bg-[#0779ef]", "text-white", "border-[#0779ef]");
            b.classList.add("border-slate-200", "text-slate-600");
          });
          btn.classList.add("bg-[#0779ef]", "text-white", "border-[#0779ef]");
          btn.classList.remove("border-slate-200", "text-slate-600");
          const size = btn.getAttribute("data-size");
          card.setAttribute("data-selected-size", size);
          if (priceEl) priceEl.textContent = money(prices[size]);
        });
      });
    });

    // Add to cart
    $$("[data-add-cart]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const card = btn.closest("[data-product-card]");
        if (!card) return;
        const prices = JSON.parse(card.getAttribute("data-prices") || "{}");
        const size = card.getAttribute("data-selected-size") || "5 GAL";
        const items = readCart();
        items.push({
          slug: card.getAttribute("data-slug"),
          name: card.getAttribute("data-name"),
          size,
          price: prices[size],
        });
        writeCart(items);
        btn.textContent = "Added ✓";
        setTimeout(() => {
          btn.textContent = "Add to Cart";
        }, 1200);
      });
    });

    // Cart UI
    const drawer = $("#cwm-quote-cart");
    const fab = $("#cwm-cart-fab");
    fab?.addEventListener("click", () => drawer?.classList.add("open"));
    $("[data-cart-close]")?.addEventListener("click", () => drawer?.classList.remove("open"));
    document.addEventListener("click", (e) => {
      const t = e.target;
      if (t && t.matches && t.matches("[data-cart-remove]")) {
        const i = Number(t.getAttribute("data-cart-remove"));
        const items = readCart();
        items.splice(i, 1);
        writeCart(items);
      }
    });

    const quoteForm = $("#cwm-quote-form");
    quoteForm?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const items = readCart();
      if (!items.length) {
        alert("Add products to your quote cart first.");
        return;
      }
      const data = fieldValues(quoteForm);
      data.items = items;
      const btn = quoteForm.querySelector('[type="submit"]');
      const original = btn?.innerHTML;
      if (btn) {
        btn.disabled = true;
        btn.textContent = "Sending…";
      }
      try {
        const res = await fetch("/api/quote", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (res.ok) {
          writeCart([]);
          quoteForm.reset();
          if (btn) btn.textContent = "Quote requested!";
          drawer?.classList.remove("open");
        } else if (btn) btn.textContent = "Error — try again";
      } catch {
        if (btn) btn.textContent = "Network error";
      }
      setTimeout(() => {
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = original;
        }
      }, 2500);
    });

    renderCart();
  }

  /* ---------- Calculator ---------- */
  function calculateSavings(data) {
    const cars = Number(data.cars_per_month) || 0;
    const waterCostPer1000 = Number(data.water_cost_per_1000) || 0;
    const gallonsPerCar = Number(data.gallons_per_car) || 0;
    const chemicalSpend = Number(data.chemical_spend_monthly) || 0;
    const downtime = Number(data.downtime_hours) || 0;
    const currentWaterGallons = cars * gallonsPerCar;
    const currentWaterCost = (currentWaterGallons / 1000) * waterCostPer1000;
    const waterSavingsRate = data.reclaim_status === "yes" ? 0.25 : 0.4;
    const water_savings_monthly = Math.round(currentWaterCost * waterSavingsRate);
    const chemical_savings_monthly = Math.round(chemicalSpend * 0.3);
    const avgRevenuePerHour = (cars * 12) / (30 * 12) || 0;
    const maintenance_savings_monthly = Math.round(downtime * avgRevenuePerHour * 0.6 + 200);
    const total_monthly =
      water_savings_monthly + chemical_savings_monthly + maintenance_savings_monthly;
    const total_annual = total_monthly * 12;
    const roi_months = Math.max(2, Math.round(18000 / Math.max(total_monthly, 1)));
    let confidence = 50;
    if (data.wash_type) confidence += 10;
    if (cars) confidence += 10;
    if (waterCostPer1000) confidence += 10;
    if (gallonsPerCar) confidence += 5;
    if (chemicalSpend) confidence += 5;
    if (downtime) confidence += 5;
    if (data.reclaim_status) confidence += 5;
    return {
      water_savings_monthly,
      chemical_savings_monthly,
      maintenance_savings_monthly,
      total_monthly,
      total_annual,
      roi_months,
      confidence: Math.min(confidence, 100),
    };
  }

  function initCalculator() {
    if (document.body.getAttribute("data-page") !== "calculator") return;
    const root = $("[data-calculator]");
    if (!root) return;

    let step = 1;
    const inputs = {
      wash_type: "",
      cars_per_month: 5000,
      water_cost_per_1000: 6,
      gallons_per_car: 40,
      chemical_spend_monthly: 5000,
      downtime_hours: 0,
      reclaim_status: "",
      water_bill: 3500,
      pit_cleaning: 0,
      maintenance_cost: 1500,
    };

    function showStep(n) {
      step = n;
      $$("[data-calc-step]").forEach((el) => {
        const s = Number(el.getAttribute("data-calc-step"));
        if (s === n) el.removeAttribute("hidden");
        else el.setAttribute("hidden", "");
      });
      $$("[data-step-indicator]").forEach((el) => {
        const s = Number(el.getAttribute("data-step-indicator"));
        const active = s <= n;
        el.classList.toggle("bg-blue-600", active);
        el.classList.toggle("text-white", active);
        el.classList.toggle("bg-slate-100", !active);
        el.classList.toggle("text-slate-400", !active);
      });
      $$("[data-step-label]").forEach((el) => {
        const s = Number(el.getAttribute("data-step-label"));
        el.classList.toggle("text-slate-900", s <= n);
        el.classList.toggle("text-slate-400", s > n);
      });
    }

    function readStep1() {
      inputs.cars_per_month = Number($('[name="cars_per_month"]', root)?.value) || 0;
      inputs.water_bill = Number($('[name="water_bill"]', root)?.value) || 0;
      inputs.chemical_spend_monthly = Number($('[name="chemical_spend_monthly"]', root)?.value) || 0;
      inputs.pit_cleaning = Number($('[name="pit_cleaning"]', root)?.value) || 0;
      inputs.maintenance_cost = Number($('[name="maintenance_cost"]', root)?.value) || 0;
      // Derive water cost assumptions from bill if gallons known
      if (inputs.cars_per_month && inputs.gallons_per_car && inputs.water_bill) {
        const gallons = inputs.cars_per_month * inputs.gallons_per_car;
        inputs.water_cost_per_1000 = gallons ? (inputs.water_bill / gallons) * 1000 : 6;
      }
      inputs.downtime_hours = Math.max(0, Math.round(inputs.maintenance_cost / 200));
    }

    function validateStep1() {
      readStep1();
      return (
        inputs.cars_per_month > 0 &&
        inputs.water_bill > 0 &&
        inputs.chemical_spend_monthly > 0
      );
    }

    function updateCalcBtn() {
      const btn = $("[data-calc-next]", root);
      if (!btn) return;
      btn.disabled = !validateStep1();
    }

    $$("input", root).forEach((inp) => inp.addEventListener("input", updateCalcBtn));
    updateCalcBtn();

    $("[data-calc-next]", root)?.addEventListener("click", () => {
      if (!validateStep1()) return;
      showStep(2);
    });

    $("[data-calc-back]", root)?.addEventListener("click", () => showStep(1));

    $("#cwm-calc-lead")?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const form = e.target;
      const lead = fieldValues(form);
      readStep1();
      const results = calculateSavings(inputs);
      const btn = form.querySelector('[type="submit"]');
      if (btn) {
        btn.disabled = true;
        btn.textContent = "Calculating…";
      }
      try {
        await fetch("/api/calculator", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...lead, inputs, results }),
        });
      } catch (_) {}

      const out = $("[data-calc-results]");
      if (out) {
        out.innerHTML = `
          <div class="grid grid-cols-2 gap-4 mb-6">
            <div class="bg-blue-50 rounded-xl p-4"><div class="text-2xl font-black text-[#0779ef]">$${results.total_monthly.toLocaleString()}</div><div class="text-xs text-slate-500">est. monthly savings</div></div>
            <div class="bg-blue-50 rounded-xl p-4"><div class="text-2xl font-black text-[#0779ef]">$${results.total_annual.toLocaleString()}</div><div class="text-xs text-slate-500">est. annual savings</div></div>
            <div class="bg-slate-50 rounded-xl p-4"><div class="text-lg font-bold">${results.roi_months} mo</div><div class="text-xs text-slate-500">est. payback</div></div>
            <div class="bg-slate-50 rounded-xl p-4"><div class="text-lg font-bold">${results.confidence}%</div><div class="text-xs text-slate-500">confidence</div></div>
          </div>
          <ul class="text-sm text-slate-600 space-y-1 mb-6">
            <li>Water: $${results.water_savings_monthly.toLocaleString()}/mo</li>
            <li>Chemistry: $${results.chemical_savings_monthly.toLocaleString()}/mo</li>
            <li>Maintenance: $${results.maintenance_savings_monthly.toLocaleString()}/mo</li>
          </ul>
          <a href="/book-a-call" class="inline-flex w-full justify-center bg-[#0779ef] text-white font-bold py-3 rounded-xl">Book a free strategy call</a>
          <button type="button" data-calc-restart class="w-full mt-3 text-sm text-slate-500 underline">Recalculate</button>
        `;
        out.querySelector("[data-calc-restart]")?.addEventListener("click", () => showStep(1));
      }
      showStep(3);
      if (btn) {
        btn.disabled = false;
        btn.textContent = "Show My Savings";
      }
    });

    showStep(1);
  }

  ready(() => {
    initNav();
    initMobile();
    initSticky();
    initFaq();
    initForms();
    initChemistry();
    initCalculator();
  });
})();
