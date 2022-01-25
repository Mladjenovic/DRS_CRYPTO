import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { Box, Flex } from "rebass";

function ExchangeScreen() {
  const [exchange_rate, setExchangeRate] = useState([]);
  const [cyptoValueUSD, setCryptoValueUSD] = useState(0);
  const [accountBalance, setAccountBalance] = useState([]);
  const [accountCurrency, setaccountCurrency] = useState([]);
  const token = localStorage.getItem("REACT_TOKEN_AUTH_KEY");

  const handleCoinChange = () => {
    var e = document.getElementById("coin_name");
    setCryptoValueUSD(e.value);
  };

  const handleAccountChange = (event) => {
    event.preventDefault();
    var e = document.getElementById("account_currency");
    setaccountCurrency(e.value);
  };

  const handleExchange = () => {
    var amount = document.getElementById("amount").value;
    var old_currency = accountCurrency;
    var e = document.getElementById("account_currency");
    var account_id = e.options[e.selectedIndex].text;

    var c = document.getElementById("coin_name");
    var value = c.options[c.selectedIndex].value; // get selected option value
    var coin_name = c.options[c.selectedIndex].text;

    var coin_value = document.getElementById("coin_name").value;

    console.log("type of amount", typeof amount);
    console.log("amonunt value", amount);
    if (amount === "" || amount == undefined) {
      alert("Amont can't be empty");
      return;
    }

    const body = {
      amount: amount,
      account_id: account_id,
      old_currency: old_currency,
      account_id: account_id,
      coin_name: coin_name,
      coin_value: coin_value,
    };

    console.log(body);

    const requestOptions = {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${JSON.parse(token)}`,
      },
      body: JSON.stringify(body),
    };

    fetch("http://localhost:5000/transaction/exchange", requestOptions)
      .then((res) => res.json())
      .then((data) => {
        alert(data.message);
      });
  };

  useEffect(() => {
    console.log("ExchangeScreen");
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${JSON.parse(token)}`,
      },
    };

    fetch("http://localhost:5000/transaction/exchange-rate", requestOptions)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setExchangeRate(data.exchange_rate);
        setCryptoValueUSD([data.exchange_rate[0].price]);
      });

    fetch("http://localhost:5000/auth/account-balance", requestOptions)
      .then((res) => res.json())
      .then((data) => {
        console.log(data.accounts);
        setAccountBalance(data.accounts);
        setaccountCurrency(data.accounts[0].currency);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <br />
      <br />
      <br />
      <Box
        sx={{
          maxWidth: 768,
          mx: "auto",
          px: 3,
          py: 4,
        }}
        style={{
          boxShadow:
            "rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset",
        }}
      >
        <h1>From account</h1>
        <Flex
          sx={{
            flexWrap: "wrap",
          }}
        >
          <Box
            sx={{
              p: 3,
              flexGrow: 1,
              flexBasis: 256,
            }}
          >
            <Form.Group className="mb-3">
              <Form.Label htmlFor="crypto_value_in_usd">
                <b>Valute</b>
              </Form.Label>
              <br />
              <br />
              <Form.Label htmlFor="crypto_value_in_usd">
                <b>{accountCurrency}</b>
              </Form.Label>
            </Form.Group>
          </Box>
          <Box
            sx={{
              p: 3,
              flexGrow: 99999,
              flexBasis: 0,
              minWidth: 320,
            }}
          >
            <Form>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="account_currency">Account</Form.Label>
                <br />
                <br />
                <Form.Select
                  id="account_currency"
                  onChange={handleAccountChange}
                >
                  {accountBalance.map((account) => (
                    <option key={account.id} value={account.currency}>
                      {account.id}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Form>
          </Box>
        </Flex>
        <h1>Amount</h1>
        <Box
          sx={{
            maxWidth: 768,
            mx: "auto",
            px: 3,
            py: 4,
          }}
        >
          <Form.Group className="mb-3" style={{ width: "50%" }}>
            <Form.Label htmlFor="amount">Amount</Form.Label>
            <Form.Control
              id="amount"
              placeholder="Amount"
              required
              type="number"
            />
          </Form.Group>
        </Box>
        <h1>Into value</h1>
        <Flex
          sx={{
            flexWrap: "wrap",
          }}
        >
          <Box
            sx={{
              p: 3,
              flexGrow: 1,
              flexBasis: 256,
            }}
          >
            <Form>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="coin_name">Coin</Form.Label>
                <Form.Select id="coin_name" onChange={handleCoinChange}>
                  {exchange_rate.map((rate) => (
                    <option key={rate.coin} value={rate.price}>
                      {rate.coin}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Form>
          </Box>
          <Box
            sx={{
              p: 3,
              flexGrow: 99999,
              flexBasis: 0,
              minWidth: 320,
            }}
          >
            <Form.Group className="mb-3">
              <br />
              <br />
              <Form.Label htmlFor="crypto_value_in_usd">
                <b>{cyptoValueUSD} $</b>
              </Form.Label>
            </Form.Group>
          </Box>
        </Flex>

        <Button
          style={{ margin: "auto", display: "block", width: "50%" }}
          onClick={handleExchange}
        >
          Exchange
        </Button>
      </Box>
    </>
  );
}

export default ExchangeScreen;
