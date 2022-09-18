import { ethers } from "ethers"
import {Link } from "react-router-dom"
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { loadProvider, loadAccount } from "../redux/actions";

const SearchBar = () => {

    const [activeAccount, setActiveAccount] = useState()
    const [search, setSearch] = useState("")

    const dispatch = useDispatch();

    const provider = useSelector(state=>state.provider.connection)

    
    const connectWallet = async () => {
       
        try{
            const {ethereum} = window;
            if(!ethereum){
                alert("Please install Metamask")
                return;
              }

            const accounts = await ethereum.request({method: "eth_requestAccounts"})
            const account = accounts[0]

            setActiveAccount(account)

            console.log(`Account connected: ${accounts[0]}`)

            dispatch({type: "ACCOUNT_LOADED", account: account}) 
            
            let balance = await provider.getBalance(account)
            balance = ethers.utils.formatEther(balance)
        
            dispatch({ type: 'ETHER_BALANCE_LOADED', balance: balance })
            
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

            dispatch({type: "ACCOUNT_LOADED", account: currentAccount})

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
                    <Link className="nav-bar-links-link" to='profile'>Profile</Link>
                    <Link className="nav-bar-links-link" to='/upload'>Upload</Link>
                    <Link className="nav-bar-links-link" to='/mysongs'>My Songs</Link>
                    <Link className="nav-bar-links-link" to='/browse'>Browse</Link>
                    <Link className="nav-bar-links-link" to='/'>Home</Link> 
                                     
                </ul>
                
            </div>
            

            <div className="search-bar-form">
                <input className="search-bar" type="text" onChange={(e)=>setSearch(e.target.value)} placeholder="Search For a Song.." />
            </div>
        </div>
            
        


    </div>
  )
}

export default SearchBar