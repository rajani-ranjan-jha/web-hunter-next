"use client"
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import Home from '../components/Home'

const page = () => {

  const Page = useParams()
  const router = useRouter()
  // console.log(Page.pageId);
  const PageNumber = Page.pageId.split('-')[1]

  // if (PageNumber < 2) {
  //     router.push('/')
  // }
  return <Home />;
}

export default page
