import { useMemo, useState } from 'react'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import './App.css'

type Strategy = 'Momentum' | 'Mean Reversion' | 'Buy & Hold'
const prices = [100, 104, 101, 108, 113, 109, 118, 124, 121, 129, 135, 132]

function buildSeries(strategy: Strategy) {
  let equity = 100
  return prices.map((price, index) => {
    if (index === 0) return { period: 1, price, equity: 100 }
    const change = (price - prices[index - 1]) / prices[index - 1]
    if (strategy === 'Buy & Hold') equity *= 1 + change
    if (strategy === 'Momentum') equity *= 1 + (change > 0 ? change : 0)
    if (strategy === 'Mean Reversion') equity *= 1 + (change < 0 ? -change : 0)
    return { period: index + 1, price, equity: Number(equity.toFixed(2)) }
  })
}

function App() {
  const [strategy, setStrategy] = useState<Strategy>('Momentum')
  const data = useMemo(() => buildSeries(strategy), [strategy])
  const totalReturn = data.at(-1)!.equity - 100
  const range = Math.max(...data.map(d => d.equity)) - Math.min(...data.map(d => d.equity))

  return (
    <main className="app">
      <header className="hero">
        <div>
          <p className="eyebrow">CRYPTO STRATEGY LAB</p>
          <h1>Test the idea before trusting the idea.</h1>
          <p className="intro">A transparent, extensible sandbox for comparing rule-based strategies. Educational simulation only — not financial advice.</p>
        </div>
        <div className="status"><span className="dot" /> Local simulation</div>
      </header>

      <section className="controls panel">
        <div>
          <span className="label">Strategy</span>
          <div className="segmented">
            {(['Momentum', 'Mean Reversion', 'Buy & Hold'] as Strategy[]).map(name => (
              <button key={name} className={strategy === name ? 'active' : ''} onClick={() => setStrategy(name)}>{name}</button>
            ))}
          </div>
        </div>
        <div className="rule">
          <span className="label">Rule</span>
          <strong>
            {strategy === 'Momentum' && 'Participate only in positive periods'}
            {strategy === 'Mean Reversion' && 'Invert negative periods'}
            {strategy === 'Buy & Hold' && 'Stay invested throughout'}
          </strong>
        </div>
      </section>

      <section className="metrics">
        <article className="metric panel"><span>Total return</span><strong>{totalReturn.toFixed(1)}%</strong></article>
        <article className="metric panel"><span>Ending equity</span><strong>{data.at(-1)!.equity.toFixed(1)}</strong></article>
        <article className="metric panel"><span>Equity range</span><strong>{range.toFixed(1)}</strong></article>
      </section>

      <section className="panel chart-panel">
        <div className="section-heading">
          <div><span className="label">Backtest view</span><h2>Simulated equity curve</h2></div>
          <span className="badge">Illustrative data</span>
        </div>
        <div className="chart">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis domain={['auto', 'auto']} />
              <Tooltip />
              <Line type="monotone" dataKey="equity" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="grid">
        <article className="panel"><span className="label">Why this exists</span><h2>Make assumptions inspectable.</h2><p>Strategies are explicit rules, so the simulation can later be extended with historical data, transaction costs, position sizing, risk limits and reproducible tests.</p></article>
        <article className="panel"><span className="label">Next extension</span><h2>Data → rules → evidence.</h2><p>The architecture stays small: swap the price source, add a strategy module, then compare identical metrics across runs.</p></article>
      </section>
    </main>
  )
}

export default App
