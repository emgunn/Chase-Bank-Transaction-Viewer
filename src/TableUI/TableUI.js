import React, { useState } from 'react';
import './TableUI.css';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
    table: {
        minWidth: 650,
        border: '1px solid black'
    },
});

const MyTableRow = withStyles({
    hover: {
        '&$hover:hover': {
            backgroundColor: '#dfe6e9',
        },
    }
})(TableRow)

const DeleteX = withStyles({
    body: {
        color: '#d63031',
        cursor: 'pointer',
        '&$body:hover': {
            color: 'white'
        },
    },
    root: {
        '&$root:hover': {
            backgroundColor: '#e74c3c',
        },
        '&$root:active': {
            backgroundColor: '#c0392b',
            transform: 'translate(0px, 3px)'
        }
    }
})(TableCell)

const MyTableHeader = withStyles({
    root: {
        cursor: 'pointer',
        fontWeight: 'bold',
        backgroundColor: '#74b9ff',
        color: '#2d3436',
        '&$root:hover': {
            // backgroundColor: '#bdc3c7'
            // backgroundColor: 'rgba(0, 0, 0, 0.26)'
            backgroundColor: '#0984e3',
            color: '#dfe6e9'
        },
        '&$root:active': {
            // backgroundColor: '#95a5a6',
            // backgroundColor: 'rgba(0, 0, 0, 0.54)',
            transform: 'translate(0px, 3px)'
        }
    }
})(TableCell)

const bold = {fontWeight: 'bold', backgroundColor: '#74b9ff', color: '#2d3436'}

//yyyy-mm-dd to mm/dd/yyyy
const formatDate = (date) => {
    //[yyyy, mm, dd]
    let tokens = date.split('-')
    return [tokens[1], tokens[2], tokens[0]].join('/')
}

export default function SimpleTable(props) {
    const classes = useStyles();

    const [dateText, setDateText] = useState('Date')
    const [vendorText, setVendorText] = useState('Vendor')
    const [categoryText, setCategoryText] = useState('Category')
    const [amountText, setAmountText] = useState('Amount')

    return (
    <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
        <TableHead>
            <TableRow>
                <TableCell style={bold} align="center">Number</TableCell>
                <MyTableHeader onClick={() => {
                    setDateText(`Date ${props.ascending ? '\u2191' : '\u2193'}`)
                    setVendorText('Vendor')
                    setCategoryText('Category')
                    setAmountText('Amount')
                    props.sort('date')
                }} align="center">{dateText}</MyTableHeader>
                <MyTableHeader onClick={() => {
                    setVendorText(`Vendor ${props.ascending ? '\u2191' : '\u2193'}`)
                    setDateText('Date')
                    setCategoryText('Category')
                    setAmountText('Amount')
                    props.sort('vendor')
                }} align="center">{vendorText}</MyTableHeader>
                <MyTableHeader onClick={() => {
                    setCategoryText(`Category ${props.ascending ? '\u2191' : '\u2193'}`)
                    setDateText('Date')
                    setVendorText('Vendor')
                    setAmountText('Amount')
                    props.sort('category')
                }} align="center">{categoryText}</MyTableHeader>
                <MyTableHeader onClick={() => {
                    setAmountText(`Amount ${props.ascending ? '\u2191' : '\u2193'}`)
                    setDateText('Date')
                    setVendorText('Vendor')
                    setCategoryText('Category')
                    props.sort('amount')
                }} align="right">{amountText}</MyTableHeader>
                <TableCell style={bold} align="center"></TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {props.rows.map((row, index) => (
            <MyTableRow hover={true} key={row.key}>
                <TableCell align="center" component="th" scope="row">
                {index + 1}
                </TableCell>
                <TableCell align="center">{formatDate(row.date)}</TableCell>
                <TableCell align="center">{row.vendor}</TableCell>
                <TableCell align="center">{row.category}</TableCell>
                <TableCell align="right">{Number.parseFloat(-1 * row.amount).toLocaleString('en-US', {style: "currency",currency: "USD"})}</TableCell>
                <DeleteX align="center" onClick={() => props.delete(index)} className='deleteRow'>x</DeleteX>
            </MyTableRow>
            ))}
        </TableBody>
        </Table>
    </TableContainer>
    );
}