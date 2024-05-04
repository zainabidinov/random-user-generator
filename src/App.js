import {
  ConfigProvider,
  Select,
  Space,
  InputNumber,
  Slider,
  Col,
  Row,
  Button,
  Table,
} from "antd";
import { useState } from "react";
import { IoShuffleOutline } from "react-icons/io5";
import { generateUserData } from "./components/utils/generateUserData";
import { generateUserError } from "./components/utils/generateUserError";
import { CSVLink } from "react-csv";

function App() {
  const [sliderValue, setSliderValue] = useState(0);
  const [inputValue, setInputValue] = useState(0);
  const [region, setRegion] = useState("en");
  const [seed, setSeed] = useState(8759863);
  const [data, setData] = useState(generateUserData(region, 10, seed));

  const [currentPage, setCurrentPage] = useState(1);
  const [currentPaginPage, setCurrentPaginPage] = useState(1);

  const onRegionChange = (value) => {
    setRegion(value);
    setData(generateUserData(value, 30, seed));
  };

  const columns = [
    {
      title: "#",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Phone number",
      dataIndex: "phone",
      key: "phone",
    },
  ];

  const handleTableScroll = (e) => {
    const { scrollHeight, clientHeight, scrollTop } = e.target;

    const halfwayPoint = (scrollHeight - clientHeight) / 4;

    if (scrollTop >= halfwayPoint && currentPage === currentPaginPage) {
      const newData = generateUserData(region, data.length + 20, seed);
      setData(newData);
      setCurrentPaginPage((prevValue) => prevValue + 1);
    }
  };

  const paginationChange = (e) => {
    setCurrentPage(e);
    setCurrentPaginPage(e);
  };

  const handleSliderChange = (value) => {
    setSliderValue(value);
    setInputValue(value);
    const newData = data.map((item) => ({
      ...item,
      name: generateUserError(item.name, value, seed),
      address: generateUserError(item.address, value, seed),
      phone: generateUserError(item.phone, value, seed),
    }));

    setData(newData);
  };

  const handleInputChange = (value) => {
    setInputValue(value);
    setSliderValue(Math.floor(value / 100));
    const newData = data.map((item) => ({
      ...item,
      name: generateUserError(item.name, value, seed),
      address: generateUserError(item.address, value, seed),
      phone: generateUserError(item.phone, value, seed),
    }));

    setData(newData);
  };

  const handleSeedChange = (value) => {
    setSeed(value);
    setData(generateUserData(region, 30, value));
  };

  const handleRandomSeedChange = () => {
    const randomSeed = Math.floor(Math.random() * 100000);
    setSeed(randomSeed);
    setData(generateUserData(region, 30, randomSeed));
  };

  return (
    <>
      <div className="header">
        <div className="header-content">
          <Space wrap style={{ lineHeight: "40px" }}>
            <span>Region:</span>
            <Select
              defaultValue="USA"
              onChange={onRegionChange}
              style={{
                width: 120,
              }}
              options={[
                {
                  value: "en",
                  label: "USA",
                },
                {
                  value: "pl",
                  label: "Poland",
                },
                {
                  value: "de",
                  label: "Germany",
                },
                {
                  value: "tr",
                  label: "Turkey",
                },
              ]}
            />
          </Space>

          <ConfigProvider
            theme={{
              components: {
                Slider: {
                  colorPrimary: "#1677ff",
                  railBg: "#FFF",
                  railHoverBg: "#FFF",
                  algorithm: true,
                },
              },
            }}
          >
            <Space wrap style={{ lineHeight: "40px" }}>
              <span>Errors:</span>
              <Row>
                <Col span={20}>
                  <Slider
                    style={{ marginTop: "15px" }}
                    controlSize={20}
                    min={0}
                    max={10}
                    value={sliderValue}
                    onChange={handleSliderChange}
                  />
                </Col>
                <Col span={4}>
                  <InputNumber
                    min={0}
                    max={1000}
                    style={{
                      margin: "0 15px",
                    }}
                    value={inputValue}
                    onChange={handleInputChange}
                  />
                </Col>
              </Row>
            </Space>
          </ConfigProvider>

          <Space wrap style={{ lineHeight: "40px" }}>
            Seed:
            <InputNumber min={0} value={seed} onChange={handleSeedChange} />
            <IoShuffleOutline
              onClick={handleRandomSeedChange}
              size={30}
              style={{ paddingTop: "13px", cursor: "pointer" }}
            />
          </Space>

          <Space wrap style={{ lineHeight: "40px" }}>
            <CSVLink data={data} columns={columns} filename={"userdata.csv"}>
              <Button type="primary">Export</Button>
            </CSVLink>
          </Space>
        </div>
      </div>

      <div className="body">
        <Table
          onScroll={handleTableScroll}
          columns={columns}
          dataSource={data}
          pagination={{
            pageSize: 20,
            position: ["bottomCenter"],
            onChange: paginationChange,
          }}
          scroll={{
            y: 530,
          }}
        />
      </div>
    </>
  );
}

export default App;
