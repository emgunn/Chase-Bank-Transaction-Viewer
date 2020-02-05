import React from 'react';

const columnSelect = props => {

    return (
        <select name={props.name} onChange={props.change}>
            <option value='date'>Transaction Date</option>
            <option value='vendor'>Vendor</option>
            <option value='category'>Category</option>
            <option value='amount'>Amount</option>
        </select>
    )
}

export default columnSelect;