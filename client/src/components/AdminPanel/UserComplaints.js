import React, { useState, useEffect } from "react";
import {
  Table,
  Typography,
  message,
  Tooltip,
  Modal,
  Input,
  Button,
  Select,
} from "antd";
import axios from "axios";
import NavbarAdmin from "./NavbarAdmin";
import Footer from "../Footer";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";

const { Option } = Select;

export default function UserComplaints() {
  const [complaint, setComplaint] = useState([]);
  const [visible, setVisible] = useState(false);
  const [adminResponse, setAdminResponse] = useState("");
  const [complaintId, setComplaintId] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");

  useEffect(() => {
    const fetchUserComplaint = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/complaint/fetchUser-complaints"
        );
        setComplaint(response.data);
      } catch (error) {
        message.error("No complaint found");
      }
    };

    fetchUserComplaint();
  }, [adminResponse]);

  const columns = [
    {
      key: 1,
      title: "User Name",
      dataIndex: "firstName",
      width: "20%",
    },
    {
      key: 2,
      title: "Complaint",
      dataIndex: "complaint",
      width: "45%",
    },
    {
      key: 3,
      title: "Date",
      dataIndex: "date",
      width: "20%",
    },
    {
      key: 4,
      title: "Actions",
      render: (record) => {
        return (
          <>
            <Tooltip title="Click to respond to user">
              <ChatBubbleOutlineIcon
                onClick={() => handleOpenModal(record)}
                style={{
                  color: "#164863",
                  fontSize: 20,
                  marginRight: 25,
                  cursor: "pointer",
                }}
              />
            </Tooltip>
          </>
        );
      },
      width: "20%",
    },
  ];

  const handleOpenModal = (record) => {
    setVisible(true);
    setComplaintId(record._id);
  };

  const handleOk = async () => {
    if (!adminResponse) {
      message.error("Please enter response");
      return;
    }

    const url = `http://localhost:5000/api/complaint/save-response/${complaintId}`;
    const response = await axios.post(url, { adminResponse });

    setVisible(false);
    setAdminResponse("");
    message.success(response.data.message);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleSortOrderChange = (value) => {
    setSortOrder(value);
  };

  const filteredData = complaint.filter((item) =>
    item.firstName.toLowerCase().includes(searchText.toLowerCase())
  );

  const filteredAndSortedData = filteredData.sort((a, b) => {
    if (sortOrder === "newest") {
      return new Date(b.date) - new Date(a.date); // Sort newest first
    } else if (sortOrder === "oldest") {
      return new Date(a.date) - new Date(b.date); // Sort oldest first
    }
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        overflowX: "hidden",
      }}
    >
      <NavbarAdmin />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem', marginLeft: '12px', marginRight: '12px' }}>
        <Typography.Title level={2}>User Complaints</Typography.Title>
        <div>
          <Input
            placeholder="Search by user name"
            onChange={(e) => handleSearch(e.target.value)}
            style={{ width: 200, marginRight: 16 }}
          />
          <Select
            defaultValue="Sort by"
            onChange={handleSortOrderChange}
            style={{ width: 120 }}
          >
            <Option value="newest">Newest first</Option>
            <Option value="oldest">Oldest first</Option>
          </Select>
        </div>
      </div>
      <Table columns={columns} dataSource={filteredAndSortedData} />

      <Modal
        title="Respond"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button
            key="submit"
            style={{ backgroundColor: "#3bb19b", color: "white" }}
            onClick={handleOk}
          >
            Send
          </Button>,
        ]}
      >
        <Input.TextArea
          rows={4}
          value={adminResponse}
          onChange={(e) => setAdminResponse(e.target.value)}
          placeholder="Type your response here"
        />
      </Modal>

      <div style={{ bottom: "0", width: "100%", marginTop: "auto" }}>
        <Footer />
      </div>
    </div>
  );
}
