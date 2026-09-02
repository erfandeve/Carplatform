import { Check } from 'lucide-react'

/** Vertical stepper: steps = [{id, title, state: done|current|pending}]. */
export default function Stepper({ steps = [] }) {
  return (
    <ol className="relative space-y-1">
      {steps.map((s, i) => {
        const done = s.state === 'done'
        const current = s.state === 'current'
        return (
          <li key={s.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span
                className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-bold transition-colors ${
                  done
                    ? 'bg-free-perm text-bg'
                    : current
                      ? 'bg-neon text-bg glow-sm'
                      : 'border border-line bg-surface text-faint'
                }`}
              >
                {done ? <Check size={15} /> : toStep(i + 1)}
              </span>
              {i < steps.length - 1 && (
                <span
                  className={`my-1 w-0.5 flex-1 ${done ? 'bg-free-perm' : 'bg-line'}`}
                  style={{ minHeight: 18 }}
                />
              )}
            </div>
            <div className="pb-4 pt-1">
              <p
                className={`text-sm ${
                  current ? 'font-bold text-ink' : done ? 'text-ink-2' : 'text-faint'
                }`}
              >
                {s.title}
              </p>
              {current && (
                <span className="text-xs text-neon-bright">در حال انجام</span>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}

const fa = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']
const toStep = (n) => String(n).replace(/\d/g, (d) => fa[+d])
