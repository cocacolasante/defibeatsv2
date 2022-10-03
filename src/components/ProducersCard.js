import React from 'react'


const ProducersCard = (props) => {
  return (
    <div id='content'>
        <h1>{props.userAddress}</h1>
        <div id='content-wrapper'>
            <div>
                <h2>Producer Username: {props.username} </h2>
            </div>
            <div>
                <h3>UserName</h3>
                <h4>Profile Picture: </h4>
                <p>{props.userStatus} </p>
                <p>{props.userslikes}</p>
                <button>Click here to like artist</button>
                <p>Tips</p>
                <input placeholder='enter tip amount in ether' type='number' />

            </div>
      </div></div>
  )
}

export default ProducersCard