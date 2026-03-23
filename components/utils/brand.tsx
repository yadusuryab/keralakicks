import React from 'react'
import logo from '@/public/wordmark.png'
import Image from 'next/image'


function Brand({className}:any) {
  return (
    <Image src={logo.src} width={70} className={className} height={20} alt={process.env.NEXT_PUBLIC_APP_NAME || 'SHOPIGO'} />

  )
}

export default Brand
