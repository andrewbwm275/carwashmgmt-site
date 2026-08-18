/**
 * Client interactivity for the live-snapshot Astro site.
 * Handles: mobile menu, nav dropdowns, FAQ accordion, forms, calculator.
 */
(function () {
  "use strict";

  const DROPDOWNS = {
    services: [
      { label: "Consultation", href: "/services" },
      { label: "Equipment", href: "/equipment" },
      { label: "Chemistry", href: "/chemistry" },
      { label: "Preventive Maintenance", href: "/preventive-maintenance" },
    ],
    results: [
      { label: "Testimonials", href: "/testimonials" },
      { label: "Case Study", href: "/results" },
    ],
  };

  const MOBILE_LINKS = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Services / Solutions", href: "/solutions" },
    { label: "Consultation", href: "/services" },
    { label: "Equipment", href: "/equipment" },
    { label: "Chemistry", href: "/chemistry" },
    { label: "Preventive Maintenance", href: "/preventive-maintenance" },
    { label: "Results", href: "/results" },
    { label: "Blog", href: "/blog" },
    { label: "Contact Us", href: "/contact" },
    { label: "Nano Bubble ROI Calculator", href: "/calculator" },
    { label: "Book a Call", href: "/book-a-call" },
  ];

  function $(sel, root) {
    return (root || document).querySelector(sel);
  }
  function $$(sel, root) {
    return [...(root || document).querySelectorAll(sel)];
  }

  /* ---------- Mobile menu ---------- */
  function initMobileMenu() {
    const toggle = $("[data-cwm-mobile-toggle]");
    if (!toggle) return;

    let panel = $("#cwm-mobile-panel");
    if (!panel) {
      panel = document.createElement("div");
      panel.id = "cwm-mobile-panel";
      panel.setAttribute("hidden", "");
      panel.style.cssText =
        "position:fixed;inset:0;z-index:10000;background:rgba(15,23,42,0.96);padding:80px 24px 24px;overflow:auto;";
      panel.innerHTML =
        '<button type="button" id="cwm-mobile-close" aria-label="Close menu" style="position:absolute;top:16px;right:16px;color:#fff;background:transparent;border:0;font-size:28px;cursor:pointer;">×</button>' +
        '<nav style="display:flex;flex-direction:column;gap:8px;">' +
        MOBILE_LINKS.map(
          (l) =>
            `<a href="${l.href}" style="color:#fff;padding:12px 8px;font-size:16px;font-weight:600;text-decoration:none;border-bottom:1px solid rgba(255,255,255,0.08);">${l.label}</a>`
        ).join("") +
        "</nav>";
      document.body.appendChild(panel);
    }

    function open() {
      panel.removeAttribute("hidden");
      document.body.style.overflow = "hidden";
    }
    function close() {
      panel.setAttribute("hidden", "");
      document.body.style.overflow = "";
    }

    toggle.addEventListener("click", open);
    panel.addEventListener("click", (e) => {
      if (e.target.id === "cwm-mobile-close" || e.target.tagName === "A") close();
    });
  }

  /* ---------- Nav dropdowns ---------- */
  function initDropdowns() {
    $$("[data-cwm-dropdown]").forEach((wrap) => {
      const key = wrap.getAttribute("data-cwm-dropdown");
      const items = DROPDOWNS[key];
      if (!items) return;

      let menu = wrap.querySelector(".cwm-dd-menu");
      if (!menu) {
        menu = document.createElement("div");
        menu.className = "cwm-dd-menu";
        menu.hidden = true;
        menu.style.cssText =
          "position:absolute;top:100%;left:0;padding-top:8px;z-index:50;min-width:220px;";
        menu.innerHTML =
          '<div style="background:#fff;border-radius:12px;box-shadow:0 12px 40px rgba(0,0,0,0.12);border:1px solid #e2e8f0;padding:8px;display:flex;flex-direction:column;">' +
          items
            .map(
              (i) =>
                `<a href="${i.href}" style="padding:10px 12px;border-radius:8px;font-size:14px;color:#0f172a;text-decoration:none;font-weight:500;" onmouseover="this.style.background='#eff6ff';this.style.color='#0779ef'" onmouseout="this.style.background='transparent';this.style.color='#0f172a'">${i.label}</a>`
            )
            .join("") +
          "</div>";
        wrap.appendChild(menu);
      }

      let timer = null;
      const open = () => {
        clearTimeout(timer);
        menu.hidden = false;
      };
      const close = () => {
        timer = setTimeout(() => {
          menu.hidden = true;
        }, 150);
      };
      wrap.addEventListener("mouseenter", open);
      wrap.addEventListener("mouseleave", close);
      wrap.addEventListener("focusin", open);
      wrap.addEventListener("focusout", close);
    });
  }

  /* ---------- FAQ accordion ---------- */
  function initFaqs() {
    $$("[data-cwm-faq]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const card = btn.parentElement;
        if (!card) return;
        let answer = card.querySelector("[data-faq-answer], .cwm-faq-answer");
        // Also try next sibling after button
        if (!answer) {
          const next = btn.nextElementSibling;
          if (next && /faq|answer|text-slate-600/i.test(next.className + next.getAttribute("data-faq-answer"))) {
            answer = next;
          }
        }
        if (!answer) return;

        const isOpen = !answer.hasAttribute("hidden") && !answer.classList.contains("hidden");
        // close siblings in same list
        const list = card.parentElement;
        if (list) {
          $$("[data-faq-answer], .cwm-faq-answer", list).forEach((a) => {
            a.setAttribute("hidden", "");
            a.classList.add("hidden");
            a.style.display = "none";
          });
          $$("[data-cwm-faq] svg.lucide-chevron-down", list).forEach((svg) => {
            svg.style.transform = "rotate(0deg)";
          });
        }

        if (!isOpen) {
          answer.removeAttribute("hidden");
          answer.classList.remove("hidden");
          answer.style.display = "block";
          const chev = btn.querySelector("svg.lucide-chevron-down");
          if (chev) chev.style.transform = "rotate(180deg)";
        }
      });
    });
  }

  /* ---------- Forms ---------- */
  function fieldValues(form) {
    const inputs = $$("input, textarea, select", form);
    const data = {};
    // Heuristic naming by placeholder / label order
    let i = 0;
    inputs.forEach((el) => {
      const ph = (el.getAttribute("placeholder") || "").toLowerCase();
      const type = (el.getAttribute("type") || el.tagName).toLowerCase();
      let key = el.name || el.id;
      if (!key) {
        if (type === "email" || ph.includes("@") || ph.includes("email")) key = "email";
        else if (ph.includes("name") || ph.includes("john")) key = "name";
        else if (ph.includes("phone") || ph.includes("555")) key = "phone";
        else if (ph.includes("company") || ph.includes("wash") || ph.includes("car wash")) key = "company";
        else if (ph.includes("message") || el.tagName === "TEXTAREA") key = "message";
        else key = "field_" + i++;
      }
      data[key] = el.value;
    });
    return data;
  }

  async function submitForm(form, endpoint) {
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
      const ok = res.ok;
      if (btn) btn.textContent = ok ? "Sent — thank you!" : "Something went wrong";
      if (ok) form.reset();
      setTimeout(() => {
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = original;
        }
      }, 2500);
    } catch (e) {
      if (btn) {
        btn.textContent = "Network error — try again";
        btn.disabled = false;
        setTimeout(() => {
          btn.innerHTML = original;
        }, 2500);
      }
    }
  }

  function initForms() {
    $$("form[data-cwm-form]").forEach((form) => {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const kind = form.getAttribute("data-cwm-form");
        const map = {
          guide: "/api/guide",
          newsletter: "/api/newsletter",
          contact: "/api/contact",
          testimonial: "/api/testimonial",
          calculator: "/api/calculator",
        };
        submitForm(form, map[kind] || form.getAttribute("action") || "/api/contact");
      });
    });

    // Fallback: any form with "Send Me the Guide" that wasn't annotated
    $$("form").forEach((form) => {
      if (form.hasAttribute("data-cwm-form")) return;
      const txt = form.textContent || "";
      if (/Send Me the Guide/i.test(txt)) {
        form.setAttribute("data-cwm-form", "guide");
        form.addEventListener("submit", (e) => {
          e.preventDefault();
          submitForm(form, "/api/guide");
        });
      } else if (/Get Free Guide/i.test(txt)) {
        form.setAttribute("data-cwm-form", "newsletter");
        form.addEventListener("submit", (e) => {
          e.preventDefault();
          submitForm(form, "/api/newsletter");
        });
      }
    });
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
    const avgRevenuePerHour = (cars * 12) / (30 * 12);
    const maintenance_savings_monthly = Math.round(downtime * avgRevenuePerHour * 0.6 + 200);
    const total_monthly =
      water_savings_monthly + chemical_savings_monthly + maintenance_savings_monthly;
    const total_annual = total_monthly * 12;
    const estimatedInvestment = 18000;
    const roi_months = Math.max(2, Math.round(estimatedInvestment / Math.max(total_monthly, 1)));
    let confidence = 50;
    if (data.wash_type) confidence += 10;
    if (data.cars_per_month) confidence += 10;
    if (data.water_cost_per_1000) confidence += 10;
    if (data.gallons_per_car) confidence += 5;
    if (data.chemical_spend_monthly) confidence += 5;
    if (data.downtime_hours) confidence += 5;
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

    // Find number inputs in order — match live step-1 defaults
    const section = $$("section").find((s) => /How much is inefficient water/i.test(s.textContent || ""));
    if (!section) return;

    const inputs = $$('input[type="number"]', section);
    // Labels nearby help mapping
    const allText = section.innerText;

    // Wire the primary CTA button in this section
    const nextBtn = $$("button", section).find((b) =>
      /Continue|Next|See My|Calculate|Get My/i.test(b.textContent || "")
    );

    function readInputs() {
      // Map by surrounding label text
      const data = {
        wash_type: "",
        cars_per_month: 5000,
        water_cost_per_1000: 6,
        gallons_per_car: 40,
        chemical_spend_monthly: 5000,
        downtime_hours: 0,
        reclaim_status: "",
      };

      $$("input, select, button[aria-pressed]", section).forEach((el) => {
        const wrap = el.closest("div") || el.parentElement;
        const label = (wrap && wrap.textContent) || "";
        const val = el.value;
        if (/cars?\s*per\s*month|monthly\s*cars/i.test(label) && el.type === "number")
          data.cars_per_month = Number(val) || 0;
        else if (/water.*cost|cost.*1000|\/\s*1000/i.test(label) && el.type === "number")
          data.water_cost_per_1000 = Number(val) || 0;
        else if (/gallon/i.test(label) && el.type === "number") data.gallons_per_car = Number(val) || 0;
        else if (/chemical/i.test(label) && el.type === "number")
          data.chemical_spend_monthly = Number(val) || 0;
        else if (/downtime/i.test(label) && el.type === "number") data.downtime_hours = Number(val) || 0;
      });

      // Fallback positional mapping if labels didn't match
      if (inputs.length >= 5) {
        if (!data.cars_per_month && inputs[0]) data.cars_per_month = Number(inputs[0].value) || 5000;
        if (inputs[0] && data.cars_per_month === 5000) data.cars_per_month = Number(inputs[0].value) || 5000;
        data.cars_per_month = Number(inputs[0]?.value) || data.cars_per_month;
        data.water_cost_per_1000 = Number(inputs[1]?.value) || data.water_cost_per_1000;
        data.gallons_per_car = Number(inputs[2]?.value) || data.gallons_per_car;
        data.chemical_spend_monthly = Number(inputs[3]?.value) || data.chemical_spend_monthly;
        data.downtime_hours = Number(inputs[4]?.value) || data.downtime_hours;
      }

      // Wash type / reclaim buttons
      $$("button", section).forEach((b) => {
        const t = (b.textContent || "").trim().toLowerCase();
        if (/tunnel|in-bay|self-serve|express/i.test(t) && b.getAttribute("data-selected") === "1")
          data.wash_type = t;
        if (t === "yes" || t === "no") {
          /* reclaim may be toggle — leave empty unless marked */
        }
      });

      return data;
    }

    // Create lead+results overlay UI injected after section
    let resultsHost = $("#cwm-calc-results");
    if (!resultsHost) {
      resultsHost = document.createElement("div");
      resultsHost.id = "cwm-calc-results";
      resultsHost.className = "max-w-xl mx-auto mt-8";
      section.appendChild(resultsHost);
    }

    function showLeadGate(inputsData) {
      resultsHost.innerHTML = `
        <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 class="text-xl font-bold text-slate-900">Almost there — where should we send your results?</h3>
          <p class="text-sm text-slate-600">Enter your details to see estimated monthly and annual savings.</p>
          <form data-cwm-calc-lead class="space-y-3">
            <input name="name" required placeholder="Your name" class="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm" />
            <input name="email" type="email" required placeholder="you@company.com" class="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm" />
            <input name="phone" placeholder="Phone (optional)" class="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm" />
            <input name="city_state" placeholder="City, State" class="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm" />
            <button type="submit" class="w-full font-bold py-3 rounded-xl text-white text-sm" style="background:#0779ef">Show My Savings</button>
          </form>
        </div>`;
      const form = resultsHost.querySelector("form");
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const fd = new FormData(form);
        const lead = Object.fromEntries(fd.entries());
        const results = calculateSavings(inputsData);
        showResults(results);
        try {
          await fetch("/api/calculator", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...lead, inputs: inputsData, results }),
          });
        } catch (_) {}
      });
      resultsHost.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function money(n) {
      return "$" + Number(n || 0).toLocaleString();
    }

    function showResults(r) {
      resultsHost.innerHTML = `
        <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 class="text-xl font-bold text-slate-900">Your estimated savings</h3>
          <div class="grid grid-cols-2 gap-4">
            <div><div class="text-2xl font-black text-[#0779ef]">${money(r.total_monthly)}</div><div class="text-xs text-slate-500">per month</div></div>
            <div><div class="text-2xl font-black text-[#0779ef]">${money(r.total_annual)}</div><div class="text-xs text-slate-500">per year</div></div>
            <div><div class="text-lg font-bold">${r.roi_months} mo</div><div class="text-xs text-slate-500">est. payback</div></div>
            <div><div class="text-lg font-bold">${r.confidence}%</div><div class="text-xs text-slate-500">confidence</div></div>
          </div>
          <ul class="text-sm text-slate-600 space-y-1">
            <li>Water: ${money(r.water_savings_monthly)}/mo</li>
            <li>Chemistry: ${money(r.chemical_savings_monthly)}/mo</li>
            <li>Maintenance / downtime: ${money(r.maintenance_savings_monthly)}/mo</li>
          </ul>
          <a href="/book-a-call" class="inline-flex items-center justify-center w-full font-bold py-3 rounded-xl text-white text-sm" style="background:#0779ef">Book a free strategy call</a>
        </div>`;
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", (e) => {
        e.preventDefault();
        showLeadGate(readInputs());
      });
    }

    // Also allow Enter on inputs
    inputs.forEach((inp) => {
      inp.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          showLeadGate(readInputs());
        }
      });
    });
  }

  function ready(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }

  ready(() => {
    initMobileMenu();
    initDropdowns();
    initFaqs();
    initForms();
    initCalculator();
  });
})();
