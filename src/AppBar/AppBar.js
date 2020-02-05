import React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';

import DatePicker from '../DatePicker/DatePicker.js';

const options = ['Filter...', 'Filter by date', 'Filter by vendor', 'Filter by category', 'Filter by amount'];
const options2 = ['Contains', 'Match', 'Starts with'];
const options2values = ['contains', 'match', 'starts'];

const MyGrayButton = withStyles({
    root: {
      padding: '6px 12px', border: '1px solid', lineHeight: 1.5, textTransform: 'none',
      backgroundColor: '#dfe6e9', color: '#2d3436',
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

export default function Bar(props) {

  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const [open2, setOpen2] = React.useState(false);
  const anchorRef2 = React.useRef(null);
  const [selectedIndex2, setSelectedIndex2] = React.useState(0);

  const [open3, setOpen3] = React.useState(false);
  const anchorRef3 = React.useRef(null);
  const [selectedIndex3, setSelectedIndex3] = React.useState(0);

  const handleClick = () => {
    console.info(`You clicked ${options[selectedIndex]}`);
  };

  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    if(index === 1) {
        //filter 
    }
    setOpen(false);
  };

  const handleMenuItemClick2 = (event, index) => {
    setSelectedIndex2(index);
    if(index === 1) {
        //filter 
    }
    setOpen2(false);
  };

  const handleMenuItemClick3 = (event, index) => {
    setSelectedIndex3(index);
    if(index === 1) {
        //filter 
    }
    setOpen3(false);
  };

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen);
  };

  const handleToggle2 = () => {
    setOpen2(prevOpen => !prevOpen);
  }

  const handleToggle3 = () => {
    setOpen3(prevOpen => !prevOpen);
  }

  const handleClose = event => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const handleClose2 = event => {
    if (anchorRef2.current && anchorRef2.current.contains(event.target)) {
      return;
    }
    setOpen2(false);
  };

  const handleClose3 = event => {
    if (anchorRef3.current && anchorRef3.current.contains(event.target)) {
      return;
    }
    setOpen3(false);
  };

//   const MyButtonGroup = withStyles({
//     root: {
//         display: 'inline'
//     },
//     contained: {
//         display: 'inline',
//     }
//   })(ButtonGroup)

//   const MyGrid = withStyles({
//     container: {
//         display: 'inline-flex',
//     }
//   })(Grid)

  const boxShadow = {boxShadow: '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)'}

  return (
    <Grid container direction="column" alignItems="center" style={{margin: '6px'}} >
        <Grid item xs={12}>
            <ButtonGroup variant="contained" color="default" ref={anchorRef} aria-label="split button">
                <MyGrayButton onClick={handleClick}>{options[selectedIndex]}</MyGrayButton>
                <MyGrayButton
                    aria-controls={open ? 'split-button-menu' : undefined}
                    aria-expanded={open ? 'true' : undefined}
                    aria-label="select filter type"
                    aria-haspopup="menu"
                    onClick={handleToggle}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"><path d="M5 8l4 4 4-4z"/></svg>
                </MyGrayButton>

                {selectedIndex === 1 ?
                    <Grid style={{border: '1px solid black', padding: '5px'}} item xs={10}>
                        <DatePicker id='datePicker1' label='After'></DatePicker>
                        <DatePicker id='datePicker2' label='Before'></DatePicker>
                    </Grid>
                : null}

                {selectedIndex === 4 ?
                    <Grid style={{border: '1px solid black', padding: '5px'}} item xs={10}>
                        <TextField id='leftAmount' type='number' label='Greater than'></TextField>
                        <TextField id='rightAmount' type='number' label='Less than'></TextField>
                    </Grid>
                : null}

            </ButtonGroup>

            {selectedIndex === 2 ?
            <ButtonGroup style={{paddingLeft: '10px'}} color="default" ref={anchorRef2} aria-label="split button2">
                <MyGrayButton id='filterVendorType' value={options2values[selectedIndex2]} style={boxShadow}>{options2[selectedIndex2]}</MyGrayButton>
                <MyGrayButton style={{...{borderRight: '1px solid black'}, ...boxShadow}}
                    aria-controls={open2 ? 'split-button-menu2' : undefined}
                    aria-expanded={open2 ? 'true' : undefined}
                    aria-label="select filter by vendor type"
                    aria-haspopup="menu"
                    onClick={handleToggle2}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"><path d="M5 8l4 4 4-4z"/></svg>
                </MyGrayButton>

                <Grid style={{...{border: '1px solid black', padding: '5px'}, ...boxShadow}} item xs={10}>
                    <TextField id='filterVendorQuery' placeholder='Type query here'></TextField>
                </Grid>
            </ButtonGroup>
            : null}

            {selectedIndex === 3 ?
            <ButtonGroup style={{paddingLeft: '10px'}} color="default" ref={anchorRef3} aria-label="split button3">
                <MyGrayButton id='categorySelect' value={props.categories[selectedIndex3]}
                    style={boxShadow}>{props.categories[selectedIndex3]}</MyGrayButton>
                <MyGrayButton style={{...{borderRight: '1px solid black'}, ...boxShadow}}
                    aria-controls={open3 ? 'split-button-menu3' : undefined}
                    aria-expanded={open3 ? 'true' : undefined}
                    aria-label="select category"
                    aria-haspopup="menu"
                    onClick={handleToggle3}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"><path d="M5 8l4 4 4-4z"/></svg>
                </MyGrayButton>
            </ButtonGroup>
            : null}

            <ButtonGroup style={{paddingLeft: '10px'}}>
                <MyGrayButton onClick={() => {
                    if(selectedIndex === 1) {
                        props.filter('date')
                    }
                    else if(selectedIndex === 2) {
                        props.filter('vendor')
                    }
                    else if(selectedIndex === 3) {
                        props.filter('category')
                    }
                    else if(selectedIndex === 4) {
                        props.filter('amount')
                    }
                }}
                style={boxShadow}>Apply Filter</MyGrayButton>
            </ButtonGroup>

            <Popper open={open} anchorEl={anchorRef.current} role={undefined} placement='right-start' transition>
            {({ TransitionProps, placement }) => (
                <Grow
                {...TransitionProps}
                style={{
                    transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
                }}
                >
                <Paper>
                    <ClickAwayListener onClickAway={handleClose}>
                    <MenuList id="split-button-menu">
                        {options.map((option, index) => (
                        <MenuItem
                            key={option}
                            selected={index === selectedIndex}
                            onClick={event => handleMenuItemClick(event, index)}
                        >
                            {option}
                        </MenuItem>
                        ))}
                    </MenuList>
                    </ClickAwayListener>
                </Paper>
                </Grow>
            )}
            </Popper>

            <Popper open={open2} anchorEl={anchorRef2.current} role={undefined} placement='right-start' transition>
            {({ TransitionProps, placement }) => (
                <Grow
                {...TransitionProps}
                style={{
                    transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
                }}
                >
                <Paper>
                    <ClickAwayListener onClickAway={handleClose2}>
                    <MenuList id="split-button-menu2">
                        {options2.map((option, index) => (
                        <MenuItem
                            key={option}
                            selected={index === selectedIndex2}
                            onClick={event => handleMenuItemClick2(event, index)}
                        >
                            {option}
                        </MenuItem>
                        ))}
                    </MenuList>
                    </ClickAwayListener>
                </Paper>
                </Grow>
            )}
            </Popper>

            <Popper open={open3} anchorEl={anchorRef3.current} role={undefined} placement='right-start' transition>
            {({ TransitionProps, placement }) => (
                <Grow
                {...TransitionProps}
                style={{
                    transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
                }}
                >
                <Paper>
                    <ClickAwayListener onClickAway={handleClose3}>
                    <MenuList id="split-button-menu3">
                        {props.categories.map((option, index) => (
                        <MenuItem
                            key={option}
                            selected={index === selectedIndex3}
                            onClick={event => handleMenuItemClick3(event, index)}
                        >
                            {option}
                        </MenuItem>
                        ))}
                    </MenuList>
                    </ClickAwayListener>
                </Paper>
                </Grow>
            )}
            </Popper>
        </Grid>
    </Grid>
  );
}