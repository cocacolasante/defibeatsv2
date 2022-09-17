import { ethers } from "ethers"
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { loadProvider } from "../redux/actions";

const SearchBar = () => {

    const [activeAccount, setActiveAccount] = useState()
    const dispatch = useDispatch();

    
    


    const connectWallet = async () => {
        try{
            const {ethereum} = window;
            if(!ethereum){
                alert("Please install Metamask")
                return;
              }

            const accounts = await ethereum.request({method: "eth_requestAccounts"})
            setActiveAccount(accounts[0])
            console.log(`Account connected: ${accounts[0]}`)
            
            
            

        }catch (error){
            console.log(error)
        }
    }
    

    const checkIfWalletIsConnected = async () => {

        const {ethereum} = window;

        if(!ethereum){
            alert("please install metamask")
            return;
        } else{
            console.log("we have the ethereum object")
        }

        const accounts = await ethereum.request({method: "eth_accounts"})

        if(accounts.length !== 0){
            const currentAccount = accounts[0]
            setActiveAccount(currentAccount)
            console.log(`Connected to ${currentAccount}`)
        } else{
            console.log("No accounts authorized or connected")
        }


        loadProvider(dispatch)

    }

  


    useEffect(()=>{
        checkIfWalletIsConnected();
    },[])

  return (
    <div className="search-bar-container">
        <div className="button-container">
            {!activeAccount ? <button onClick={connectWallet} className="button">connect</button> : <button onClick={null} className='button'>Wallet: {activeAccount.slice(0, 6)}...{activeAccount.slice(-4)}</button> }
        </div>
        <div >
            <div>

                <ul className="navbar-links">
                    <a href="">Home</a>
                    <a href="">Browse</a>
                    <a href="">My Songs</a>
                    <a href="">Upload</a>
                    <a href="">Profile</a> 
                                     
                </ul>
                
            </div>
            

            <div className="search-bar-form">
                SearchBar
            </div>
        </div>
            
        


    </div>
  )
}

export default SearchBar