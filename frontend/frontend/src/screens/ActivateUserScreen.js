import React, { useState, useEffect } from "react";
import { Box, Flex } from "rebass";
import { Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

function ActivateUserScreen() {
  const token = localStorage.getItem("REACT_TOKEN_AUTH_KEY");
  const navigate = useNavigate();

  const handleActivateUser = (event) => {
    event.preventDefault();
    const body = {
      card_number: event.target.elements.card_number.value,
      name: event.target.elements.name.value,
      expire_date: event.target.elements.expire_date.value,
      secure_code: event.target.elements.secure_code.value,
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

    fetch("http://localhost:5000/auth/verify-user", requestOptions)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.message == "User successfully activated.") {
          const userData = JSON.parse(localStorage.getItem("userData"));
          userData.isActive = true;
          localStorage.setItem("userData", JSON.stringify(userData));
          navigate("/");
          window.location.reload(false);
        }
      });
  };

  useEffect(() => {}, []);

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
        <Form onSubmit={handleActivateUser}>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="card_number">Card number</Form.Label>
            <Form.Control
              id="card_number"
              placeholder="Card number"
              required
              type="number"
            />
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
          <Button type="submit">Verify account</Button>
        </Form>
      </Box>
    </div>
  );
}

export default ActivateUserScreen;
