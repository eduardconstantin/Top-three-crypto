import React, { useState, useEffect } from 'react';
import PriceChange from "./PriceChange";
import Odometer from 'react-odometerjs';
import { Chart, Line } from 'react-chartjs-2';
import annotationPlugin from 'chartjs-plugin-annotation';

export default function CriptoCard(props) {

   const [price, setPrice] = useState(0);
   const [chartData, setChartData] = useState(null);
   Chart.register(annotationPlugin);

   const fetchChartData = () => {
      fetch("https://api.coinstats.app/public/v1/charts?period=24h&coinId=" + props.coinId)
         .then(response => {
            if (response.ok) {
               return response.json();
            }
            throw response;
         }).then(result => {
            setChartData(result);
         }).catch(error => console.error(error));
   }

   useEffect(() => {
      fetchChartData();
      setPrice(props.price);
   }, []);

   const AvailableSupply = () => {
      if (props.tSupply === 0) {
         return 0;
      }
      return Number((props.aSupply / props.tSupply) * 100).toFixed(2);
   }

   const data = {
      labels: chartData?.chart.map(item => { return item[0] }),
      datasets: [
         {
            data: chartData?.chart.map(item => { return item[1] })
         },
      ],
   };

   const MaxChartVal = (arr) => {
      if (typeof arr.datasets[0].data !== 'undefined')
         return Number(Math.max(...arr.datasets[0].data)).toFixed(2);
   }
   
   const MinChartVal = (arr) => {
      if (typeof arr.datasets[0].data !== 'undefined')
         return Number(Math.min(...arr.datasets[0].data)).toFixed(2);
   }
   const options = {
      borderWidth: 0,
      responsive: true,
      maintainAspectRatio: false,
      aspectRatio: 1,
      plugins:{
         annotation: {
            annotations: [{
               borderColor: '#72B943',
               borderDash: [2, 2],
               borderWidth: 2,
               type: 'line',
               value: MaxChartVal(data),
               scaleID: 'yAxis',
               label: {
                  fontSize: 10,
                  textAlign: 'center',
                  backgroundColor: '#72B943',
                  xPadding: 4,
                  yPadding: 4,
                  cornerRadius: 4,
                  position: 'start',
                  enabled: true,
                  content: MaxChartVal(data)
               }
            },
            {
               borderColor: '#f65164',
               borderDash: [2, 2],
               borderWidth: 2,
               type: 'line',
               value: MinChartVal(data),
               scaleID: 'yAxis',
               label: {
                  fontSize: 10,
                  textAlign: 'center',
                  backgroundColor: '#f65164',
                  xPadding: 4,
                  yPadding: 4,
                  cornerRadius: 4,
                  position: 'end',
                  enabled: true,
                  content: MinChartVal(data)
               }
            }]
         },
         decimation: {
            enabled: true,
            algorithm: 'lttb',
            samples: 10
         },
         tooltips: {
            enabled: false
         },
         legend: {
            display: false
         },
         title: {
            display: false
         }
      },
      elements: {
         line: {
           fill: false,
           backgroundColor: '#EEE9F8',
           borderColor: '#EEE9F8',
           borderWidth: 0.7
         },
         point: {
           radius: 0,
           hoverRadius: 0,
         }
      },
      scales: {
         yAxis: {
            id: 'yAxis',
            ticks: {
               beginAtZero: false,
               display: false
            },
            grid:{
               display: false,
               drawBorder: false
            }
         },
         xAxis:{
            ticks:{
               display: false,
               stepSize: 100
            },
            grid:{
               display: false,
               drawBorder: false
            }
         },
      },
   };

   return (
      <div className="col-4">
         <div className="card">
            <div className="card-header mb-2">
               <div className="img-container">
                  <img style={{ height: 30 }} src={props.image} alt="icon" />
               </div>
               <p>{props.cardTitle}</p>
            </div>
            <div className="card-body">
               <div className="row mb-3 price">
                  <div className="col-12 text-center">
                     <h1><span>$</span><Odometer value={price} duration={500} format="(,ddd).dd" /></h1>
                  </div>
               </div>
               <div className="row mb-3 supply">
                  <div className="col-12">
                     <label className="mb-1">Supply</label>
                     <div className="progress">
                        <div className="progress-bar" role="progressbar" style={{ width: AvailableSupply() + '%' }} aria-valuenow={AvailableSupply()} aria-valuemin="0" aria-valuemax="100">{AvailableSupply()}%</div>
                     </div>
                  </div>
               </div>
               <div className="row mb-3 price-change">
                  <label className="mb-1">Price change</label>
                  <PriceChange title={"HOUR"} priceChange={props.priceChangeH} />
                  <PriceChange title={"DAY"} priceChange={props.priceChangeD} />
                  <PriceChange title={"WEEK"} priceChange={props.priceChangeW} />
               </div>
               <div className="row">
                  <label className="mb-1">Last 24h</label>
                  <div className="col-12">
                     
                     <Line data={data} options={options} />
                  </div>
               </div>
            </div>
            <div className="card-footer text-center">
               <a href={props.website}>WEBSITE</a>
            </div>
         </div>
      </div>
   )
}
