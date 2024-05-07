import React, { useState, useEffect } from "react";
import { Input, Modal, Table, Tooltip, Typography, message, Select, Space } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import axios from "axios";
import NavbarAdmin from './NavbarAdmin'
import Footer from "../Footer";

const { Option } = Select;

export default function UserDetails() {
    const [users, setUsers] = useState([]);
    const [editedUserId, setEditedUserId] = useState("");
    const [editedFirstName, setEditedFirstName] = useState(null);
    const [editedLastName, setEditedLastName] = useState(null);
    const [editedEmail, setEditedEmail] = useState(null);
    const [record, setRecord] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [sortRole, setSortRole] = useState(null);

    useEffect(() => {
        // Fetch verified users when the component mounts
        const fetchVerifiedUsers = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/users/get-users");
                setUsers(response.data);
            } catch (error) {
                console.error("Error fetching verified users:", error);
                message.error("Failed to fetch verified users");
            }
        };

        fetchVerifiedUsers();
    }, []);

    const columns = [
        {
            key: 1,
            title: "First Name",
            dataIndex: "firstName",
        },
        {
            key: 2,
            title: "Last Name",
            dataIndex: "lastName",
        },
        {
            key: 3,
            title: "Email",
            dataIndex: "email",
        },
        {
            key: 4,
            title: "Role",
            dataIndex: "role",
            filters: [
                {
                    text: 'All',
                    value: 'all',
                },
                {
                    text: 'Farmer',
                    value: 'farmer',
                },
                {
                    text: 'Normal Victim',
                    value: 'normal victim',
                },
            ],
            filteredValue: sortRole ? [sortRole] : null,
            onFilter: (value, record) => value === 'all' || record.role === value,
            render: (text) => text.toUpperCase(),
            width: '20%',
        },
        {
            key: 5,
            title: "Actions",
            render: (record) => {
                return (
                    <>
                        <Tooltip title="Click to edit the user">
                            <EditOutlined
                                onClick={() => onEdit(record)}
                                style={{ color: "#164863", fontSize: 20, marginRight: 25 }}
                            />
                        </Tooltip>
                        <Tooltip title="Click to delete the user">
                            <DeleteOutlined
                                onClick={() => onDelete(record)}
                                style={{ color: "red", fontSize: 20 }}
                            />
                        </Tooltip>
                    </>
                );
            },
        },
    ];

    const onDelete = (record) => {

        Modal.confirm({
            title: "Are you sure, you want to delete this user?",
            okText: "Yes",
            okType: "danger",
            onOk: async () => {
                await axios.delete(`http://localhost:5000/api/users/delete-user/${record._id}`)
                    .then((response) => {
                        if (response.data.success) {
                            message.success(response.data.message);
                            // Refresh the user list after deletion
                            setUsers(
                                users.filter((user) => user._id !== record._id)
                            );
                        } else {
                            console.log(response);
                            message.error("Failed to delete user");
                        }
                    })
                    .catch((error) => {
                        message.error("Error deleting user");
                    });
            },
        });
    };

    const onEdit = (record) => {
        setShowEditModal(true);
        setRecord(record);
        setEditedUserId(record._id);
        setEditedFirstName(record.firstName);
        setEditedLastName(record.lastName);
        setEditedEmail(record.email);
    };

    const handleEditRecords = async () => {
        if (!editedFirstName || !editedLastName || !editedEmail) {
            message.error("Please fill all the fields");
            return;
        }

        const data = {
            firstName: editedFirstName,
            lastName: editedLastName,
            email: editedEmail,
        };

        const initialData = {
            firstName: record.firstName,
            lastName: record.lastName,
            email: record.email,
            role: record.role,
        };

        const dataChanged = Object.keys(data).some(
            (key) => data[key] !== initialData[key]
        );

        if (!dataChanged) {
            message.warning("No changes made. Nothing to update.");
            setShowEditModal(false);
            return;
        }

        try {
            const url = `http://localhost:5000/api/users/edit-user/${editedUserId}`
            const response = await axios.put(url, data)

            if (response.status === 201) {
                setUsers((prevUsers) =>
                    prevUsers.map((user) =>
                        user._id === editedUserId ? { ...user, ...data } : user
                    )
                );

                message.success(response.data.message);
                setShowEditModal(false);
            }
        } catch (error) {
            message.error("Error Updating User");
        }
    };

    const handleSearch = (value) => {
        setSearchText(value);
    };

    const handleSortRole = (value) => {
        setSortRole(value);
    };

    const filteredData = users.filter((user) =>
        user.firstName.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', overflowX: 'hidden' }}>
            <NavbarAdmin />
            <Typography.Title level={2} style={{ marginTop: '2rem', marginLeft: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>User Details</span>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Input.Search
                        placeholder="Search by name"
                        onChange={(e) => handleSearch(e.target.value)}
                        style={{ width: 200, marginRight: 16 }}
                    />
                    <Select
                        defaultValue="Sort by Role"
                        onChange={handleSortRole}
                        style={{ width: 150, marginRight: 16 }}
                    >
                        <Option value="all">All</Option>
                        <Option value="farmer">Farmer</Option>
                        <Option value="normal victim">Normal Victim</Option>
                    </Select>
                </div>
            </Typography.Title>
            <Table columns={columns} dataSource={filteredData} />

            <Modal
                title="Edit User"
                open={showEditModal}
                okText="Save"
                onOk={handleEditRecords}
                onCancel={() => setShowEditModal(false)}
                okButtonProps={{ style: { backgroundColor: '#3bb19b', color: 'white' } }}
            >
                <Typography.Text>First Name:</Typography.Text>
                <Input
                    value={editedFirstName}
                    placeholder="Enter First Name"
                    onChange={(e) => setEditedFirstName(e.target.value)}
                    style={{ marginBottom: 15 }}
                />

                <Typography.Text>Last Name:</Typography.Text>
                <Input
                    value={editedLastName}
                    placeholder="Enter Last Name"
                    onChange={(e) => setEditedLastName(e.target.value)}
                    style={{ marginBottom: 15 }}
                />

                <Typography.Text>Email:</Typography.Text>
                <Input
                    value={editedEmail}
                    placeholder="Enter Email"
                    onChange={(e) => setEditedEmail(e.target.value)}
                    style={{ marginBottom: 15 }}
                />

            </Modal>

            <div style={{ bottom: "0", width: "100%", marginTop: 'auto' }}><Footer /></div>

        </div>
    );

}
