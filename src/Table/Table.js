import React from 'react';
import './Table.css';

const table = props => {

    //yyyy-mm-dd to mm/dd/yyyy
    const formatDate = (date) => {
        //[yyyy, mm, dd]
        let tokens = date.split('-')
        return [tokens[1], tokens[2], tokens[0]].join('/')
    }

    const rows = []
    for(let i = 0; i < props.entries.length; i++) {
        const row = (
            <tr key={props.entries[i]['key']}>
                <td>{props.entries[i]['number']}</td>
                <td>{formatDate(props.entries[i]['date'])}</td>
                <td>{props.entries[i]['vendor']}</td>
                <td>{props.entries[i]['category']}</td>
                <td>{Number.parseFloat(props.entries[i]['amount']).toLocaleString('en-US', {style: "currency",currency: "USD"})}</td>
                <td onClick={() => props.delete(props.entries[i]['number'] - 1)} className='deleteRow'>x</td>
            </tr>
        )
        rows.push(row)
    }

    return (
        <table>
            <tbody>
                <tr className='tableHeader'>
                    <th className='tableHeading'>Number</th>
                    <th className='tableHeading'>Date</th>
                    <th className='tableHeading'>Vendor</th>
                    <th className='tableHeading'>Category</th>
                    <th className='tableHeading'>Amount</th>
                    <th className='tableHeading'></th>
                </tr>
                {rows}
            </tbody>
        </table>
    )
}

export default table;