import { ethers } from "ethers"
import {Link } from "react-router-dom"
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { loadAccount } from "../redux/actions";
import { loadProfileNftContract } from "../redux/actions";
import { networks } from "../utils/networks";

const SearchBar = () => {

    const [activeAccount, setActiveAccount] = useState()
    const dispatch = useDispatch();
    const provider = useSelector(state=>state.provider.connection)
    const [network, setNetwork] = useState("")

    
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
            
            loadAccount(provider, dispatch)
                    
        }catch (error){
            console.log(error)
        }

        
                    
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const checkIfWalletIsConnected = async () => {

        const {ethereum} = window;

        if(!ethereum){
            alert("please install metamask")
            return;
        } else{
            console.log("we have the ethereum object")
        }

        const accounts = await ethereum.request({method: "eth_accounts"})

        const chainId = await ethereum.request({method: "eth_chainId"})

            setNetwork(networks[chainId])

            ethereum.on('chainChanged', handleChainChanged);

            function handleChainChanged(_chainId) {
                window.location.reload();
            }

        if(accounts.length !== 0){
            const currentAccount = accounts[0]
            setActiveAccount(currentAccount)

            console.log(`Connected to ${currentAccount}`)

            dispatch({type: "ACCOUNT_LOADED", account: currentAccount})
            
            
            const connection = new ethers.providers.Web3Provider(ethereum)

            dispatch({ type: 'PROVIDER_LOADED', connection }) // causes bug in console, still have to figure out

            

            

        } else{
            console.log("No accounts authorized or connected")
        }
        
    }

   

    useEffect(()=>{
        
        checkIfWalletIsConnected();
        loadProfileNftContract(provider, dispatch)
        

    },[checkIfWalletIsConnected, setNetwork, network, dispatch, provider])
    

  return (
    <div className="navbar navbar-light navbar-expand bg-white shadow mb-4 topbar static-top ">
    {console.log(network)}
        {network !== "Polygon Mumbai Testnet" ? <h1>Connect to Mumbai Testnet</h1> :(
            <>
                <div className="button-container">
                    {!activeAccount ? <button onClick={connectWallet} className="blue-button">connect</button> : <button onClick={null} className='blue-button'>Wallet: {activeAccount.slice(0, 6)}...{activeAccount.slice(-4)}</button> }
                </div>
            

                        <ul className="navbar-links">
                            <Link className="nav-bar-links-link" to='profile'>Profile</Link>
                            <Link className="nav-bar-links-link" to='/upload'>Upload</Link>
                            <Link className="nav-bar-links-link" to='/mysongs'>My Songs</Link>
                            <Link className="nav-bar-links-link" to='/browse'>Browse</Link>
                            <Link className="nav-bar-links-link" to='/'>Home</Link> 
                                            
                        </ul>      

            </>
        ) }
         


    </div>
  )
}

export default SearchBar


/*
<nav class="navbar navbar-light navbar-expand bg-white shadow mb-4 topbar static-top">
    <div class="container-fluid"><button id="sidebarToggleTop" class="btn btn-link d-md-none rounded-circle me-3" type="button"><i class="fas fa-bars"></i></button>
        <form class="d-none d-sm-inline-block me-auto ms-md-3 my-2 my-md-0 mw-100 navbar-search">
            <div class="input-group"><input class="bg-light form-control border-0 small" type="text" placeholder="Search for ..." /><button class="btn btn-primary py-0" type="button"><i class="fas fa-search"></i></button></div>
        </form>
        <ul class="navbar-nav flex-nowrap ms-auto">
            <li class="nav-item dropdown d-sm-none no-arrow"><a class="dropdown-toggle nav-link" data-bs-toggle="dropdown" href="#"><i class="fas fa-search"></i></a>
                <div class="dropdown-menu dropdown-menu-end p-3 animated--grow-in">
                    <form class="me-auto navbar-search w-100">
                        <div class="input-group"><input class="bg-light form-control border-0 small" type="text" placeholder="Search for ..." />
                            <div class="input-group-append"><button class="btn btn-primary py-0" type="button"><i class="fas fa-search"></i></button></div>
                        </div>
                    </form>
                </div>
            </li>
            <li class="nav-item dropdown no-arrow mx-1">
                <div class="nav-item dropdown no-arrow"><a class="dropdown-toggle nav-link" data-bs-toggle="dropdown" href="#"><span class="badge bg-danger badge-counter">3+</span><i class="fas fa-bell fa-fw"></i></a>
                    <div class="dropdown-menu dropdown-menu-end dropdown-list animated--grow-in">
                        <h6 class="dropdown-header">alerts center</h6><a class="dropdown-item d-flex align-items-center" href="#">
                            <div class="me-3">
                                <div class="bg-primary icon-circle"><i class="fas fa-file-alt text-white"></i></div>
                            </div>
                            <div><span class="small text-gray-500">December 12, 2019</span>
                                <p>A new monthly report is ready to download!</p>
                            </div>
                        </a><a class="dropdown-item d-flex align-items-center" href="#">
                            <div class="me-3">
                                <div class="bg-success icon-circle"><i class="fas fa-donate text-white"></i></div>
                            </div>
                            <div><span class="small text-gray-500">December 7, 2019</span>
                                <p>$290.29 has been deposited into your account!</p>
                            </div>
                        </a><a class="dropdown-item d-flex align-items-center" href="#">
                            <div class="me-3">
                                <div class="bg-warning icon-circle"><i class="fas fa-exclamation-triangle text-white"></i></div>
                            </div>
                            <div><span class="small text-gray-500">December 2, 2019</span>
                                <p>Spending Alert: We&#39;ve noticed unusually high spending for your account.</p>
                            </div>
                        </a><a class="dropdown-item text-center small text-gray-500" href="#">Show All Alerts</a>
                    </div>
                </div>
            </li>
            <li class="nav-item dropdown no-arrow mx-1">
                <div class="nav-item dropdown no-arrow"><a class="dropdown-toggle nav-link" data-bs-toggle="dropdown" href="#"><span class="badge bg-danger badge-counter">7</span><i class="fas fa-envelope fa-fw"></i></a>
                    <div class="dropdown-menu dropdown-menu-end dropdown-list animated--grow-in">
                        <h6 class="dropdown-header">alerts center</h6><a class="dropdown-item d-flex align-items-center" href="#">
                            <div class="dropdown-list-image me-3"><img class="rounded-circle" src="blob:file:///2f99fbfe-36a0-4764-b301-db091929f60c" />
                                <div class="bg-success status-indicator"></div>
                            </div>
                            <div class="fw-bold">
                                <div class="text-truncate"><span>Hi there! I am wondering if you can help me with a problem I&#39;ve been having.</span></div>
                                <p class="small text-gray-500 mb-0">Emily Fowler - 58m</p>
                            </div>
                        </a><a class="dropdown-item d-flex align-items-center" href="#">
                            <div class="dropdown-list-image me-3"><img class="rounded-circle" src="blob:file:///2e7f3fe3-01a9-4cfe-bceb-6fae1144bc4c" />
                                <div class="status-indicator"></div>
                            </div>
                            <div class="fw-bold">
                                <div class="text-truncate"><span>I have the photos that you ordered last month!</span></div>
                                <p class="small text-gray-500 mb-0">Jae Chun - 1d</p>
                            </div>
                        </a><a class="dropdown-item d-flex align-items-center" href="#">
                            <div class="dropdown-list-image me-3"><img class="rounded-circle" src="blob:file:///f6e51c1d-0109-4a31-b854-d0138411f6bc" />
                                <div class="bg-warning status-indicator"></div>
                            </div>
                            <div class="fw-bold">
                                <div class="text-truncate"><span>Last month&#39;s report looks great, I am very happy with the progress so far, keep up the good work!</span></div>
                                <p class="small text-gray-500 mb-0">Morgan Alvarez - 2d</p>
                            </div>
                        </a><a class="dropdown-item d-flex align-items-center" href="#">
                            <div class="dropdown-list-image me-3"><img class="rounded-circle" src="blob:file:///2e62398b-cee2-491d-ab5a-618b3ef9639e" />
                                <div class="bg-success status-indicator"></div>
                            </div>
                            <div class="fw-bold">
                                <div class="text-truncate"><span>Am I a good boy? The reason I ask is because someone told me that people say this to all dogs, even if they aren&#39;t good...</span></div>
                                <p class="small text-gray-500 mb-0">Chicken the Dog · 2w</p>
                            </div>
                        </a><a class="dropdown-item text-center small text-gray-500" href="#">Show All Alerts</a>
                    </div>
                </div>
                <div class="shadow dropdown-list dropdown-menu dropdown-menu-end"></div>
            </li>
            <div class="d-none d-sm-block topbar-divider"></div>
            <li class="nav-item dropdown no-arrow">
                <div class="nav-item dropdown no-arrow"><a class="dropdown-toggle nav-link" data-bs-toggle="dropdown" href="#"><span class="d-none d-lg-inline me-2 text-gray-600 small">Valerie Luna</span><img class="border rounded-circle img-profile" src="blob:file:///b7f2a8cf-f0ec-464a-94d2-e1e6e01bdbf6" /></a>
                    <div class="dropdown-menu shadow dropdown-menu-end animated--grow-in"><a class="dropdown-item" href="#"><i class="fas fa-user fa-sm fa-fw me-2 text-gray-400"></i> Profile</a><a class="dropdown-item" href="#"><i class="fas fa-cogs fa-sm fa-fw me-2 text-gray-400"></i> Settings</a><a class="dropdown-item" href="#"><i class="fas fa-list fa-sm fa-fw me-2 text-gray-400"></i> Activity log</a>
                        <div class="dropdown-divider"></div><a class="dropdown-item" href="#"><i class="fas fa-sign-out-alt fa-sm fa-fw me-2 text-gray-400"></i> Logout</a>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</nav>
*/