import Link from 'next/link'

interface Props {
  title: string
  subtitle?: string
  children: React.ReactNode
}

export default function ContentPage({ title, subtitle, children }: Props) {
  return (
    <main className="page-main">
      <div className="page-container max-w-[760px]">
        <nav className="page-breadcrumb">
          <Link href="/" className="hover:text-gold transition-colors">Home</Link>
          <span>/</span>
          <span className="text-gold">{title}</span>
        </nav>

        <div className="panel mb-8">
          <p className="section-tag mb-6">{title}</p>
          <h1 className="page-title">{title}</h1>
          {subtitle && <p className="page-subtitle mb-0">{subtitle}</p>}
        </div>

        <div className="panel-moss content-prose">
          {children}
        </div>
      </div>
    </main>
  )
}
