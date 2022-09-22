import React from 'react'

const ProducersProfile = () => {
  return (
    <div id='content'>
        <div>
            <h2>Producers Profile</h2>
        </div>
        <div>
            <h3>User name</h3>
            <h4>Profile Picture</h4>
            <p>Message</p>
            <p>Likes</p>
            <button>Click here to like artist</button>
            <p>Tips</p>
            <input placeholder='enter tip amount in ether' type='number' />

        </div>
    </div>
  )
}

export default ProducersProfile