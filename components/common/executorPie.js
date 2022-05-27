import useSWR from 'swr'
import { useState, useEffect } from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'react-chartjs-2';

import { fetcher } from '../../lib/functions'

import { REQUEST_STATUS_ENUM } from '../../lib/constants'

ChartJS.register(ArcElement, Tooltip, Legend)

const ExectorPie = ({ executor, className }) => {
    const { data, error } = useSWR(`/api/indicators/${executor}`, fetcher)
    const [dataSetData, setDataSetData] = useState([])

    useEffect(() => { 
        console.log(data);
        setDataSetData([data?.inProgress, data?.done, data?.expired])
    }, [data])

    const dataSet = {
        labels: [REQUEST_STATUS_ENUM['inProgress'], REQUEST_STATUS_ENUM['done'], REQUEST_STATUS_ENUM['expired']],
        datasets: [
            {
                label: 'Статистика',
                data: dataSetData,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)'
                ]
            },
        ],
    };

    return (
        <div className={className}>
            {data && !error 
            &&
                <Pie data={dataSet} options={{ maintainAspectRatio: true }}/>
            }
            {error 
            && 
                <span>
                    Ошибка при загрузке графика
                </span>
            }
        </div>
    )
}

export default ExectorPie