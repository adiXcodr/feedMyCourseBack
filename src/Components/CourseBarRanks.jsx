import React, { useEffect, useState } from 'react';
import { Select, Button, MenuItem, TextField, Card } from '@material-ui/core';
import { useSelector, useDispatch } from "react-redux";
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { isMobile } from "react-device-detect";

const CourseBarRanks = (props) => {
    const { history, data } = props;
    const user = useSelector((state) => state.auth.userData);

    useEffect(() => {

    }, []);

    return (
        <div style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        }}>
            <ResponsiveContainer width={isMobile ? "100%" : "30%"} aspect={1}>
                <BarChart width={150} height={40} data={data}>
                    <XAxis dataKey="courseCode" legend={0} />
                    <YAxis />
                    <Tooltip />
                    <Legend/>
                    <Bar dataKey="score" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );


};


export default CourseBarRanks;