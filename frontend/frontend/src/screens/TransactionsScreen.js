import React, { useState, useEffect } from "react";
import { MDBDataTable } from "mdbreact";
import { Box, Flex } from "rebass";

function Transactions() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});

  const token = localStorage.getItem("REACT_TOKEN_AUTH_KEY");

  useEffect(() => {
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${JSON.parse(token)}`,
      },
    };

    fetch("http://localhost:5000/transaction/get-transactions", requestOptions)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setData({
          columns: [
            {
              label: "Id",
              field: "id",
              sort: "asc",
              width: 150,
            },
            {
              label: "Amount",
              field: "amount",
              sort: "asc",
              width: 270,
            },
            {
              label: "From user",
              field: "from_user",
              sort: "asc",
              width: 200,
            },
            {
              label: "To user",
              field: "to_user",
              sort: "asc",
              width: 200,
            },
            {
              label: "Currency",
              field: "currency",
              sort: "asc",
              width: 50,
            },
            {
              label: "Hash",
              field: "transaction_hash",
              sort: "asc",
              width: 50,
            },
            {
              label: "State",
              field: "transaction_state",
              sort: "asc",
              width: 50,
            },
            {
              label: "Start Date",
              field: "transaction_date",
              sort: "asc",
              width: 50,
            },
          ],
          rows: [...data.from_user, ...data.to_user],
        });
      })
      .catch((err) => console.log(err));

    setLoading(false);
  }, []);

  return (
    <>
      {loading ? (
        <></>
      ) : (
        <>
          {" "}
          <Box
            sx={{
              maxWidth: 1200,
              mx: "auto",
              px: 3,
              py: 4,
            }}
          >
            <h1>Transactions:</h1>
            <MDBDataTable striped bordered small data={data} />
          </Box>
        </>
      )}
    </>
  );
}

export default Transactions;
