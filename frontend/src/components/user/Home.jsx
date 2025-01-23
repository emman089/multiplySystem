import React from 'react'
import Navbar from './Navbar'
import Hero from './Hero'
import Carousel from './Carousel'
import Footer from './Footer'

const Home = () => {
  return (
<>
<div className='overflow-hidden'>

<Navbar/>
<Hero/>
<Carousel/>
<Footer/>
</div>
</> 
)
}

export default Home