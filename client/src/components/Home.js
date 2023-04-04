import React, { useEffect, useState } from 'react';
import axios from "axios";

const Home = () => {
  const [itemsData, setItemsData] = useState(undefined);

  useEffect(() => {
    async function fetchData () {
      try {
        const { data } = await axios.get(
          "https://tempapi.proj.me/api/YO4GQLPeW"
        );
        setItemsData(data);
      } catch (err) {
        console.log(err);
      }
    }

    fetchData();
  }, []);

  const itemsCard = () => {
    return (
      <div>
        {itemsData.map((item) => {
          <div key={item.id}>
            {item.name ? <div>{item.name}</div> : <></>}
            {item.description ? <div>{item.description}</div> : <></>}
            {item.type ? <div>Type: {item.type}</div> : <></>}
            {item.status ? <div>Status: {item.status}</div> : <></>}
          </div>
        })}
      </div>
    );
  };

  return (
    <div>
      {itemsData ? <div>{itemsCard}</div> : <></>}
    </div>
  )
};

export default Home;