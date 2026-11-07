import { NavLink } from 'react-router-dom'
import {
  Star,
  Droplets,
  Stethoscope,
  LayoutGrid,
  BedDouble,
  ShieldPlus,
  FileText,
  Bell,
  Smartphone,
  User,
  Settings,
  Building2,
  HelpCircle,
  Shield,
} from 'lucide-react'
import { HOSPITAL, WARD, VERSION, navItems } from '../data/dummyData'
import { asset } from '../asset'

const icons = {
  Star,
  Droplets,
  Stethoscope,
  LayoutGrid,
  BedDouble,
  ShieldPlus,
  FileText,
  Bell,
  Smartphone,
  User,
  Settings,
}

export default function Sidebar() {
  return (
    <aside className="w-64 shrink-0 bg-sidebar text-white flex flex-col min-h-screen">
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-white/10">
        <div className="w-14 h-14 rounded-lg bg-white/95 flex items-center justify-center overflow-hidden">
          <img
            src={asset('spz-guardian-logo.jpg')}
            alt="SPZ Guardian logo"
            className="w-full h-full object-cover object-center"
          />
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = icons[item.icon]
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="leading-tight">{item.label}</span>
            </NavLink>
          )
        })}
      </nav>

      <div className="px-4 py-4 border-t border-white/10">
        <div className="flex items-start gap-2 text-xs text-slate-300 mb-3">
          <Building2 className="w-4 h-4 mt-0.5 shrink-0" />
          <div>
            <div>{HOSPITAL}</div>
            <div className="text-slate-400">{WARD}</div>
          </div>
        </div>
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>{VERSION}</span>
          <button type="button" className="w-6 h-6 rounded-full border border-slate-500 flex items-center justify-center hover:border-white hover:text-white">
            <HelpCircle className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  )
}
