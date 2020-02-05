import React, {Component} from 'react';
import './App.css';
import DataFrame from 'dataframe-js';
import FileSaver from 'file-saver';

import TableUI from './TableUI/TableUI.js';
import AppBar from './AppBar/AppBar.js';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';

import Scroll from 'react-scroll';

class App extends Component {
  
  state = { 
    entries: [
    ],
    uploaded: [
    ],
    cache: [      
    ],
    categories: [

    ],
    leftDate: null,
    rightDate: null,
    leftAmount: null,
    rightAmount: null,
    error: false,
    ascending: true,
    sortDataBy: null
  }

  options = ['date', 'vendor', 'category', 'amount']
  optionNames = ['Transaction Date', 'Description', 'Category', 'Amount']
  columnHeaders = 'Transaction Date,Post Date,Description,Category,Type,Amount\n'

  //handles the loading of CSV files and parsing to table
  loadFiles = (event) => {
    console.log(event.target.files.length + " files uploaded")
    const prevUploaded = [...this.state.uploaded]
    for(let i = 0; i < event.target.files.length; i++) {
      let reader = new FileReader()
      console.log("Reading " + event.target.files[i].name + "...")
      prevUploaded.push(event.target.files[i].name)
      
      reader.onload = () => {
        // only add lines after header
        let output = reader.result.substring(reader.result.indexOf("\n") + 1)

        //console.log(output)
        const prevEntries = [...this.state.entries]
        let lines = output.split('\n')
        const lastLineNum = this.state.entries.length
        //console.log(lastLineNum)
        for(let j = 0; j < lines.length; j++) {
          if(lines[j] !== '') {
            prevEntries.push({
              number: (lastLineNum + j + 1),
              date: this.formatDateOpp(lines[j].split(',')[0]),
              vendor: lines[j].split(',')[2],
              category: lines[j].split(',')[3],
              amount: parseFloat(lines[j].split(',')[5]),
              key: Math.random().toString(36).slice(2)
            })
          }
        }
        this.setState({
          entries: prevEntries
        })
        this.setCategories()
      }
      reader.readAsText(event.target.files[i])
    }
    this.setState({
      uploaded: prevUploaded
    })
    event.target.value = null
  }

  exportToCSV = () => {
    let csv = this.columnHeaders
    for(let i = 0; i < this.state.entries.length + 2; i++) {
      csv += `${this.state.entries[i].date},,${this.state.entries[i].vendor},${this.state.entries[i].category},,${this.state.entries[i].amount}\n`
    }
    return csv
  }

  exportToJSON = () => {
    return {message: this.exportToCSV()}
  }

  sortData = column => {
    if(this.state.entries.length === 0) {
      console.log('Nothing to sort...')
      return
    }
    const df = this.createDataFrame()
    if(column === 'date') {
      df.sortBy('date', !this.state.ascending)
    }
    else if(column === 'vendor') {
      df.sortBy('vendor', !this.state.ascending)
    }
    else if(column === 'category') {
      df.sortBy('category', !this.state.ascending)
    }
    else if(column === 'amount') {
      df.sortBy('amount', this.state.ascending)
    }
    this.setState({
      sortDataBy: column,
      ascending: !this.state.ascending
    })
    this.parseFromAPI(df.toCSV(true))
    console.log(`Sorted by ${column} ${this.state.ascending ? 'ascending' : 'descending'}`)
  }

  //filter the dataframe by column stored in state.filterBy
  filter = column => {
    let df = this.createDataFrame()

    //if filtering by date
    if(column === 'date') {
      console.log('Filter by date')

      this.setState({
        leftDate: document.getElementById('datePicker1').value,
        rightDate: document.getElementById('datePicker2').value
      },
      //callback after setting left and right dates
        () => {
          console.log('Left date: ' + this.state.leftDate)
          console.log('Right date: ' + this.state.rightDate)

          if(this.state.leftDate !== null && this.state.leftDate !== '') {
            df = df.filter(row => row.get('date') >= this.state.leftDate)
          }
          if(this.state.rightDate !== null && this.state.rightDate !== '') {
            df = df.filter(row => row.get('date') <= this.state.rightDate)
          }
          this.parseFromAPI(df.toCSV(true))

          if(df.count() === 0) { 
            this.setState({
              error: true
            })
            console.log('Failed to filter, resulting dataframe empty.')
          }
          else {
            this.setState({
              error: false
            })
          }
        }
      )
    }

    //if filtering by vendor
    else if(column === 'vendor') {
      console.log('Filter by vendor')
      let queryType = document.getElementById('filterVendorType').value
      console.log('Query type: ' + queryType)
      if(queryType === 'contains') {
        console.log('CONTAINS')
        let value = document.getElementById('filterVendorQuery').value
        df = df.filter(row => row.get('vendor').toLowerCase().includes(value.toLowerCase()))
        this.parseFromAPI(df.toCSV(true))
      }
      else if(queryType === 'match') {
        console.log('MATCH')
        let value = document.getElementById('filterVendorQuery').value
        df = df.filter(row => row.get('vendor') === value)
        this.parseFromAPI(df.toCSV(true))
      }
      else if(queryType === 'starts') {
        console.log('STARTS')
        let value = document.getElementById('filterVendorQuery').value
        df = df.filter(row => row.get('vendor').toLowerCase().startsWith(value.toLowerCase()))
        this.parseFromAPI(df.toCSV(true))
      }
      if(df.count() === 0) { 
        this.setState({
          error: true
        })
        console.log('Failed to filter, resulting dataframe empty.')
      }
      else {
        this.setState({
          error: false
        })
      }
    }
    
    //if filtering by category
    else if(column === 'category') {
      console.log('Filter by category')
      let categoryType = document.getElementById('categorySelect').value
      console.log('Category: ' + categoryType)
      df = df.filter(row => row.get('category') === categoryType)
      this.parseFromAPI(df.toCSV(true))
      if(df.count() === 0) { 
        this.setState({
          error: true
        })
        console.log('Failed to filter, resulting dataframe empty.')
      }
      else {
        this.setState({
          error: false
        })
      }
    }

    //if filtering by amount
    else if(column === 'amount') {
      console.log('Filter by amount')
      this.setState({
        leftAmount: document.getElementById('leftAmount').value,
        rightAmount: document.getElementById('rightAmount').value
      },
      //callback after setting left and right dates
        () => {
          console.log('Left amount: ' + this.state.leftAmount)
          console.log('Right amount: ' + this.state.rightAmount)

          if(this.state.leftAmount !== null && this.state.leftAmount !== '') {
            df = df.filter(row => row.get('amount') <= (-1 * parseFloat(this.state.leftAmount)))
          }
          if(this.state.rightAmount !== null && this.state.rightAmount !== '') {
            df = df.filter(row => row.get('amount') >= (-1 * parseFloat(this.state.rightAmount)))
          }
          this.parseFromAPI(df.toCSV(true))

          if(df.count() === 0) { 
            this.setState({
              error: true
            })
            console.log('Failed to filter, resulting dataframe empty.')
          }
          else {
            this.setState({
              error: false
            })
          }
        }
      )
    }
  }

  //parses csv message and saves new state for entries
  parseFromAPI = csv => {
    console.log('Parsing from CSV...')
    let lines = csv.split('\n')
    let newEntries = []
    console.log(lines.length + ' lines')
    console.log(lines)
    for(let i = 1; i < lines.length; i++) {
      if(lines[i] === '') {
        continue
      }
      let line = lines[i].split(',')
      newEntries.push({
        number: i,
        date: line[1],
        vendor: line[2],
        category: line[3],
        amount: parseFloat(line[4]),
        key: Math.random().toString(36).slice(2)
      })
      this.setState({
        entries: newEntries
      })
    }

    this.setCategories()
  }

  createDataFrame = () => {
    return new DataFrame(this.state.entries, ['number', ...this.options])
  }

  //method to be passed to Table.js <tr> elements
  //deletes row when it is clicked and updates state
  deleteRow = i => {
    // let newEntries = this.state.entries
    // newEntries.splice(i, 1)
    
    // this.setState({
    //   entries: newEntries.map((entry, index) => {
    //     const oldEntry = {...entry}
    //     oldEntry['number'] = index + 1
    //     return oldEntry
    //   })
    // })

    // this.setState({
    //   entries: newEntries
    // })

    this.setState({
      entries: this.state.entries.filter((entry, index) => index !== i)
    })
  }

  //clears list of entries in state
  clearList = () => {
    console.log('Clearing ' + this.state.entries.length + ' items...')
    this.setState({
      entries: [],
      uploaded: [],
      error: false
    })
  }

  cacheList = () => {
    console.log('Caching current data frame...')
    if(this.state.entries.length === 0)  {
      console.log('No data to save, save canceled.')
    }
    else {
      this.setState({
        cache: this.state.entries
      })
    }
  }

  loadCache = () => {
    console.log('Loading cached data frame...')
    if(this.state.cache.length === 0) { 
      console.log('Failed to load, no data saved in cache!')
    }
    else {
      this.setState({
        entries: this.state.cache
      })
    }
  }

  exportCache = () => {
    let csv = this.columnHeaders
    for(let i = 0; i < this.state.cache.length; i++) {
      csv += `${this.state.cache[i].date},,${this.state.cache[i].vendor},${this.state.cache[i].category},,${this.state.cache[i].amount}\n`
    }
    const blob = new Blob([csv], {type: "text/csv;charset=utf-8"});
    FileSaver.saveAs(blob, document.getElementById('fileNameInput').value);
    console.log('Saving cache to ' + document.getElementById('fileNameInput').value + '...')
  }

  //prints state
  printState = () => {
    console.log(this.state)
  }

  //yyyy-mm-dd to mm/dd/yyyy
  formatDate = (date) => {
    //[yyyy, mm, dd]
    let tokens = date.split('-')
    return [tokens[1], tokens[2], tokens[0]].join('/')
  }

  //mm/dd/yyyy to yyyy-mm-dd
  formatDateOpp = (date) => {
    let tokens = date.split('/')
    return [tokens[2], tokens[0], tokens[1]].join('-')
  }

  uploadClick = () => {
    document.getElementById('csv').click()
  }

  setCategories = () => {
    let df = this.createDataFrame()
    let dfUnique = df.unique('category')
    let collection = dfUnique.toCollection()
    // console.log(collection)
    let newColl = [];
    for(let i = 0; i < collection.length; i++) {
      if(collection[i]['category']) {
        newColl.push(collection[i]['category'])
      }
    }
    newColl.sort()
    this.setState({categories: newColl})
    console.log(newColl)
  }

  // dateChange1 = event => {
  //   this.setState({
  //     leftDate: event.target.value
  //   })
  // }

  // dateChange2 = event => {
  //   this.setState({
  //     rightDate: event.target.value
  //   })
  // }

  MyButton = withStyles({
    // contained: {
    //   margin: '6px',
    //   marginLeft: '3px',
    //   marginRight: '3px'
    // }
    root: {
      // boxShadow: 'none',
      margin: '6px', marginLeft: '3px', marginRight: '3px', padding: '6px 12px', border: '1px solid',
      lineHeight: 1.5, textTransform: 'none', backgroundColor: '#74b9ff',
      // borderColor: '#007bff',
      color: '#2d3436',
      width: '7rem',
      fontFamily: [
        '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial',
        'sans-serif', '"Apple Color Emoji"', '"Segoe UI Emoji"', '"Segoe UI Symbol"',
      ].join(','),
      '&:hover': {
        backgroundColor: '#0984e3', color: '#dfe6e9',
        // borderColor: '#0062cc',
        boxShadow: 'none',
      },
      '&:active': {
        boxShadow: 'none', backgroundColor: '#0062cc', borderColor: '#005cbf',
      },
    },
  })(Button)

  MyGrayButton = withStyles({
    root: {
      margin: '6px', marginLeft: '3px', marginRight: '3px', padding: '6px 12px', border: '1px solid',
      lineHeight: 1.5, textTransform: 'none', backgroundColor: '#dfe6e9', color: '#2d3436',
      width: '7rem',
      fontFamily: [
        '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial',
        'sans-serif', '"Apple Color Emoji"', '"Segoe UI Emoji"', '"Segoe UI Symbol"',
      ].join(','),
      '&:hover': {
        backgroundColor: '#636e72', color: '#dfe6e9', boxShadow: 'none',
      },
      '&:active': {
        boxShadow: 'none', backgroundColor: '#2d3436', borderColor: '#005cbf',
      },
    },
  })(Button)

  MyRedButton = withStyles({
    root: {
      margin: '6px', marginLeft: '3px', marginRight: '3px', padding: '6px 12px', border: '1px solid',
      lineHeight: 1.5, textTransform: 'none', backgroundColor: '#fab1a0', color: '#2d3436',
      width: '7rem',
      fontFamily: [
        '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial',
        'sans-serif', '"Apple Color Emoji"', '"Segoe UI Emoji"', '"Segoe UI Symbol"',
      ].join(','),
      '&:hover': {
        backgroundColor: '#ff7675', color: '#dfe6e9', boxShadow: 'none',
      },
      '&:active': {
        boxShadow: 'none', backgroundColor: '#d63031', borderColor: '#005cbf',
      },
    },
  })(Button)
  
  render() {

    return (
      <div className="App">
        <h1>
          <span style={{border: '1px black solid', paddingTop: '10px',
            paddingBottom: '10px', paddingLeft: '30px', paddingRight: '30px',
            borderRadius: '10px', display: 'inline-flex'}}>Transaction Viewer</span>
        </h1>

        {/* <button onClick={this.setCategories}></button> */}

        <div style={{display: 'block', paddingBottom: '10px'}}>
          <this.MyButton size='small' style={{root: {
            backgroundColor: '#dfe6e9'
          }}} variant="contained" onClick={this.uploadClick}>Upload</this.MyButton>
          <input style={{display: 'none'}} type="file" id="csv" accept=".csv" multiple onChange={this.loadFiles}/>
          {this.state.entries.length === 0 ?
            <this.MyGrayButton size='small' color='inherit' variant="contained" onClick={this.loadCache}>Load Cache</this.MyGrayButton>
            : null}
        </div>

        {this.state.entries.length !== 0 ? 
        <div style={{display: 'inline-block', paddingBottom: '10px'}}>
          <AppBar categories={this.state.categories} filter={this.filter}>
          </AppBar>
        </div> : null }

        {this.state.error ?
        <div>
          <p id='errorMsg'>Filter canceled, resulting data frame empty...</p>
        </div> : null}

        {/* {this.state.entries.length !== 0 ? 
        <div className='buttonList'>
          <button onClick={this.filter}>Filter</button>
          <ColumnSelect name='Filter By' change={event => {
              this.setState({
                  filterBy: event.target.value
              })
          }}></ColumnSelect>
          {this.state.filterBy === 'date' ?
          <div>
            <input id='filterDateLeft' type='text' placeholder='mm/dd/yyyy'></input>
            <span> &lt; date &lt; </span>
            <input id='filterDateRight' type='text' placeholder='mm/dd/yyyy'></input>
          </div> :
          null}
          {this.state.filterBy === 'vendor' ?
          <div>
            <select id='filterVendorType'>
              <option value='contains'>Contains</option>
              <option value='match'>Match</option>
              <option value='starts'>Starts With</option>
            </select>
            <input type='text' placeholder='vendor name query'></input>
          </div>:
          null}
          {this.state.filterBy === 'category' ?
          <CategorySelect identifier='categorySelect' name='categorySelect'></CategorySelect>:
          null}
          {this.state.filterBy === 'amount' ?
          <div>
            <input id='filterAmountLeft' type='text' placeholder='left amount'></input>
            <span> &lt; amount &lt; </span>
            <input id='filterAmountRight' type='text' placeholder='right amount'></input>
          </div>:
          null}
        </div> : null
        } */}

        {this.state.entries.length !== 0 ?
        <div className='buttonList'>
          <this.MyRedButton size='small' color='primary' variant="contained" onClick={this.printState}>Print State</this.MyRedButton>
          <this.MyGrayButton size='small' color='inherit' variant="contained" onClick={this.cacheList}>Save Cache</this.MyGrayButton>
          <this.MyGrayButton size='small' color='inherit' variant="contained" onClick={this.loadCache}>Load Cache</this.MyGrayButton>
          <TextField helperText="Save CSV as..." id="fileNameInput" 
            style={{
              marginLeft: '5px',
              marginRight: '5px',
              width: 200
            }}
            margin="dense" variant="outlined"
          />
          <this.MyGrayButton size='small' color='inherit' variant="contained" onClick={this.exportCache}>Export</this.MyGrayButton>
          <this.MyButton size='small' color='primary' variant="contained" onClick={Scroll.animateScroll.scrollToBottom}>To Bottom</this.MyButton>
          <this.MyRedButton size='small' color='secondary' variant="contained" onClick={this.clearList}>Clear List</this.MyRedButton>
        </div> : null}

        {this.state.entries.length !== 0 ?
          // <Table entries={this.state.entries} delete={this.deleteRow}></Table>
          <TableUI rows={this.state.entries} delete={this.deleteRow} ascending={this.state.ascending}
            sort={this.sortData} sortDataBy={this.sortDataBy}></TableUI> :
          <p>Import a CSV file</p>}

        {this.state.entries.length !== 0 ?
          <div style={{paddingTop: '10px'}}>
            <this.MyButton size='small' color='primary' variant="contained" onClick={Scroll.animateScroll.scrollToTop}>To Top</this.MyButton>
            <this.MyRedButton size='small' color='secondary' variant="contained" onClick={this.clearList}>Clear List</this.MyRedButton>
          </div> : null}
      </div>
    );
  }
}

export default App;
