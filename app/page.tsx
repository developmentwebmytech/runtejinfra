import React from 'react'
import FirstSection from '@/components/the-nation-builder'
import SecondSection from '@/components/iconic-projects'
import ThirdSection from '@/components/pillars-of-progress'
import Fourth from '@/components/build-better'
import OurBrand from '@/components/ourbrand'

import VideoSection from '@/components/header-video'
import Fifth from '@/components/explore-our-project'
import FormPage from '@/components/formpage'
import Counter from '@/components/counter'
// import MemberTeam from '@/components/memberteam'
import Testimonial from '@/components/testinomail'
import OurWorkPartner from '@/components/our-works-partner'

function homepage() {
  return (
    <>
      <VideoSection/>
      <FirstSection/>
      <Counter/>
      <SecondSection/>
      <Fifth/>
      <Fourth/>
      <ThirdSection/>
      {/* <MemberTeam/> */}
      <OurWorkPartner/>
      <OurBrand/>
      <Testimonial/>
      <FormPage/>
      
      
    </>
  )
}

export default homepage
