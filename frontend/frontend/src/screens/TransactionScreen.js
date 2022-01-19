import React, { useState, useEffect } from "react";
import { Box, Flex } from "rebass";
import { Form, Button } from "react-bootstrap";

function TransactionScreen() {
  const token = localStorage.getItem("REACT_TOKEN_AUTH_KEY");
  const [userAccounts, setUserAccounts] = useState([]);

  const handleTransaction = (event) => {
    event.preventDefault();
    console.log("handle trans entered");

    const body = {
      amount: event.target.elements.amount.value,
      account_id: event.target.elements.account_id.value,
      to_user_email: event.target.elements.to_user_email.value,
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

    fetch("http://localhost:5000/transaction/transfer-money", requestOptions)
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
    <>
      <Box
        sx={{
          maxWidth: 768,
          mx: "auto",
          px: 3,
          py: 4,
        }}
      >
        <Form onSubmit={handleTransaction}>
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
            <Form.Label htmlFor="to_user_email">Email</Form.Label>
            <Form.Control
              id="to_user_email"
              placeholder="Email"
              required
              type="email"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label htmlFor="amount">Amount</Form.Label>
            <Form.Control
              id="amount"
              placeholder="Amount"
              required
              type="number"
            />
          </Form.Group>
          <Button type="submit">Submit</Button>
        </Form>
      </Box>
    </>
  );
}

export default TransactionScreen;
