import React, { useState, useEffect } from "react";
import { Box, Flex } from "rebass";
import { Table } from "react-bootstrap";

function HomeScreen() {
  const [exchange_rate, setExchangeRate] = useState([]);

  useEffect(() => {
    const requestOptions = {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    };

    fetch("http://localhost:5000/transaction/exchange-rate", requestOptions)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setExchangeRate(data.exchange_rate);
      });
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
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Coin</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {exchange_rate.map((ex_rate, i) => {
              return [
                <tr key={i}>
                  <td>{ex_rate.coin}</td>
                  <td>{ex_rate.price}$</td>
                </tr>,
              ];
            })}
          </tbody>
        </Table>
      </Box>
    </>
  );
}

export default HomeScreen;
