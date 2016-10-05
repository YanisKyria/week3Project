var accounts;
var account;
var account1;
var account2;
var balance;

function setStatus(message) {
  var status = document.getElementById("status");
  status.innerHTML = message;
};

function refreshBalance() {
  var meta = MetaCoin.deployed();
  var adress_receiver1 = document.getElementById("receiver1");
  var adress_receiver2 = document.getElementById("receiver2");

  adress_receiver1.innerHTML = account1;
  adress_receiver2.innerHTML = account2;

  meta.getBalance.call(account, {from: account}).then(function(value) {
    var balance_element = document.getElementById("balance");
    balance_element.innerHTML = value.valueOf();
  }).catch(function(e) {
    console.log(e);
    setStatus("Error getting balance; see log.");
  });

  meta.getBalance.call(account1, {from: account1}).then(function(value) {
    var balance_element = document.getElementById("balance1");
    balance_element.innerHTML = value.valueOf();
  }).catch(function(e) {
    console.log(e);
    setStatus("Error getting balance; see log.");
  });

  meta.getBalance.call(account2, {from: account2}).then(function(value) {
    var balance_element = document.getElementById("balance2");
    balance_element.innerHTML = value.valueOf();
  }).catch(function(e) {
    console.log(e);
    setStatus("Error getting balance; see log.");
  });
};

function sendCoin() {
  var meta = MetaCoin.deployed();

  var amount = parseInt(document.getElementById("amount").value);
  var receiver = document.getElementById("receiver").value;

  setStatus("Initiating transaction... (please wait)");

  meta.sendCoin(receiver, amount, {from: account}).then(function() {
    setStatus("Transaction complete!");
    refreshBalance();
  }).catch(function(e) {
    console.log(e);
    setStatus("Error sending coin; see log.");
  });
};

function sendCoinToSplit() {
  var meta = MetaCoin.deployed();
  var amountToSplit = parseInt(document.getElementById("amountToSplit").value);
  
  setStatus("Initiating transaction... (please wait)");

  meta.sendCoinToSplit(account1,account2, amountToSplit, {from: account}).then(function() {
    setStatus("Transaction complete!");
    refreshBalance();
  }).catch(function(e) {
    console.log(e);
    setStatus("Error sending coin; see log.");
  });
};

window.onload = function() {
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
    account = accounts[0];
    account1 = accounts[1];
    account2 = accounts[2];

    refreshBalance();
  });
}
