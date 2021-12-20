import React, { useEffect } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { isMobile } from "react-device-detect";

const CourseBarRanks = (props) => {
    const { data } = props;

    useEffect(() => {}, []);

    return (
        <div
            style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <ResponsiveContainer width={isMobile ? "100%" : "30%"} aspect={1}>
                <BarChart width={150} height={40} data={data}>
                    <XAxis dataKey="courseCode" legend={0} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="score" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default CourseBarRanks;
