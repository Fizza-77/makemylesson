/** Above-the-fold hero rules inlined on the homepage to cut LCP element render delay. */
export const HOME_CRITICAL_CSS = `
.mml-marketing-page{--mml-navy-deep:#0e294c;--mml-ink:#0e294c;--mml-text-secondary:#4a5a66;--mml-cyan:#159f9b;--mml-white:#fff;--mml-paper:#e6ecee;min-height:100vh;background:var(--mml-paper);color:var(--mml-ink);overflow-x:clip}
.mml-mkt-hero{position:relative;background-color:#f8fcfc;background-image:linear-gradient(180deg,#f4fbfc 0%,#f8fcfc 100%);color:var(--mml-ink);padding:calc(4.25rem + clamp(1.1rem,2.4vw,2rem)) clamp(1.1rem,3vw,2.5rem) .35rem;box-sizing:border-box}
.mml-mkt-hero-inner{position:relative;z-index:1;margin:0 auto;width:100%;max-width:min(1280px,100%)}
.mml-mkt-hero-split{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.05fr);gap:clamp(1rem,2.5vw,2rem);align-items:start}
.mml-mkt-hero-copy-col{position:relative;z-index:2;min-width:0;text-align:left;padding-top:.35rem}
.mml-mkt-hero-heading{width:100%;text-align:center}
.mml-mkt-hero-kicker{margin:0 0 1.35rem;font-size:.68rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;text-align:center;color:var(--mml-navy-deep)}
.mml-mkt-hero-title{margin:0;font-family:var(--font-manrope),Manrope,system-ui,sans-serif;font-size:clamp(2.15rem,5.2vw,3.85rem);font-weight:700;line-height:1.08;letter-spacing:-.035em;color:var(--mml-navy-deep);text-align:center;white-space:nowrap}
.mml-mkt-hero-lead{margin:0;max-width:none;font-size:clamp(.98rem,1.05vw,1.12rem);line-height:1.58;text-align:left;color:var(--mml-text-secondary)}
@media(max-width:1199px){.mml-mkt-hero-split{grid-template-columns:1fr;justify-items:center;gap:1.75rem}.mml-mkt-hero-copy-col{display:flex;flex-direction:column;align-items:center;margin-left:0;width:100%;max-width:44rem;text-align:center;padding-top:.5rem}.mml-mkt-hero-title{white-space:normal}.mml-mkt-hero-lead{text-align:center}}
`.replace(/\n/g, "");
