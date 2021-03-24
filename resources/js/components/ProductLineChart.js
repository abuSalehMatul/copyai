import React, { Component } from 'react'
import { Line } from 'react-chartjs-2';

export class ProductLineChart extends Component {
    render() {
        const state = {
            labels: ['Octobar', 'November', 'December','January', 'February', 'March'],
            datasets: [
              {
                label: 'Conversion Rate',
                fill: false,
                lineTension: 0.6,
                backgroundColor: '#f422a0',
                borderColor: '#f422a0',
                borderWidth: 2,
                data: [65, 59, 80, 81, 56, 23]
              },
              {
                label: 'Revenue',
                fill: false,
                lineTension: 0.6,
                backgroundColor: '#f7dd4c',
                borderColor: '#f7dd4c',
                borderWidth: 2,
                data: [5, 9, 40, 61, 56, 33]
              },
              {
                label: 'Views',
                fill: false,
                lineTension: 0.6,
                backgroundColor: '#0ebbd6',
                borderColor: '#0ebbd6',
                borderWidth: 2,
                data: [15, 99, 70, 41, 96, 56]
              }
            ]
        }

        return (
            <div className="bg-white">
                <Line
                    labels = {['Red', 'Blue', 'Yellow']}
                    data={state}
                    width={1020}
                    height={500}
                    options={{
                        title: {
                            display: true,
                            fontSize: 20
                        },
                        legend: {
                            display: true,
                            position: 'top'
                        }
                    }}
                />
            </div>
        )
    }
}

export default ProductLineChart
