/** Above-the-fold hero + nav rules inlined on the homepage to cut LCP element render delay. */
export const HOME_CRITICAL_CSS = `
.mml-marketing-page{--mml-navy-deep:#0e294c;--mml-ink:#0e294c;--mml-text-secondary:#4a5a66;--mml-cyan:#159f9b;--mml-white:#fff;--mml-paper:#e6ecee;min-height:100vh;background:var(--mml-paper);color:var(--mml-ink);overflow-x:clip;font-family:var(--font-inter),Inter,system-ui,sans-serif}
#site-nav.site-nav--home{position:fixed;left:0;right:0;top:0;z-index:1100;background-color:#f8fcfc;background-image:linear-gradient(180deg,#f4fbfc 0%,#f8fcfc 100%)}
#site-nav.site-nav--home .site-nav-brand{background:#0e294c;border-color:#0e294c}
#site-nav.site-nav--home .site-nav-brand-text{color:#fff;font-weight:700}
#site-nav.site-nav--home .site-nav-link{color:#fff;background:#0e294c;border:1.5px solid #0e294c;border-radius:9999px;padding:.3125rem .5625rem;font-weight:500}
#site-nav.site-nav--home .site-nav-signin{color:#0e294c}
#site-nav.site-nav--home .site-nav-toggle{color:#0e294c}
.site-nav-container{margin-left:auto;margin-right:auto;display:flex;width:100%;max-width:1600px;align-items:center;gap:.5rem;padding-left:.75rem;padding-right:.75rem}
.site-nav-bar{display:flex;height:3.25rem;min-height:3.25rem;width:100%;align-items:center}
.site-nav-actions{margin-left:auto;display:flex;align-items:center;gap:.75rem}
.site-nav-cta{display:inline-flex;align-items:center;justify-content:center;border-radius:9999px;background:#159f9b;color:#fff;font-size:.875rem;font-weight:700;text-decoration:none;padding:.55rem 1rem;white-space:nowrap}
.mml-mkt-hero{position:relative;background-color:#f8fcfc;background-image:linear-gradient(180deg,#f4fbfc 0%,#f8fcfc 100%);color:var(--mml-ink);padding-top:calc(4.25rem + clamp(1.1rem,2.4vw,2rem));padding-right:max(.75rem,clamp(1.1rem,3vw,2.5rem));padding-bottom:.35rem;padding-left:max(.75rem,4px);box-sizing:border-box}
.mml-mkt-hero-inner{position:relative;z-index:1;margin:0 auto;width:100%;max-width:min(1280px,100%)}
.mml-mkt-hero-split{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.05fr);gap:clamp(1rem,2.5vw,2rem);align-items:start}
.mml-mkt-hero-copy-col{position:relative;z-index:2;min-width:0;max-width:100%;text-align:left;padding-top:.35rem;padding-inline:.75rem;box-sizing:border-box}
.mml-mkt-hero-heading{width:100%;text-align:center}
.mml-mkt-hero-kicker{margin:0 0 1.35rem;font-size:.68rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;text-align:center;color:var(--mml-navy-deep)}
.mml-mkt-hero-title{margin:0;font-family:var(--font-manrope),Manrope,system-ui,sans-serif;font-size:clamp(2.15rem,5.2vw,3.85rem);font-weight:700;line-height:1.08;letter-spacing:-.035em;color:var(--mml-navy-deep);text-align:center;white-space:nowrap}
.mml-mkt-hero-lead{margin:0;max-width:none;font-size:clamp(.98rem,1.05vw,1.12rem);line-height:1.58;text-align:left;color:var(--mml-text-secondary)}
.mml-mkt-hero-lead-accent{color:var(--mml-cyan);font-size:1.12em;font-weight:700;text-decoration:underline;text-decoration-color:var(--mml-navy-deep);text-underline-offset:.18em;text-decoration-thickness:.12em}
.mml-mkt-hero-body{display:flex;flex-direction:column;gap:.85rem;margin-top:1.85rem}
@media(max-width:1199px){.mml-mkt-hero-split{grid-template-columns:1fr;justify-items:center;gap:1.75rem}.mml-mkt-hero-copy-col{display:flex;flex-direction:column;align-items:stretch;margin-left:0;width:100%;max-width:44rem;text-align:center;padding-top:.5rem;padding-inline:.75rem}.mml-mkt-hero-title{white-space:normal}.mml-mkt-hero-lead{text-align:center}.mml-mkt-hero-ctas{width:100%;max-width:100%;box-sizing:border-box;flex-wrap:wrap}}
`.replace(/\n/g, "");
