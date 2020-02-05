import React from 'react';

const categorySelect = props => {

    const categories = ['Automotive', 'Bills & Utilities', 'Education', 'Entertainment', 'Fees & Adjustments',
        'Food & Drink', 'Gas', 'Gifts & Donations', 'Groceries', 'Health & Wellness', 'Home', 'Miscellaneous',
        'Personal', 'Professional Services', 'Shopping', 'Travel']

    return (
        <select id={props.identifier} name={props.name}>
            {categories.map(category => {
                return <option value={category} key={Math.random().toString(36).slice(2)}>{category}</option>
            })}
        </select>
    )
}

export default categorySelect;