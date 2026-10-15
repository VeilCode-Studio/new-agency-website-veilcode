function CommerceDashboard() {
  return (
    <div className="w-[31rem] overflow-hidden rounded-xl border border-line-hi bg-surface shadow-[0_30px_100px_var(--color-brand-dim)]">
      <div className="flex h-9 items-center border-b border-line bg-surface-hi px-3">
        <div className="flex gap-1.5"><i className="size-1.5 rounded-full bg-red-400" /><i className="size-1.5 rounded-full bg-amber-400" /><i className="size-1.5 rounded-full bg-emerald-400" /></div>
        <div className="mx-auto rounded-md border border-line bg-page/60 px-12 py-1 font-mono text-[7px] text-ink-faint">app.northstar.store</div>
      </div>
      <div className="grid grid-cols-[6.25rem_1fr]">
        <aside className="border-r border-line bg-page/60 p-3">
          <p className="mb-5 text-[10px] font-extrabold tracking-tight text-ink">NORTHSTAR</p>
          {['Overview','Orders','Products','Customers'].map((item, i) => <div key={item} className={`mb-1 rounded px-2 py-1.5 text-[7px] font-medium ${i === 0 ? 'bg-svc-web-dim text-svc-web' : 'text-ink-faint'}`}>{item}</div>)}
        </aside>
        <div className="p-4">
          <div className="mb-3 flex items-center justify-between"><div><p className="text-[7px] text-ink-faint">Tuesday, 2 September</p><p className="text-xs font-bold text-ink">Commerce overview</p></div><span className="rounded border border-line px-2 py-1 text-[7px] text-ink-muted">Last 30 days</span></div>
          <div className="mb-3 grid grid-cols-3 gap-2">
            {[['Revenue','$84,260','+18.4%'],['Orders','1,284','+9.7%'],['Conversion','4.82%','+0.6%']].map(([label,value,delta]) => <div key={label} className="rounded-lg border border-line bg-surface-hi p-2.5"><p className="text-[6px] uppercase tracking-wider text-ink-faint">{label}</p><p className="mt-1 text-sm font-bold text-ink">{value}</p><p className="text-[6px] text-emerald-500">{delta}</p></div>)}
          </div>
          <div className="grid grid-cols-[1.55fr_1fr] gap-2">
            <div className="rounded-lg border border-line bg-surface-hi p-3"><div className="mb-2 flex justify-between"><span className="text-[7px] font-semibold text-ink">Revenue</span><span className="text-[6px] text-ink-faint">May — Sep</span></div><svg viewBox="0 0 210 72" className="h-20 w-full" fill="none"><path d="M0 62C20 58 28 44 48 48S78 61 99 39s35-18 50-23 36 10 61-13" stroke="var(--color-svc-web)" strokeWidth="2"/><path d="M0 62C20 58 28 44 48 48S78 61 99 39s35-18 50-23 36 10 61-13V72H0Z" fill="var(--color-svc-web-dim)"/></svg></div>
            <div className="rounded-lg border border-line bg-surface-hi p-3"><p className="mb-3 text-[7px] font-semibold text-ink">Recent orders</p>{[['#1048','N. Okafor','$320'],['#1047','L. Chen','$148'],['#1046','M. Taylor','$612']].map(row => <div key={row[0]} className="flex justify-between border-b border-line py-1.5 text-[6px]"><span className="text-ink-faint">{row[0]}</span><span className="text-ink-muted">{row[1]}</span><span className="font-semibold text-ink">{row[2]}</span></div>)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileBankingApp() {
  return (
    <div className="w-40 rounded-[2rem] border-2 border-line-hi bg-page p-1.5 shadow-[0_25px_70px_var(--color-svc-mobile-dim)]">
      <div className="overflow-hidden rounded-[1.55rem] border border-line bg-surface px-3 pb-4 pt-2">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-line-hi" />
        <div className="mb-4 flex items-center justify-between"><div><p className="text-[6px] text-ink-faint">Good morning</p><p className="text-[9px] font-bold text-ink">Amina</p></div><div className="grid size-6 place-items-center rounded-lg bg-svc-mobile-dim text-[7px] font-bold text-svc-mobile">AK</div></div>
        <div className="mb-3 rounded-xl bg-svc-mobile p-3 text-page"><p className="text-[6px] opacity-70">Available balance</p><p className="mt-1 text-lg font-extrabold">$12,480.60</p><p className="mt-3 text-[6px] opacity-70">•••• 4821</p></div>
        <div className="mb-4 grid grid-cols-3 gap-1.5">{['Send','Pay','More'].map((x,i)=><div key={x} className="text-center"><div className={`mx-auto mb-1 grid size-7 place-items-center rounded-lg border ${i===0?'border-svc-mobile-border bg-svc-mobile-dim text-svc-mobile':'border-line bg-surface-hi text-ink-muted'}`}><span className="text-[9px]">{i===0?'↑':i===1?'✓':'•••'}</span></div><span className="text-[6px] text-ink-muted">{x}</span></div>)}</div>
        <p className="mb-2 text-[8px] font-bold text-ink">Recent activity</p>
        {[['Figma','Subscription','−$15.00'],['Transfer','James K.','−$240.00'],['Payment','Received','+$1,200']].map(([a,b,c])=><div key={a} className="flex items-center border-b border-line py-2"><div className="mr-2 size-6 rounded-lg bg-surface-hi"/><div className="min-w-0 flex-1"><p className="text-[7px] font-semibold text-ink">{a}</p><p className="text-[5px] text-ink-faint">{b}</p></div><span className={`text-[6px] font-semibold ${c.startsWith('+')?'text-emerald-500':'text-ink'}`}>{c}</span></div>)}
      </div>
    </div>
  );
}

function AiOperationsApp() {
  return (
    <div className="w-72 overflow-hidden rounded-xl border border-svc-ai-border bg-surface shadow-[0_25px_80px_var(--color-svc-ai-dim)]">
      <div className="flex items-center justify-between border-b border-line bg-surface-hi px-3 py-2"><div><p className="text-[6px] uppercase tracking-[.16em] text-svc-ai">VeilOps</p><p className="text-[9px] font-bold text-ink">Automation control</p></div><span className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-[6px] text-emerald-500">All systems healthy</span></div>
      <div className="p-3"><div className="mb-2 grid grid-cols-3 gap-1.5">{[['Runs today','1,842'],['Success rate','99.2%'],['Hours saved','126h']].map(([a,b])=><div key={a} className="rounded-md border border-line bg-surface-hi p-2"><p className="text-[5px] text-ink-faint">{a}</p><p className="mt-1 text-[10px] font-bold text-ink">{b}</p></div>)}</div>
        <p className="mb-2 mt-3 text-[7px] font-semibold text-ink">Live workflows</p>
        {[['Lead qualification','CRM → AI scoring','Running'],['Invoice processing','Inbox → Finance','Running'],['Support triage','Helpdesk → Routing','Review']].map(([name,path,status])=><div key={name} className="mb-1.5 grid grid-cols-[1fr_auto] items-center rounded-lg border border-line bg-surface-hi p-2"><div><div className="flex items-center gap-1.5"><span className={`size-1.5 rounded-full ${status==='Review'?'bg-amber-400':'bg-svc-ai'}`}/><p className="text-[7px] font-semibold text-ink">{name}</p></div><p className="ml-3 mt-0.5 text-[5px] text-ink-faint">{path}</p></div><span className="text-[5px] text-ink-muted">{status}</span></div>)}
      </div>
    </div>
  );
}

export function ServiceVisualField() {
  return <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
    <div className="absolute inset-0 z-10 bg-linear-to-r from-page via-page/95 to-page/15 sm:via-page/82 lg:via-page/65" />
    <div className="ambient-float absolute right-[-13rem] top-[12%] opacity-35 sm:right-[-7rem] sm:opacity-50 lg:right-[1%] lg:opacity-80"><CommerceDashboard /></div>
    <div className="ambient-float absolute right-[2%] top-[55%] z-20 hidden opacity-80 sm:block lg:right-[5%]"><MobileBankingApp /></div>
    <div className="ambient-float absolute right-[23%] top-[62%] z-20 hidden opacity-70 lg:block xl:right-[28%]"><AiOperationsApp /></div>
    <div className="absolute inset-x-0 bottom-0 z-30 h-44 bg-linear-to-t from-page to-transparent" />
  </div>;
}
