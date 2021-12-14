import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { isMobile } from 'react-device-detect';

const PREFIX = 'FeedbackTable';

const classes = {
    head: `${PREFIX}-head`,
    body: `${PREFIX}-body`,
    head2: `${PREFIX}-head2`,
    root: `${PREFIX}-root`,
    container: `${PREFIX}-container`,
    title: `${PREFIX}-title`
};

const StyledPaper = styled(Paper)({
    [`&.${classes.root}`]: {
        boxShadow: 'none',
        borderRadius: '10px 10px 0px 0px'

    },
    [`& .${classes.container}`]: {
        maxHeight: 500,
        borderRadius: '10px 10px 0px 0px'

    },
    [`& .${classes.title}`]: {
        width: '100%',
        fontWeight: '600',
    },
});

const StyledTableCell = TableCell;

const StyledTableCellMain = TableCell;

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
        <StyledPaper className={classes.root} style={{ width: "100%", maxWidth: isMobile ? 250 : "100%", overflowX: "auto", marginLeft: "auto", marginRight: "auto" }}>
            <TableContainer className={classes.container}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell
                                classes={{
                                    head: classes.head,
                                    body: classes.body
                                }}>Overall</StyledTableCell>
                            <StyledTableCell
                                classes={{
                                    head: classes.head,
                                    body: classes.body
                                }}>Content Provided</StyledTableCell>
                            <StyledTableCell
                                classes={{
                                    head: classes.head,
                                    body: classes.body
                                }}>Punctuality</StyledTableCell>
                            <StyledTableCell
                                classes={{
                                    head: classes.head,
                                    body: classes.body
                                }}>Class Interaction</StyledTableCell>
                            <StyledTableCell
                                classes={{
                                    head: classes.head,
                                    body: classes.body
                                }}>Your Impression</StyledTableCell>
                            <StyledTableCell
                                classes={{
                                    head: classes.head,
                                    body: classes.body
                                }}>Additional Comments</StyledTableCell>
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
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                style={{
                    color: 'black'
                }}
            />
        </StyledPaper>
    );
}
