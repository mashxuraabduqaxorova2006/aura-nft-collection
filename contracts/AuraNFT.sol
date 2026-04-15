// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AuraNFT is ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;
    
    // NFTlar uchun ovozlar soni
    mapping(uint256 => uint256) public voteCount;
    
    // Foydalanuvchi qaysi NFTga ovoz berganini saqlash
    mapping(address => mapping(uint256 => bool)) public hasVoted;

    event NFTMinted(address indexed owner, uint256 indexed tokenId, string tokenURI);
    event Voted(address indexed voter, uint256 indexed tokenId, uint256 newVoteCount);

    constructor() ERC721("Aura Digital Collection", "AURA") Ownable(msg.sender) {}

    // 1. NFT yaratish (Mint) funksiyasi
    function mintNFT(address recipient, string memory uri) public returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _safeMint(recipient, tokenId);
        _setTokenURI(tokenId, uri);

        emit NFTMinted(recipient, tokenId, uri);
        return tokenId;
    }

    // 2. Ovoz berish funksiyasi (CRUD/Vote talabi uchun)
    function voteForNFT(uint256 tokenId) public {
        require(_ownerOf(tokenId) != address(0), "Xatolik: Bunday NFT mavjud emas!");
        require(!hasVoted[msg.sender][tokenId], "Xatolik: Siz ushbu NFT'ga allaqachon ovoz bergansiz!");

        voteCount[tokenId] += 1;
        hasVoted[msg.sender][tokenId] = true;

        emit Voted(msg.sender, tokenId, voteCount[tokenId]);
    }

    // 3. Ovozlar sonini olish
    function getVotes(uint256 tokenId) public view returns (uint256) {
        return voteCount[tokenId];
    }
}
