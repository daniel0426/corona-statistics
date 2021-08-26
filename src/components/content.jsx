/* eslint-disable no-sequences */
import React from "react";
import {useState, useEffect} from "react";
import {Bar, Doughnut, Line} from 'react-chartjs-2';

const Content = () => {

    const [confirmedData, setConfirmedData] = useState();
    const [quarantinedData, setQuarantinedData] = useState();
    const [comparedData, setComparedData] = useState();



    useEffect(()=> {
      const fetchEvent = async ()=> {
        const response = await fetch('https://api.covid19api.com/total/dayone/country/nz');
        const data = await response.json();
        makeData(data)

      }
      const makeData = (items)=> {
        const arr = items.reduce((acc,cur)=> {
          const currentDate = new Date(cur.Date)
          const year = currentDate.getFullYear();
          const month = currentDate.getMonth();
          const date = currentDate.getDate();
          const confirmed = cur.Confirmed;
          const active = cur.Active;
          const death = cur.Deaths;
          const recovered = cur.Recovered;

          const findItem = acc.find(a => a.year === year && a.month === month)

          if(!findItem){
            acc.push({
              year, month, date, confirmed, active, death, recovered
            })
          }
          if(findItem && findItem.date < date){
            findItem.active = active;
            findItem.death = death;
            findItem.date = date;
            findItem.year = year;
            findItem.recovered = recovered;
            findItem.confirmed = confirmed;
          }
          console.log(cur.Date)
          return acc
        },[])

            const labels = arr.map(a => `${a.year} . ${a.month +1}`);
            setConfirmedData({
              labels ,
              datasets: [
                {
                  label : "Cumulative confirmed cases",
                  backgroundColor: "salmon",
                  fill:true,
                  data: arr.map(a => a.confirmed)
                }
              ]
            })

          setQuarantinedData({
            labels ,
            datasets: [
              {
                label : "Number of Quarantined per Month",
                borderColor: "red",
                fill:false,
                data: arr.map(a => a.active)
              }
            ]
          })
            const last = arr[arr.length-1]

          setComparedData({
            labels: ["Confirmed", "Recovered", "Death"],
            datasets: [
              {
                label : "Cumulative cases, Recovered, Portion of death",
                backgroundColor : ['#ff3d67', '#059bff', '#ffc233'],
                borderColor:['#ff3d67', '#059bff', '#ffc233'],
                fill:false,
                data: [last.confirmed, last.recovered, last.death]
              }
            ],
          });
      }

      fetchEvent();
    },[])
    
    return (
      <section>
          <h2>COVID-19 in NZ </h2>
          <div >
              <div className="contents">
              <div>
                <Bar data={confirmedData} options= {
                  // eslint-disable-next-line 
                  {title: {display : true, text : "Cumulative confirmed cases", fontSize: 16}},
                  {legend : {display :true, position : "bottom"}}
                } />
                </div>
                <div>
                 <Line data={quarantinedData} options= {
                  // eslint-disable-next-line 
                  {title: {display : true, text : "Number of Quarantined", fontSize: 16}},
                  {legend : {display :true, position : "bottom"}}
                } />
                </div>
                <div>
                 <Doughnut data={comparedData} options= {
                  // eslint-disable-next-line 
                  {title: {display : true, text : `${new Date().getMonth()+1 } Corona situation `, fontSize: 16}},
                  {legend : {display :true, position : "bottom"}}
                } />
                </div>
              </div>
          </div>
      </section>

    )
}

export default Content
