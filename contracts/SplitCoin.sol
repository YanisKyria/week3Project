pragma solidity 0.4.4;
contract SplitCoin {
	
	mapping (address => uint) balances;

	function SplitCoin() {
		balances[tx.origin] = 0;
	}

	function sendCoinToSplit(address receiver, uint amount) returns(bool sufficient) {
		address owner;
		
		owner = msg.sender;
				
		if (balances[owner] < amount/2) {
            throw;
        }
	
	    balances[owner] -= amount/2;
	    // if it's an odd value, we keep the remaining 1 value in the balance. Nothing gets lost.
	    if (!receiver.send(amount/2)) {
                balances[msg.sender] += amount/2;
                // when failing, the amount is set back to the balance so we do not loose anything
                throw;
            }

		return true;
	}

	function deposit() returns (uint _deposit) {
        _deposit = msg.value;
        
        balances[msg.sender] += _deposit;
        if (!this.send(_deposit)) {
        	balances[msg.sender] -= _deposit;
        	throw;
        }

        return _deposit;
    }

	function withdraw() returns (uint _withdrawn) {
        address receiver;

        receiver = msg.sender;
        _withdrawn = balances[receiver];

        if (_withdrawn == 0) throw;
        if (this.balance < _withdrawn) throw;

		balances[receiver] = 0;
        if (!receiver.send(_withdrawn)) { 
        	balances[receiver] = _withdrawn;
        	throw;
        }

        return _withdrawn;
    }

	function getBalance(address addr) returns(uint) {
  	return balances[addr];
  	}

    function splitOneTransaction (address receiver1, address receiver2) payable returns(bool sufficient) {
             
        uint amountSent2 = msg.value ;
        uint amountSent1 = amountSent2/2;
        
        if (!receiver1.send(amountSent1)) {
                throw;
            }

        amountSent2 -= amountSent1;
        if (!receiver2.send(amountSent2)) {
                throw;
            }
        return true;
    }
}