import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

function Icon({ children, className = 'h-4 w-4', ...props }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  )
}

export function LayoutGrid(props: IconProps) {
  return <Icon {...props}><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></Icon>
}

export function Building2(props: IconProps) {
  return <Icon {...props}><path d="M6 22V3h12v19" /><path d="M9 7h1M14 7h1M9 11h1M14 11h1M9 15h1M14 15h1" /><path d="M4 22h16" /></Icon>
}

export function Home(props: IconProps) {
  return <Icon {...props}><path d="m3 11 9-8 9 8" /><path d="M5 10v11h14V10" /></Icon>
}

export function Users(props: IconProps) {
  return <Icon {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" /><circle cx="9.5" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></Icon>
}

export function UserGroup(props: IconProps) {
  return <Icon {...props}><circle cx="8" cy="8" r="3" /><circle cx="16" cy="7" r="2.5" /><path d="M3 20v-1.5A4.5 4.5 0 0 1 7.5 14h1A4.5 4.5 0 0 1 13 18.5V20" /><path d="M14 14.5a4 4 0 0 1 7 2.6V20" /></Icon>
}

export function CreditCard(props: IconProps) {
  return <Icon {...props}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 10h18" /></Icon>
}

export function Percent(props: IconProps) {
  return <Icon {...props}><path d="m19 5-14 14" /><circle cx="7" cy="7" r="2" /><circle cx="17" cy="17" r="2" /></Icon>
}

export function FileText(props: IconProps) {
  return <Icon {...props}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" /><path d="M14 2v6h6" /><path d="M8 13h8M8 17h6" /></Icon>
}

export function ShieldCheck(props: IconProps) {
  return <Icon {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><path d="m9 12 2 2 4-5" /></Icon>
}

export function BarChart3(props: IconProps) {
  return <Icon {...props}><path d="M4 19V5" /><path d="M4 19h16" /><path d="M8 16v-5M12 16V8M16 16v-3" /></Icon>
}

export function UserCog(props: IconProps) {
  return <Icon {...props}><circle cx="9" cy="7" r="4" /><path d="M3 21v-2a4 4 0 0 1 4-4h3" /><path d="M17 14v6M14 17h6" /></Icon>
}

export function Settings(props: IconProps) {
  return <Icon {...props}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1-2 2-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V20h-3v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1-2-2 .1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H4v-3h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1 2-2 .1.1a1.7 1.7 0 0 0 1.8.3 1.7 1.7 0 0 0 1-1.5V4h3v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1 2 2-.1.1a1.7 1.7 0 0 0-.3 1.8 1.7 1.7 0 0 0 1.5 1h.1v3h-.1a1.7 1.7 0 0 0-1.5 1Z" /></Icon>
}

export function Bell(props: IconProps) { return <Icon {...props}><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 7h18s-3 0-3-7" /><path d="M13.7 21a2 2 0 0 1-3.4 0" /></Icon> }
export function Menu(props: IconProps) { return <Icon {...props}><path d="M4 6h16M4 12h16M4 18h16" /></Icon> }
export function Search(props: IconProps) { return <Icon {...props}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></Icon> }
export function ChevronDown(props: IconProps) { return <Icon {...props}><path d="m6 9 6 6 6-6" /></Icon> }
export function ChevronRight(props: IconProps) { return <Icon {...props}><path d="m9 18 6-6-6-6" /></Icon> }
export function X(props: IconProps) { return <Icon {...props}><path d="M18 6 6 18M6 6l12 12" /></Icon> }
export function Plus(props: IconProps) { return <Icon {...props}><path d="M12 5v14M5 12h14" /></Icon> }
export function Check(props: IconProps) { return <Icon {...props}><path d="m5 12 4 4L19 6" /></Icon> }
export function AlertCircle(props: IconProps) { return <Icon {...props}><circle cx="12" cy="12" r="9" /><path d="M12 8v4M12 16h.01" /></Icon> }
export function Clock(props: IconProps) { return <Icon {...props}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></Icon> }
export function SpinnerIcon(props: IconProps) { return <Icon {...props}><path d="M21 12a9 9 0 1 1-6.2-8.6" /></Icon> }
export function Eye(props: IconProps) { return <Icon {...props}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></Icon> }
export function Edit2(props: IconProps) { return <Icon {...props}><path d="M17 3a2.8 2.8 0 0 1 4 4L8 20l-5 1 1-5Z" /></Icon> }
export function Trash2(props: IconProps) { return <Icon {...props}><path d="M3 6h18" /><path d="M8 6V4h8v2" /><path d="M19 6l-1 15H6L5 6" /><path d="M10 11v6M14 11v6" /></Icon> }
export function Download(props: IconProps) { return <Icon {...props}><path d="M12 3v12" /><path d="m7 10 5 5 5-5" /><path d="M5 21h14" /></Icon> }
export function Upload(props: IconProps) { return <Icon {...props}><path d="M12 21V9" /><path d="m7 14 5-5 5 5" /><path d="M5 3h14" /></Icon> }
export function Filter(props: IconProps) { return <Icon {...props}><path d="M4 5h16l-6 7v5l-4 2v-7Z" /></Icon> }
export function RefreshCw(props: IconProps) { return <Icon {...props}><path d="M21 12a9 9 0 0 1-15.5 6.2" /><path d="M3 12A9 9 0 0 1 18.5 5.8" /><path d="M3 19v-5h5M21 5v5h-5" /></Icon> }
export function LogOut(props: IconProps) { return <Icon {...props}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="M16 17l5-5-5-5" /><path d="M21 12H9" /></Icon> }
export function TrendingUp(props: IconProps) { return <Icon {...props}><path d="m3 17 6-6 4 4 8-8" /><path d="M14 7h7v7" /></Icon> }
export function TrendingDown(props: IconProps) { return <Icon {...props}><path d="m3 7 6 6 4-4 8 8" /><path d="M14 17h7v-7" /></Icon> }
export function Wallet(props: IconProps) { return <Icon {...props}><path d="M4 7h16v12H4z" /><path d="M4 7V5h13v2" /><path d="M16 13h4" /></Icon> }
export function Receipt(props: IconProps) { return <Icon {...props}><path d="M6 2h12v20l-3-2-3 2-3-2-3 2Z" /><path d="M9 7h6M9 11h6M9 15h4" /></Icon> }
export function Scale(props: IconProps) { return <Icon {...props}><path d="M12 3v18" /><path d="M5 6h14" /><path d="m6 6-3 7h6Zm12 0-3 7h6Z" /></Icon> }
