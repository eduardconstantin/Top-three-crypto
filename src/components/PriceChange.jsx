import React, { useState, useEffect } from 'react';
import Odometer from 'react-odometerjs';


export default function PriceChange(props) {
   const [priceChange, setPriceChange] = useState(0);

   useEffect(() => {
      setPriceChange(props.priceChange);
   })

   return (
      
      <div className="col-4">
         <div className="content" style={props.priceChange<0?{backgroundColor:'#F65164'}:{backgroundColor:'#63C08A'}}>
            <p className="mb-1">{props.title}</p>
            <p className="pb-3 text-center"><Odometer value={priceChange} duration={500} format="(,ddd).dd"/><span className="percentage">%</span></p>
         </div>
      </div>
   )
}