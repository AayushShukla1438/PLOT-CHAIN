// src/getWeb3.js

import Web3 from 'web3';

const getWeb3 = () =>
  new Promise((resolve, reject) => {
    window.addEventListener('load', async () => {
      // Wait for loading completion to avoid race conditions with web3 injection timing.
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try {
          // Request account access if needed
          await window.ethereum.request({ method: "eth_requestAccounts" });
          // Accounts now exposed
          resolve(web3);
        } catch (error) {
          reject(error);
        }
      } else if (window.web3) {
        // Use Mist/MetaMask's provider.
        const web3 = window.web3;
        console.log('Injected web3 detected.');
        resolve(web3);
      } else {
        // Fallback to localhost; use Ganache.
        const provider = new Web3.providers.HttpProvider('http://127.0.0.1:7545');
        const web3 = new Web3(provider);
        console.log('No web3 instance injected, using Local web3.');
        resolve(web3);
      }
    });
  });

export default getWeb3;
