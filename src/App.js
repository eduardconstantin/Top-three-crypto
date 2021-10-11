import React, {useEffect, useState} from 'react';
import CriptoCard from "./components/CriptoCard";
import 'odometer/themes/odometer-theme-default.css';

export default function App() {
  const [data, setData] = useState(null);

  const fetchData = () => {
    fetch("https://api.coinstats.app/public/v1/coins?skip=0&limit=3")
     .then( response => {
        if(response.ok){
           return response.json();
        }
        throw response;
     }).then(result => {
        setData(result);
     }).catch(error => console.error(error))
  }

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      fetchData();
      console.log('fetched');
    }, 300000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container">
      <header className="text-center my-5">
        <h1>TOP 3 CRYPTOCURRENCIES</h1>
      </header>
      <section className="crypto-cards">
        <div className="row">
        {data?.coins.map(item => <CriptoCard 
                                  key={item.id} 
                                  cardTitle={item.name}
                                  image={item.icon}
                                  price={item.price}
                                  aSupply={item.availableSupply}
                                  tSupply={item.totalSupply}
                                  priceChangeH={item.priceChange1h}
                                  priceChangeD={item.priceChange1d}
                                  priceChangeW={item.priceChange1w}
                                  website={item.websiteUrl}
                                  coinId={item.id}
                                  />)}
        </div>
      </section>
    </div>
  );
}

