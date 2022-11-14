//SPDX-License-Identifier:MIT

pragma solidity^0.8.0;

contract MultiSignerWallet{
    address [] public owners;
    uint public threshold;

    struct Transfer{
        uint id;
        uint amount;
        address payable to;
        uint approvals; 
        bool sent;
    }

    Transfer [] public transfers;
    

    mapping(address=>mapping(uint=>bool)) public approvals;


    constructor(address[] memory _owners,uint _threshold){
        owners=_owners;
        threshold=_threshold;
    }

      modifier ownerOnly() {
        bool owner = false;
        for(uint i = 0; i < owners.length; i++) {
            if(msg.sender == owners[i]) {
                owner = true;
            }
        } 
        require(owner == true, "Only owner can access");
        _;
    }

    function getOwners()external view returns(address[] memory){
        return owners;
    }
    function createTransfer(uint amount, address payable to)external{
        transfers.push(Transfer(
            transfers.length,
            amount,
            to,
            0,
            false
        ));
    } 

    function getTransfers()external view returns(Transfer[] memory){
        return transfers;
    }

    function approveTransfer(uint id)external ownerOnly{
        require(transfers[id].sent==false,"transfer already has been sent");
        require(approvals[msg.sender][id]==false,"cannot approve again");

        approvals[msg.sender][id] == true;
        transfers[id].approvals++;


        if(transfers[id].approvals>=threshold){
            transfers[id].sent=true;
            address payable to = transfers[id].to;
            uint amount = transfers[id].amount;
            to.transfer(amount);
        }
    }
    // receive()external payable{}
    function deposit()external payable{

    }
}