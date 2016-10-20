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

	function deposit() returns (uint balance) {
        
        balances[msg.sender] += msg.value;
        return balances[msg.sender];
    }

	function getBalance(address addr) returns(uint) {
  	return balances[addr];
  	}

}