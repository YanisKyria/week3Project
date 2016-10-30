var accounts;
var account0;
var account1;
var account2;

function setStatus(message) {
  var status = document.getElementById("status");
  status.innerHTML = message;
};


function refreshBalance() {
  var splitContract = SplitCoin.deployed();
  var balance0_element = document.getElementById("balance0");
  var balance1_element = document.getElementById("balance1");
  var balance2_element = document.getElementById("balance2");

   splitContract.getBalance.call(account0, {from: account0}).then(function(value) {
    var balance_element = document.getElementById("balance");
    balance_element.innerHTML = value.valueOf();

  }).catch(function(e) {
    console.log(e);
    setStatus("Error getting balance; see log.");
  });

   web3.eth.getBalance(account0, function(err, balance0) {
    if (err != null) {
      alert("There was an error fetching your account balance0.");
      return;
    }

    balance0_element.innerHTML = web3.fromWei(balance0, 'ether');
  });

  web3.eth.getBalance(account1, function(err, balance1) {
    if (err != null) {
      alert("There was an error fetching your account balance1.");
      return;
    }

    balance1_element.innerHTML = web3.fromWei(balance1, 'ether');
  });

  web3.eth.getBalance(account2, function(err, balance2) {
    if (err != null) {
      alert("There was an error fetching your account balance2.");
      return;
    }

    balance2_element.innerHTML = web3.fromWei(balance2, 'ether');
  });
  
};


function sendCoinToSplit() {
  var splitContract = SplitCoin.deployed();
  var amountToSplit = parseInt(document.getElementById("amountToSplit").value);

  
  setStatus("Initiating transaction... (please wait)");

  splitContract.deposit( {from: account0, value: amountToSplit, gas: 500000, gasPrice: web3.eth.gasPrice.toString(10)}).then(function(value) {
    setStatus("Transaction complete!");
    refreshBalance();
    console.log("Balance updated for account ", account0, "by adding", amountToSplit);
    return value;
  }).catch(function(e) {
    console.log(e);
    setStatus("Error sending coin to balance from account 0; see log.");
  });
  
  splitContract.sendCoinToSplit(account1, amountToSplit, {from: account0, gas: 500000, gasPrice: web3.eth.gasPrice.toString(10)}).then(function(bool) {
    setStatus("Transaction complete!");
    refreshBalance();
    console.log("Half of the amount sent from balance to ", account1);
    return bool;
  }).catch(function(e) {
    console.log(e);
    setStatus("Error sending coin to account 1; see log.");
  });

  splitContract.sendCoinToSplit(account2, amountToSplit, {from: account0, gas: 500000, gasPrice: web3.eth.gasPrice.toString(10)}).then(function(bool) {
    setStatus("Transaction complete!");
    refreshBalance();
    console.log("Half of the amount sent from balance to ", account2);
    return bool;
  }).catch(function(e) {
    console.log(e);
    setStatus("Error sending coin to account 2; see log.");
  });

};

function fullWithdraw() {
  var splitContract = SplitCoin.deployed();
  
  setStatus("Initiating Full Withdraw... (please wait)");


  splitContract.withdraw( {from: account0}).then(function(value) {
    setStatus("Withdraw complete!");
    console.log("Balance updated for account ", account0, "after withdrawing all his money:", value.valueOf());
    refreshBalance();
    return value;
  }).catch(function(e) {
    console.log(e);
    setStatus("Error withdrawing; see log.");
  });
  
};

function splitInOneTransaction() {
 var splitContract = SplitCoin.deployed();
  var amountToSplit = parseInt(document.getElementById("amountToSplit").value);

  
  setStatus("Initiating transaction... (please wait)");

  splitContract.splitOneTransaction(account1, account2, {from: account0, value: amountToSplit, gas: 500000, gasPrice: web3.eth.gasPrice.toString(10)}).then(function(value) {
    setStatus("Transaction complete!");
    refreshBalance();
    console.log("Balance updated for account ", account0, "by splitting", amountToSplit);
    return value;
  }).catch(function(e) {
    console.log(e);
    setStatus("Error sending coin to balance from account 0; see log.");
  });
  
};


window.onload = function() {
  var receiver0_element = document.getElementById("receiver0");
  var receiver1_element = document.getElementById("receiver1");
  var receiver2_element = document.getElementById("receiver2");

  web3.eth.getAccounts(function(err, accs) {
    if (err != null) {
      alert("There was an error fetching your accounts.");
      return;
    }

    if (accs.length == 0) {
      alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
      return;
    }

    accounts = accs;
    account0 = accounts[0];
    receiver0_element.innerHTML = account0;
    account1 = accounts[1];
    receiver1_element.innerHTML = account1;
    account2 = accounts[2];
    receiver2_element.innerHTML = account2;
    refreshBalance();
  });
}
