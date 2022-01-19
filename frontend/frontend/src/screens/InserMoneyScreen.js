import React, { useState, useEffect } from "react";
import { Box, Flex } from "rebass";
import { Form, Button } from "react-bootstrap";

function InserMoneyScreen() {
  const [userAccounts, setUserAccounts] = useState([]);
  const [accountCurrency, setAccountCurrency] = useState("");
  const token = localStorage.getItem("REACT_TOKEN_AUTH_KEY");

  const handleInsertMoney = (event) => {
    event.preventDefault();

    const body = {
      name: event.target.elements.name.value,
      account_id: event.target.elements.account_id.value,
      expire_date: event.target.elements.expire_date.value,
      secure_code: event.target.elements.secure_code.value,
      amount: event.target.elements.amount.value,
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

    fetch("http://localhost:5000/transaction/insert-money", requestOptions)
      .then((res) => res.json())
      .then((data) => {
        alert(data.message);
      });
  };

  useEffect(() => {
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${JSON.parse(token)}`,
      },
    };

    fetch("http://localhost:5000/auth/account-balance", requestOptions)
      .then((res) => res.json())
      .then((data) => {
        setUserAccounts(data.accounts);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div>
      <Box
        sx={{
          maxWidth: 768,
          mx: "auto",
          px: 3,
          py: 4,
        }}
      >
        <Form onSubmit={handleInsertMoney}>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="account_id">Account</Form.Label>
            <Form.Select id="account_id">
              {userAccounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.id}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="name">Name</Form.Label>
            <Form.Control id="name" placeholder="Name" required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="expire_date">Expire Date</Form.Label>
            <Form.Control
              id="expire_date"
              placeholder="Expire Date"
              required
              type="date"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="secure_code">Secure code</Form.Label>
            <Form.Control
              id="secure_code"
              placeholder="Secure code"
              required
              type="number"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="amount">Amount</Form.Label>
            <Form.Control
              id="amount"
              placeholder="Secure code"
              required
              type="number"
            />
          </Form.Group>
          <Button type="submit">Submit</Button>
        </Form>
      </Box>
    </div>
  );
}

export default InserMoneyScreen;
