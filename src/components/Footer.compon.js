import React from 'react'


const Footer = () => {
    const currentTime = new Date();
    const currentYear = currentTime.getFullYear()

  return (
    <div className='footer-container'>
        <footer>Copyright Sante {currentYear} </footer>
    </div>
  )
}

export default Footer