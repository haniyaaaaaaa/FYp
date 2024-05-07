// Import necessary components from antd
import React, { useState, useEffect } from "react";
import { Table, Typography, message, Tooltip, Modal, Button, Select } from "antd";
import axios from "axios";
import NavbarAdmin from "./NavbarAdmin";
import Footer from "../Footer";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import PostWidget from "./widgets/PostWidget";

const { Option } = Select;

export default function PostModeration() {
  const [complaint, setComplaint] = useState([]);
  const [visible, setVisible] = useState(false);
  const [complaintId, setComplaintId] = useState("");
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortValue, setSortValue] = useState("asc");

  useEffect(() => {
    const fetchUserComplaint = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/postmoderation/fetch-modposts"
        );
        setComplaint(response.data);
      } catch (error) {
        message.error("No complaint found");
      }
    };

    fetchUserComplaint();
  }, [complaint]);

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
    setSelectedComplaint(record);
    setComplaintId(record._id);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleOk = async (res) => {
    try {
      if (res === "Pass") {
        // Update the complaint to mark it as responded
        await axios.put(
          `http://localhost:5000/api/postmoderation/respond/${complaintId}`,
          { responded: true }
        );

        // Remove the complaint from the list of complaints
        setComplaint((prevComplaints) =>
          prevComplaints.filter((complaint) => complaint._id !== complaintId)
        );
      } else if (res === "Moderate") {
        // Show a confirmation dialog
        const confirmed = window.confirm(
          "Are you sure you want to delete this post?"
        );
        if (confirmed) {
          // Delete the post
          await axios.delete(
            `http://localhost:5000/api/posts/${selectedComplaint.postId}/delete`
          );

          // Update the complaint to mark it as responded
          await axios.put(
            `http://localhost:5000/api/postmoderation/respond/${complaintId}`,
            { responded: true }
          );

          // Remove the complaint from the list of complaints
          setComplaint((prevComplaints) =>
            prevComplaints.filter((complaint) => complaint._id !== complaintId)
          );
        }
      }
    } catch (error) {
      console.error("Error:", error);
      message.error("Failed to update post");
    } finally {
      setVisible(false); // Close the modal regardless of the outcome
    }
  };

  // Define a function to handle changes in the search input
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Define a function to handle changes in the sort dropdown
  const handleSortChange = (value) => {
    setSortValue(value);
  };

  // Filter complaints based on the search query
  const filteredComplaints = complaint.filter((item) =>
    item.firstName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Apply sorting based on the selected value
  const sortedComplaints = [...filteredComplaints].sort((a, b) => {
    if (sortValue === "asc") {
      return a.date.localeCompare(b.date);
    } else {
      return b.date.localeCompare(a.date);
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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
          marginLeft: "12px",
          marginRight: "12px",
        }}
      >
        <Typography.Title level={2}>Reported Posts</Typography.Title>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Select
            value={sortValue}
            onChange={handleSortChange}
            style={{ marginRight: "10px", width: 120 }}
            placeholder="Filter"
          >
            <Option value="asc">Oldest First</Option>
            <Option value="desc">Newest First</Option>
          </Select>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search by user name"
            style={{
              width: "200px",
              borderRadius: "30px",
              padding: "5px 10px",
              border: "1px solid #ccc",
              outline: "none",
            }}
          />
        </div>
      </div>
      <Table columns={columns} dataSource={sortedComplaints} />

      <Modal
        title="Respond"
        visible={visible}
        onCancel={handleCancel}
        footer={[
          <Button
            key="moderate"
            style={{ backgroundColor: "#3bb19b", color: "white" }}
            onClick={() => {
              handleOk("Moderate");
            }}
          >
            Moderate
          </Button>,
          <Button
            key="pass"
            style={{ backgroundColor: "#3bb19b", color: "white" }}
            onClick={() => {
              handleOk("Pass");
            }}
          >
            Pass
          </Button>,
        ]}
      >
        {selectedComplaint && ( // Render PostWidget component if selectedComplaint is not null
          <PostWidget
            postUserId={selectedComplaint.userId}
            name={selectedComplaint.username}
            description={selectedComplaint.description}
            picturePath={selectedComplaint.picturePath}
          />
        )}
      </Modal>

      <div style={{ bottom: "0", width: "100%", marginTop: "auto" }}>
        <Footer />
      </div>
    </div>
  );
}
