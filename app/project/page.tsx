import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Projecten",
  robots: { index: false, follow: false },
}

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
     <a href="CineCity" className="hover:underline">CineCity</a>
     <br />
     <a href="Architectuur" className="hover:underline">Hélène Binet</a>
     <br />
     <a href="Frisdrank" className="hover:underline">Easy Leaf</a>   
    </div>
  )
}
