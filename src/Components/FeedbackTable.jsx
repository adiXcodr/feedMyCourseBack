import React, { useState, useEffect } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TablePagination from '@material-ui/core/TablePagination';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { isMobile } from 'react-device-detect';

const useStyles = makeStyles({
    root: {
        boxShadow: 'none',
        borderRadius: '10px 10px 0px 0px'

    },
    container: {
        maxHeight: 500,
        borderRadius: '10px 10px 0px 0px'

    },
    title: {
        width: '100%',
        fontWeight: '600',
    },
});

const StyledTableCell = withStyles((theme) => ({
    head: {

        fontSize: 17,
        fontWeight: 600,
        border: 'none'
    },
    body: {
        fontSize: 20,
        fontWeight: 'bold',
        borderWidth: 0
    },
}))(TableCell);

const StyledTableCellMain = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
        fontSize: 20,
        fontWeight: 600,
        width: '100%',
        display: 'flex',
        justifyContent: 'center'
    },
}))(TableCell);

function Row(props) {
    const { row } = props;
    const [open, setOpen] = useState(false);

    return (
        <React.Fragment>
            <TableRow >
                <TableCell style={{ color: 'black', borderColor: '#333' }} component="th" scope="row">
                    {row.overall}
                </TableCell>
                <TableCell style={{ color: 'black', borderColor: '#333' }}>{row.content}</TableCell>
                <TableCell style={{ color: 'black', borderColor: '#333' }}>{row.punctuality}</TableCell>
                <TableCell style={{ color: 'black', borderColor: '#333' }}>{row.query}</TableCell>
                <TableCell style={{ color: 'black', borderColor: '#333' }}>{row.instructor}</TableCell>
                <TableCell style={{ color: 'black', borderColor: '#333' }}>{!row.additional || row.additional == "" ? "None" : row.additional}</TableCell>
            </TableRow>
        </React.Fragment>
    );
}


export default function BasicTable(props) {
    const { feedback } = props;
    const classes = useStyles();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <Paper className={classes.root} style={{ width: "100%", maxWidth: isMobile ? 250 : "100%", overflowX: "auto", marginLeft: "auto", marginRight: "auto" }}>
            <TableContainer className={classes.container}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Overall</StyledTableCell>
                            <StyledTableCell>Content Provided</StyledTableCell>
                            <StyledTableCell>Punctuality</StyledTableCell>
                            <StyledTableCell>Class Interaction</StyledTableCell>
                            <StyledTableCell>Your Impression</StyledTableCell>
                            <StyledTableCell>Additional Comments</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {feedback.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((stockitem, i) => {
                            return (
                                <Row key={i} row={stockitem} />

                            );
                        })
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10]}
                component="div"
                count={feedback.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
                style={{
                    color: 'black'
                }}
            />
        </Paper>
    );
}
