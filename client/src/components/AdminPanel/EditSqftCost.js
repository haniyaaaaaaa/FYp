import React, { useState, useEffect } from "react";
import {
  Table,
  Typography,
  message,
  Button,
  Modal,
  Form,
  Input,
  Popconfirm,
  Select,
} from "antd";
import axios from "axios";
import NavbarAdmin from "./NavbarAdmin";
import Footer from "../Footer";

const { Option } = Select;

export default function EditSqftCost() {
  const [districts, setDistricts] = useState([]);
  const [locations, setLocations] = useState([]);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [newDistrict, setNewDistrict] = useState(null);
  const [selectedRecordDistrict, setSelectedRecordDistrict] = useState(null);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const districtResponse = await axios.get(
        "http://localhost:5000/api/locations/get-districts"
      );
      setDistricts(districtResponse.data);

      const locationResponse = await axios.get(
        "http://localhost:5000/api/locations/get-district-location-cost"
      );
      setLocations(locationResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("Failed to fetch data");
    }
  };

  const handleAddLocation = () => {
    setVisible(true);
    setSelectedLocation(null);
  };

  const handleEditLocation = (record) => {
    setVisible(true);
    setSelectedLocation(record);
    setSelectedRecordDistrict(record.district);
  };

  const handleCancel = () => {
    setVisible(false);
    form.resetFields();
    setSelectedLocation(null);
    setNewDistrict(null);
  };

  const handleSaveLocation = () => {
    form.validateFields().then(async (values) => {
      try {
        const { location, cost } = values;
        let districtName = null;

        if (newDistrict) {
          // If user entered a new district
          await axios.post("http://localhost:5000/api/locations/add-district", {
            district: newDistrict,
            locations: [location],
          });
          districtName = newDistrict;
        } else {
          districtName = selectedDistrict || selectedRecordDistrict;
        }
        if (selectedLocation) {
          // If editing existing location
          await axios.patch(
            `http://localhost:5000/api/locations/update-location-cost/${selectedLocation._id}`,
            { districtName, location, selectedLocation, cost }
          );
          message.success("Location updated successfully");
        } else {
          // If adding new location
          await axios.post(
            `http://localhost:5000/api/locations/add-location/${districtName}/${location}`
          );
          await axios.post(
            `http://localhost:5000/api/locations/add-district-location-cost`,
            { districtName, location, cost }
          );
          message.success("Location added successfully");
        }
        setVisible(false);
        form.resetFields();
        fetchData();
      } catch (error) {
        console.error("Error adding location:", error);
        message.error("Failed to add location");
      }
    }).catch((error) => {
      console.error("Error please add data in necessary fields:", error);
    });
  };

  const handleDeleteLocation = async (locationId, district, location) => {
    const requestBody = {
      locationId,
      districtName: district,
      locationName: location,
    };
    try {
      await axios.delete(
        `http://localhost:5000/api/locations/delete-sqft-cost`,
        {
          data: requestBody,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      message.success("Location deleted successfully");
      fetchData();
    } catch (error) {
      console.error("Error deleting location:", error);
      message.error("Failed to delete location");
    }
  };

  const handleDeleteDistrict = async (districtId) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/sqft/districts/${districtId}`
      );
      message.success("District deleted successfully");
      fetchData();
    } catch (error) {
      console.error("Error deleting district:", error);
      message.error("Failed to delete district");
    }
  };

  const columns = [
    {
      key: "district",
      title: "District",
      dataIndex: "district",
    },
    {
      key: "location",
      title: "Location",
      dataIndex: "location",
    },
    {
      key: "cost",
      title: "Cost",
      dataIndex: "cost",
    },
    {
      key: "edit",
      title: "Edit",
      render: (text, record) => (
        <Button type="link" onClick={() => handleEditLocation(record)}>
          Edit
        </Button>
      ),
    },
    {
      key: "delete",
      title: "Delete",
      render: (text, record) => (
        <Popconfirm
          title="Are you sure you want to delete this location?"
          onConfirm={() =>
            handleDeleteLocation(record._id, record.district, record.location)
          }
          okText="Yes"
          cancelText="No"
        >
          <Button type="link" danger>
            Delete
          </Button>
        </Popconfirm>
      ),
    },
  ];

  const filteredLocations = selectedDistrict
    ? locations.filter((location) => location.district === selectedDistrict)
    : locations;

  const searchedLocations = filteredLocations.filter((location) =>
    location.location.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div>
      <NavbarAdmin style={{ marginBottom: "1rem" }}/>
      <div
        className="ml-2"
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <Typography.Title level={2} style={{ marginRight: "auto", marginTop: "1rem"}}>
          SQFT Costs
        </Typography.Title>

        {/* Search Input */}
        <Input.Search
          placeholder="Search by location"
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 200 }}
        />

        {/* Select District Dropdown */}
        <Select
          showSearch
          style={{ width: 200, marginLeft: 16 }}
          placeholder="Select a district or add a new one"
          optionFilterProp="children"
          onChange={(value) => {
            if (value === "new") {
              setNewDistrict(""); // Show input for new district
              setSelectedDistrict(null); // Reset selected district
            } else {
              setNewDistrict(null); // Hide input for new district
              setSelectedDistrict(value); // Set selected district
            }
          }}
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {districts.map((district) => (
            <Option key={district._id} value={district.district}>
              {district.district}
            </Option>
          ))}
          <Option value="new">Add New District</Option>
        </Select>

        {/* Add Location Button */}
        <Button
          type="primary"
          onClick={handleAddLocation}
          style={{ backgroundColor: "rgba(59, 177, 155, 1)", marginLeft: 16, marginRight: 16 }}
        >
          Add Location
        </Button>
      </div>

      <Table
        dataSource={searchedLocations}
        columns={columns}
        rowKey="_id"
        pagination={false}
        style={{ marginTop: "1rem" }}
      />

      <Modal
        title={selectedLocation ? "Edit Location" : "Add Location"}
        visible={visible}
        onCancel={handleCancel}
        onOk={handleSaveLocation}
        okButtonProps={{ style: { backgroundColor: "rgb(59, 177, 155)" } }}
      >
        <Form form={form} initialValues={selectedLocation}>
          <Form.Item
            name="location"
            label="Location"
            rules={[{ required: true, message: "Please enter the location" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="cost"
            label="Cost"
            rules={[{ required: true, message: "Please enter the cost" }]}
          >
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>

      <Footer />
    </div>
  );
}
