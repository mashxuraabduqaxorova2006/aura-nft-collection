// app.js - AuraNFT DApp Logic
const contractAddress = "0x0000000000000000000000000000000000000000"; // Deploydan keyin o'zgartiring

const contractABI = [
    {
        "inputs": [
            { "internalType": "address", "name": "recipient", "type": "address" },
            { "internalType": "string", "name": "uri", "type": "string" }
        ],
        "name": "mintNFT",
        "outputs": [
            { "internalType": "uint256", "name": "", "type": "uint256" }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "uint256", "name": "tokenId", "type": "uint256" }
        ],
        "name": "voteForNFT",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "uint256", "name": "tokenId", "type": "uint256" }
        ],
        "name": "getVotes",
        "outputs": [
            { "internalType": "uint256", "name": "", "type": "uint256" }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

let provider;
let signer;
let contract;

const connectBtn = document.getElementById('connectWallet');
const mintBtn = document.getElementById('mintBtn');

async function connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            provider = new ethers.providers.Web3Provider(window.ethereum);
            signer = provider.getSigner();
            
            const address = await signer.getAddress();
            connectBtn.innerText = address.slice(0, 6) + "..." + address.slice(-4);
            connectBtn.style.background = "rgba(0, 242, 255, 0.1)";
            connectBtn.style.color = "var(--accent-primary)";
            connectBtn.style.border = "1px solid var(--accent-primary)";

            contract = new ethers.Contract(contractAddress, contractABI, signer);
            console.log("Contract connected at:", contractAddress);
        } catch (error) {
            console.error("Ulanishda xato:", error);
            alert("Hamyonni ulashda xatolik yuz berdi.");
        }
    } else {
        alert("Iltimos, MetaMask o'rnating!");
    }
}

async function mintNFT() {
    if (!contract) return alert("Avval hamyonni ulang!");
    
    const name = document.getElementById('nftName').value;
    const desc = document.getElementById('nftDesc').value;
    const url = document.getElementById('nftUrl').value;

    if (!name || !url) return alert("Iltimos, barcha maydonlarni to'ldiring!");

    try {
        console.log("Minting NFT...");
        const tx = await contract.mintNFT(await signer.getAddress(), url);
        alert("Tranzaksiya yuborildi: " + tx.hash);
        await tx.wait();
        alert("Tabriklaymiz! NFT muvaffaqiyatli yaratildi.");
    } catch (error) {
        console.error("Mintingda xato:", error);
        alert("Xatolik: " + (error.data ? error.data.message : error.message));
    }
}

async function vote(tokenId) {
    if (!contract) return alert("Avval hamyonni ulang!");

    try {
        const tx = await contract.voteForNFT(tokenId);
        alert("Ovoz berilmoqda...");
        await tx.wait();
        alert("Ovoz muvaffaqiyatli qabul qilindi!");
        location.reload(); // Ma'lumotlarni yangilash uchun
    } catch (error) {
        console.error("Ovoz berishda xato:", error);
        alert("Xatolik: " + (error.data ? error.data.message : error.message));
    }
}

connectBtn.addEventListener('click', connectWallet);
mintBtn.addEventListener('click', mintNFT);

// Ovoz berish tugmalari uchun (dinamik elementlar bo'lsa event delegation ishlatish yaxshi)
document.querySelectorAll('.btn-vote').forEach((btn, index) => {
    btn.addEventListener('click', () => vote(index)); // Bu yerda index tokedId sifatida ishlatiladi (demo uchun)
});
