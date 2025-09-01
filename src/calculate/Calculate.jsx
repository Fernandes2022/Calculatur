import { useEffect, useMemo, useState } from 'react'
import { create, all } from 'mathjs'

const Calculate = () => {
  const [display, setDisplay] = useState('0')
  const [angleUnit, setAngleUnit] = useState('DEG')
  const [shift, setShift] = useState(false)
  const [history, setHistory] = useState([])
  const [memory, setMemory] = useState(null)

  const math = useMemo(() => {
    const instance = create(all, {})

    // Capture native trig functions to avoid recursion when overriding
    const nativeSin = instance.sin
    const nativeCos = instance.cos
    const nativeTan = instance.tan
    const nativeAsin = instance.asin
    const nativeAcos = instance.acos
    const nativeAtan = instance.atan

    const toRad = (x) => instance.multiply(x, instance.divide(instance.pi, 180))
    const toDeg = (x) => instance.multiply(x, instance.divide(180, instance.pi))

    instance.import({
      // Override trig to honor angle unit
      sin: (x) => nativeSin(angleUnit === 'DEG' ? toRad(x) : x),
      cos: (x) => nativeCos(angleUnit === 'DEG' ? toRad(x) : x),
      tan: (x) => nativeTan(angleUnit === 'DEG' ? toRad(x) : x),
      asin: (x) => angleUnit === 'DEG' ? toDeg(nativeAsin(x)) : nativeAsin(x),
      acos: (x) => angleUnit === 'DEG' ? toDeg(nativeAcos(x)) : nativeAcos(x),
      atan: (x) => angleUnit === 'DEG' ? toDeg(nativeAtan(x)) : nativeAtan(x),
    }, { override: true })

    return instance
  }, [angleUnit])

  const safeSetDisplay = (val) => {
    setDisplay(prev => (prev === '0' || prev === 'Error' ? String(val) : String(prev) + String(val)))
  }

  const clearAll = () => setDisplay('0')
  const deleteOne = () => setDisplay(prev => (prev.length <= 1 ? '0' : prev.slice(0, -1)))

  const insert = (value) => {
    const functionNames = ['sin','cos','tan','asin','acos','atan','log','ln','sqrt','log10']
    if (typeof value === 'string') {
      if (functionNames.includes(value)) {
        safeSetDisplay(`${value}(`)
        return
      }
      safeSetDisplay(value)
    } else {
      safeSetDisplay(String(value))
    }
  }

  const evaluateExpression = () => {
    try {
      const normalized = display
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        // Map ln( to log( for natural log in mathjs
        .replace(/ln\(/g, 'log(')
        // Map log10 function for base-10 if user typed 'log10'
        .replace(/log10\(/g, 'log10(')

      const result = math.evaluate(normalized)
      const formatted = typeof result === 'number'
        ? math.format(result, { precision: 14, lowerExp: -9, upperExp: 15 })
        : String(result)

      setHistory(prev => [...prev.slice(-9), { expression: display, result: formatted }])
      setDisplay(formatted)
    } catch {
      setDisplay('Error')
    }
  }

  const handleKey = (e) => {
    const key = e.key
    if ((key >= '0' && key <= '9') || key === '.' || key === '(' || key === ')') {
      e.preventDefault()
      insert(key)
      return
    }
    if (['+','-','*','/','^'].includes(key)) {
      e.preventDefault()
      insert(key)
      return
    }
    if (key === 'Enter' || key === '=') {
      e.preventDefault()
      evaluateExpression()
      return
    }
    if (key === 'Backspace') {
      e.preventDefault()
      deleteOne()
      return
    }
    if (key === 'Escape') {
      e.preventDefault()
      clearAll()
      return
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  })

  const handleMemoryAdd = () => {
    try {
      const val = Number(math.evaluate(display))
      if (!Number.isNaN(val)) setMemory((memory ?? 0) + val)
    } catch { return }
  }

  const handleMemorySub = () => {
    try {
      const val = Number(math.evaluate(display))
      if (!Number.isNaN(val)) setMemory((memory ?? 0) - val)
    } catch { return }
  }

  const handleMemoryRecall = () => {
    if (memory != null) insert(String(memory))
  }

  const handleMemoryClear = () => setMemory(null)

  const sci = [
    { label: shift ? 'asin' : 'sin', onClick: () => insert(shift ? 'asin' : 'sin') },
    { label: shift ? 'acos' : 'cos', onClick: () => insert(shift ? 'acos' : 'cos') },
    { label: shift ? 'atan' : 'tan', onClick: () => insert(shift ? 'atan' : 'tan') },
    { label: 'ln', onClick: () => insert('ln') },
    { label: 'log', onClick: () => insert('log10') },
    { label: '√', onClick: () => insert('sqrt') },
    { label: 'x²', onClick: () => insert('^2') },
    { label: 'xʸ', onClick: () => insert('^') },
    { label: '(', onClick: () => insert('(') },
    { label: ')', onClick: () => insert(')') },
    { label: 'π', onClick: () => insert('pi') },
    { label: 'e', onClick: () => insert('e') },
  ]

  return (
    <section className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      <div className="min-h-screen flex items-center justify-center container mx-auto px-4 py-10">
        <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur shadow-xl shadow-black/40">
          <div className="p-5 flex items-center justify-between">
            <h1 className="text-slate-200 font-semibold tracking-wide">SciCalc</h1>
            <div className="flex items-center gap-2">
              <div className="flex rounded-md bg-slate-800 p-1">
                <button aria-label="Degrees" onClick={() => setAngleUnit('DEG')} className={`${angleUnit==='DEG'?'bg-cyan-600 text-white':'text-slate-300 hover:text-white'} rounded px-2 py-1 text-xs md:text-sm`}>
                  DEG
                </button>
                <button aria-label="Radians" onClick={() => setAngleUnit('RAD')} className={`${angleUnit==='RAD'?'bg-cyan-600 text-white':'text-slate-300 hover:text-white'} rounded px-2 py-1 text-xs md:text-sm`}>
                  RAD
                </button>
              </div>
              <button aria-pressed={shift} onClick={() => setShift(s => !s)} className={`rounded-md px-2 py-1 text-xs md:text-sm ${shift?'bg-emerald-600 text-white':'bg-slate-800 text-slate-300 hover:text-white'}`}>
                INV
              </button>
            </div>
          </div>

          <div className="px-5">
            <input aria-label="calculator display" readOnly className="w-full h-16 md:h-20 rounded-lg bg-black/80 text-right text-2xl md:text-3xl tracking-wider text-slate-100 px-4 font-mono" value={display} />
            <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
              <div className="flex gap-2 items-center">
                <span className="opacity-80">MEM:</span>
                <span>{memory ?? 0}</span>
              </div>
              <div className="flex gap-2">
                {history.slice().reverse().slice(0,3).map((h, i) => (
                  <button key={i} title={`${h.expression} = ${h.result}`} onClick={() => setDisplay(h.result)} className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300">
                    {h.result}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-5 pt-4 space-y-3">
            <div className="grid grid-cols-8 gap-2 text-sm">
              <button className="col-span-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-100 h-10 md:h-12" onClick={handleMemoryClear}>MC</button>
              <button className="col-span-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-100 h-10 md:h-12" onClick={handleMemoryRecall}>MR</button>
              <button className="col-span-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-100 h-10 md:h-12" onClick={handleMemoryAdd}>M+</button>
              <button className="col-span-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-100 h-10 md:h-12" onClick={handleMemorySub}>M-</button>
              <button className="col-span-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white h-10 md:h-12" onClick={clearAll}>AC</button>
              <button className="col-span-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-100 h-10 md:h-12" onClick={deleteOne}>DEL</button>
            </div>

            <div className="grid grid-cols-6 gap-2">
              {sci.map((b, i) => (
                <button key={i} className="rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-100 h-10 md:h-12 text-sm md:text-base" onClick={b.onClick}>{b.label}</button>
              ))}
            </div>

            <div className="grid grid-cols-4 gap-2">
              <button className="rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-100 h-12 md:h-14 text-xl" onClick={() => insert('7')}>7</button>
              <button className="rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-100 h-12 md:h-14 text-xl" onClick={() => insert('8')}>8</button>
              <button className="rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-100 h-12 md:h-14 text-xl" onClick={() => insert('9')}>9</button>
              <button className="rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white h-12 md:h-14 text-xl" onClick={() => insert('÷')}>÷</button>

              <button className="rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-100 h-12 md:h-14 text-xl" onClick={() => insert('4')}>4</button>
              <button className="rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-100 h-12 md:h-14 text-xl" onClick={() => insert('5')}>5</button>
              <button className="rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-100 h-12 md:h-14 text-xl" onClick={() => insert('6')}>6</button>
              <button className="rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white h-12 md:h-14 text-xl" onClick={() => insert('×')}>×</button>

              <button className="rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-100 h-12 md:h-14 text-xl" onClick={() => insert('1')}>1</button>
              <button className="rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-100 h-12 md:h-14 text-xl" onClick={() => insert('2')}>2</button>
              <button className="rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-100 h-12 md:h-14 text-xl" onClick={() => insert('3')}>3</button>
              <button className="rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white h-12 md:h-14 text-xl" onClick={() => insert('-')}>-</button>

              <button className="rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-100 h-12 md:h-14 text-xl" onClick={() => insert('0')}>0</button>
              <button className="rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-100 h-12 md:h-14 text-xl" onClick={() => insert('.')}>.</button>
              <button className="rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white h-12 md:h-14 text-xl" onClick={() => insert('+')}>+</button>
              <button className="rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white h-12 md:h-14 text-xl" onClick={evaluateExpression}>=</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Calculate