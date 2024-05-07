import React, { useState, useEffect } from "react";
import { Table, Typography, message, Select } from "antd";
import axios from "axios";
import NavbarAdmin from './NavbarAdmin';
import Footer from "../Footer";
import { Rating } from '@mui/material';

const { Option } = Select;

export default function UserFeedback() {
    const [feedback, setFeedback] = useState([]);
    const [sortKey, setSortKey] = useState(null);

    useEffect(() => {
        const fetchUserFeedbacks = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/feedback/get-feedback");
                setFeedback(response.data);
            } catch (error) {
                console.error("Error fetching feedback:", error);
                message.error("Failed to fetch feedback");
            }
        };

        fetchUserFeedbacks();
    }, []);

    const handleSortChange = (value) => {
        setSortKey(value);
    };

    const sortedFeedback = sortKey
        ? sortKey === "date"
            ? feedback.slice().sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort from newest to oldest
            : sortKey === "-date"
                ? feedback.slice().sort((a, b) => new Date(a.date) - new Date(b.date)) // Sort from oldest to newest
                : feedback.slice().sort((a, b) => {
                    if (a[sortKey] < b[sortKey]) return -1;
                    if (a[sortKey] > b[sortKey]) return 1;
                    return 0;
                })
        : feedback;

    const columns = [
        {
            key: 1,
            title: "User Name",
            dataIndex: "username",
            render: (text, record) => `${record.firstName} ${record.lastName}`,
            width: '20%',
        },
        {
            key: 2,
            title: "Email",
            dataIndex: "email",
            width: '20%',
        },
        {
            key: 3,
            title: "Feedback",
            dataIndex: "feedback",
            width: '20%',
        },
        {
            key: 4,
            title: "Rating",
            dataIndex: "rating",
            render: (text, record) => (
                <Rating
                    name={`rating-${record._id}`}
                    value={record.rating}
                    readOnly
                    precision={0.5}
                />
            ),
        },
        {
            key: 5,
            title: "Date",
            dataIndex: "date",
            width: '20%',
        },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', overflowX: 'hidden' }}>
            <NavbarAdmin />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem', marginLeft: '12px', marginRight: '12px' }}>
                <Typography.Title level={2}>User Feedbacks</Typography.Title>
                <Select
                    defaultValue="Sort by"
                    onChange={handleSortChange}
                    style={{ width: 180 }}
                >
                    <Option value="username">User Name</Option>
                    <Option value="email">Email</Option>
                    <Option value="rating">Rating</Option>
                    <Option value="date">Newest First</Option>
                    <Option value="-date">Oldest First</Option>
                </Select>
            </div>

            <Table columns={columns} dataSource={sortedFeedback} />

            <div style={{ bottom: "0", width: "100%", marginTop: 'auto' }}><Footer /></div>
        </div>
    );
}
