"use client"

import Image from "next/image"

export function LogoLoader({ size = 64 }: { size?: number }) {
  return (
    <div className="flex items-center justify-center py-10">
      <div className="animate-pulse">
        <Image
          src="/public/logo.PNG"   // 👈 make sure this exists in /public
          alt="Loading"
          width={size}
          height={size}
          priority
        />
      </div>
    </div>
  )
}
