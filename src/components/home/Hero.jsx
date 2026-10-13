import React from 'react';
import PropTypes from 'prop-types';

// data
import socialLinks from '../../data/socialLinks.json';

function Hero(props) {
  return (

    <div className="md:w-[75%] flex flex-col items-center mx-auto md:flex-row md:flex-nowrap md:justify-around mt-10">
      <div className="order-2 md:order-1 flex flex-col justify-center sm:justify-center md:justify-evenly lg:justify-evenly flex-grow basis-full md:basis-1/2 lg:basis-1/2 p-4 rounded-lg mx-auto md:mr-4 lg:mr-4 ">
        <div>

          {/* MSG: for more highlighting options https://www.coding-dude.com/wp/css/highlight-text-css/ */}

          <span className="inline-flex items-center gap-2 rounded-full bg-bg2 px-3 py-1 text-xs font-medium text-content/80 mb-4">
            <span className="h-2 w-2 rounded-full bg-primary"></span>
            Open to opportunities
          </span>

          <h1 id='hero-title-name' className="font-bold text-3xl md:text-4xl text-title">
          M.Ham<strong className='' id='hero-title-name-inner'>mad Hassan</strong>
          </h1>

          <div className='mt-5 text-2xl font-bold text-content/80'>
            <p className="">Product Engineer</p>
            <p className="">Technical Consultant</p>
          </div>

          <p className='mt-5 text-base text-content/70 max-w-md'>
            I help teams turn ideas into shipped products — owning features end-to-end, from user problem and design through backend, integrations, and long-term maintainability.
          </p>

          <div className='flex flex-row flex-wrap gap-2 mt-5'>
            <a target="_blank" href={socialLinks.linkedin} className="text-1xl text-contentLink cursor-pointer hover:text-contentLinkHover">LinkedIn </a> |
            <a target="_blank" href={socialLinks.x} className="text-1xl text-contentLink cursor-pointer hover:text-contentLinkHover">X </a> |
            <a target="_blank" href={socialLinks.github} className=" text-1xl text-contentLink cursor-pointer hover:text-contentLinkHover">Github </a> |
            {/* <a target="_blank" href={socialLinks.medium} className=" text-1xl text-contentLink cursor-pointer hover:text-contentLinkHover">Medium </a> | */}
            <a target="_blank" href={socialLinks.hashnode} className=" text-1xl text-contentLink cursor-pointer hover:text-contentLinkHover">Hashnode </a> 
            {/* <a target="_blank" href={socialLinks.upwork} className="text-1xl text-contentLink cursor-pointer hover:text-contentLinkHover">Upwork </a> */}
            {/* <a target="_blank" href={socialLinks.discord} className="text-1xl text-contentLink cursor-pointer hover:text-contentLinkHover">Discord </a> */}
          </div>
        </div>
      </div>
      <div className="order-1 md:order-2 w-64 md:w-48 mx-auto mb-8 md:mb-0">
        {/* TODO: put this link in constants */}
        <img src="/profile_pic.png" alt="Profile image" className=" rounded-lg shadow object-cover rounded-md  hover:shadow-xl transition duration-500 "/>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={socialLinks.calendarBooking}
          className="mt-4 flex items-center justify-center w-full rounded-md bg-primary text-bg1 px-4 py-2 text-sm font-bold font-semibold hover:bg-primary/80 hover:text-white transition-colors"
        >
          Let's talk?
        </a>
      </div>
    </div>

  )
}

Hero.propTypes = {}

export default Hero
